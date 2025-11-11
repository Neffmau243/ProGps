# API GPS Tracking - Documentación

## Configuración Inicial

### Base de Datos
- **Nombre:** ProGps
- **Usuario:** root
- **Password:** 1234

### Usuarios de Prueba

#### Administrador
- **Email:** admin@gps.com
- **Password:** admin123

#### Empleado
- **Email:** juan@gps.com
- **Password:** empleado123

## Base URL
```
http://localhost:8000/api
```

## Autenticación

Todos los endpoints (excepto login) requieren el header:
```
Authorization: Bearer {token}
```

---

## Endpoints

### 1. Autenticación

#### POST /auth/login
Autenticar usuario y obtener token.

**Request:**
```json
{
  "email": "admin@gps.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "1|abc123...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@gps.com",
    "role": "admin"
  }
}
```

#### POST /auth/logout
Cerrar sesión (invalidar token actual).

**Response (200):**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

#### GET /auth/me
Obtener información del usuario autenticado.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@gps.com",
    "role": "admin"
  }
}
```

---

### 2. Gestión de Usuarios (Solo Admin)

#### GET /users
Listar todos los usuarios.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@gps.com",
    "role": {
      "id": 1,
      "name": "admin"
    }
  }
]
```

#### GET /users/{id}
Obtener un usuario específico.

#### POST /users
Crear nuevo usuario.

**Request:**
```json
{
  "name": "María García",
  "email": "maria@gps.com",
  "password": "password123",
  "role_id": 2
}
```

**Response (201):**
```json
{
  "id": 3,
  "name": "María García",
  "email": "maria@gps.com",
  "role": {
    "id": 2,
    "name": "empleado"
  }
}
```

#### PUT /users/{id}
Actualizar usuario.

**Request:**
```json
{
  "name": "María García Actualizado",
  "email": "maria.nueva@gps.com"
}
```

#### DELETE /users/{id}
Eliminar usuario.

**Response (200):**
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

---

### 3. Gestión de Dispositivos

#### GET /devices
Listar dispositivos.
- **Admin:** Ve todos los dispositivos
- **Empleado:** Solo ve sus propios dispositivos

**Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "name": "Móvil Juan",
    "serial": "ABC123",
    "status": "activo",
    "user": {
      "id": 2,
      "name": "Juan Pérez"
    }
  }
]
```

#### GET /devices/{id}
Obtener dispositivo específico.

#### POST /devices (Solo Admin)
Crear nuevo dispositivo.

**Request:**
```json
{
  "user_id": 2,
  "name": "Tablet María",
  "serial": "XYZ789",
  "status": "activo"
}
```

**Validaciones:**
- `serial` debe ser único
- `status` debe ser: activo, inactivo o mantenimiento

#### PUT /devices/{id} (Solo Admin)
Actualizar dispositivo.

#### DELETE /devices/{id} (Solo Admin)
Eliminar dispositivo.

#### PATCH /devices/{id}/status (Solo Admin)
Cambiar estado del dispositivo.

**Request:**
```json
{
  "status": "mantenimiento"
}
```

---

### 4. Registro de Ubicaciones GPS

#### POST /gps
Registrar nueva ubicación GPS.

**Request:**
```json
{
  "device_id": 1,
  "latitude": -12.046374,
  "longitude": -77.042793,
  "accuracy": 10.5
}
```

**Validaciones:**
- `latitude`: -90 a 90
- `longitude`: -180 a 180
- `accuracy`: >= 0 (opcional)
- El dispositivo debe pertenecer al usuario autenticado
- El dispositivo debe estar en estado "activo"

**Response (202):**
```json
{
  "message": "Ubicación recibida y en proceso"
}
```

**Nota:** El procesamiento es asíncrono mediante colas.

---

### 5. Consulta de Ubicaciones (Solo Admin)

#### GET /locations/current
Obtener última ubicación de cada dispositivo activo.

**Response (200):**
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

#### GET /locations/history
Obtener historial de ubicaciones de un dispositivo.

**Query Parameters:**
- `device_id` (requerido): ID del dispositivo
- `start_date` (requerido): Fecha inicio (Y-m-d H:i:s)
- `end_date` (requerido): Fecha fin (Y-m-d H:i:s)
- `limit` (opcional): Máximo de registros (default: 1000)

**Ejemplo:**
```
GET /locations/history?device_id=1&start_date=2025-11-11 00:00:00&end_date=2025-11-11 23:59:59
```

**Response (200):**
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

**Validaciones:**
- Rango máximo: 30 días

---

## Códigos de Estado HTTP

- **200 OK:** Solicitud exitosa
- **201 Created:** Recurso creado exitosamente
- **202 Accepted:** Solicitud aceptada para procesamiento asíncrono
- **400 Bad Request:** Datos inválidos
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** Sin permisos
- **404 Not Found:** Recurso no encontrado
- **422 Unprocessable Entity:** Errores de validación

---

## Iniciar el Servidor

```bash
php artisan serve
```

El servidor estará disponible en: `http://localhost:8000`

---

## Probar con cURL

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gps.com","password":"admin123"}'
```

### Registrar ubicación GPS
```bash
curl -X POST http://localhost:8000/api/gps \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {tu_token}" \
  -d '{
    "device_id": 1,
    "latitude": -12.046374,
    "longitude": -77.042793,
    "accuracy": 10.5
  }'
```

### Ver ubicaciones actuales
```bash
curl -X GET http://localhost:8000/api/locations/current \
  -H "Authorization: Bearer {tu_token}"
```
