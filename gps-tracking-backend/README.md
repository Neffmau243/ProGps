# GPS Tracking Backend - Laravel API

Sistema de rastreo GPS en tiempo real para gestión de dispositivos y empleados.

## 🚀 Características

- ✅ Autenticación con Laravel Sanctum (tokens)
- ✅ Gestión de usuarios (Admin/Empleado)
- ✅ Gestión de dispositivos
- ✅ Registro de ubicaciones GPS en tiempo real
- ✅ Consulta de ubicaciones actuales e historial
- ✅ Procesamiento asíncrono con colas
- ✅ Cálculo de distancias recorridas
- ✅ Control de permisos por roles

## 📋 Requisitos

- PHP >= 8.2
- Composer
- MySQL
- Laravel 12

## 🔧 Instalación

### 1. Clonar el repositorio
```bash
cd gps-tracking-backend
```

### 2. Instalar dependencias
```bash
composer install
```

### 3. Configurar base de datos
Crear la base de datos `ProGps` en MySQL con las credenciales:
- Usuario: `root`
- Password: `1234`

El archivo `.env` ya está configurado con estos valores.

### 4. Ejecutar migraciones y seeders
```bash
php artisan migrate --seed
```

Esto creará:
- Tablas: users, roles, devices, gps_logs
- Usuario admin: admin@gps.com / admin123
- Usuario empleado: juan@gps.com / empleado123
- Un dispositivo de prueba

### 5. Iniciar el servidor
```bash
php artisan serve
```

El servidor estará disponible en: `http://localhost:8000`

## 📚 Documentación

### Documentación completa de la API
Ver archivo: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Colección de Postman
Importar el archivo: [GPS_Tracking_API.postman_collection.json](./GPS_Tracking_API.postman_collection.json)

### Script de Prueba
Ejecutar: `powershell -ExecutionPolicy Bypass -File test-api.ps1`

## 🗂️ Estructura del Proyecto

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── AuthController.php       # Autenticación
│   │       ├── UserController.php       # CRUD usuarios
│   │       ├── DeviceController.php     # CRUD dispositivos
│   │       ├── GpsController.php        # Registro GPS
│   │       └── LocationController.php   # Consulta ubicaciones
│   └── Middleware/
│       ├── RoleMiddleware.php           # Verificar roles
│       └── CheckDeviceOwnership.php     # Verificar propiedad
├── Models/
│   ├── User.php
│   ├── Role.php
│   ├── Device.php
│   └── GpsLog.php
└── Jobs/
    └── ProcessGpsLocation.php           # Procesamiento asíncrono

database/
├── migrations/
│   ├── create_roles_table.php
│   ├── add_role_id_to_users_table.php
│   ├── create_devices_table.php
│   └── create_gps_logs_table.php
└── seeders/
    └── DatabaseSeeder.php

routes/
└── api.php                              # Rutas de la API
```

## 🔐 Autenticación

La API usa Laravel Sanctum para autenticación basada en tokens.

### Flujo de autenticación:
1. Login: `POST /api/auth/login`
2. Recibir token en la respuesta
3. Incluir token en headers: `Authorization: Bearer {token}`
4. Logout: `POST /api/auth/logout`

## 👥 Roles y Permisos

### Admin
- Gestión completa de usuarios
- Gestión completa de dispositivos
- Ver todas las ubicaciones GPS
- Consultar historial de cualquier dispositivo

### Empleado
- Ver sus propios dispositivos
- Registrar ubicaciones GPS de sus dispositivos
- No puede crear/editar usuarios ni dispositivos

## 📍 Endpoints Principales

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Usuario actual

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/{id}` - Actualizar usuario
- `DELETE /api/users/{id}` - Eliminar usuario

### Dispositivos
- `GET /api/devices` - Listar dispositivos
- `POST /api/devices` - Crear dispositivo (Admin)
- `PUT /api/devices/{id}` - Actualizar dispositivo (Admin)
- `PATCH /api/devices/{id}/status` - Cambiar estado (Admin)

### GPS
- `POST /api/gps` - Registrar ubicación

### Ubicaciones (Admin)
- `GET /api/locations/current` - Ubicaciones actuales
- `GET /api/locations/history` - Historial de ubicaciones

## 🧪 Pruebas Rápidas

### 1. Login como admin
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gps.com","password":"admin123"}'
```

### 2. Login como empleado
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@gps.com","password":"empleado123"}'
```

### 3. Registrar ubicación GPS (como empleado)
```bash
curl -X POST http://localhost:8000/api/gps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token_empleado}" \
  -d '{
    "device_id": 1,
    "latitude": -12.046374,
    "longitude": -77.042793,
    "accuracy": 10.5
  }'
```

### 4. Ver ubicaciones actuales (como admin)
```bash
curl -X GET http://localhost:8000/api/locations/current \
  -H "Authorization: Bearer {token_admin}"
```

## 🔄 Sistema de Colas

El registro de ubicaciones GPS se procesa de forma asíncrona mediante colas.

### Desarrollo (sync)
Por defecto usa el driver `sync` (procesamiento inmediato).

### Producción (redis)
Para producción, configurar Redis en `.env`:
```env
QUEUE_CONNECTION=redis
```

Ejecutar el worker:
```bash
php artisan queue:work
```

## 🗄️ Base de Datos

### Tablas principales:

#### roles
- id
- name (admin, empleado)

#### users
- id
- name
- email
- password
- role_id

#### devices
- id
- user_id
- name
- serial (único)
- status (activo, inactivo, mantenimiento)

#### gps_logs
- id
- user_id
- device_id
- latitude
- longitude
- accuracy
- timestamp

## 🛠️ Comandos Útiles

```bash
# Limpiar caché
php artisan cache:clear
php artisan config:clear

# Ver rutas
php artisan route:list

# Crear nueva migración
php artisan make:migration nombre_migracion

# Ejecutar migraciones
php artisan migrate

# Rollback migraciones
php artisan migrate:rollback

# Ejecutar seeders
php artisan db:seed
```

## 📝 Notas Importantes

1. **CORS**: Ya está configurado para aceptar peticiones desde cualquier origen
2. **Validaciones**: Todos los endpoints tienen validaciones de datos
3. **Seguridad**: Los passwords se hashean con bcrypt
4. **Índices**: La tabla gps_logs tiene índices para búsquedas rápidas
5. **Límites**: El historial de ubicaciones tiene un límite de 30 días

## 🐛 Troubleshooting

### Error de conexión a base de datos
Verificar que MySQL esté corriendo y las credenciales en `.env` sean correctas.

### Error 419 (CSRF)
La API no usa CSRF tokens. Asegurarse de usar las rutas `/api/*`.

### Token inválido
Verificar que el header `Authorization: Bearer {token}` esté correcto.

## 📧 Contacto

Para dudas o sugerencias sobre el backend.
