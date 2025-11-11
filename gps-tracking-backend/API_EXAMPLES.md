# 📋 Ejemplos de Respuestas de la API

Este documento muestra ejemplos reales de las respuestas de cada endpoint.

---

## 🔐 Autenticación

### POST /api/auth/login

**Request:**
```json
{
  "email": "admin@gps.com",
  "password": "admin123"
}
```

**Response 200 OK:**
```json
{
  "token": "1|RaaGUpDXQx0KEvYvXsABCDEFGHIJKLMNOPQRSTUVWXYZ",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@gps.com",
    "role": "admin"
  }
}
```

**Response 422 Validation Error:**
```json
{
  "message": "Las credenciales son incorrectas.",
  "errors": {
    "email": [
      "Las credenciales son incorrectas."
    ]
  }
}
```

---

### GET /api/auth/me

**Response 200 OK:**
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

### POST /api/auth/logout

**Response 200 OK:**
```json
{
  "message": "Sesión cerrada exitosamente"
}
```

---

## 👥 Usuarios

### GET /api/users

**Response 200 OK:**
```json
[
  {
    "id": 1,
    "name": "Admin",
    "email": "admin@gps.com",
    "email_verified_at": null,
    "created_at": "2025-11-11T16:20:35.000000Z",
    "updated_at": "2025-11-11T16:20:35.000000Z",
    "role_id": 1,
    "role": {
      "id": 1,
      "name": "admin",
      "created_at": "2025-11-11T16:20:19.000000Z",
      "updated_at": "2025-11-11T16:20:19.000000Z"
    }
  },
  {
    "id": 2,
    "name": "Juan Pérez",
    "email": "juan@gps.com",
    "email_verified_at": null,
    "created_at": "2025-11-11T16:20:35.000000Z",
    "updated_at": "2025-11-11T16:20:35.000000Z",
    "role_id": 2,
    "role": {
      "id": 2,
      "name": "empleado",
      "created_at": "2025-11-11T16:20:19.000000Z",
      "updated_at": "2025-11-11T16:20:19.000000Z"
    }
  }
]
```

---

### GET /api/users/2

**Response 200 OK:**
```json
{
  "id": 2,
  "name": "Juan Pérez",
  "email": "juan@gps.com",
  "email_verified_at": null,
  "created_at": "2025-11-11T16:20:35.000000Z",
  "updated_at": "2025-11-11T16:20:35.000000Z",
  "role_id": 2,
  "role": {
    "id": 2,
    "name": "empleado",
    "created_at": "2025-11-11T16:20:19.000000Z",
    "updated_at": "2025-11-11T16:20:19.000000Z"
  },
  "devices": [
    {
      "id": 1,
      "user_id": 2,
      "name": "Móvil Juan",
      "serial": "ABC123",
      "status": "activo",
      "created_at": "2025-11-11T16:20:35.000000Z",
      "updated_at": "2025-11-11T16:20:35.000000Z"
    }
  ]
}
```

---

### POST /api/users

**Request:**
```json
{
  "name": "María García",
  "email": "maria@gps.com",
  "password": "password123",
  "role_id": 2
}
```

**Response 201 Created:**
```json
{
  "id": 3,
  "name": "María García",
  "email": "maria@gps.com",
  "created_at": "2025-11-11T16:25:00.000000Z",
  "updated_at": "2025-11-11T16:25:00.000000Z",
  "role_id": 2,
  "role": {
    "id": 2,
    "name": "empleado",
    "created_at": "2025-11-11T16:20:19.000000Z",
    "updated_at": "2025-11-11T16:20:19.000000Z"
  }
}
```

**Response 422 Validation Error:**
```json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": [
      "The email has already been taken."
    ]
  }
}
```

---

### PUT /api/users/3

**Request:**
```json
{
  "name": "María García Actualizado"
}
```

**Response 200 OK:**
```json
{
  "id": 3,
  "name": "María García Actualizado",
  "email": "maria@gps.com",
  "created_at": "2025-11-11T16:25:00.000000Z",
  "updated_at": "2025-11-11T16:26:00.000000Z",
  "role_id": 2,
  "role": {
    "id": 2,
    "name": "empleado",
    "created_at": "2025-11-11T16:20:19.000000Z",
    "updated_at": "2025-11-11T16:20:19.000000Z"
  }
}
```

---

### DELETE /api/users/3

**Response 200 OK:**
```json
{
  "message": "Usuario eliminado exitosamente"
}
```

---

## 📱 Dispositivos

### GET /api/devices

**Response 200 OK (Admin - ve todos):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "name": "Móvil Juan",
    "serial": "ABC123",
    "status": "activo",
    "created_at": "2025-11-11T16:20:35.000000Z",
    "updated_at": "2025-11-11T16:20:35.000000Z",
    "user": {
      "id": 2,
      "name": "Juan Pérez",
      "email": "juan@gps.com",
      "email_verified_at": null,
      "created_at": "2025-11-11T16:20:35.000000Z",
      "updated_at": "2025-11-11T16:20:35.000000Z",
      "role_id": 2
    }
  }
]
```

**Response 200 OK (Empleado - solo los suyos):**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "name": "Móvil Juan",
    "serial": "ABC123",
    "status": "activo",
    "created_at": "2025-11-11T16:20:35.000000Z",
    "updated_at": "2025-11-11T16:20:35.000000Z"
  }
]
```

