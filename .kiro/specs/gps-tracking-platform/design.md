# Documento de Diseño Técnico - Plataforma de Rastreo GPS

## Resumen Ejecutivo

Este documento describe el diseño técnico de una plataforma de rastreo GPS que permite a una empresa monitorear la ubicación de empleados en tiempo real. El sistema está compuesto por:
- **Backend**: API REST desarrollada en Laravel 11.x
- **Frontend Empleado**: Aplicación Vue.js para captura y envío de ubicaciones GPS
- **Frontend Admin**: Panel administrativo Vue.js para visualización y gestión

## Arquitectura General

### Diagrama de Arquitectura

```
┌─────────────────┐         ┌─────────────────┐
│  Cliente        │         │  Panel Admin    │
│  Empleado       │         │  (Vue.js)       │
│  (Vue.js)       │         │                 │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │  HTTPS/REST API           │
         │                           │
         └───────────┬───────────────┘
                     │
         ┌───────────▼────────────┐
         │   Laravel Backend      │
         │   - API REST           │
         │   - Sanctum Auth       │
         │   - Queue System       │
         │   - Reverb (WebSocket) │
         └───────────┬────────────┘
                     │
         ┌───────────▼────────────┐
         │   MySQL Database       │
         │   (ProGps)             │
         └────────────────────────┘
```

### Flujo de Datos Principal

1. **Captura GPS**: Cliente Empleado obtiene coordenadas del dispositivo
2. **Envío**: POST a `/api/gps` con token de autenticación
3. **Validación**: Backend verifica usuario, dispositivo y permisos
4. **Procesamiento**: Ubicación se encola para procesamiento asíncrono
5. **Almacenamiento**: Worker procesa cola y guarda en base de datos
6. **Notificación**: Reverb notifica a clientes admin conectados (tiempo real)
7. **Visualización**: Panel Admin actualiza mapa con nueva ubicación


## Modelo de Datos

### Diagrama Entidad-Relación

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   roles     │         │    users     │         │   devices   │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id          │◄───┐    │ id           │◄───┐    │ id          │
│ name        │    └────┤ role_id      │    └────┤ user_id     │
│ created_at  │         │ name         │         │ name        │
│ updated_at  │         │ email        │         │ serial      │
└─────────────┘         │ password     │         │ status      │
                        │ created_at   │         │ created_at  │
                        │ updated_at   │         │ updated_at  │
                        └──────────────┘         └──────┬──────┘
                                                        │
                                                        │
                                                 ┌──────▼──────┐
                                                 │  gps_logs   │
                                                 ├─────────────┤
                                                 │ id          │
                                                 │ user_id     │
                                                 │ device_id   │
                                                 │ latitude    │
                                                 │ longitude   │
                                                 │ accuracy    │
                                                 │ created_at  │
                                                 └─────────────┘
```

### Tablas de Base de Datos

#### Tabla: roles
```sql
CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Datos iniciales:**
- admin
- empleado


