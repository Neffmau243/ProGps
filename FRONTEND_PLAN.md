# 🎨 Plan de Desarrollo Frontend - GPS Tracking Platform

## 📋 Índice
1. [Vistas Necesarias](#vistas-necesarias)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Geolocalización Explicada](#geolocalización-explicada)
5. [Modo Claro/Oscuro](#modo-clarooscuro)
6. [Componentes Reutilizables](#componentes-reutilizables)
7. [Flujo de Navegación](#flujo-de-navegación)

---

## 🖼️ Vistas Necesarias

### Total: 8 Vistas Principales

#### 1. **Login** (`/login`)
**Propósito:** Autenticación de usuarios

**Elementos:**
- Logo de la aplicación
- Formulario de login
  - Input: Email
  - Input: Password
  - Botón: Iniciar Sesión
- Mensaje de error (si aplica)
- Toggle modo claro/oscuro

**Usuarios:** Todos (público)

---

#### 2. **Dashboard Admin** (`/admin/dashboard`)
**Propósito:** Vista principal del administrador con mapa en tiempo real

**Elementos:**
- **Header:**
  - Logo
  - Nombre del usuario
  - Botón de logout
  - Toggle modo claro/oscuro
  
- **Sidebar/Menu:**
  - Dashboard (activo)
  - Usuarios
  - Dispositivos
  - Historial
  
- **Contenido Principal:**
  - **Mapa interactivo** (70% del espacio)
    - Marcadores de dispositivos activos
    - Info windows con datos del empleado
    - Controles de zoom
    - Botón de centrar mapa
  
  - **Panel lateral** (30% del espacio)
    - Lista de dispositivos activos
    - Estado de cada dispositivo
    - Última actualización
    - Filtros (todos/activos/inactivos)

**Usuarios:** Solo Admin

---

#### 3. **Gestión de Usuarios** (`/admin/users`)
**Propósito:** CRUD de usuarios

**Elementos:**
- **Header:** (igual que dashboard)
- **Sidebar:** (igual que dashboard)
- **Contenido:**
  - Botón: Crear Usuario
  - Tabla de usuarios:
    - Columnas: ID, Nombre, Email, Rol, Acciones
    - Acciones: Editar, Eliminar
  - Paginación
  - Buscador
  
- **Modal Crear/Editar Usuario:**
  - Input: Nombre
  - Input: Email
  - Input: Password
  - Select: Rol (Admin/Empleado)
  - Botones: Guardar, Cancelar

**Usuarios:** Solo Admin

---

#### 4. **Gestión de Dispositivos** (`/admin/devices`)
**Propósito:** CRUD de dispositivos

**Elementos:**
- **Header:** (igual que dashboard)
- **Sidebar:** (igual que dashboard)
- **Contenido:**
  - Botón: Crear Dispositivo
  - Tabla de dispositivos:
    - Columnas: ID, Nombre, Serial, Usuario, Estado, Acciones
    - Acciones: Editar, Cambiar Estado, Eliminar
  - Paginación
  - Filtros por estado
  
- **Modal Crear/Editar Dispositivo:**
  - Input: Nombre
  - Input: Serial
  - Select: Usuario asignado
  - Select: Estado (activo/inactivo/mantenimiento)
  - Botones: Guardar, Cancelar

**Usuarios:** Solo Admin

---

#### 5. **Historial de Ubicaciones** (`/admin/history`)
**Propósito:** Ver rutas históricas de dispositivos

**Elementos:**
- **Header:** (igual que dashboard)
- **Sidebar:** (igual que dashboard)
- **Contenido:**
  - **Filtros:**
    - Select: Dispositivo
    - Date picker: Fecha inicio
    - Date picker: Fecha fin
    - Botón: Buscar
  
  - **Mapa con ruta:**
    - Polyline mostrando el recorrido
    - Marcadores de inicio y fin
    - Puntos intermedios
  
  - **Estadísticas:**
    - Total de puntos
    - Distancia recorrida (km)
    - Duración (horas/minutos)
    - Velocidad promedio
  
  - **Timeline:**
    - Lista de ubicaciones con hora
    - Scroll vertical

**Usuarios:** Solo Admin

---


#### 6. **Dashboard Empleado** (`/empleado/dashboard`)
**Propósito:** Vista del empleado para activar/desactivar rastreo

**Elementos:**
- **Header:**
  - Logo
  - Nombre del usuario
  - Botón de logout
  - Toggle modo claro/oscuro
  
- **Contenido Principal:**
  - **Card de Estado:**
    - Icono de GPS
    - Estado: "Rastreando" o "Detenido"
    - Botón grande: "Iniciar Rastreo" / "Detener Rastreo"
    - Indicador visual (verde/rojo)
  
  - **Información del Dispositivo:**
    - Nombre del dispositivo
    - Serial
    - Estado
  
  - **Última Ubicación Enviada:**
    - Coordenadas
    - Precisión
    - Hora de envío
    - Mapa pequeño (opcional)
  
  - **Configuración:**
    - Intervalo de envío (30s, 1min, 5min)
    - Precisión GPS (alta/media/baja)

**Usuarios:** Solo Empleado

---

#### 7. **Perfil de Usuario** (`/profile`)
**Propósito:** Ver y editar información personal

**Elementos:**
- **Header:** (según rol)
- **Contenido:**
  - Avatar/Foto de perfil
  - Información personal:
    - Nombre
    - Email
    - Rol (solo lectura)
  - Cambiar contraseña:
    - Password actual
    - Password nuevo
    - Confirmar password
  - Botón: Guardar cambios

**Usuarios:** Todos (autenticados)

---

#### 8. **Página 404 / No Autorizado**
**Propósito:** Manejo de errores de navegación

**Elementos:**
- Mensaje de error
- Ilustración
- Botón: Volver al inicio
- Toggle modo claro/oscuro

**Usuarios:** Todos

---

## 🛠️ Stack Tecnológico

### Framework y Librerías Principales

#### 1. **Vue.js 3** (Composition API)
```bash
npm create vue@latest gps-tracking-frontend
```
**Opciones a seleccionar:**
- ✅ TypeScript (opcional, recomendado)
- ✅ Vue Router
- ✅ Pinia (state management)
- ✅ ESLint
- ✅ Prettier

---

#### 2. **UI Framework: Vuetify 3**
```bash
npm install vuetify@next
npm install @mdi/font
```

**¿Por qué Vuetify?**
- ✅ Componentes Material Design listos
- ✅ Sistema de grid responsive
- ✅ Modo claro/oscuro integrado
- ✅ Iconos incluidos
- ✅ Tablas, modales, formularios pre-diseñados
- ✅ Muy bien documentado

**Alternativas:**
- **PrimeVue:** Más componentes, más pesado
- **Element Plus:** Estilo más corporativo
- **Naive UI:** Más ligero, menos componentes

---

#### 3. **Mapas: Leaflet**
```bash
npm install leaflet
npm install @vue-leaflet/vue-leaflet
```

**¿Por qué Leaflet?**
- ✅ **GRATIS** (no requiere API key)
- ✅ Ligero y rápido
- ✅ Fácil de usar
- ✅ Muchos plugins disponibles
- ✅ Funciona offline con tiles cacheados

**Alternativa: Google Maps**
```bash
npm install @googlemaps/js-api-loader
```
- ❌ Requiere API key
- ❌ Requiere tarjeta de crédito
- ✅ Mejor calidad de mapas
- ✅ Más funcionalidades

**Recomendación:** Empieza con Leaflet, cambia a Google Maps si lo necesitas después.

---

#### 4. **HTTP Client: Axios**
```bash
npm install axios
```

**Configuración:**
- Interceptores para tokens
- Manejo de errores centralizado
- Base URL configurable

---

#### 5. **Gestión de Estado: Pinia**
Ya incluido en la instalación de Vue.

**Stores necesarios:**
- `authStore` - Autenticación y usuario actual
- `themeStore` - Modo claro/oscuro
- `devicesStore` - Dispositivos y ubicaciones
- `usersStore` - Gestión de usuarios (admin)

---

#### 6. **Notificaciones: Vue Toastification**
```bash
npm install vue-toastification@next
```

**Para mostrar:**
- Éxito en operaciones
- Errores de API
- Confirmaciones
- Alertas

---

#### 7. **Fechas: Day.js**
```bash
npm install dayjs
```

**Más ligero que Moment.js**
- Formateo de fechas
- Cálculos de tiempo
- Internacionalización

---

#### 8. **Validación de Formularios: Vee-Validate**
```bash
npm install vee-validate yup
```

**Para validar:**
- Formularios de login
- Creación de usuarios
- Creación de dispositivos

---

### Resumen de Dependencias

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "vuetify": "^3.5.0",
    "@mdi/font": "^7.4.0",
    "leaflet": "^1.9.4",
    "@vue-leaflet/vue-leaflet": "^0.10.0",
    "axios": "^1.6.0",
    "vue-toastification": "^2.0.0",
    "dayjs": "^1.11.0",
    "vee-validate": "^4.12.0",
    "yup": "^1.3.0"
  }
}
```

---

## 📁 Estructura del Proyecto

```
gps-tracking-frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   ├── logo.png
│   │   └── styles/
│   │       └── main.css
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   ├── ThemeToggle.vue
│   │   │   └── LoadingSpinner.vue
│   │   │
│   │   ├── maps/
│   │   │   ├── MapView.vue
│   │   │   ├── DeviceMarker.vue
│   │   │   └── RoutePolyline.vue
│   │   │
│   │   ├── users/
│   │   │   ├── UserTable.vue
│   │   │   ├── UserForm.vue
│   │   │   └── UserModal.vue
│   │   │
│   │   └── devices/
│   │       ├── DeviceTable.vue
│   │       ├── DeviceForm.vue
│   │       ├── DeviceCard.vue
│   │       └── DeviceModal.vue
│   │
│   ├── views/
│   │   ├── LoginView.vue
│   │   ├── admin/
│   │   │   ├── DashboardView.vue
│   │   │   ├── UsersView.vue
│   │   │   ├── DevicesView.vue
│   │   │   └── HistoryView.vue
│   │   ├── empleado/
│   │   │   └── DashboardView.vue
│   │   ├── ProfileView.vue
│   │   └── NotFoundView.vue
│   │
│   ├── router/
│   │   └── index.js
│   │
│   ├── stores/
│   │   ├── auth.js
│   │   ├── theme.js
│   │   ├── devices.js
│   │   └── users.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── gps.js
│   │   ├── auth.service.js
│   │   ├── users.service.js
│   │   ├── devices.service.js
│   │   └── locations.service.js
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   │
│   ├── plugins/
│   │   ├── vuetify.js
│   │   └── toast.js
│   │
│   ├── App.vue
│   └── main.js
│
├── .env
├── .env.production
├── package.json
├── vite.config.js
└── README.md
```

---


## 📍 Geolocalización Explicada (Sin Misterios)

### ¿Cómo funciona la geolocalización en el navegador?

#### 1. **API de Geolocalización del Navegador**

El navegador tiene una API nativa llamada `navigator.geolocation` que te da acceso a la ubicación del dispositivo.

**Ejemplo básico:**
```javascript
// Obtener ubicación una vez
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log('Latitud:', position.coords.latitude)
    console.log('Longitud:', position.coords.longitude)
    console.log('Precisión:', position.coords.accuracy, 'metros')
  },
  (error) => {
    console.error('Error:', error.message)
  }
)
```

**¿De dónde viene la ubicación?**
- 📱 **Móvil:** GPS del teléfono (muy preciso, 5-10 metros)
- 💻 **PC/Laptop:** WiFi + IP (menos preciso, 50-500 metros)
- 🌐 **Sin GPS:** Triangulación de torres de celular

---

#### 2. **Permisos del Usuario**

El navegador **SIEMPRE** pide permiso al usuario antes de compartir su ubicación.

**Flujo:**
1. Tu código llama a `getCurrentPosition()`
2. El navegador muestra un popup: "¿Permitir acceso a tu ubicación?"
3. Usuario acepta o rechaza
4. Si acepta: obtienes las coordenadas
5. Si rechaza: obtienes un error

**Importante:**
- ✅ Solo funciona en HTTPS (o localhost)
- ✅ El permiso se guarda por dominio
- ✅ El usuario puede revocarlo en cualquier momento

---

#### 3. **Implementación en Vue.js**

**Servicio GPS (`src/services/gps.js`):**

```javascript
class GPSService {
  constructor() {
    this.watchId = null
    this.isTracking = false
    this.callbacks = {
      onSuccess: null,
      onError: null
    }
  }

