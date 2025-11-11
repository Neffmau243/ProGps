# 🔗 Guía de Integración con Vue.js

Esta guía te ayudará a conectar tu frontend Vue.js con el backend Laravel.

---

## 📋 Requisitos Previos

- ✅ Backend corriendo en http://localhost:8000
- ✅ Vue.js 3 instalado
- ✅ Axios o Fetch API

---

## 🚀 Configuración Inicial

### 1. Instalar Axios (Recomendado)

```bash
npm install axios
```

### 2. Crear servicio de API

Crear archivo `src/services/api.js`:

```javascript
import axios from 'axios'

const API_URL = 'http://localhost:8000/api'

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

---

## 🔐 Autenticación

### Login Component

```vue
<template>
  <div class="login">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="login">
      <input 
        v-model="email" 
        type="email" 
        placeholder="Email"
        required
      />
      <input 
        v-model="password" 
        type="password" 
        placeholder="Password"
        required
      />
      <button type="submit">Ingresar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login() {
      try {
        const response = await api.post('/auth/login', {
          email: this.email,
          password: this.password
        })
        
        // Guardar token y usuario
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        // Redirigir según rol
        if (response.data.user.role === 'admin') {
          this.$router.push('/admin/dashboard')
        } else {
          this.$router.push('/empleado/dashboard')
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al iniciar sesión'
      }
    }
  }
}
</script>
```

### Logout

```javascript
async logout() {
  try {
    await api.post('/auth/logout')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.$router.push('/login')
  }
}
```

---

## 📍 Envío de Ubicación GPS (Empleado)

### GPS Service

Crear archivo `src/services/gps.js`:

```javascript
import api from './api'

class GPSService {
  constructor() {
    this.watchId = null
    this.deviceId = null
    this.isTracking = false
  }

  // Iniciar rastreo
  startTracking(deviceId, interval = 30000) {
    this.deviceId = deviceId
    this.isTracking = true

    // Verificar si el navegador soporta geolocalización
    if (!navigator.geolocation) {
      throw new Error('Geolocalización no soportada')
    }

    // Obtener ubicación inicial
    this.sendLocation()

    // Enviar ubicación cada X segundos
    this.watchId = setInterval(() => {
      if (this.isTracking) {
        this.sendLocation()
      }
    }, interval)
  }

  // Detener rastreo
  stopTracking() {
    this.isTracking = false
    if (this.watchId) {
      clearInterval(this.watchId)
      this.watchId = null
    }
  }

  // Enviar ubicación al backend
  async sendLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await api.post('/gps', {
              device_id: this.deviceId,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            })
            console.log('Ubicación enviada:', response.data)
            resolve(response.data)
          } catch (error) {
            console.error('Error al enviar ubicación:', error)
            reject(error)
          }
        },
        (error) => {
          console.error('Error al obtener ubicación:', error)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }
}

export default new GPSService()
```

### Componente Empleado

```vue
<template>
  <div class="empleado-dashboard">
    <h2>Dashboard Empleado</h2>
    
    <div class="tracking-control">
      <button 
        @click="toggleTracking"
        :class="{ active: isTracking }"
      >
        {{ isTracking ? 'Detener Rastreo' : 'Iniciar Rastreo' }}
      </button>
      
      <p v-if="isTracking" class="status">
        📍 Rastreando ubicación...
      </p>
    </div>

    <div class="device-info">
      <h3>Mi Dispositivo</h3>
      <p><strong>Nombre:</strong> {{ device.name }}</p>
      <p><strong>Serial:</strong> {{ device.serial }}</p>
      <p><strong>Estado:</strong> {{ device.status }}</p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import gpsService from '@/services/gps'

export default {
  data() {
    return {
      device: null,
      isTracking: false
    }
  },
  async mounted() {
    await this.loadDevice()
  },
  beforeUnmount() {
    // Detener rastreo al salir del componente
    if (this.isTracking) {
      gpsService.stopTracking()
    }
  },
  methods: {
    async loadDevice() {
      try {
        const response = await api.get('/devices')
        this.device = response.data[0] // Primer dispositivo del empleado
      } catch (error) {
        console.error('Error al cargar dispositivo:', error)
      }
    },
    
    toggleTracking() {
      if (this.isTracking) {
        gpsService.stopTracking()
        this.isTracking = false
      } else {
        gpsService.startTracking(this.device.id, 30000) // Cada 30 segundos
        this.isTracking = true
      }
    }
  }
}
</script>
```

---

## 🗺️ Mapa de Ubicaciones (Admin)

### Usando Google Maps

```bash
npm install @googlemaps/js-api-loader
```

```vue
<template>
  <div class="admin-dashboard">
    <h2>Ubicaciones en Tiempo Real</h2>
    
    <div id="map" style="width: 100%; height: 600px;"></div>
    
    <div class="devices-list">
      <h3>Dispositivos Activos</h3>
      <ul>
        <li v-for="location in locations" :key="location.device_id">
          {{ location.device_name }} - {{ location.user_name }}
          <span class="time">Hace {{ location.minutes_ago }} min</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader'
import api from '@/services/api'

