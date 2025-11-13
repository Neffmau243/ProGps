import api from './api'

interface Location {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
}

interface FullPosition {
  coords: {
    latitude: number
    longitude: number
    accuracy: number
    speed: number | null
    heading: number | null
    altitude: number | null
  }
  timestamp: number
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

  private lastPosition: FullPosition | null = null

  async getFullPosition(): Promise<FullPosition> {
    if (!this.isSupported()) {
      throw new Error('Geolocalización no soportada')
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lastPosition = {
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              speed: position.coords.speed,
              heading: position.coords.heading,
              altitude: position.coords.altitude
            },
            timestamp: position.timestamp
          }
          resolve(this.lastPosition)
        },
        (error) => {
          reject(this.handleError(error))
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000
        }
      )
    })
  }

  async getCurrentLocation(): Promise<Location> {
    if (!this.isSupported()) {
      throw new Error('Geolocalización no soportada')
    }

    return new Promise((resolve, reject) => {
      // Primero intentar con alta precisión
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const timestamp = new Date(position.timestamp)
          console.log('📍 Ubicación obtenida (alta precisión):', {
            lat: position.coords.latitude.toFixed(6),
            lng: position.coords.longitude.toFixed(6),
            accuracy: `${position.coords.accuracy.toFixed(1)}m`,
            speed: position.coords.speed ? `${(position.coords.speed * 3.6).toFixed(1)} km/h` : 'N/A',
            heading: position.coords.heading ? `${position.coords.heading.toFixed(0)}°` : 'N/A',
            altitude: position.coords.altitude ? `${position.coords.altitude.toFixed(0)}m` : 'N/A',
            timestamp: timestamp.toLocaleTimeString('es-ES')
          })
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: timestamp
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
      const fullPosition = await this.getFullPosition()

      console.log('📤 Enviando ubicación al servidor...', {
        device_id: this.deviceId,
        latitude: fullPosition.coords.latitude.toFixed(6),
        longitude: fullPosition.coords.longitude.toFixed(6),
        speed: fullPosition.coords.speed ? `${(fullPosition.coords.speed * 3.6).toFixed(1)} km/h` : 'NULL',
        heading: fullPosition.coords.heading ? `${fullPosition.coords.heading.toFixed(0)}°` : 'NULL',
        altitude: fullPosition.coords.altitude ? `${fullPosition.coords.altitude.toFixed(0)}m` : 'NULL'
      })
      
      const response = await api.post('/gps', {
        device_id: this.deviceId,
        latitude: fullPosition.coords.latitude,
        longitude: fullPosition.coords.longitude,
        accuracy: fullPosition.coords.accuracy,
        speed: fullPosition.coords.speed,
        heading: fullPosition.coords.heading,
        altitude: fullPosition.coords.altitude
      })

      console.log('✅ Ubicación enviada exitosamente:', {
        device_id: this.deviceId,
        lat: fullPosition.coords.latitude.toFixed(6),
        lng: fullPosition.coords.longitude.toFixed(6),
        accuracy: `${fullPosition.coords.accuracy.toFixed(1)}m`,
        speed: fullPosition.coords.speed ? `${(fullPosition.coords.speed * 3.6).toFixed(1)} km/h` : 'NULL',
        heading: fullPosition.coords.heading ? `${fullPosition.coords.heading.toFixed(0)}°` : 'NULL',
        altitude: fullPosition.coords.altitude ? `${fullPosition.coords.altitude.toFixed(0)}m` : 'NULL',
        timestamp: new Date(fullPosition.timestamp).toLocaleString('es-ES')
      })

      if (this.callbacks.onSuccess) {
        this.callbacks.onSuccess({
          latitude: fullPosition.coords.latitude,
          longitude: fullPosition.coords.longitude,
          accuracy: fullPosition.coords.accuracy,
          timestamp: new Date(fullPosition.timestamp)
        })
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
