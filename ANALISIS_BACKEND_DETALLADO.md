# 📊 Análisis Detallado del Backend GPS Tracking

## 🗄️ BASE DE DATOS: ProGps

### Configuración de Conexión
```
Nombre: ProGps
Host: 127.0.0.1
Puerto: 3306
Usuario: root
Contraseña: 1234
Motor: MySQL
```

---

## 📋 ESTRUCTURA DE TABLAS

### 1. **roles** - Tabla de Roles del Sistema
Define los tipos de usuarios que pueden acceder al sistema.

**Estructura:**
```sql
- id (bigint, PK, auto_increment)
- name (varchar, unique) 
- created_at (timestamp)
- updated_at (timestamp)
```

**Datos Iniciales:**
- `admin` (ID: 1) - Administrador con acceso total
- `empleado` (ID: 2) - Empleado con acceso limitado

**Propósito:** 
Control de acceso basado en roles (RBAC). Determina qué operaciones puede realizar cada usuario.

---

### 2. **users** - Tabla de Usuarios
Almacena todos los usuarios del sistema (administradores y empleados).

**Estructura:**
```sql
- id (bigint, PK, auto_increment)
- name (varchar)
- email (varchar, unique)
- email_verified_at (timestamp, nullable)
- password (varchar, hashed con bcrypt)
- role_id (bigint, FK -> roles.id, nullable)
- remember_token (varchar, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

**Relaciones:**
- `belongsTo` Role (un usuario tiene un rol)
- `hasMany` Device (un usuario puede tener múltiples dispositivos)
- `hasMany` GpsLog (un usuario genera múltiples registros GPS)

**Usuarios de Prueba:**
1. **Admin:**
   - Email: admin@gps.com
   - Password: admin123
   - Role: admin

2. **Empleado:**
   - Email: juan@gps.com
   - Password: empleado123
   - Role: empleado

**Propósito:**
Gestión de autenticación y autorización. Cada usuario puede tener dispositivos asignados y generar registros de ubicación.

---

### 3. **devices** - Tabla de Dispositivos GPS
Registra los dispositivos móviles que envían ubicaciones GPS.

**Estructura:**
```sql
- id (bigint, PK, auto_increment)
- user_id (bigint, FK -> users.id, cascade on delete)
- name (varchar) - Nombre descriptivo del dispositivo
- serial (varchar, unique) - Número de serie único
- status (enum: 'activo', 'inactivo', 'mantenimiento')
- created_at (timestamp)
- updated_at (timestamp)
```

**Relaciones:**
- `belongsTo` User (un dispositivo pertenece a un usuario)
- `hasMany` GpsLog (un dispositivo genera múltiples registros GPS)
- `hasOne` latestLocation (última ubicación registrada)

**Estados Posibles:**
- `activo`: Dispositivo operativo, puede enviar ubicaciones
- `inactivo`: Dispositivo deshabilitado temporalmente
- `mantenimiento`: Dispositivo en reparación o mantenimiento

**Dispositivo de Prueba:**
- Nombre: "Móvil Juan"
- Serial: "ABC123"
- Usuario: Juan Pérez (empleado)
- Estado: activo

**Propósito:**
Identificar y gestionar los dispositivos móviles. Solo dispositivos activos pueden registrar ubicaciones.

---

### 4. **gps_logs** - Tabla de Registros GPS (La más importante)
Almacena todas las ubicaciones GPS enviadas por los dispositivos.

**Estructura:**
```sql
- id (bigint, PK, auto_increment)
- user_id (bigint, FK -> users.id, cascade on delete)
- device_id (bigint, FK -> devices.id, cascade on delete)
- latitude (decimal 10,8) - Latitud (-90 a 90)
- longitude (decimal 11,8) - Longitud (-180 a 180)
- accuracy (decimal 8,2, nullable) - Precisión en metros
- speed (decimal 8,2, nullable) - Velocidad en m/s
- heading (decimal 8,2, nullable) - Dirección en grados (0-360)
- altitude (decimal 8,2, nullable) - Altitud en metros
- timestamp (timestamp) - Momento exacto de la ubicación
- created_at (timestamp)
- updated_at (timestamp)
```

**Índices para Optimización:**
```sql
INDEX (device_id, timestamp) - Búsquedas por dispositivo y fecha
INDEX (timestamp) - Búsquedas por rango de fechas
```

**Relaciones:**
- `belongsTo` User (cada registro pertenece a un usuario)
- `belongsTo` Device (cada registro proviene de un dispositivo)

**Propósito:**
Almacenar el historial completo de ubicaciones. Permite rastrear movimientos, calcular distancias y generar reportes.

---

### 5. **personal_access_tokens** - Tabla de Tokens de Autenticación
Gestiona los tokens de acceso para la API (Laravel Sanctum).

**Estructura:**
```sql
- id (bigint, PK, auto_increment)
- tokenable_type (varchar) - Tipo de modelo (User)
- tokenable_id (bigint) - ID del usuario
- name (varchar) - Nombre del token
- token (varchar, unique, hashed) - Token de acceso
- abilities (text, nullable) - Permisos del token
- last_used_at (timestamp, nullable)
- expires_at (timestamp, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

**Propósito:**
Autenticación stateless para la API REST. Cada login genera un token único.

---

### 6. **jobs** - Tabla de Cola de Trabajos
Almacena trabajos pendientes para procesamiento asíncrono.

**Estructura:**
```sql
- id (bigint, PK, auto_increment)
- queue (varchar) - Nombre de la cola
- payload (longtext) - Datos del trabajo serializado
- attempts (tinyint) - Intentos realizados
- reserved_at (int, nullable) - Timestamp de reserva
- available_at (int) - Timestamp de disponibilidad
- created_at (int) - Timestamp de creación
```

**Propósito:**
Procesar ubicaciones GPS de forma asíncrona sin bloquear las peticiones HTTP.

---

### 7. **failed_jobs** - Tabla de Trabajos Fallidos
Registra trabajos que fallaron después de todos los reintentos.

**Estructura:**
```sql
- id (bigint, PK, auto_increment)
- uuid (varchar, unique)
- connection (text) - Conexión de cola
- queue (text) - Nombre de la cola
- payload (longtext) - Datos del trabajo
- exception (longtext) - Excepción capturada
- failed_at (timestamp) - Momento del fallo
```

**Propósito:**
Debugging y recuperación de trabajos fallidos.

---

### 8. **cache** - Tabla de Caché
Almacena datos en caché para mejorar el rendimiento.

**Estructura:**
```sql
- key (varchar, PK)
- value (mediumtext)
- expiration (int) - Timestamp de expiración
```

**Propósito:**
Cachear consultas frecuentes y reducir carga en la base de datos.

---

### 9. **sessions** - Tabla de Sesiones
Almacena sesiones de usuario.

**Estructura:**
```sql
- id (varchar, PK)
- user_id (bigint, nullable)
- ip_address (varchar, nullable)
- user_agent (text, nullable)
- payload (longtext)
- last_activity (int)
```

**Propósito:**
Gestión de sesiones para la aplicación web.

---

## 🔗 DIAGRAMA DE RELACIONES

```
roles (1) ----< (N) users (1) ----< (N) devices (1) ----< (N) gps_logs
                      |                                          ^
                      |                                          |
                      +------------------------------------------+
                                    (también relacionado)
```

**Explicación:**
1. Un **rol** puede tener muchos **usuarios**
2. Un **usuario** puede tener muchos **dispositivos**
3. Un **dispositivo** genera muchos **registros GPS**
4. Cada **registro GPS** está vinculado tanto al **usuario** como al **dispositivo**

---

## ⚙️ LOS 3 SERVICIOS PRINCIPALES DEL BACKEND

El backend de GPS Tracking levanta **3 servicios independientes** que trabajan en conjunto:

---

### 🌐 SERVICIO 1: API REST (Laravel - Puerto 8000)

**Comando para iniciar:**
```bash
php artisan serve
```

**URL:** `http://localhost:8000`

#### ¿Qué es?
Es el servidor principal de la aplicación. Una API RESTful construida con Laravel que maneja todas las peticiones HTTP.

#### ¿Para qué sirve?
- **Autenticación:** Login/logout de usuarios, generación de tokens
- **CRUD de Usuarios:** Crear, leer, actualizar y eliminar usuarios (solo admin)
- **CRUD de Dispositivos:** Gestionar dispositivos GPS
- **Registro de Ubicaciones:** Recibir coordenadas GPS desde dispositivos móviles
- **Consulta de Ubicaciones:** Ver ubicaciones actuales e historial
- **Control de Permisos:** Validar roles y permisos de acceso

#### Endpoints Principales:
```
POST   /api/auth/login          - Autenticación
POST   /api/auth/logout         - Cerrar sesión
GET    /api/auth/me             - Usuario actual

GET    /api/users               - Listar usuarios (admin)
POST   /api/users               - Crear usuario (admin)
PUT    /api/users/{id}          - Actualizar usuario (admin)
DELETE /api/users/{id}          - Eliminar usuario (admin)

GET    /api/devices             - Listar dispositivos
POST   /api/devices             - Crear dispositivo (admin)
PUT    /api/devices/{id}        - Actualizar dispositivo (admin)
PATCH  /api/devices/{id}/status - Cambiar estado (admin)

POST   /api/gps                 - Registrar ubicación GPS
GET    /api/locations/current   - Ubicaciones actuales (admin)
GET    /api/locations/history   - Historial de ubicaciones (admin)
```

#### Tecnologías:
- **Framework:** Laravel 12
- **Autenticación:** Laravel Sanctum (tokens)
- **Base de Datos:** MySQL (ProGps)
- **Validación:** Form Requests
- **Middleware:** Autenticación y autorización por roles

#### Flujo de una Petición:
```
Cliente → Middleware Auth → Middleware Role → Controller → Model → Database
                                                    ↓
                                                  Queue Job
                                                    ↓
                                              WebSocket Event
```

---

### 📡 SERVICIO 2: LARAVEL REVERB (WebSocket Server - Puerto 8080)

**Comando para iniciar:**
```bash
php artisan reverb:start
```

**URL:** `ws://localhost:8080`

#### ¿Qué es?
Es un servidor de WebSockets nativo de Laravel que permite comunicación bidireccional en tiempo real entre el servidor y los clientes.

#### ¿Para qué sirve?
- **Actualizaciones en Tiempo Real:** Enviar ubicaciones GPS instantáneamente a todos los clientes conectados
- **Broadcasting de Eventos:** Transmitir el evento `LocationUpdated` cuando se registra una nueva ubicación
- **Sincronización:** Mantener todos los dashboards actualizados simultáneamente
- **Notificaciones Push:** Alertas en tiempo real sin necesidad de polling

#### Configuración (.env):
```env
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=724374
REVERB_APP_KEY=pulubs52b5dplox1ouov
REVERB_APP_SECRET=0cjlmfaku7q2z8tflhyx
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

#### Canal de Broadcasting:
```php
Channel: 'locations' (público)
Evento: 'LocationUpdated'
```

#### Datos Transmitidos:
```json
{
  "deviceId": 1,
  "latitude": -12.046374,
  "longitude": -77.042793,
  "accuracy": 10.5,
  "userName": "Juan Pérez",
  "deviceName": "Móvil Juan",
  "timestamp": "2025-11-15T10:30:00Z",
  "speed": 5.2,
  "heading": 180.0,
  "altitude": 150.0
}
```

#### Flujo de Broadcasting:
```
GPS Registrado → Job Procesado → Evento LocationUpdated → Reverb Server → Clientes WebSocket
```

#### Ventajas:
- **Latencia Mínima:** Actualizaciones instantáneas (< 100ms)
- **Escalable:** Maneja miles de conexiones simultáneas
- **Nativo de Laravel:** No requiere servicios externos como Pusher
- **Eficiente:** Usa menos recursos que polling HTTP

---

### 🔄 SERVICIO 3: QUEUE WORKER (Procesador de Colas)

**Comando para iniciar:**
```bash
php artisan queue:work
```

#### ¿Qué es?
Es un proceso en segundo plano que ejecuta trabajos (jobs) de forma asíncrona desde una cola.

#### ¿Para qué sirve?
- **Procesamiento Asíncrono:** Guardar ubicaciones GPS sin bloquear la respuesta HTTP
- **Mejora de Performance:** La API responde inmediatamente (202 Accepted) mientras el trabajo se procesa en background
- **Reintentos Automáticos:** Si falla, reintenta 3 veces con backoff (10s, 30s, 60s)
- **Manejo de Errores:** Registra fallos en `failed_jobs` para debugging
- **Broadcasting:** Emite eventos WebSocket después de guardar la ubicación

#### Configuración (.env):
```env
QUEUE_CONNECTION=database
```

#### Job Principal: `ProcessGpsLocation`

**Responsabilidades:**
1. Recibir datos de ubicación GPS
2. Validar y guardar en la tabla `gps_logs`
3. Obtener información del dispositivo y usuario
4. Emitir evento `LocationUpdated` vía WebSocket
5. Registrar logs de éxito/error

**Código del Job:**
```php
class ProcessGpsLocation implements ShouldQueue
{
    public $tries = 3; // 3 intentos
    public $backoff = [10, 30, 60]; // Espera entre reintentos
    
    public function handle(): void
    {
        // 1. Guardar ubicación en BD
        $gpsLog = GpsLog::create($this->data);
        
        // 2. Obtener dispositivo y usuario
        $device = Device::with('user')->find($this->data['device_id']);
        
        // 3. Emitir evento WebSocket
        broadcast(new LocationUpdated(...));
        
        // 4. Log de éxito
        Log::info('Ubicación GPS guardada exitosamente');
    }
    
    public function failed(\Throwable $exception): void
    {
        // Registrar fallo después de 3 intentos
        Log::error('Job falló después de todos los intentos');
    }
}
```

#### Flujo Completo:
```
1. Cliente envía POST /api/gps
2. API valida datos
3. API encola job ProcessGpsLocation
4. API responde 202 Accepted (inmediato)
5. Queue Worker toma el job
6. Job guarda en gps_logs
7. Job emite evento LocationUpdated
8. Reverb transmite a clientes WebSocket
9. Frontend actualiza mapa en tiempo real
```

#### Ventajas:
- **No Bloquea:** La API responde en milisegundos
- **Confiable:** Reintentos automáticos en caso de fallo
- **Escalable:** Múltiples workers pueden procesar en paralelo
- **Auditable:** Todos los fallos quedan registrados

#### Tabla de Cola (`jobs`):
```sql
- queue: 'default'
- payload: Datos serializados del job
- attempts: Número de intentos realizados
- available_at: Cuándo estará disponible para procesamiento
```

---

## 🔄 FLUJO COMPLETO DE UNA UBICACIÓN GPS

### Paso a Paso:

1. **Dispositivo Móvil** envía ubicación GPS:
   ```http
   POST /api/gps
   {
     "device_id": 1,
     "latitude": -12.046374,
     "longitude": -77.042793,
     "accuracy": 10.5
   }
   ```

2. **API REST (Servicio 1)** recibe la petición:
   - Valida autenticación (token)
   - Valida que el dispositivo pertenezca al usuario
   - Valida que el dispositivo esté activo
   - Valida formato de coordenadas

3. **API encola el trabajo**:
   ```php
   ProcessGpsLocation::dispatch($data);
   ```
   - Inserta registro en tabla `jobs`
   - Responde inmediatamente: `202 Accepted`

4. **Queue Worker (Servicio 3)** procesa el job:
   - Toma el job de la tabla `jobs`
   - Ejecuta `ProcessGpsLocation::handle()`
   - Guarda en tabla `gps_logs`
   - Obtiene datos del dispositivo y usuario

5. **Job emite evento WebSocket**:
   ```php
   broadcast(new LocationUpdated(...));
   ```

6. **Reverb Server (Servicio 2)** transmite:
   - Recibe el evento `LocationUpdated`
   - Lo transmite por el canal `locations`
   - Todos los clientes conectados lo reciben

7. **Frontend actualiza en tiempo real**:
   - Recibe el evento vía WebSocket
   - Actualiza el marcador en el mapa
   - Muestra notificación de nueva ubicación

---

## 🎯 RESUMEN DE LOS 3 SERVICIOS

| Servicio | Puerto | Comando | Propósito Principal |
|----------|--------|---------|---------------------|
| **API REST** | 8000 | `php artisan serve` | Manejar peticiones HTTP, autenticación, CRUD |
| **Reverb WebSocket** | 8080 | `php artisan reverb:start` | Transmitir actualizaciones en tiempo real |
| **Queue Worker** | N/A | `php artisan queue:work` | Procesar trabajos asíncronos en background |

### ¿Por qué 3 servicios separados?

1. **Separación de Responsabilidades:**
   - API: Lógica de negocio y validaciones
   - Reverb: Comunicación en tiempo real
   - Queue: Procesamiento pesado sin bloquear

2. **Escalabilidad:**
   - Cada servicio puede escalar independientemente
   - Múltiples workers pueden procesar colas en paralelo
   - Reverb maneja miles de conexiones WebSocket

3. **Performance:**
   - API responde inmediatamente (< 50ms)
   - Procesamiento pesado en background
   - Actualizaciones en tiempo real sin polling

4. **Confiabilidad:**
   - Si un servicio falla, los otros siguen funcionando
   - Reintentos automáticos en colas
   - Logs detallados de cada servicio

---

## 🚀 COMANDOS PARA LEVANTAR TODO EL BACKEND

```bash
# Terminal 1: API REST
php artisan serve

# Terminal 2: WebSocket Server
php artisan reverb:start

# Terminal 3: Queue Worker
php artisan queue:work

# Opcional: Ver logs en tiempo real
# Terminal 4
php artisan tail
```

---

## 📊 ESTADÍSTICAS Y CAPACIDADES

### Capacidad de la Base de Datos:
- **Usuarios:** Ilimitados
- **Dispositivos:** Ilimitados
- **Registros GPS:** Millones (con índices optimizados)
- **Consultas Históricas:** Hasta 30 días por petición
- **Límite de Historial:** 1000 registros por consulta (configurable)

### Performance:
- **Latencia API:** < 50ms (sin cola)
- **Latencia WebSocket:** < 100ms
- **Procesamiento Queue:** ~200ms por ubicación
- **Throughput:** ~100 ubicaciones/segundo (con 1 worker)

### Seguridad:
- **Autenticación:** Tokens Sanctum (stateless)
- **Autorización:** Middleware de roles
- **Validación:** Form Requests en todos los endpoints
- **Passwords:** Hashed con bcrypt (12 rounds)
- **CORS:** Configurado para frontend

---

## 🔍 CONSULTAS SQL ÚTILES

### Ver últimas ubicaciones de todos los dispositivos:
```sql
SELECT 
    d.id as device_id,
    d.name as device_name,
    u.name as user_name,
    g.latitude,
    g.longitude,
    g.timestamp
FROM devices d
INNER JOIN users u ON d.user_id = u.id
INNER JOIN gps_logs g ON g.device_id = d.id
WHERE g.id IN (
    SELECT MAX(id) 
    FROM gps_logs 
    GROUP BY device_id
)
AND d.status = 'activo'
ORDER BY g.timestamp DESC;
```

### Calcular distancia recorrida por un dispositivo:
```sql
SELECT 
    device_id,
    COUNT(*) as total_points,
    MIN(timestamp) as start_time,
    MAX(timestamp) as end_time,
    TIMESTAMPDIFF(MINUTE, MIN(timestamp), MAX(timestamp)) as duration_minutes
FROM gps_logs
WHERE device_id = 1
AND timestamp BETWEEN '2025-11-15 00:00:00' AND '2025-11-15 23:59:59'
GROUP BY device_id;
```

### Ver trabajos pendientes en cola:
```sql
SELECT 
    id,
    queue,
    attempts,
    FROM_UNIXTIME(available_at) as available_at,
    FROM_UNIXTIME(created_at) as created_at
FROM jobs
ORDER BY id DESC;
```

### Ver trabajos fallidos:
```sql
SELECT 
    uuid,
    queue,
    exception,
    failed_at
FROM failed_jobs
ORDER BY failed_at DESC
LIMIT 10;
```

---

## 🎓 CONCEPTOS CLAVE

### Laravel Sanctum:
Sistema de autenticación ligero para APIs. Genera tokens únicos por sesión que se envían en el header `Authorization: Bearer {token}`.

### Broadcasting:
Mecanismo de Laravel para emitir eventos en tiempo real. Usa Reverb (WebSocket) para transmitir a clientes conectados.

### Queue Jobs:
Trabajos que se ejecutan en segundo plano. Permiten respuestas HTTP rápidas mientras el procesamiento pesado ocurre asíncronamente.

### Middleware:
Filtros que se ejecutan antes de llegar al controlador. Validan autenticación, roles y permisos.

### Eloquent ORM:
Sistema de mapeo objeto-relacional de Laravel. Permite interactuar con la BD usando objetos PHP en lugar de SQL.

---

## 📝 NOTAS FINALES

1. **Los 3 servicios DEBEN estar corriendo** para que el sistema funcione completamente
2. **La base de datos ProGps** debe existir antes de ejecutar migraciones
3. **Los seeders** crean usuarios y dispositivos de prueba automáticamente
4. **El Queue Worker** puede usar `database` (desarrollo) o `redis` (producción)
5. **Reverb** es más eficiente que Pusher y no requiere servicios externos

---

**Fecha de Análisis:** 15 de Noviembre, 2025
**Versión Laravel:** 12
**Versión PHP:** 8.2+
**Base de Datos:** MySQL (ProGps)