#### Tabla: users
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    INDEX idx_role (role_id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
- `id`: Identificador único
- `role_id`: Relación con tabla roles (admin o empleado)
- `name`: Nombre completo del usuario
- `email`: Email único para login
- `password`: Hash bcrypt de la contraseña

#### Tabla: devices
```sql
CREATE TABLE devices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    serial VARCHAR(100) NOT NULL UNIQUE,
    status ENUM('activo', 'inactivo', 'mantenimiento') DEFAULT 'activo',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_serial (serial)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
- `id`: Identificador único
- `user_id`: Usuario al que pertenece el dispositivo
- `name`: Nombre descriptivo del dispositivo
- `serial`: Número de serie único
- `status`: Estado del dispositivo (activo, inactivo, mantenimiento)


#### Tabla: gps_logs
```sql
CREATE TABLE gps_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    device_id BIGINT UNSIGNED NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy FLOAT NULL,
    created_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    INDEX idx_device_created (device_id, created_at),
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Campos:**
- `id`: Identificador único
- `user_id`: Usuario que envió la ubicación
- `device_id`: Dispositivo que generó la ubicación
- `latitude`: Latitud (-90 a 90)
- `longitude`: Longitud (-180 a 180)
- `accuracy`: Precisión en metros (opcional)
- `created_at`: Timestamp del servidor

**Índices optimizados:**
- `idx_device_created`: Para consultas de historial por dispositivo
- `idx_user_created`: Para consultas por usuario
- `idx_created`: Para consultas temporales

#### Tabla: personal_access_tokens (Laravel Sanctum)
```sql
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    INDEX idx_tokenable (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```


## Componentes del Backend

### 1. Autenticación (Laravel Sanctum)

**Responsabilidad:** Gestionar autenticación basada en tokens

**Endpoints:**
- `POST /api/auth/login`: Autenticar usuario y generar token
- `POST /api/auth/logout`: Invalidar token actual
- `GET /api/auth/me`: Obtener información del usuario autenticado

**Flujo de autenticación:**
```
1. Usuario envía email + password
2. Backend valida credenciales
3. Si válido: genera token Sanctum
4. Retorna: { token, user: { id, name, email, role } }
5. Cliente almacena token en localStorage/sessionStorage
6. Cliente incluye token en header: Authorization: Bearer {token}
```

**Validaciones:**
- Email debe existir en la base de datos
- Password debe coincidir con hash almacenado
- Usuario debe tener un rol asignado

### 2. Gestión de Usuarios

**Responsabilidad:** CRUD de usuarios (solo admin)

**Endpoints:**
- `GET /api/users`: Listar todos los usuarios
- `GET /api/users/{id}`: Obtener un usuario específico
- `POST /api/users`: Crear nuevo usuario
- `PUT /api/users/{id}`: Actualizar usuario
- `DELETE /api/users/{id}`: Eliminar usuario

**Middleware:** `auth:sanctum`, `role:admin`

**Validaciones:**
- Email único
- Password mínimo 8 caracteres
- Role_id debe existir en tabla roles
- Solo admin puede crear otros admin


### 3. Gestión de Dispositivos

**Responsabilidad:** CRUD de dispositivos

**Endpoints:**
- `GET /api/devices`: Listar dispositivos (admin: todos, empleado: solo suyos)
- `GET /api/devices/{id}`: Obtener dispositivo específico
- `POST /api/devices`: Crear dispositivo (solo admin)
- `PUT /api/devices/{id}`: Actualizar dispositivo (solo admin)
- `DELETE /api/devices/{id}`: Eliminar dispositivo (solo admin)
- `PATCH /api/devices/{id}/status`: Cambiar estado del dispositivo (solo admin)

**Middleware:** `auth:sanctum`

**Validaciones:**
- Serial único
- User_id debe existir
- Status debe ser: activo, inactivo o mantenimiento
- Empleados solo pueden ver sus propios dispositivos

### 4. Registro de Ubicaciones GPS

**Responsabilidad:** Recibir y procesar ubicaciones GPS

**Endpoints:**
- `POST /api/gps`: Registrar nueva ubicación

**Request Body:**
```json
{
  "device_id": 1,
  "latitude": -12.046374,
  "longitude": -77.042793,
  "accuracy": 10.5
}
```

**Middleware:** `auth:sanctum`

**Proceso:**
1. Validar que device_id existe
2. Verificar que device pertenece al usuario autenticado
3. Validar que device tiene status "activo"
4. Validar rangos de latitud (-90 a 90) y longitud (-180 a 180)
5. Encolar job para procesamiento asíncrono
6. Retornar respuesta inmediata (202 Accepted)

**Job: ProcessGpsLocation**
- Guardar en tabla gps_logs
- Broadcast evento via Reverb para actualización en tiempo real
- Manejar reintentos en caso de error


### 5. Consulta de Ubicaciones

**Responsabilidad:** Proporcionar datos de ubicación para visualización

**Endpoints:**

#### Ubicaciones Actuales
```
GET /api/locations/current
```
**Descripción:** Retorna la última ubicación de cada dispositivo activo

**Response:**
```json
[
  {
    "device_id": 1,
    "device_name": "Móvil Juan",
    "device_serial": "ABC123",
    "user_id": 2,
    "user_name": "Juan Pérez",
    "latitude": -12.046374,
    "longitude": -77.042793,
    "accuracy": 10.5,
    "timestamp": "2025-11-11T10:30:00Z",
    "minutes_ago": 2
  }
]
```

**Middleware:** `auth:sanctum`, `role:admin`

#### Historial de Ubicaciones
```
GET /api/locations/history?device_id={id}&start_date={date}&end_date={date}
```
**Descripción:** Retorna historial de ubicaciones de un dispositivo

**Query Parameters:**
- `device_id` (requerido): ID del dispositivo
- `start_date` (requerido): Fecha inicio (Y-m-d H:i:s)
- `end_date` (requerido): Fecha fin (Y-m-d H:i:s)
- `limit` (opcional): Máximo de registros (default: 1000)

**Validaciones:**
- Rango máximo: 30 días
- device_id debe existir

**Response:**
```json
{
  "device": {
    "id": 1,
    "name": "Móvil Juan",
    "user_name": "Juan Pérez"
  },
  "locations": [
    {
      "latitude": -12.046374,
      "longitude": -77.042793,
      "accuracy": 10.5,
      "timestamp": "2025-11-11T10:30:00Z"
    }
  ],
  "statistics": {
    "total_points": 150,
    "distance_km": 12.5,
    "duration_minutes": 180
  }
}
```

**Middleware:** `auth:sanctum`, `role:admin`


### 6. Sistema de Colas

**Responsabilidad:** Procesamiento asíncrono de ubicaciones GPS

**Configuración:**
- **Desarrollo:** Driver `sync` (procesamiento inmediato)
- **Producción:** Driver `redis` (procesamiento en background)

**Jobs:**

#### ProcessGpsLocation
```php
class ProcessGpsLocation implements ShouldQueue
{
    public $tries = 3;
    public $backoff = [10, 30, 60]; // segundos
    
    public function handle()
    {
        // 1. Guardar en gps_logs
        // 2. Broadcast evento LocationUpdated
        // 3. Log de éxito
    }
    
    public function failed(Throwable $exception)
    {
        // Log de error para auditoría
    }
}
```

**Eventos Broadcast:**
```php
class LocationUpdated implements ShouldBroadcast
{
    public function broadcastOn()
    {
        return new Channel('locations');
    }
    
    public function broadcastWith()
    {
        return [
            'device_id' => $this->device_id,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'timestamp' => $this->timestamp
        ];
    }
}
```

### 7. Middleware Personalizado

#### CheckDeviceOwnership
```php
// Verifica que el dispositivo pertenece al usuario autenticado
// Usado en: POST /api/gps
```

#### RoleMiddleware
```php
// Verifica que el usuario tiene el rol requerido
// Usado en: endpoints administrativos
```


## Componentes del Frontend

### Arquitectura Frontend

```
frontend/
├── employee-app/          # Aplicación para empleados
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.vue
│   │   │   ├── GpsTracker.vue
│   │   │   └── StatusIndicator.vue
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── gps.js
│   │   │   └── auth.js
│   │   ├── stores/
│   │   │   └── auth.js (Pinia)
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
│
└── admin-panel/           # Panel administrativo
    ├── src/
    │   ├── components/
    │   │   ├── LoginForm.vue
    │   │   ├── MapView.vue
    │   │   ├── DeviceList.vue
    │   │   ├── UserManagement.vue
    │   │   ├── DeviceManagement.vue
    │   │   ├── HistoryViewer.vue
    │   │   └── StatusIndicators.vue
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── websocket.js
    │   │   └── auth.js
    │   ├── stores/
    │   │   ├── auth.js
    │   │   ├── devices.js
    │   │   └── locations.js (Pinia)
    │   ├── router/
    │   │   └── index.js
    │   ├── App.vue
    │   └── main.js
    └── package.json
```


### Cliente Empleado (Vue.js)

#### Componentes Principales

**1. LoginForm.vue**
- Formulario de email y password
- Validación de campos
- Llamada a API `/api/auth/login`
- Almacenamiento de token en localStorage
- Redirección a GpsTracker tras login exitoso

**2. GpsTracker.vue**
- Solicita permisos de geolocalización
- Obtiene coordenadas cada 30 segundos (configurable)
- Envía a `/api/gps` con token de autenticación
- Muestra estado: "Enviando...", "Enviado", "Error"
- Cola local para ubicaciones offline
- Reintento automático cuando se recupera conexión

**3. StatusIndicator.vue**
- Muestra estado de conexión (online/offline)
- Última ubicación enviada (timestamp)
- Contador de ubicaciones enviadas en la sesión
- Botón de logout

#### Servicios

**gps.js**
```javascript
class GpsService {
  constructor() {
    this.watchId = null;
    this.interval = 30000; // 30 segundos
    this.offlineQueue = [];
  }
  
  startTracking(callback) {
    // Obtener ubicación cada X segundos
    // Llamar callback con coordenadas
  }
  
  stopTracking() {
    // Detener watchPosition
  }
  
  async sendLocation(latitude, longitude, accuracy) {
    // POST a /api/gps
    // Si falla, agregar a offlineQueue
  }
  
  async syncOfflineQueue() {
    // Enviar ubicaciones pendientes
  }
}
```

**auth.js**
```javascript
class AuthService {
  async login(email, password) {
    // POST a /api/auth/login
    // Guardar token en localStorage
    // Retornar user data
  }
  
  logout() {
    // POST a /api/auth/logout
    // Limpiar localStorage
  }
  
  getToken() {
    return localStorage.getItem('token');
  }
  
  isAuthenticated() {
    return !!this.getToken();
  }
}
```


### Panel Administrativo (Vue.js)

#### Componentes Principales

**1. MapView.vue**
- Integración con Leaflet.js o Google Maps
- Muestra marcadores de dispositivos activos
- Actualización automática cada 30 segundos
- Click en marcador muestra popup con detalles
- Colores según estado: verde (activo), amarillo (advertencia), rojo (sin señal)

**2. DeviceList.vue**
- Lista de dispositivos con información:
  - Nombre del dispositivo
  - Usuario asignado
  - Estado (activo/inactivo/mantenimiento)
  - Última ubicación (tiempo transcurrido)
- Filtros: por estado, por usuario
- Búsqueda por nombre o serial
- Click en dispositivo centra mapa en su ubicación

**3. UserManagement.vue**
- Tabla de usuarios con columnas: ID, Nombre, Email, Rol
- Botones: Crear, Editar, Eliminar
- Modal para formulario de usuario
- Validaciones: email único, password mínimo 8 caracteres

**4. DeviceManagement.vue**
- Tabla de dispositivos con columnas: ID, Nombre, Serial, Usuario, Estado
- Botones: Crear, Editar, Eliminar, Cambiar Estado
- Modal para formulario de dispositivo
- Select para asignar usuario
- Toggle para cambiar estado

**5. HistoryViewer.vue**
- Selector de dispositivo (dropdown)
- Selector de rango de fechas (date picker)
- Botón "Ver Historial"
- Mapa con ruta trazada (polyline)
- Marcadores en puntos clave
- Panel lateral con estadísticas:
  - Distancia total recorrida
  - Tiempo en movimiento
  - Número de puntos GPS
  - Velocidad promedio (opcional)
- Botón "Reproducir Ruta" (animación)

**6. StatusIndicators.vue**
- Cards con métricas:
  - Total de dispositivos
  - Dispositivos activos
  - Dispositivos con advertencia
  - Dispositivos sin señal
- Gráfico de actividad (opcional)


#### Servicios

**websocket.js**
```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

class WebSocketService {
  constructor() {
    this.echo = null;
  }
  
  connect(token) {
    this.echo = new Echo({
      broadcaster: 'reverb',
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST,
      wsPort: import.meta.env.VITE_REVERB_PORT,
      forceTLS: false,
      enabledTransports: ['ws', 'wss'],
      auth: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });
  }
  
  listenToLocations(callback) {
    this.echo.channel('locations')
      .listen('LocationUpdated', (data) => {
        callback(data);
      });
  }
  
  disconnect() {
    if (this.echo) {
      this.echo.disconnect();
    }
  }
}
```

**api.js**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```


#### Stores (Pinia)

**auth.js**
```javascript
import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  
  actions: {
    async login(email, password) {
      const response = await api.post('/auth/login', { email, password });
      this.token = response.data.token;
      this.user = response.data.user;
      localStorage.setItem('token', this.token);
    },
    
    async logout() {
      await api.post('/auth/logout');
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
    },
    
    async fetchUser() {
      const response = await api.get('/auth/me');
      this.user = response.data;
    }
  }
});
```

**devices.js**
```javascript
import { defineStore } from 'pinia';
import api from '@/services/api';