export default {
  data() {
    return {
      map: null,
      markers: {},
      locations: [],
      updateInterval: null
    }
  },
  async mounted() {
    await this.initMap()
    await this.loadLocations()
    
    // Actualizar cada 10 segundos
    this.updateInterval = setInterval(() => {
      this.loadLocations()
    }, 10000)
  },
  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
  },
  methods: {
    async initMap() {
      const loader = new Loader({
        apiKey: 'TU_API_KEY_DE_GOOGLE_MAPS',
        version: 'weekly'
      })

      const google = await loader.load()
      
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -12.046374, lng: -77.042793 },
        zoom: 13
      })
    },
    
    async loadLocations() {
      try {
        const response = await api.get('/locations/current')
        this.locations = response.data
        this.updateMarkers()
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error)
      }
    },
    
    updateMarkers() {
      // Limpiar marcadores antiguos
      Object.values(this.markers).forEach(marker => marker.setMap(null))
      this.markers = {}
      
      // Crear nuevos marcadores
      this.locations.forEach(location => {
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(location.latitude),
            lng: parseFloat(location.longitude)
          },
          map: this.map,
          title: location.device_name,
          label: location.user_name.charAt(0)
        })
        
        // Info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3>${location.device_name}</h3>
              <p><strong>Usuario:</strong> ${location.user_name}</p>
              <p><strong>Precisión:</strong> ${location.accuracy}m</p>
              <p><strong>Última actualización:</strong> Hace ${location.minutes_ago} min</p>
            </div>
          `
        })
        
        marker.addListener('click', () => {
          infoWindow.open(this.map, marker)
        })
        
        this.markers[location.device_id] = marker
      })
    }
  }
}
</script>
```

### Usando Leaflet (Alternativa gratuita)

```bash
npm install leaflet
```

```vue
<template>
  <div class="admin-dashboard">
    <h2>Ubicaciones en Tiempo Real</h2>
    <div id="map" style="width: 100%; height: 600px;"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '@/services/api'

export default {
  data() {
    return {
      map: null,
      markers: {},
      locations: [],
      updateInterval: null
    }
  },
  async mounted() {
    this.initMap()
    await this.loadLocations()
    
    this.updateInterval = setInterval(() => {
      this.loadLocations()
    }, 10000)
  },
  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([-12.046374, -77.042793], 13)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map)
    },
    
    async loadLocations() {
      try {
        const response = await api.get('/locations/current')
        this.locations = response.data
        this.updateMarkers()
      } catch (error) {
        console.error('Error al cargar ubicaciones:', error)
      }
    },
    
    updateMarkers() {
      // Limpiar marcadores antiguos
      Object.values(this.markers).forEach(marker => {
        this.map.removeLayer(marker)
      })
      this.markers = {}
      
      // Crear nuevos marcadores
      this.locations.forEach(location => {
        const marker = L.marker([
          parseFloat(location.latitude),
          parseFloat(location.longitude)
        ]).addTo(this.map)
        
        marker.bindPopup(`
          <div>
            <h3>${location.device_name}</h3>
            <p><strong>Usuario:</strong> ${location.user_name}</p>
            <p><strong>Precisión:</strong> ${location.accuracy}m</p>
            <p><strong>Última actualización:</strong> Hace ${location.minutes_ago} min</p>
          </div>
        `)
        
        this.markers[location.device_id] = marker
      })
    }
  }
}
</script>
```

---

## 👥 Gestión de Usuarios (Admin)

```vue
<template>
  <div class="users-management">
    <h2>Gestión de Usuarios</h2>
    
    <button @click="showCreateForm = true">Crear Usuario</button>
    
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role.name }}</td>
          <td>
            <button @click="editUser(user)">Editar</button>
            <button @click="deleteUser(user.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  data() {
    return {
      users: [],
      showCreateForm: false
    }
  },
  async mounted() {
    await this.loadUsers()
  },
  methods: {
    async loadUsers() {
      try {
        const response = await api.get('/users')
        this.users = response.data
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
      }
    },
    
    async deleteUser(id) {
      if (confirm('¿Estás seguro de eliminar este usuario?')) {
        try {
          await api.delete(`/users/${id}`)
          await this.loadUsers()
        } catch (error) {
          console.error('Error al eliminar usuario:', error)
        }
      }
    }
  }
}
</script>
```

---

## 🛡️ Protección de Rutas

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/admin',
      component: () => import('@/views/Admin.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/empleado',
      component: () => import('@/views/Empleado.vue'),
      meta: { requiresAuth: true, role: 'empleado' }
    }
  ]
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.role && user.role !== to.meta.role) {
    next('/unauthorized')
  } else {
    next()
  }
})

export default router
```

---

## 📊 Store (Vuex/Pinia)

```javascript
// store/auth.js (Pinia)
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token')
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  
  actions: {
    async login(email, password) {
      const response = await api.post('/auth/login', { email, password })
      this.token = response.data.token
      this.user = response.data.user
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    
    async logout() {
      await api.post('/auth/logout')
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
```

---

## ✅ Checklist de Integración

- [ ] Instalar Axios
- [ ] Crear servicio de API
- [ ] Implementar login/logout
- [ ] Configurar interceptores
- [ ] Proteger rutas
- [ ] Implementar envío de GPS (empleado)
- [ ] Implementar mapa (admin)
- [ ] Gestión de usuarios (admin)
- [ ] Gestión de dispositivos (admin)
- [ ] Manejo de errores
- [ ] Loading states
- [ ] Notificaciones

---

**¡Listo para integrar! El backend está esperando tus peticiones. 🚀**
