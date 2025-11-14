# 🚀 ProGPS Frontend - Sistema de Rastreo GPS

![Vue 3](https://img.shields.io/badge/Vue-3.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-7.x-purple)

## 📋 Descripción

Frontend desarrollado con **Vue 3**, **TypeScript** y **Vite** para el sistema de rastreo GPS en tiempo real ProGPS. Diseño moderno con paleta de colores **negro/verde neón** inspirado en inDrive.

## ✨ Características

- ✅ **Vue 3** con Composition API
- ✅ **TypeScript** para tipado fuerte
- ✅ **Vite** para desarrollo ultrarrápido
- ✅ **Pinia** para gestión de estado
- ✅ **Vue Router** con guards de autenticación
- ✅ **Axios** para peticiones HTTP
- ✅ **Leaflet** para mapas interactivos
- ✅ **Diseño Desktop First** (1920x1080 y 1366x768)
- ✅ **Paleta Negro/Verde Neón** (#000000 / #C0F11C)

## 🚀 Instalación y Uso

### Prerrequisitos

- **Node.js** 18+ 
- **npm** 9+

### Instalación

```bash
# Instalar dependencias
npm install
```

### Variables de Entorno

Crear archivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:5173
```

### Compilación para Producción

```bash
# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

## 🔐 Autenticación

### Credenciales de Prueba

**Administrador:**
- Email: `admin@gps.com`
- Password: `password`

**Empleado:**
- Email: `juan@gps.com`
- Password: `password`

## 📡 API Endpoints

Base URL: `http://localhost:8000/api`

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/logout` - Cerrar sesión
- `GET /auth/me` - Usuario actual

### Usuarios (Admin)
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `PUT /users/{id}` - Actualizar usuario
- `DELETE /users/{id}` - Eliminar usuario

### Dispositivos
- `GET /devices` - Listar dispositivos
- `POST /devices` - Crear dispositivo (Admin)
- `PUT /devices/{id}` - Actualizar dispositivo (Admin)
- `DELETE /devices/{id}` - Eliminar dispositivo (Admin)

### Ubicaciones GPS
- `POST /gps` - Registrar ubicación (Empleado)
- `GET /locations/current` - Ubicaciones actuales (Admin)
- `GET /locations/history` - Historial (Admin)

## 👨‍💻 Desarrollador

**Neffmau243**
- GitHub: [@Neffmau243](https://github.com/Neffmau243)
- Proyecto: ProGPS GPS Tracking System

---

**Última actualización:** 13 de noviembre de 2025 | **Versión:** 2.0.0 | **Estado:** En desarrollo activo 🚧