export const useDevicesStore = defineStore('devices', {
  state: () => ({
    devices: [],
    loading: false
  }),
  
  actions: {
    async fetchDevices() {
      this.loading = true;
      const response = await api.get('/devices');
      this.devices = response.data;
      this.loading = false;
    },
    
    async createDevice(deviceData) {
      const response = await api.post('/devices', deviceData);
      this.devices.push(response.data);
    },
    
    async updateDevice(id, deviceData) {
      const response = await api.put(`/devices/${id}`, deviceData);
      const index = this.devices.findIndex(d => d.id === id);
      if (index !== -1) {
        this.devices[index] = response.data;
      }
    },
    
    async deleteDevice(id) {
      await api.delete(`/devices/${id}`);
      this.devices = this.devices.filter(d => d.id !== id);
    }
  }
});
```


**locations.js**
```javascript
import { defineStore } from 'pinia';
import api from '@/services/api';

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    currentLocations: [],
    history: [],
    loading: false
  }),
  
  actions: {
    async fetchCurrentLocations() {
      this.loading = true;
      const response = await api.get('/locations/current');
      this.currentLocations = response.data;
      this.loading = false;
    },
    
    async fetchHistory(deviceId, startDate, endDate) {
      this.loading = true;
      const response = await api.get('/locations/history', {
        params: { device_id: deviceId, start_date: startDate, end_date: endDate }
      });
      this.history = response.data;
      this.loading = false;
    },
    
    updateLocation(locationData) {
      // Actualizar ubicación en tiempo real desde WebSocket
      const index = this.currentLocations.findIndex(
        l => l.device_id === locationData.device_id
      );
      if (index !== -1) {
        this.currentLocations[index] = {
          ...this.currentLocations[index],
          ...locationData
        };
      }
    }
  }
});
```


## Manejo de Errores

### Backend

**Códigos de Estado HTTP:**
- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `202 Accepted`: Solicitud aceptada para procesamiento asíncrono
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: Token inválido o ausente
- `403 Forbidden`: Usuario no tiene permisos
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Validación fallida
- `500 Internal Server Error`: Error del servidor

**Formato de Respuesta de Error:**
```json
{
  "message": "Descripción del error",
  "errors": {
    "field_name": ["Error específico del campo"]
  }
}
```

**Ejemplos:**

Validación fallida:
```json
{
  "message": "Los datos proporcionados no son válidos",
  "errors": {
    "email": ["El email ya está registrado"],
    "password": ["La contraseña debe tener al menos 8 caracteres"]
  }
}
```

Dispositivo no pertenece al usuario:
```json
{
  "message": "No tienes permiso para usar este dispositivo",
  "errors": {}
}
```

### Frontend

**Estrategias de Manejo:**

1. **Errores de Red:**
   - Mostrar mensaje: "Error de conexión. Verifica tu internet"
   - Reintentar automáticamente después de 5 segundos
   - Encolar operaciones para envío posterior

2. **Errores 401 (No autorizado):**
   - Limpiar token almacenado
   - Redirigir a página de login
   - Mostrar mensaje: "Tu sesión ha expirado"

3. **Errores 403 (Prohibido):**
   - Mostrar mensaje: "No tienes permisos para esta acción"
   - No reintentar automáticamente

4. **Errores de Validación (422):**
   - Mostrar errores específicos en cada campo del formulario
   - Resaltar campos con error en rojo

5. **Errores de GPS:**
   - Permisos denegados: "Necesitamos acceso a tu ubicación"
   - GPS no disponible: "Tu dispositivo no soporta GPS"
   - Timeout: "No se pudo obtener tu ubicación. Intenta de nuevo"


## Estrategia de Testing

### Backend (Laravel)

**1. Tests Unitarios**
- Modelos: Relaciones, scopes, mutators
- Servicios: Lógica de negocio
- Jobs: Procesamiento de ubicaciones
- Helpers: Funciones de utilidad (cálculo de distancias)

**2. Tests de Integración**
- Autenticación: Login, logout, tokens
- CRUD de usuarios y dispositivos
- Registro de ubicaciones GPS
- Consultas de ubicaciones

**3. Tests de API (Feature Tests)**
```php
// Ejemplo: tests/Feature/GpsLocationTest.php
public function test_employee_can_send_gps_location()
{
    $user = User::factory()->create(['role_id' => 2]); // empleado
    $device = Device::factory()->create(['user_id' => $user->id]);
    
    $response = $this->actingAs($user)
        ->postJson('/api/gps', [
            'device_id' => $device->id,
            'latitude' => -12.046374,
            'longitude' => -77.042793,
            'accuracy' => 10.5
        ]);
    
    $response->assertStatus(202);
    $this->assertDatabaseHas('gps_logs', [
        'device_id' => $device->id,
        'latitude' => -12.046374
    ]);
}