  // Verificar si el navegador soporta geolocalización
  isSupported() {
    return 'geolocation' in navigator
  }

  // Obtener ubicación una sola vez
  async getCurrentLocation() {
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
          enableHighAccuracy: true,  // Usar GPS si está disponible
          timeout: 10000,             // Esperar máximo 10 segundos
          maximumAge: 0               // No usar ubicación cacheada
        }
      )
    })
  }

  // Iniciar rastreo continuo
  startTracking(deviceId, intervalSeconds = 30) {
    if (!this.isSupported()) {
      throw new Error('Geolocalización no soportada')
    }

    this.isTracking = true
    this.deviceId = deviceId

    // Enviar ubicación inmediatamente
    this.sendLocation()

    // Luego enviar cada X segundos
    this.watchId = setInterval(() => {
      if (this.isTracking) {
        this.sendLocation()
      }
    }, intervalSeconds * 1000)
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
    try {
      const location = await this.getCurrentLocation()
      
      // Enviar al backend
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
    } catch (error) {
      console.error('❌ Error al enviar ubicación:', error)
      
      if (this.callbacks.onError) {
        this.callbacks.onError(error)
      }
      
      throw error
    }
  }

  // Manejar errores
  handleError(error) {
    const errors = {
      1: 'Permiso denegado. Por favor, permite el acceso a tu ubicación.',
      2: 'Ubicación no disponible. Verifica tu conexión.',
      3: 'Tiempo de espera agotado. Intenta de nuevo.'
    }
    return errors[error.code] || 'Error desconocido'
  }

  // Registrar callbacks
  onSuccess(callback) {
    this.callbacks.onSuccess = callback
  }

  onError(callback) {
    this.callbacks.onError = callback
  }
}