---

### POST /api/devices

**Request:**
```json
{
  "user_id": 2,
  "name": "Tablet María",
  "serial": "XYZ789",
  "status": "activo"
}
```

**Response 201 Created:**
```json
{
  "id": 2,
  "user_id": 2,
  "name": "Tablet María",
  "serial": "XYZ789",
  "status": "activo",
  "created_at": "2025-11-11T16:30:00.000000Z",
  "updated_at": "2025-11-11T16:30:00.000000Z",
  "user": {
    "id": 2,
    "name": "Juan Pérez",
    "email": "juan@gps.com",
    "email_verified_at": null,
    "created_at": "2025-11-11T16:20:35.000000Z",
    "updated_at": "2025-11-11T16:20:35.000000Z",
    "role_id": 2
  }
}
```

---

### PATCH /api/devices/1/status

**Request:**
```json
{
  "status": "mantenimiento"
}
```

**Response 200 OK:**
```json
{
  "id": 1,
  "user_id": 2,
  "name": "Móvil Juan",
  "serial": "ABC123",
  "status": "mantenimiento",
  "created_at": "2025-11-11T16:20:35.000000Z",
  "updated_at": "2025-11-11T16:31:00.000000Z"
}
```

---

## 📍 GPS

### POST /api/gps

**Request:**
```json
{
  "device_id": 1,
  "latitude": -12.046374,
  "longitude": -77.042793,
  "accuracy": 10.5
}
```

**Response 202 Accepted:**
```json
{
  "message": "Ubicación recibida y en proceso"
}
```

**Response 403 Forbidden (dispositivo no pertenece al usuario):**
```json
{
  "message": "Este dispositivo no te pertenece"
}
```

**Response 400 Bad Request (dispositivo inactivo):**
```json
{
  "message": "El dispositivo no está activo"
}
```

**Response 422 Validation Error:**
```json
{
  "message": "The latitude field must be between -90 and 90.",
  "errors": {
    "latitude": [
      "The latitude field must be between -90 and 90."
    ]
  }
}
```

---

## 🗺️ Ubicaciones

### GET /api/locations/current

**Response 200 OK:**
```json
[
  {
    "device_id": 1,
    "device_name": "Móvil Juan",
    "device_serial": "ABC123",
    "user_id": 2,
    "user_name": "Juan Pérez",
    "latitude": "-12.04637400",
    "longitude": "-77.04279300",
    "accuracy": "10.50",
    "timestamp": "2025-11-11T16:35:00.000000Z",
    "minutes_ago": 2
  }
]
```

**Response 200 OK (sin ubicaciones):**
```json
[]
```

---

### GET /api/locations/history

**Request:**
```
GET /api/locations/history?device_id=1&start_date=2025-11-11 00:00:00&end_date=2025-11-11 23:59:59
```

**Response 200 OK:**
```json
{
  "device": {
    "id": 1,
    "name": "Móvil Juan",
    "user_name": "Juan Pérez"
  },
  "locations": [
    {
      "latitude": "-12.04637400",
      "longitude": "-77.04279300",
      "accuracy": "10.50",
      "timestamp": "2025-11-11T10:00:00.000000Z"
    },
    {
      "latitude": "-12.04650000",
      "longitude": "-77.04290000",
      "accuracy": "12.30",
      "timestamp": "2025-11-11T10:05:00.000000Z"
    },
    {
      "latitude": "-12.04670000",
      "longitude": "-77.04310000",
      "accuracy": "8.70",
      "timestamp": "2025-11-11T10:10:00.000000Z"
    }
  ],
  "statistics": {
    "total_points": 3,
    "distance_km": 0.25,
    "duration_minutes": 10
  }
}
```

**Response 400 Bad Request (rango mayor a 30 días):**
```json
{
  "message": "El rango máximo permitido es de 30 días"
}
```

---

## ❌ Errores Comunes

### 401 Unauthorized (sin token)
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden (sin permisos)
```json
{
  "message": "No tienes permisos para acceder a este recurso"
}
```

### 404 Not Found
```json
{
  "message": "No query results for model [App\\Models\\User] 999"
}
```

### 422 Unprocessable Entity (validación)
```json
{
  "message": "The name field is required. (and 1 more error)",
  "errors": {
    "name": [
      "The name field is required."
    ],
    "email": [
      "The email field is required."
    ]
  }
}
```

### 500 Internal Server Error
```json
{
  "message": "Server Error"
}
```

---

## 📊 Formato de Timestamps

Todos los timestamps siguen el formato ISO 8601:
```
2025-11-11T16:35:00.000000Z
```

- Zona horaria: UTC (Z)
- Formato: YYYY-MM-DDTHH:MM:SS.ssssssZ

---

## 🔢 Tipos de Datos

### Latitude/Longitude
- Tipo: DECIMAL(10, 8) / DECIMAL(11, 8)
- Formato: String en JSON
- Ejemplo: "-12.04637400"

### Accuracy
- Tipo: DECIMAL(8, 2)
- Formato: String en JSON
- Ejemplo: "10.50"
- Unidad: metros

### Status
- Valores permitidos: "activo", "inactivo", "mantenimiento"

### Role
- Valores: "admin", "empleado"

---

**Estos ejemplos son respuestas reales del sistema en funcionamiento.**
