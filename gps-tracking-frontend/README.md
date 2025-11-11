# 🎨 GPS Tracking Frontend

Frontend desarrollado con Vue 3, TypeScript, Vuetify y Leaflet.

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
El archivo `.env` ya está configurado con:
```
VITE_API_URL=http://localhost:8000/api
```

### 3. Iniciar servidor de desarrollo
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## 📦 Stack Tecnológico

- **Vue 3** - Framework JavaScript
- **TypeScript** - Tipado estático
- **Vuetify 3** - UI Framework (Material Design)
- **Vue Router** - Navegación
- **Pinia** - State Management
- **Leaflet** - Mapas (GRATIS)
- **Axios** - HTTP Client
- **Vue Toastification** - Notificaciones
- **Day.js** - Manejo de fechas

## 🖼️ Vistas Disponibles

### Públicas
- `/login` - Inicio de sesión

### Admin
- `/admin/dashboard` - Mapa en tiempo real
- `/admin/users` - Gestión de usuarios
- `/admin/devices` - Gestión de dispositivos
- `/admin/history` - Historial de rutas

### Empleado
- `/empleado/dashboard` - Activar/desactivar rastreo GPS

### Comunes
- `/profile` - Perfil de usuario
- `/unauthorized` - Sin permisos
- `/*` - 404 Not Found

## 🔑 Credenciales de Prueba

### Administrador
```
Email: admin@gps.com
Password: admin123
```

### Empleado
```
Email: juan@gps.com
Password: empleado123
```

## 🌓 Modo Claro/Oscuro

El tema se cambia con el botón en el header. La preferencia se guarda en localStorage.

## 📍 Geolocalización

El navegador pedirá permiso para acceder a la ubicación. Solo funciona en:
- HTTPS (producción)
- localhost (desarrollo)

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── common/          # Componentes comunes
│   └── maps/            # Componentes de mapas
├── views/               # Vistas/Páginas
│   ├── admin/           # Vistas de admin
│   └── empleado/        # Vistas de empleado
├── stores/              # Pinia stores
├── services/            # Servicios (API, GPS)
├── plugins/             # Plugins (Vuetify, Toast)
├── router/              # Configuración de rutas
├── App.vue              # Componente raíz
└── main.ts              # Punto de entrada
```

## 🔐 Seguridad

- Rutas protegidas con guards
- Tokens en localStorage
- Interceptores de Axios
- Validación de roles

## 🗺️ Mapas

Usando Leaflet con tiles de OpenStreetMap (gratis, sin API key).

Para cambiar a Google Maps:
1. Instalar: `npm install @googlemaps/js-api-loader`
2. Obtener API key de Google Maps
3. Modificar componente MapView.vue

## 📱 Responsive

Todas las vistas son responsive gracias a Vuetify.

## 🐛 Troubleshooting

### Error de CORS
Asegúrate de que el backend esté corriendo en `http://localhost:8000`

### Error de geolocalización
- Verifica que estés en localhost o HTTPS
- Acepta el permiso del navegador
- Verifica que tu dispositivo tenga GPS/WiFi

### Errores de TypeScript
```bash
npm run type-check
```

## 🚀 Despliegue

### Build
```bash
npm run build
```

Los archivos estarán en `dist/`

### Variables de entorno para producción
Crear `.env.production`:
```
VITE_API_URL=https://tu-api.com/api
```

## 📞 Soporte

Ver documentación completa en:
- `FRONTEND_PLAN.md`
- `FRONTEND_RESUMEN.md`

---

**¡Frontend listo para usar! 🎨**