export default new GPSService()
```

---

#### 4. **Uso en Componente Vue**

**Dashboard Empleado:**

```vue
<template>
  <div class="empleado-dashboard">
    <v-card class="tracking-card">
      <v-card-title>
        <v-icon :color="isTracking ? 'success' : 'error'" size="large">
          mdi-map-marker-radius
        </v-icon>
        Rastreo GPS
      </v-card-title>

      <v-card-text>
        <div class="status-indicator">
          <v-chip 
            :color="isTracking ? 'success' : 'error'" 
            size="large"
          >
            {{ isTracking ? '📍 Rastreando' : '⏸️ Detenido' }}
          </v-chip>
        </div>

        <v-btn
          :color="isTracking ? 'error' : 'success'"
          size="x-large"
          block
          @click="toggleTracking"
          class="my-4"
        >
          {{ isTracking ? 'Detener Rastreo' : 'Iniciar Rastreo' }}
        </v-btn>

        <!-- Última ubicación -->
        <v-card v-if="lastLocation" variant="outlined" class="mt-4">
          <v-card-subtitle>Última ubicación enviada</v-card-subtitle>
          <v-card-text>
            <p><strong>Latitud:</strong> {{ lastLocation.latitude }}</p>
            <p><strong>Longitud:</strong> {{ lastLocation.longitude }}</p>
            <p><strong>Precisión:</strong> {{ lastLocation.accuracy }}m</p>
            <p><strong>Hora:</strong> {{ formatTime(lastLocation.timestamp) }}</p>
          </v-card-text>
        </v-card>

        <!-- Configuración -->
        <v-select
          v-model="interval"
          :items="intervalOptions"
          label="Intervalo de envío"
          class="mt-4"
          :disabled="isTracking"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from 'vue-toastification'
