# 📁 Estructura del Proyecto GPS Tracking Backend

## 🗂️ Árbol de Directorios

```
gps-tracking-backend/
│
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── AuthController.php          # Autenticación (login, logout, me)
│   │   │       ├── UserController.php          # CRUD de usuarios
│   │   │       ├── DeviceController.php        # CRUD de dispositivos
│   │   │       ├── GpsController.php           # Registro de ubicaciones GPS
│   │   │       └── LocationController.php      # Consulta de ubicaciones
│   │   │
│   │   └── Middleware/
│   │       ├── RoleMiddleware.php              # Verificar rol del usuario
│   │       └── CheckDeviceOwnership.php        # Verificar propiedad de dispositivo
│   │
│   ├── Models/
│   │   ├── User.php                            # Modelo de usuario
│   │   ├── Role.php                            # Modelo de rol
│   │   ├── Device.php                          # Modelo de dispositivo
│   │   └── GpsLog.php                          # Modelo de ubicación GPS
│   │
│   └── Jobs/
│       └── ProcessGpsLocation.php              # Job para procesar GPS asíncrono
│
├── bootstrap/
│   └── app.php                                 # Configuración de la aplicación
│
├── config/
│   ├── app.php                                 # Configuración general
│   ├── database.php                            # Configuración de base de datos
│   ├── cors.php                                # Configuración de CORS
│   └── sanctum.php                             # Configuración de Sanctum
│
├── database/
│   ├── migrations/
│   │   ├── 2025_11_11_162010_create_personal_access_tokens_table.php
│   │   ├── 2025_11_11_162019_create_roles_table.php
│   │   ├── 2025_11_11_162023_add_role_id_to_users_table.php
│   │   ├── 2025_11_11_162028_create_devices_table.php
│   │   └── 2025_11_11_162031_create_gps_logs_table.php
│   │
│   └── seeders/
│       └── DatabaseSeeder.php                  # Datos de prueba
│
├── routes/
│   ├── api.php                                 # Rutas de la API
│   ├── web.php                                 # Rutas web (no usadas)
│   └── console.php                             # Comandos de consola
│
├── storage/
│   └── logs/
│       └── laravel.log                         # Logs de la aplicación
│
├── .env                                        # Variables de entorno
├── composer.json                               # Dependencias PHP
├── artisan                                     # CLI de Laravel
│
├── API_DOCUMENTATION.md                        # 📚 Documentación completa de la API
├── README.md                                   # 📖 Documentación principal
├── QUICK_START.md                              # 🚀 Guía de inicio rápido
├── PROJECT_STRUCTURE.md                        # 📁 Este archivo
│
├── GPS_Tracking_API.postman_collection.json    # 📮 Colección de Postman
├── test-api.ps1                                # 🧪 Script de pruebas (PowerShell)
└── test-api.sh                                 # 🧪 Script de pruebas (Bash)
```

## 📊 Base de Datos

### Tablas

#### `roles`
```sql
id          BIGINT UNSIGNED PRIMARY KEY
name        VARCHAR(255) UNIQUE
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

**Datos iniciales:**
- id: 1, name: 'admin'
- id: 2, name: 'empleado'

---

#### `users`
```sql
id                  BIGINT UNSIGNED PRIMARY KEY
name                VARCHAR(255)
email               VARCHAR(255) UNIQUE
password            VARCHAR(255)
role_id             BIGINT UNSIGNED (FK -> roles.id)
email_verified_at   TIMESTAMP NULL
remember_token      VARCHAR(100) NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

**Relaciones:**
- `belongsTo(Role)` - Un usuario pertenece a un rol
- `hasMany(Device)` - Un usuario tiene muchos dispositivos
- `hasMany(GpsLog)` - Un usuario tiene muchos registros GPS

---

#### `devices`
```sql
id          BIGINT UNSIGNED PRIMARY KEY
user_id     BIGINT UNSIGNED (FK -> users.id)
name        VARCHAR(255)
serial      VARCHAR(255) UNIQUE
status      ENUM('activo', 'inactivo', 'mantenimiento')
created_at  TIMESTAMP
updated_at  TIMESTAMP
```

**Relaciones:**
- `belongsTo(User)` - Un dispositivo pertenece a un usuario
- `hasMany(GpsLog)` - Un dispositivo tiene muchos registros GPS
- `hasOne(GpsLog)->latestLocation()` - Última ubicación del dispositivo

---

#### `gps_logs`
```sql
id          BIGINT UNSIGNED PRIMARY KEY
user_id     BIGINT UNSIGNED (FK -> users.id)
device_id   BIGINT UNSIGNED (FK -> devices.id)
latitude    DECIMAL(10, 8)
longitude   DECIMAL(11, 8)
accuracy    DECIMAL(8, 2) NULL
timestamp   TIMESTAMP
created_at  TIMESTAMP
updated_at  TIMESTAMP

INDEX (device_id, timestamp)
INDEX (timestamp)
```