public function test_employee_cannot_send_location_for_other_device()
{
    $user = User::factory()->create(['role_id' => 2]);
    $otherDevice = Device::factory()->create(); // otro usuario
    
    $response = $this->actingAs($user)
        ->postJson('/api/gps', [
            'device_id' => $otherDevice->id,
            'latitude' => -12.046374,
            'longitude' => -77.042793
        ]);
    
    $response->assertStatus(403);
}
```

**Herramientas:**
- PHPUnit (incluido en Laravel)
- Laravel Factories para datos de prueba
- Database Transactions para rollback automático


### Frontend (Vue.js)

**1. Tests de Componentes**
- Renderizado correcto
- Interacciones de usuario (clicks, inputs)
- Emisión de eventos
- Props y validaciones

**2. Tests de Servicios**
- Llamadas a API
- Manejo de respuestas exitosas
- Manejo de errores
- Almacenamiento de tokens

**3. Tests de Stores (Pinia)**
- Estado inicial
- Mutaciones de estado
- Acciones asíncronas
- Getters

**Ejemplo con Vitest:**
```javascript
// tests/components/LoginForm.spec.js
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from '@/components/LoginForm.vue';

describe('LoginForm', () => {
  it('renders login form', () => {
    const wrapper = mount(LoginForm);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });
  
  it('emits login event with credentials', async () => {
    const wrapper = mount(LoginForm);
    
    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');
    
    expect(wrapper.emitted('login')).toBeTruthy();
    expect(wrapper.emitted('login')[0]).toEqual([{
      email: 'test@example.com',
      password: 'password123'
    }]);
  });
});
```

**Herramientas:**
- Vitest (test runner)
- @vue/test-utils (utilidades para testing de Vue)
- MSW (Mock Service Worker) para mockear APIs


## Seguridad

### Autenticación y Autorización

**1. Laravel Sanctum**
- Tokens de acceso personal
- Expiración de tokens: 24 horas (configurable)
- Revocación de tokens al logout
- Un token por sesión (opcional: múltiples dispositivos)

**2. Middleware de Roles**
```php
// app/Http/Middleware/CheckRole.php
public function handle($request, Closure $next, $role)
{
    if (!$request->user() || $request->user()->role->name !== $role) {
        return response()->json(['message' => 'Acceso denegado'], 403);
    }
    return $next($request);
}
```

**3. Validación de Propiedad**
- Verificar que el dispositivo pertenece al usuario autenticado
- Implementado en middleware CheckDeviceOwnership
- Aplicado en endpoint POST /api/gps

### Protección de Datos

**1. Encriptación**
- Contraseñas: bcrypt con 12 rounds
- HTTPS obligatorio en producción
- Tokens almacenados de forma segura

**2. Validación de Entrada**
- Validación de tipos de datos
- Sanitización de inputs
- Límites de longitud
- Rangos válidos para coordenadas GPS

**3. Rate Limiting**
```php
// routes/api.php
Route::middleware(['throttle:60,1'])->group(function () {
    // Máximo 60 requests por minuto
});

