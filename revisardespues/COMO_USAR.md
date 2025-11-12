# 🚀 Cómo Usar la Plataforma GPS Tracking

## ✅ Estado Actual

**Backend:** 🟢 http://localhost:8000
**Frontend:** 🟢 http://localhost:5173

Ambos servidores están corriendo y listos para usar.

---

## 📖 Guía Paso a Paso

### 1️⃣ Abrir la Aplicación

Abre tu navegador y ve a:
```
http://localhost:5173
```

Verás la pantalla de login.

---

### 2️⃣ Login como Administrador

**Credenciales:**
```
Email: admin@gps.com
Password: admin123
```

1. Ingresa el email y password
2. Clic en "Iniciar Sesión"
3. Serás redirigido al Dashboard Admin

---

### 3️⃣ Explorar el Dashboard Admin

**Verás:**
- 🗺️ **Mapa grande** (centro de la pantalla)
- 📱 **Panel lateral** con lista de dispositivos
- 📊 **Estadísticas** (dispositivos activos)
- 🔄 **Actualización automática** cada 10 segundos

**Nota:** Al inicio no habrá ubicaciones porque ningún empleado está rastreando.

---

### 4️⃣ Gestionar Usuarios (Opcional)

1. Clic en "Usuarios" en el menú lateral
2. Verás la tabla con 2 usuarios (Admin y Juan)
3. Puedes:
   - ➕ Crear nuevo usuario
   - ✏️ Editar usuario existente
   - 🗑️ Eliminar usuario

**Para crear un usuario:**
1. Clic en "Crear Usuario"
2. Llenar formulario:
   - Nombre
   - Email
   - Password (mínimo 8 caracteres)
   - Rol (admin o empleado)
3. Clic en "Guardar"

---

### 5️⃣ Gestionar Dispositivos

1. Clic en "Dispositivos" en el menú lateral
2. Verás el dispositivo "Móvil Juan" ya creado
3. Puedes:
   - ➕ Crear nuevo dispositivo
   - ✏️ Editar dispositivo
   - 🗑️ Eliminar dispositivo
   - 🔄 Cambiar estado

**Para crear un dispositivo:**
1. Clic en "Crear Dispositivo"
2. Llenar formulario:
   - Nombre (ej: "Tablet María")
   - Serial (único, ej: "XYZ789")
   - Usuario (seleccionar de la lista)
   - Estado (activo/inactivo/mantenimiento)
3. Clic en "Guardar"

---

### 6️⃣ Cerrar Sesión y Login como Empleado

1. Clic en el icono de usuario (arriba derecha)
2. Clic en "Cerrar Sesión"
3. Serás redirigido al login

**Credenciales del Empleado:**
```
Email: juan@gps.com
Password: empleado123
```

---

### 7️⃣ Dashboard del Empleado

**Verás:**
- 📍 **Botón grande** "Iniciar Rastreo"
- 📱 **Información de tu dispositivo** (Móvil Juan)
- ⚙️ **Configuración** de intervalo de envío

---

### 8️⃣ Activar el Rastreo GPS

1. Clic en el botón **"Iniciar Rastreo"**
2. El navegador pedirá permiso para acceder a tu ubicación
3. Clic en **"Permitir"**
4. El botón cambiará a verde: "📍 Rastreando"
5. Verás notificaciones cada vez que se envíe una ubicación

**Configuración:**
- Puedes cambiar el intervalo de envío (30s, 1min, 5min)
- Solo se puede cambiar cuando el rastreo está detenido

**Última Ubicación:**
- Verás las coordenadas de la última ubicación enviada
- Latitud, Longitud, Precisión y Hora

---

### 9️⃣ Ver Ubicaciones en el Mapa (como Admin)

1. Cierra sesión del empleado
2. Login como admin
3. Ve al Dashboard
4. **Verás el marcador del empleado en el mapa** 🎉
5. Clic en el marcador para ver información
6. El mapa se actualiza automáticamente cada 10 segundos

**Panel Lateral:**
- Lista de dispositivos activos
- Tiempo desde última actualización
- Colores:
  - 🟢 Verde: < 2 minutos
  - 🟡 Amarillo: 2-5 minutos
  - 🔴 Rojo: > 5 minutos

---

### 🔟 Ver Historial de Rutas

1. Clic en "Historial" en el menú lateral
2. Seleccionar:
   - **Dispositivo** (ej: Móvil Juan)
   - **Fecha inicio** (ej: hoy 00:00)
   - **Fecha fin** (ej: hoy 23:59)
3. Clic en "Buscar"

**Verás:**
- 📊 **Estadísticas:**
  - Total de puntos registrados
  - Distancia recorrida (km)
  - Duración (minutos)
