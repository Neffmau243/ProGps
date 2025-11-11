import api from './api'

interface Location {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
}

class GPSService {
  private watchId: number | null = null
  private isTracking = false
  private deviceId: number | null = null
  private callbacks = {
    onSuccess: null as ((location: Location) => void) | null,
    onError: null as ((error: string) => void) | null
  }

  isSupported(): boolean {
    return 'geolocation' in navigator
  }

  async getCurrentLocation(): Promise<Location> {
    if (!this.isSupported()) {
      throw new Error('Geolocalización no soportada')
    }

    return new Promise((resolve, reject) => {
      // Primero intentar con alta precisión
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 Ubicación obtenida (alta precisión):', position.coords)
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp)
          })
        },
        (error) => {
          console.warn('⚠️ Error con alta precisión, intentando con baja precisión...', error)
          
          // Si falla, intentar con baja precisión
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('📍 Ubicación obtenida (baja precisión):', position.coords)
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date(position.timestamp)
              })
            },
            (error2) => {
              console.error('❌ Error obteniendo ubicación:', error2)
              reject(this.handleError(error2))
            },
            {
              enableHighAccuracy: false,
              timeout: 30000,
              maximumAge: 60000
            }
          )
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000
        }
      )
    })
  }

  startTracking(deviceId: number, intervalSeconds = 30) {
    if (!this.isSupported()) {
      throw new Error('Geolocalización no soportada')
    }

    this.isTracking = true
    this.deviceId = deviceId

    this.sendLocation()

    this.watchId = window.setInterval(() => {
      if (this.isTracking) {
        this.sendLocation()
      }
    }, intervalSeconds * 1000)
  }

  stopTracking() {
    this.isTracking = false
    if (this.watchId) {
      clearInterval(this.watchId)
      this.watchId = null
    }
  }

  async sendLocation() {
    if (!this.isTracking) {
      console.log('⏸️ Rastreo detenido, no se enviará ubicación')
      return
    }

    try {
      console.log('🔄 Obteniendo ubicación...')
      const location = await this.getCurrentLocation()

      console.log('📤 Enviando ubicación al servidor...')
      const response = await api.post('/gps', {
        device_id: this.deviceId,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy
      })

      console.log('✅ Ubicación enviada exitosamente:', {
        lat: location.latitude,
        lng: location.longitude,
        accuracy: location.accuracy
      })

      if (this.callbacks.onSuccess) {
        this.callbacks.onSuccess(location)
      }

      return response.data
    } catch (error: any) {
      const errorMsg = error.message || error || 'Error desconocido'
      console.error('❌ Error al enviar ubicación:', errorMsg)

      if (this.callbacks.onError) {
        this.callbacks.onError(errorMsg)
      }

      // No lanzar el error para que el tracking continúe
      return null
    }
  }

  handleError(error: GeolocationPositionError): string {
    const errors: { [key: number]: string } = {
      1: 'Permiso denegado. Por favor, permite el acceso a tu ubicación.',
      2: 'Ubicación no disponible. Verifica tu conexión.',
      3: 'Tiempo de espera agotado. Intenta de nuevo.'
    }
    return errors[error.code] || 'Error desconocido'
  }

  onSuccess(callback: (location: Location) => void) {
    this.callbacks.onSuccess = callback
  }

  onError(callback: (error: string) => void) {
    this.callbacks.onError = callback
  }

  getIsTracking(): boolean {
    return this.isTracking
  }
}

export default new GPSService()