Route::post('/gps', [GpsController::class, 'store'])
    ->middleware(['throttle:120,1']); // 120 requests/min para GPS
```

### Prevención de Ataques

**1. SQL Injection**
- Uso de Eloquent ORM
- Prepared statements automáticos
- Validación de parámetros

**2. XSS (Cross-Site Scripting)**
- Escape automático en Blade (backend)
- Sanitización en Vue.js (frontend)
- Content Security Policy headers

**3. CSRF (Cross-Site Request Forgery)**
- No aplica para API REST con tokens
- Sanctum maneja CSRF para SPA si se usa

**4. Mass Assignment**
- Uso de $fillable en modelos
- Validación explícita de campos permitidos


## Optimización y Rendimiento

### Base de Datos

**1. Índices**
```sql
-- Consultas frecuentes optimizadas
INDEX idx_device_created ON gps_logs(device_id, created_at);
INDEX idx_user_created ON gps_logs(user_id, created_at);
INDEX idx_created ON gps_logs(created_at);
INDEX idx_status ON devices(status);
```

**2. Paginación**
- Usar paginación en listados grandes
- Límite por defecto: 50 registros
- Máximo: 1000 registros

**3. Eager Loading**
```php
// Evitar N+1 queries
$devices = Device::with(['user', 'latestLocation'])->get();
```

**4. Caché**
- Cachear lista de dispositivos activos (5 minutos)
- Cachear ubicaciones actuales (30 segundos)
- Usar Redis en producción

### Backend

**1. Procesamiento Asíncrono**
- Ubicaciones GPS procesadas en cola
- Respuesta inmediata al cliente (202 Accepted)
- Workers dedicados para procesar colas

**2. Compresión**
- Gzip para respuestas JSON
- Reducción de tamaño de payload

**3. Logs Eficientes**
- Log solo errores en producción
- Rotación de logs diaria
- Limpieza automática de logs antiguos

### Frontend

**1. Lazy Loading**
- Componentes cargados bajo demanda
- Rutas con carga diferida

**2. Debouncing**
- Búsquedas con debounce de 300ms
- Evitar llamadas excesivas a API

**3. Optimización de Mapa**
- Clustering de marcadores si hay muchos dispositivos
- Actualización selectiva (solo marcadores que cambiaron)
- Límite de marcadores visibles: 100

**4. Service Workers (PWA)**
- Caché de assets estáticos
- Funcionamiento offline básico
- Sincronización en background


## Despliegue

### Entorno de Desarrollo

**Backend:**
```bash
# Requisitos
- PHP 8.2+
- Composer
- MySQL 8.0+
- Redis (opcional para colas)