- 📍 **Lista de ubicaciones** con timestamps
- 🗺️ **Mapa con la ruta** (próximamente)

---

## 🌓 Cambiar Tema (Claro/Oscuro)

1. Clic en el icono de sol ☀️ o luna 🌙 en el header
2. El tema cambia instantáneamente
3. La preferencia se guarda automáticamente

---

## 👤 Ver/Editar Perfil

1. Clic en el icono de usuario (arriba derecha)
2. Clic en "Perfil"
3. Puedes editar:
   - Nombre
   - Email
   - Contraseña

---

## 🔄 Flujo Completo de Uso

### Escenario Real:

1. **Admin crea empleados y dispositivos**
   - Crear usuario empleado
   - Crear dispositivo
   - Asignar dispositivo al empleado

2. **Empleado activa rastreo**
   - Login con sus credenciales
   - Clic en "Iniciar Rastreo"
   - Permitir acceso a ubicación
   - Dejar la app abierta

3. **Admin monitorea en tiempo real**
   - Ver mapa con todos los empleados
   - Ver última actualización
   - Ver estadísticas

4. **Admin revisa historial**
   - Seleccionar empleado y fechas
   - Ver recorrido completo
   - Ver estadísticas de distancia

---

## 📱 Uso en Móvil

La aplicación funciona perfectamente en móviles:

1. Abre el navegador en tu teléfono
2. Ve a: `http://TU_IP_LOCAL:5173`
3. Login como empleado
4. Activa el rastreo
5. El GPS del teléfono enviará ubicaciones reales

**Nota:** Reemplaza `TU_IP_LOCAL` con la IP de tu computadora en la red local.

---

## 🎯 Casos de Uso

### 1. Rastreo de Empleados en Campo
- Vendedores
- Repartidores
- Técnicos de servicio
- Personal de seguridad

### 2. Gestión de Flotas
- Vehículos de empresa
- Equipos móviles
- Activos en movimiento

### 3. Control de Asistencia
- Verificar ubicación al marcar entrada/salida
- Historial de recorridos
- Reportes de actividad

---

## ⚙️ Configuración Avanzada

### Cambiar Intervalo de Envío

**Como Empleado:**
1. Ve a tu dashboard
2. Detén el rastreo si está activo
3. Cambia el intervalo en el selector
4. Inicia el rastreo nuevamente

**Opciones:**
- 30 segundos (más preciso, más batería)
- 1 minuto (balanceado)
- 5 minutos (ahorra batería)

### Cambiar Estado de Dispositivo

**Como Admin:**
1. Ve a "Dispositivos"
2. Clic en editar
3. Cambiar estado:
   - **Activo:** Puede enviar ubicaciones
   - **Inactivo:** No puede enviar ubicaciones
   - **Mantenimiento:** Temporalmente fuera de servicio

---

## 🐛 Solución de Problemas

### No veo ubicaciones en el mapa
✅ **Solución:**
1. Verifica que el empleado haya activado el rastreo
2. Espera 10 segundos (actualización automática)
3. Verifica que el dispositivo esté en estado "activo"
4. Refresca la página

### El navegador no pide permiso de ubicación
✅ **Solución:**
1. Verifica que estés en localhost o HTTPS
2. Revisa la configuración del navegador
3. Puede que ya hayas denegado el permiso antes
4. Limpia los permisos del sitio en configuración

### Error "Token inválido"
✅ **Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. El token se renovará automáticamente

### El mapa no carga
✅ **Solución:**
1. Verifica tu conexión a internet
2. Leaflet usa tiles de OpenStreetMap (requiere internet)
3. Refresca la página

---

## 💡 Tips y Trucos

### Para Admins:
- 📊 Revisa el historial al final del día
- 🔍 Usa filtros de fecha para análisis
- 📱 Mantén el dashboard abierto para monitoreo continuo
- 🌓 Usa modo oscuro para reducir fatiga visual

### Para Empleados:
- 🔋 Usa intervalo de 5 minutos para ahorrar batería
- 📍 Verifica que el GPS esté activo en tu dispositivo
- 🔌 Mantén el teléfono cargado
- 📱 No cierres el navegador mientras rastreas

---

## 📞 Ayuda

Si tienes problemas:
1. Revisa este documento
2. Consulta `PROYECTO_COMPLETADO.md`
3. Revisa los logs del backend: `gps-tracking-backend/storage/logs/laravel.log`
4. Abre la consola del navegador (F12) para ver errores

---

## 🎉 ¡Listo!

Ya sabes cómo usar la plataforma completa. 

**Disfruta rastreando ubicaciones en tiempo real! 🗺️📍**