import gpsService from '@/services/gps'
import { useAuthStore } from '@/stores/auth'

const toast = useToast()
const authStore = useAuthStore()

const isTracking = ref(false)
const lastLocation = ref(null)
const interval = ref(30)
const deviceId = ref(null)

const intervalOptions = [
  { title: '30 segundos', value: 30 },
  { title: '1 minuto', value: 60 },
  { title: '5 minutos', value: 300 }
]

onMounted(async () => {
  // Obtener dispositivo del empleado
  const devices = await devicesService.getMyDevices()
  deviceId.value = devices[0]?.id

  // Configurar callbacks
  gpsService.onSuccess((location) => {
    lastLocation.value = location
    toast.success('Ubicación enviada correctamente')
  })

  gpsService.onError((error) => {
    toast.error(error)
  })
})

onBeforeUnmount(() => {
  // Detener rastreo al salir
  if (isTracking.value) {
    gpsService.stopTracking()
  }
})

const toggleTracking = () => {
  if (!gpsService.isSupported()) {
    toast.error('Tu navegador no soporta geolocalización')
    return
  }

  if (isTracking.value) {
    gpsService.stopTracking()
    isTracking.value = false
    toast.info('Rastreo detenido')
  } else {
    try {
      gpsService.startTracking(deviceId.value, interval.value)
      isTracking.value = true
      toast.success('Rastreo iniciado')
    } catch (error) {
      toast.error(error.message)
    }
  }
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString()
}
</script>
```

---

### Resumen de Geolocalización

**¿Qué hace el empleado?**
1. Abre la app en su navegador
2. Hace clic en "Iniciar Rastreo"
3. El navegador pide permiso
4. Acepta el permiso
5. La app obtiene su ubicación cada 30 segundos
6. Envía las coordenadas al backend automáticamente

**¿Qué hace el admin?**
1. Abre el dashboard
2. Ve un mapa con marcadores
3. Cada marcador es un empleado
4. Los marcadores se actualizan automáticamente cada 10 segundos

**¿Es complicado?**
❌ NO. El navegador hace todo el trabajo pesado.
✅ Solo necesitas llamar a `getCurrentPosition()` y enviar los datos al backend.

---


## 🌓 Modo Claro/Oscuro

### Implementación con Vuetify

Vuetify tiene soporte nativo para temas claro/oscuro. Es muy fácil de implementar.

#### 1. **Configuración de Vuetify**

**`src/plugins/vuetify.js`:**

```javascript
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#FFFFFF',
          surface: '#FFFFFF'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#2196F3',
          secondary: '#424242',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#121212',
          surface: '#1E1E1E'
        }
      }
    }
  }
})

