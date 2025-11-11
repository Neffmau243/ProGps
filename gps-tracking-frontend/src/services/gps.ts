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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp)
          })
        },
        (error) => {
          reject(this.handleError(error))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
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
    try {
      const location = await this.getCurrentLocation()

      const response = await api.post('/gps', {
        device_id: this.deviceId,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy
      })

      console.log('✅ Ubicación enviada:', location)

      if (this.callbacks.onSuccess) {
        this.callbacks.onSuccess(location)
      }

      return response.data
    } catch (error: any) {
      console.error('❌ Error al enviar ubicación:', error)

      if (this.callbacks.onError) {
        this.callbacks.onError(error.message || 'Error desconocido')
      }

      throw error
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
