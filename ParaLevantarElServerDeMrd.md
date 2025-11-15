# 🚀 Para Levantar El Server De Mrd

## Los 4 Comandos Mágicos

### Terminal 1: Laravel (Backend API)
```powershell
cd gps-tracking-backend
php artisan serve
```

### Terminal 2: Reverb (WebSocket Server)
```powershell
cd gps-tracking-backend
php artisan reverb:start
```

### Terminal 3: Queue Worker (Procesa Jobs)
```powershell
cd gps-tracking-backend
php artisan queue:work
```

### Terminal 4: Vue.js (Frontend Original - Vuetify)
```powershell
cd gps-tracking-frontend
npm run dev
```

**O bien:**

### Terminal 4 (Alternativa): Frontend3 (CSS Custom)
```powershell
cd gps-tracking-frontend3
npm run dev
```

---

## 🎯 Orden Recomendado

1. Primero Terminal 1 (Laravel)
2. Luego Terminal 2 (Reverb)
3. Después Terminal 3 (Queue)
4. Finalmente Terminal 4 (Frontend)

---

## ✅ Verificación Rápida

Deberías ver:

**Terminal 1:**
```
Laravel development server started: http://127.0.0.1:8000
```

**Terminal 2:**
```
Reverb server started on 0.0.0.0:8080
```

**Terminal 3:**
```
Processing jobs...
```

**Terminal 4:**
```
Local: http://localhost:5174/ (frontend original)
```
**O bien:**
```
Local: http://localhost:5173/ (frontend3)
```

---

## 🎉 Listo!

Abre según el frontend que uses:

**Frontend Original (Vuetify)**: `http://localhost:5174`

**Frontend3 (CSS Custom)**: `http://localhost:5173`

Login Admin:
- Email: `admin@gps.com`
- Password: `password`

Login Empleado:
- Email: `maria@gps.com`
- Password: `password`

---

## 📱 Ambos frontends ahora tienen:

✅ Dashboard Admin con mapa en tiempo real  
✅ Dashboard Empleado con GPS tracking funcional  
✅ Gestión de usuarios y dispositivos  
✅ Historial de rutas con estadísticas  
✅ WebSocket en tiempo real (Reverb)  
✅ Autenticación con roles  

---

**¡A trackear en tiempo real! 🗺️📍**