export default vuetify
```

---

#### 2. **Store de Tema**

**`src/stores/theme.js`:**

```javascript
import { defineStore } from 'pinia'
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark'
  }),

  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      
      // Aplicar tema en Vuetify
      const theme = useTheme()
      theme.global.name.value = this.isDark ? 'dark' : 'light'
    },

    initTheme() {
      const theme = useTheme()
      theme.global.name.value = this.isDark ? 'dark' : 'light'
    }
  }
})
```

---

#### 3. **Componente Toggle**

**`src/components/common/ThemeToggle.vue`:**

```vue
<template>
  <v-btn
    :icon="themeStore.isDark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
    @click="themeStore.toggleTheme()"
    variant="text"
  >
    <v-icon>
      {{ themeStore.isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}
    </v-icon>
    <v-tooltip activator="parent" location="bottom">
      {{ themeStore.isDark ? 'Modo Claro' : 'Modo Oscuro' }}
    </v-tooltip>
  </v-btn>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>
```

---

#### 4. **Uso en App.vue**

**`src/App.vue`:**

```vue
<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

onMounted(() => {
  // Inicializar tema al cargar la app
  themeStore.initTheme()
})
</script>
```

---

#### 5. **Uso en Header**

```vue
<template>
  <v-app-bar color="primary" dark>
    <v-app-bar-title>GPS Tracking</v-app-bar-title>
    
    <v-spacer />
    
    <!-- Toggle de tema -->
    <ThemeToggle />
    
    <!-- Menú de usuario -->
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="logout">
          <v-list-item-title>Cerrar Sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import ThemeToggle from '@/components/common/ThemeToggle.vue'
</script>
```

---

### Personalización Adicional

#### Estilos CSS personalizados que respetan el tema:

```css
/* src/assets/styles/main.css */

/* Variables que cambian según el tema */
.v-theme--light {
  --map-border: #e0e0e0;
  --card-shadow: rgba(0, 0, 0, 0.1);
}

.v-theme--dark {
  --map-border: #424242;
  --card-shadow: rgba(0, 0, 0, 0.5);
}

/* Usar las variables */
.map-container {
  border: 2px solid var(--map-border);
  box-shadow: 0 4px 6px var(--card-shadow);
}
```

---

## 🧩 Componentes Reutilizables

### 1. **AppHeader.vue**
- Logo
- Nombre de usuario
- Toggle de tema
- Menú de usuario
- Botón de logout

### 2. **AppSidebar.vue**
- Navegación principal
- Items según rol
- Indicador de página activa

### 3. **LoadingSpinner.vue**
- Spinner de carga
- Overlay opcional
- Mensaje personalizable

### 4. **ConfirmDialog.vue**
- Modal de confirmación
- Para eliminar usuarios/dispositivos
- Personalizable

### 5. **MapView.vue**
- Mapa de Leaflet
- Marcadores
- Info windows
- Controles de zoom

### 6. **DeviceMarker.vue**
- Marcador personalizado
- Color según estado
- Popup con información

### 7. **UserTable.vue**
- Tabla de usuarios
- Paginación
- Búsqueda
- Acciones (editar/eliminar)

### 8. **DeviceTable.vue**
- Tabla de dispositivos
- Filtros por estado
- Acciones

### 9. **FormModal.vue**
- Modal genérico para formularios
- Validación integrada
- Botones de acción

### 10. **StatsCard.vue**
- Card para mostrar estadísticas
- Icono
- Título
- Valor
- Color personalizable

---

## 🔄 Flujo de Navegación

### Usuario No Autenticado
```
/login → Login exitoso → Redirige según rol
```

### Administrador
```
/admin/dashboard (mapa en tiempo real)
    ├── /admin/users (gestión de usuarios)
    ├── /admin/devices (gestión de dispositivos)
    ├── /admin/history (historial de rutas)
    └── /profile (perfil personal)
```

### Empleado
```
/empleado/dashboard (activar/desactivar rastreo)
    └── /profile (perfil personal)
```

### Protección de Rutas

```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Rutas públicas
  if (to.path === '/login') {
    if (authStore.isAuthenticated) {
      // Ya está autenticado, redirigir a su dashboard
      next(authStore.isAdmin ? '/admin/dashboard' : '/empleado/dashboard')
    } else {
      next()
    }
    return
  }
  
  // Rutas protegidas
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // Verificar rol
  if (to.meta.role && authStore.user.role !== to.meta.role) {
    next('/unauthorized')
    return
  }
  
  next()
})
```

---

## 📊 Resumen de Vistas y Elementos

| Vista | Elementos Principales | Usuarios |
|-------|----------------------|----------|
| Login | Formulario, Toggle tema | Todos |
| Dashboard Admin | Mapa, Lista dispositivos, Sidebar | Admin |
| Usuarios | Tabla, Modal CRUD, Búsqueda | Admin |
| Dispositivos | Tabla, Modal CRUD, Filtros | Admin |
| Historial | Mapa con ruta, Filtros, Stats | Admin |
| Dashboard Empleado | Botón rastreo, Info dispositivo | Empleado |
| Perfil | Formulario, Cambiar password | Todos |
| 404 | Mensaje, Botón volver | Todos |

**Total: 8 vistas**

---

## 🎨 Paleta de Colores Sugerida

### Modo Claro
- **Primary:** #1976D2 (Azul)
- **Success:** #4CAF50 (Verde)
- **Error:** #FF5252 (Rojo)
- **Warning:** #FB8C00 (Naranja)
- **Background:** #FFFFFF (Blanco)

### Modo Oscuro
- **Primary:** #2196F3 (Azul claro)
- **Success:** #4CAF50 (Verde)
- **Error:** #FF5252 (Rojo)
- **Warning:** #FB8C00 (Naranja)
- **Background:** #121212 (Negro)

---

## ✅ Checklist de Desarrollo

### Fase 1: Setup (Día 1)
- [ ] Crear proyecto Vue
- [ ] Instalar dependencias
- [ ] Configurar Vuetify
- [ ] Configurar router
- [ ] Configurar Pinia
- [ ] Crear estructura de carpetas

### Fase 2: Autenticación (Día 2)
- [ ] Crear servicio de API
- [ ] Crear store de auth
- [ ] Crear vista de login
- [ ] Implementar protección de rutas
- [ ] Implementar logout

### Fase 3: Dashboard Admin (Día 3-4)
- [ ] Crear layout admin
- [ ] Implementar mapa con Leaflet
- [ ] Obtener ubicaciones actuales
- [ ] Mostrar marcadores
- [ ] Auto-refresh cada 10s

### Fase 4: Gestión de Usuarios (Día 5)
- [ ] Crear tabla de usuarios
- [ ] Implementar CRUD
- [ ] Validación de formularios
- [ ] Confirmación de eliminación

### Fase 5: Gestión de Dispositivos (Día 6)
- [ ] Crear tabla de dispositivos
- [ ] Implementar CRUD
- [ ] Filtros por estado
- [ ] Asignación a usuarios

### Fase 6: Dashboard Empleado (Día 7)
- [ ] Crear servicio GPS
- [ ] Implementar botón de rastreo
- [ ] Mostrar última ubicación
- [ ] Configuración de intervalo

### Fase 7: Historial (Día 8)
- [ ] Crear filtros de fecha
- [ ] Obtener historial del backend
- [ ] Dibujar ruta en mapa
- [ ] Mostrar estadísticas

### Fase 8: Pulido (Día 9-10)
- [ ] Implementar modo claro/oscuro
- [ ] Agregar notificaciones
- [ ] Manejo de errores
- [ ] Loading states
- [ ] Responsive design
- [ ] Testing

---

## 🚀 Comando de Inicio

```bash
# Crear proyecto
npm create vue@latest gps-tracking-frontend

# Entrar al proyecto
cd gps-tracking-frontend

# Instalar dependencias base
npm install

# Instalar dependencias adicionales
npm install vuetify@next @mdi/font leaflet @vue-leaflet/vue-leaflet axios vue-toastification@next dayjs vee-validate yup

# Iniciar servidor de desarrollo
npm run dev
```

---

**¡Listo para empezar! Con este plan tienes todo lo necesario para crear el frontend. 🎨🚀**
