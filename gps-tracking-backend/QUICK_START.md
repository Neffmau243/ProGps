# 🚀 Quick Start - GPS Tracking Backend

## ✅ Estado Actual

El backend está **completamente funcional** y listo para usar.

### ✅ Lo que ya está hecho:

- ✅ Base de datos creada y migrada
- ✅ Usuarios de prueba creados
- ✅ Servidor corriendo en http://localhost:8000
- ✅ Todas las pruebas pasaron exitosamente

## 🎯 Credenciales de Acceso

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

## 🧪 Probar la API

### Opción 1: Script PowerShell (Recomendado)
```powershell
cd gps-tracking-backend
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

### Opción 2: Postman
1. Abrir Postman
2. Importar: `GPS_Tracking_API.postman_collection.json`
3. Ejecutar las peticiones en orden

### Opción 3: cURL Manual

#### 1. Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@gps.com\",\"password\":\"admin123\"}"
```

#### 2. Guardar el token de la respuesta
```json
{
  "token": "1|abc123...",
  "user": {...}
}
```

#### 3. Usar el token en las siguientes peticiones
```bash
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 📍 Endpoints Más Importantes

### Para Empleados
```
POST /api/gps
Body: {
  "device_id": 1,
  "latitude": -12.046374,
  "longitude": -77.042793,
  "accuracy": 10.5
}
```

### Para Administradores
```
GET /api/locations/current
GET /api/locations/history?device_id=1&start_date=2025-11-11 00:00:00&end_date=2025-11-11 23:59:59
GET /api/users
POST /api/devices
```

## 🔄 Comandos Útiles

### Ver el servidor corriendo
El servidor ya está corriendo en segundo plano.

### Detener el servidor
Presiona `Ctrl+C` en la terminal donde está corriendo.

### Reiniciar el servidor
```bash
php artisan serve
```

### Ver logs en tiempo real
```bash
tail -f storage/logs/laravel.log
```

### Limpiar caché
```bash
php artisan cache:clear
php artisan config:clear
```

## 📊 Verificar Base de Datos

### Conectarse a MySQL
```bash
mysql -u root -p1234
```

### Ver datos
```sql
USE ProGps;

-- Ver usuarios
SELECT * FROM users;

-- Ver dispositivos
SELECT * FROM devices;

-- Ver ubicaciones GPS
SELECT * FROM gps_logs;

-- Ver roles
SELECT * FROM roles;
```

## 🐛 Solución de Problemas

### El servidor no inicia
```bash
# Verificar que el puerto 8000 no esté ocupado
netstat -ano | findstr :8000

# Usar otro puerto
php artisan serve --port=8001
```

### Error de base de datos
```bash
# Verificar que MySQL esté corriendo
# Verificar credenciales en .env
# Recrear base de datos
php artisan migrate:fresh --seed
```

### Token inválido
```bash
# Hacer login nuevamente para obtener un nuevo token
```

## 📚 Documentación Completa

- **API Completa:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **README:** [README.md](./README.md)
- **Colección Postman:** `GPS_Tracking_API.postman_collection.json`

## 🎉 Siguiente Paso

Ahora puedes:
1. ✅ Probar todos los endpoints con Postman
2. ✅ Integrar con el frontend Vue.js
3. ✅ Agregar más dispositivos y usuarios
4. ✅ Ver las ubicaciones en tiempo real

## 💡 Tips

- El token expira después de un tiempo, haz login nuevamente si es necesario
- Los empleados solo pueden ver sus propios dispositivos
- Las ubicaciones GPS se procesan de forma asíncrona
- El historial de ubicaciones tiene un límite de 30 días

## 🔗 URLs Importantes

- **API Base:** http://localhost:8000/api
- **Health Check:** http://localhost:8000/up
- **Documentación:** Ver archivos .md en este directorio

---

**¡El backend está listo para usar! 🚀**