**Relaciones:**
- `belongsTo(User)` - Un registro GPS pertenece a un usuario
- `belongsTo(Device)` - Un registro GPS pertenece a un dispositivo

---

#### `personal_access_tokens` (Sanctum)
```sql
id              BIGINT UNSIGNED PRIMARY KEY
tokenable_type  VARCHAR(255)
tokenable_id    BIGINT UNSIGNED
name            VARCHAR(255)
token           VARCHAR(64) UNIQUE
abilities       TEXT NULL
last_used_at    TIMESTAMP NULL
expires_at      TIMESTAMP NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## 🔐 Middleware

### `auth:sanctum`
- Verifica que el usuario esté autenticado con un token válido
- Usado en todas las rutas protegidas

### `role:admin`
- Verifica que el usuario tenga rol de administrador
- Usado en rutas administrativas (gestión de usuarios, dispositivos, ubicaciones)

### `device.owner`
- Verifica que el dispositivo pertenezca al usuario autenticado
- Usado en operaciones sobre dispositivos específicos

## 🛣️ Rutas de la API

### Públicas
```
POST /api/auth/login
```

### Autenticadas (auth:sanctum)
```
POST   /api/auth/logout
GET    /api/auth/me
POST   /api/gps
GET    /api/devices
GET    /api/devices/{id}
```

### Solo Admin (auth:sanctum + role:admin)
```
# Usuarios
GET    /api/users
GET    /api/users/{id}
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}

# Dispositivos
POST   /api/devices
PUT    /api/devices/{id}
DELETE /api/devices/{id}
PATCH  /api/devices/{id}/status

# Ubicaciones
GET    /api/locations/current
GET    /api/locations/history
```

## 🔄 Flujo de Datos

### Registro de Ubicación GPS

```
1. Empleado envía POST /api/gps
   ↓
2. GpsController valida datos
   ↓
3. Verifica que dispositivo pertenece al usuario
   ↓
4. Verifica que dispositivo está activo
   ↓
5. Encola Job ProcessGpsLocation
   ↓
6. Retorna 202 Accepted
   ↓
7. Job procesa en background
   ↓
8. Guarda en gps_logs
   ↓
9. Log de éxito
```

### Consulta de Ubicaciones

```
1. Admin solicita GET /api/locations/current
   ↓
2. LocationController consulta última ubicación de cada dispositivo
   ↓
3. Calcula minutos desde última actualización
   ↓
4. Retorna array de ubicaciones
```

## 📦 Dependencias Principales

```json
{
  "laravel/framework": "^12.0",
  "laravel/sanctum": "^4.2",
  "php": "^8.2"
}
```

## 🔧 Configuración

### .env
```env
APP_NAME="GPS Tracking"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ProGps
DB_USERNAME=root
DB_PASSWORD=1234

QUEUE_CONNECTION=sync
```

## 📝 Comandos Artisan Útiles

```bash
# Ver todas las rutas
php artisan route:list

# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Crear nueva migración
php artisan make:migration nombre_migracion

# Crear nuevo controlador
php artisan make:controller NombreController

# Crear nuevo modelo
php artisan make:model NombreModelo

# Crear nuevo middleware
php artisan make:middleware NombreMiddleware

# Crear nuevo job
php artisan make:job NombreJob

# Ejecutar migraciones
php artisan migrate

# Rollback migraciones
php artisan migrate:rollback

# Ejecutar seeders
php artisan db:seed

# Recrear base de datos
php artisan migrate:fresh --seed

# Iniciar servidor
php artisan serve

# Procesar colas
php artisan queue:work
```

## 🎯 Puntos Clave

1. **Autenticación:** Laravel Sanctum con tokens
2. **Autorización:** Middleware de roles
3. **Procesamiento:** Jobs asíncronos para GPS
4. **Validación:** Request validation en todos los endpoints
5. **Seguridad:** Passwords hasheados, CORS configurado
6. **Optimización:** Índices en gps_logs para búsquedas rápidas
7. **Relaciones:** Eloquent ORM con relaciones bien definidas

## 📈 Escalabilidad

### Para producción:
1. Cambiar `QUEUE_CONNECTION=redis` en .env
2. Ejecutar `php artisan queue:work` en background
3. Configurar supervisor para mantener workers activos
4. Usar cache (Redis/Memcached)
5. Optimizar consultas con eager loading
6. Implementar rate limiting
7. Configurar HTTPS
8. Usar servidor web (Nginx/Apache) en lugar de `php artisan serve`

---

**Estructura diseñada para ser escalable, mantenible y fácil de entender.**
