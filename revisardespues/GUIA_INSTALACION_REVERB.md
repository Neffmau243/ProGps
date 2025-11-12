# 🚀 Guía de Instalación: Laravel Reverb + WebSockets

## 📋 Pasos de Instalación

### PASO 1: Instalar Laravel Reverb

Abre PowerShell en la carpeta del backend y ejecuta:

```powershell
cd gps-tracking-backend
composer require laravel/reverb
```

Esto instalará el paquete. Espera a que termine (puede tomar 1-2 minutos).

---

### PASO 2: Instalar Configuración de Reverb

```powershell
php artisan reverb:install
```

Este comando te hará algunas preguntas:
- **"Would you like to install Reverb's dependencies?"** → Responde: `yes`
- Instalará automáticamente las dependencias necesarias

---

### PASO 3: Verificar Archivos Creados

Después de la instalación, verifica que se crearon estos archivos:
- `config/reverb.php` ✅
- Variables en `.env` ✅

---

### PASO 4: Configurar .env

Abre `gps-tracking-backend/.env` y verifica/agrega estas líneas:

```env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=123456
REVERB_APP_KEY=abcdefghijklmnop
REVERB_APP_SECRET=secretsecretsecret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

---

### PASO 5: Probar Reverb

Inicia el servidor Reverb:

```powershell
php artisan reverb:start
```

Deberías ver algo como:
```
Starting Reverb server on 0.0.0.0:8080...
Server started successfully.
```

**¡Déjalo corriendo!** Abre una nueva terminal para los siguientes pasos.

---

## ✅ Verificación

Si ves el mensaje "Server started successfully", ¡Reverb está funcionando! 🎉

---

## 🔄 Próximos Pasos

Una vez que Reverb esté instalado y corriendo, continuaremos con:

1. ✅ Crear el Evento LocationUpdated
2. ✅ Modificar el Job para emitir eventos
3. ✅ Configurar Echo en el Frontend
4. ✅ Conectar el Dashboard

---

## 🐛 Troubleshooting

### Error: "Port 8080 already in use"
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :8080

# Cambiar el puerto en .env
REVERB_PORT=8081
```

### Error: "composer: command not found"
```powershell
# Verificar instalación de Composer
composer --version

# Si no está instalado, descarga de: https://getcomposer.org/
```

### Error: "Class 'Reverb' not found"
```powershell
# Limpiar cache de Laravel
php artisan config:clear
php artisan cache:clear
composer dump-autoload
```

---

## 📞 Cuando Termines

**Avísame cuando hayas completado estos pasos y Reverb esté corriendo.**

Verás algo así en la terminal:
```
[2025-11-11 21:30:00] Reverb server started on 0.0.0.0:8080
```

¡Entonces continuaremos con el código! 🚀