# Instalación
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve

# Queue worker (terminal separado)
php artisan queue:work

# Reverb server (terminal separado)
php artisan reverb:start
```

**Frontend:**
```bash
# Requisitos
- Node.js 18+
- npm o yarn

# Cliente Empleado
cd frontend/employee-app
npm install
npm run dev

# Panel Admin
cd frontend/admin-panel
npm install
npm run dev
```

### Entorno de Producción

**Backend:**
- Servidor: VPS con Ubuntu 22.04
- Web Server: Nginx
- PHP-FPM: 8.2
- Supervisor: Para queue workers y Reverb
- SSL: Let's Encrypt (Certbot)

**Configuración Nginx:**
```nginx
server {
    listen 80;
    server_name api.progps.com;
    root /var/www/progps-backend/public;
    
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

**Supervisor (Queue Worker):**
```ini
[program:progps-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/progps-backend/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/progps-backend/storage/logs/worker.log
```

**Frontend:**
- Hosting: Vercel, Netlify o servidor estático
- Build: `npm run build`
- Variables de entorno: VITE_API_URL, VITE_REVERB_*


## Consideraciones Futuras (Fase 2)

### 1. Geofencing (Geocercas)

**Descripción:** Definir zonas geográficas y recibir alertas cuando un dispositivo entra o sale.

**Implementación:**
- Tabla `geofences`: id, name, polygon (JSON con coordenadas), user_id
- Algoritmo: Point-in-Polygon para detectar entrada/salida
- Eventos: `DeviceEnteredGeofence`, `DeviceExitedGeofence`
- Notificaciones: Email, push notifications

### 2. Zonas Jerárquicas

**Descripción:** Organizar dispositivos por empresa → sucursales → áreas.

**Implementación:**
- Tabla `zones`: id, name, parent_id, type (empresa/sucursal/área)
- Relación: devices.zone_id
- Estructura de árbol con Nested Set o Closure Table
- Filtros en panel admin por zona

### 3. Análisis de Rutas

**Descripción:** Estadísticas avanzadas de movimiento.

**Métricas:**
- Distancia total recorrida (fórmula de Haversine)
- Velocidad promedio y máxima
- Tiempo en movimiento vs tiempo detenido
- Puntos de interés frecuentes (clustering)

**Implementación:**
- Job: `AnalyzeRoute` ejecutado diariamente
- Tabla `route_statistics`: device_id, date, distance_km, avg_speed, etc.
- Gráficos en panel admin

### 4. Notificaciones Push

**Descripción:** Alertas en tiempo real para administradores.

**Casos de uso:**
- Dispositivo sin señal por más de X minutos
- Dispositivo sale de zona permitida
- Velocidad excesiva detectada

**Implementación:**
- Firebase Cloud Messaging (FCM)
- Tabla `notifications`: user_id, type, message, read_at
- Componente NotificationBell en panel admin

### 5. Reportes Exportables

**Descripción:** Generar reportes en PDF o Excel.

**Tipos de reportes:**
- Resumen diario de actividad por dispositivo
- Historial de ubicaciones con mapa
- Estadísticas mensuales

**Implementación:**
- Laravel Excel para exportar a Excel
- DomPDF o Snappy para generar PDFs
- Endpoint: `GET /api/reports/export?type=daily&device_id=1&date=2025-11-11`

### 6. Modo Offline Avanzado

**Descripción:** Funcionamiento completo sin conexión.

**Características:**
- IndexedDB para almacenar ubicaciones offline
- Service Worker para sincronización en background
- Indicador visual de ubicaciones pendientes de envío
- Compresión de datos para reducir uso de datos móviles


## Resumen de Tecnologías

### Backend
| Componente | Tecnología | Versión |
|------------|------------|---------|
| Framework | Laravel | 11.x |
| Lenguaje | PHP | 8.2+ |
| Base de Datos | MySQL | 8.0+ |
| Autenticación | Laravel Sanctum | - |
| Colas | Redis / Sync | - |
| WebSockets | Laravel Reverb | - |
| Testing | PHPUnit | - |

### Frontend
| Componente | Tecnología | Versión |
|------------|------------|---------|
| Framework | Vue.js | 3.x |
| Build Tool | Vite | 5.x |
| State Management | Pinia | 2.x |
| Router | Vue Router | 4.x |
| HTTP Client | Axios | 1.x |
| Mapas | Leaflet.js | 1.9+ |
| WebSockets | Laravel Echo + Pusher | - |
| Testing | Vitest | - |

### DevOps
| Componente | Tecnología |
|------------|------------|
| Control de Versiones | Git |
| CI/CD | GitHub Actions |
| Servidor Web | Nginx |
| Process Manager | Supervisor |
| SSL | Let's Encrypt |
| Monitoreo | Laravel Telescope (dev) |

## Conclusión

Este diseño proporciona una arquitectura sólida, escalable y segura para la plataforma de rastreo GPS. La separación clara entre backend y frontend permite desarrollo independiente y facilita el mantenimiento. El uso de tecnologías modernas y probadas garantiza un sistema robusto y eficiente.

**Próximos pasos:**
1. Revisar y aprobar este diseño
2. Crear el plan de implementación con tareas específicas
3. Comenzar desarrollo del backend (migraciones, modelos, API)
4. Desarrollar frontend en paralelo
5. Integración y testing
6. Despliegue a producción
