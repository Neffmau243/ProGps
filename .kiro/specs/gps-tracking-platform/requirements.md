# Documento de Requisitos

## Introducción

Este documento define los requisitos para una plataforma de rastreo GPS que permite a una empresa registrar empleados, asignar dispositivos, recibir ubicaciones GPS en tiempo real y visualizar las posiciones en un mapa administrativo. El sistema constará de un backend desarrollado en Laravel y un frontend desarrollado en Vue.js.

## Glosario

- **Sistema de Rastreo GPS**: El sistema completo de rastreo GPS que incluye backend, frontend de empleado y dashboard administrativo
- **Cliente Empleado**: La aplicación frontend utilizada por empleados para enviar ubicaciones GPS
- **Panel Administrativo**: La interfaz administrativa para visualizar ubicaciones y gestionar usuarios/dispositivos
- **API Backend**: El servidor Laravel que procesa y almacena datos de ubicación
- **Dispositivo**: Un dispositivo físico o virtual asignado a un empleado para rastreo GPS
- **Registro GPS**: Un registro individual de ubicación que contiene latitud, longitud y marca de tiempo
- **Ubicación Activa**: La ubicación GPS más reciente de un dispositivo
- **Historial de Ubicaciones**: El conjunto de ubicaciones GPS históricas de un dispositivo

## Configuración del Entorno

### Base de Datos
- **Motor**: MySQL 8.0+
- **Nombre de la base de datos**: ProGps
- **Charset**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Host**: 127.0.0.1
- **Puerto**: 3306
- **Usuario**: root
- **Contraseña**: 1234

### Backend (Laravel)
- **Versión Laravel**: 11.x
- **Entorno**: local (desarrollo)
- **URL**: http://localhost
- **Queue Connection**: sync (desarrollo), redis (producción)
- **Cache Store**: file (desarrollo), redis (producción)
- **Session Driver**: file
- **Broadcast Connection**: reverb (para tiempo real)

## Requisitos

## Requisitos del Backend (Laravel API)

### Requisito 0: Configuración del Proyecto

**Historia de Usuario:** Como desarrollador, necesito configurar el proyecto Laravel con las especificaciones correctas, para garantizar consistencia en todos los entornos.

#### Criterios de Aceptación

1. LA API Backend DEBERÁ usar MySQL como motor de base de datos con el nombre "ProGps"
2. LA API Backend DEBERÁ configurar la base de datos con charset utf8mb4 y collation utf8mb4_unicode_ci
3. LA API Backend DEBERÁ usar las credenciales: host=127.0.0.1, port=3306, username=root, password=1234
4. LA API Backend DEBERÁ configurar Laravel Reverb para comunicación en tiempo real
5. LA API Backend DEBERÁ usar el driver "sync" para colas en desarrollo y "redis" en producción

### Requisito 1: Gestión de Usuarios

**Historia de Usuario:** Como administrador, quiero registrar y gestionar empleados en el sistema, para poder asignarles dispositivos y rastrear sus ubicaciones.

#### Criterios de Aceptación

1. LA API Backend DEBERÁ proporcionar endpoints para crear, leer, actualizar y eliminar registros de usuario con los campos: nombre, email y contraseña
2. CUANDO se crea un usuario, LA API Backend DEBERÁ validar que el email sea único y esté correctamente formateado
3. LA API Backend DEBERÁ encriptar las contraseñas usando bcrypt antes de almacenarlas en la base de datos
4. LA API Backend DEBERÁ requerir tokens de autenticación para todas las operaciones de gestión de usuarios excepto el login
5. LA API Backend DEBERÁ proporcionar un endpoint para listar todos los usuarios con sus dispositivos asociados

### Requisito 2: Gestión de Dispositivos

**Historia de Usuario:** Como administrador, quiero registrar dispositivos y asignarlos a empleados, para poder identificar qué dispositivo está enviando cada ubicación GPS.

#### Criterios de Aceptación

1. LA API Backend DEBERÁ proporcionar endpoints para crear, leer, actualizar y eliminar registros de dispositivos con los campos: user_id, nombre, serial y estado
2. CUANDO se crea un dispositivo, LA API Backend DEBERÁ validar que el número de serie sea único
3. LA API Backend DEBERÁ garantizar una relación donde cada dispositivo pertenece exactamente a un usuario
4. LA API Backend DEBERÁ permitir que un usuario tenga múltiples dispositivos asignados
5. LA API Backend DEBERÁ proporcionar un endpoint para listar dispositivos agrupados por usuario

### Requisito 3: Almacenamiento de Ubicaciones GPS

**Historia de Usuario:** Como sistema, necesito almacenar todas las ubicaciones GPS recibidas, para poder proporcionar datos históricos y en tiempo real a los administradores.

#### Criterios de Aceptación

1. LA API Backend DEBERÁ proporcionar un endpoint POST para recibir ubicaciones GPS
2. CUANDO la API Backend recibe una ubicación GPS, LA API Backend DEBERÁ validar que el usuario y el dispositivo sean válidos y estén activos
3. LA API Backend DEBERÁ almacenar la ubicación con los campos: user_id, device_id, latitud, longitud y marca de tiempo
4. LA API Backend DEBERÁ crear índices de base de datos en los campos device_id y marca de tiempo para optimizar el rendimiento de las consultas
5. LA API Backend DEBERÁ validar que los valores de latitud estén entre -90 y 90 grados
6. LA API Backend DEBERÁ validar que los valores de longitud estén entre -180 y 180 grados
7. LA API Backend DEBERÁ registrar la marca de tiempo del servidor al almacenar cada registro GPS

### Requisito 4: Autenticación y Seguridad

**Historia de Usuario:** Como administrador del sistema, quiero que todas las comunicaciones estén autenticadas y seguras, para proteger los datos de ubicación de los empleados.

#### Criterios de Aceptación

1. LA API Backend DEBERÁ implementar Laravel Sanctum para autenticación basada en tokens
2. CUANDO un usuario inicia sesión con credenciales válidas, LA API Backend DEBERÁ generar y devolver un token de autenticación
3. LA API Backend DEBERÁ rechazar solicitudes sin tokens de autenticación válidos con estado HTTP 401
4. LA API Backend DEBERÁ verificar que los usuarios solo puedan enviar datos GPS para dispositivos asignados a ellos
5. LA API Backend DEBERÁ usar HTTPS para todas las comunicaciones API en entornos de producción

### Requisito 5: Consulta de Ubicaciones

**Historia de Usuario:** Como administrador, quiero consultar las ubicaciones actuales e históricas de los dispositivos, para monitorear y revisar las rutas de los empleados.

#### Criterios de Aceptación

1. LA API Backend DEBERÁ proporcionar un endpoint para obtener la ubicación más reciente de cada dispositivo activo
2. LA API Backend DEBERÁ proporcionar un endpoint para recuperar registros GPS filtrados por device_id y rango de fechas
3. LA API Backend DEBERÁ devolver el historial de ubicaciones ordenado por marca de tiempo en orden descendente
4. LA API Backend DEBERÁ limitar las consultas históricas a un máximo de 30 días para garantizar el rendimiento
5. LA API Backend DEBERÁ incluir información del usuario y dispositivo en las respuestas de ubicación

### Requisito 6: Estado de Dispositivos

**Historia de Usuario:** Como administrador, quiero ver el estado de cada dispositivo (activo/inactivo), para identificar rápidamente qué dispositivos están operativos.

#### Criterios de Aceptación

1. LA API Backend DEBERÁ mantener un campo de estado para cada dispositivo con valores: "activo", "inactivo" o "mantenimiento"
2. LA API Backend DEBERÁ aceptar datos GPS solo de dispositivos con estado "activo"
3. LA API Backend DEBERÁ proporcionar un endpoint para actualizar el estado de un dispositivo
4. LA API Backend DEBERÁ incluir el estado del dispositivo en todas las respuestas que contengan información de dispositivos
5. LA API Backend DEBERÁ calcular y devolver el tiempo transcurrido desde la última ubicación recibida

### Requisito 7: Gestión de Roles

**Historia de Usuario:** Como administrador del sistema, quiero diferenciar entre usuarios administradores y empleados regulares, para controlar el acceso a funcionalidades administrativas.

#### Criterios de Aceptación

1. LA API Backend DEBERÁ implementar un sistema de roles con al menos dos roles: "admin" y "empleado"
2. LA API Backend DEBERÁ restringir el acceso a los endpoints de gestión de usuarios y dispositivos a usuarios con rol "admin"
3. LA API Backend DEBERÁ permitir a los usuarios con rol "empleado" solo enviar datos GPS para sus dispositivos asignados
4. CUANDO un usuario intenta acceder a un endpoint restringido, LA API Backend DEBERÁ devolver estado HTTP 403 si carece de permisos
5. LA API Backend DEBERÁ incluir el rol del usuario en la respuesta de autenticación

### Requisito 8: Validación de Relaciones

**Historia de Usuario:** Como sistema, necesito validar que solo se registren ubicaciones para combinaciones válidas de usuario-dispositivo, para mantener la integridad de los datos.

#### Criterios de Aceptación

1. CUANDO la API Backend recibe una ubicación GPS, LA API Backend DEBERÁ verificar que el device_id existe en la base de datos
2. LA API Backend DEBERÁ verificar que el user_id autenticado coincide con el user_id asignado al dispositivo
3. SI el dispositivo no está asignado al usuario autenticado, ENTONCES LA API Backend DEBERÁ rechazar la solicitud con estado HTTP 403
4. LA API Backend DEBERÁ usar restricciones de clave foránea en la base de datos para garantizar la integridad referencial
5. LA API Backend DEBERÁ devolver mensajes de error descriptivos cuando falla la validación

### Requisito 8.1: Procesamiento de Ubicaciones en Cola

**Historia de Usuario:** Como sistema, necesito procesar las ubicaciones GPS entrantes de forma ordenada y eficiente, para manejar múltiples dispositivos enviando datos simultáneamente.

#### Criterios de Aceptación

1. LA API Backend DEBERÁ implementar un sistema de colas (Laravel Queue) para procesar ubicaciones GPS de forma asíncrona
2. CUANDO se recibe una ubicación GPS, LA API Backend DEBERÁ encolar el registro para procesamiento sin bloquear la respuesta HTTP
3. LA API Backend DEBERÁ procesar las ubicaciones en orden de llegada (FIFO)
4. LA API Backend DEBERÁ manejar reintentos automáticos si falla el procesamiento de una ubicación
5. LA API Backend DEBERÁ registrar errores de procesamiento en logs para auditoría

### Requisito 8.2: Gestión de Zonas Geográficas (Opcional - Fase Futura)

**Historia de Usuario:** Como administrador, quiero definir zonas geográficas jerárquicas (empresa → sucursales → áreas), para organizar y filtrar dispositivos por ubicación organizacional.

#### Criterios de Aceptación

1. LA API Backend DEBERÁ implementar una estructura de árbol para representar zonas geográficas con relación padre-hijo
2. LA API Backend DEBERÁ permitir asignar dispositivos a zonas específicas
3. LA API Backend DEBERÁ proporcionar endpoints para crear, leer, actualizar y eliminar zonas
4. LA API Backend DEBERÁ permitir consultar todos los dispositivos dentro de una zona y sus sub-zonas
5. LA API Backend DEBERÁ validar que no existan ciclos en la jerarquía de zonas

### Requisito 8.3: Cálculo de Rutas y Trayectorias (Opcional - Fase Futura)

**Historia de Usuario:** Como administrador, quiero que el sistema calcule automáticamente las rutas recorridas por los dispositivos, para analizar patrones de movimiento y distancias.

#### Criterios de Aceptación

1. LA API Backend DEBERÁ implementar un algoritmo para conectar puntos GPS consecutivos formando una trayectoria
2. LA API Backend DEBERÁ calcular la distancia total recorrida entre dos puntos temporales usando la fórmula de Haversine
3. LA API Backend DEBERÁ identificar y marcar períodos de inactividad (cuando el dispositivo permanece en la misma ubicación)
4. LA API Backend DEBERÁ proporcionar un endpoint para obtener estadísticas de ruta (distancia, tiempo en movimiento, paradas)
5. LA API Backend DEBERÁ optimizar consultas de rutas usando índices espaciales si la base de datos lo soporta

## Requisitos del Frontend (Vue.js)

### Requisito 9: Cliente Empleado - Captura de GPS

**Historia de Usuario:** Como empleado, quiero que mi aplicación envíe automáticamente mi ubicación GPS, para que la empresa pueda rastrear mi posición durante mi jornada laboral.

#### Criterios de Aceptación

1. EL Cliente Empleado DEBERÁ solicitar permisos GPS del sistema operativo del dispositivo antes de acceder a los datos de ubicación
2. CUANDO se otorgan los permisos GPS, EL Cliente Empleado DEBERÁ obtener las coordenadas actuales de latitud y longitud
3. EL Cliente Empleado DEBERÁ enviar las coordenadas GPS a la API Backend en intervalos configurables (por defecto: cada 30 segundos)
4. SI se pierde la conectividad de red, ENTONCES EL Cliente Empleado DEBERÁ encolar los datos de ubicación localmente y enviarlos cuando se restaure la conectividad
5. EL Cliente Empleado DEBERÁ mostrar el estado de la conexión y el último envío exitoso de ubicación

### Requisito 10: Cliente Empleado - Autenticación

**Historia de Usuario:** Como empleado, quiero iniciar sesión en la aplicación con mis credenciales, para poder comenzar a enviar mi ubicación GPS.

#### Criterios de Aceptación

1. EL Cliente Empleado DEBERÁ proporcionar un formulario de login con campos de email y contraseña
2. CUANDO un empleado inicia sesión exitosamente, EL Cliente Empleado DEBERÁ almacenar el token de autenticación de forma segura
3. EL Cliente Empleado DEBERÁ incluir el token de autenticación en todas las solicitudes a la API Backend
4. EL Cliente Empleado DEBERÁ redirigir al usuario a la pantalla de login si el token expira o es inválido
5. EL Cliente Empleado DEBERÁ proporcionar una opción para cerrar sesión que elimine el token almacenado

### Requisito 11: Panel Administrativo - Visualización en Tiempo Real

**Historia de Usuario:** Como administrador, quiero ver las ubicaciones actuales de todos los dispositivos en un mapa interactivo, para monitorear la posición de los empleados en tiempo real.

#### Criterios de Aceptación

1. EL Panel Administrativo DEBERÁ mostrar un mapa interactivo usando Leaflet o Google Maps API
2. CUANDO el Panel Administrativo se carga, EL Panel Administrativo DEBERÁ obtener y mostrar la ubicación más reciente de cada dispositivo activo
3. EL Panel Administrativo DEBERÁ representar cada ubicación de dispositivo con un marcador que muestre el nombre del empleado y el identificador del dispositivo
4. EL Panel Administrativo DEBERÁ actualizar los datos de ubicación automáticamente cada 30 segundos
5. CUANDO un usuario hace clic en un marcador de dispositivo, EL Panel Administrativo DEBERÁ mostrar información detallada incluyendo marca de tiempo y coordenadas

### Requisito 12: Panel Administrativo - Historial de Ubicaciones

**Historia de Usuario:** Como administrador, quiero consultar el historial de ubicaciones de un dispositivo específico, para revisar las rutas y movimientos de un empleado en un período determinado.

#### Criterios de Aceptación

1. EL Panel Administrativo DEBERÁ permitir a los administradores seleccionar un dispositivo y rango de fechas para ver ubicaciones históricas
2. EL Panel Administrativo DEBERÁ mostrar las ubicaciones históricas como una ruta trazada en el mapa
3. EL Panel Administrativo DEBERÁ mostrar marcadores en puntos clave de la ruta con información de tiempo
4. EL Panel Administrativo DEBERÁ permitir reproducir la ruta de forma animada mostrando el movimiento del dispositivo
5. EL Panel Administrativo DEBERÁ mostrar estadísticas del recorrido (distancia total, tiempo de movimiento)

### Requisito 13: Panel Administrativo - Gestión de Usuarios y Dispositivos

**Historia de Usuario:** Como administrador, quiero gestionar usuarios y dispositivos desde la interfaz web, para poder realizar operaciones CRUD sin necesidad de acceder directamente a la base de datos.

#### Criterios de Aceptación

1. EL Panel Administrativo DEBERÁ mostrar una lista de todos los usuarios registrados con sus dispositivos asociados
2. EL Panel Administrativo DEBERÁ proporcionar formularios para crear, editar y eliminar usuarios
3. EL Panel Administrativo DEBERÁ proporcionar formularios para crear, editar y eliminar dispositivos
4. EL Panel Administrativo DEBERÁ mostrar el estado del dispositivo con indicadores visuales (colores o iconos)
5. EL Panel Administrativo DEBERÁ permitir a los administradores cambiar el estado del dispositivo a través de la interfaz

### Requisito 14: Panel Administrativo - Indicadores de Estado

**Historia de Usuario:** Como administrador, quiero ver indicadores visuales del estado de los dispositivos, para identificar rápidamente problemas de conectividad o dispositivos inactivos.

#### Criterios de Aceptación

1. CUANDO un dispositivo no ha enviado datos de ubicación por más de 10 minutos, EL Panel Administrativo DEBERÁ mostrar un indicador de advertencia
2. EL Panel Administrativo DEBERÁ mostrar el tiempo transcurrido desde la última ubicación recibida para cada dispositivo
3. EL Panel Administrativo DEBERÁ usar códigos de color para indicar el estado: verde (activo y reciente), amarillo (advertencia), rojo (sin señal)
4. EL Panel Administrativo DEBERÁ mostrar un contador de dispositivos activos vs inactivos en el dashboard
5. EL Panel Administrativo DEBERÁ permitir filtrar dispositivos por estado (todos, activos, inactivos, con advertencia)

### Requisito 15: Panel Administrativo - Autenticación y Control de Acceso

**Historia de Usuario:** Como administrador, quiero que solo usuarios con rol de administrador puedan acceder al panel administrativo, para mantener la seguridad del sistema.

#### Criterios de Aceptación

1. EL Panel Administrativo DEBERÁ proporcionar un formulario de login separado del Cliente Empleado
2. CUANDO un usuario inicia sesión, EL Panel Administrativo DEBERÁ verificar que el usuario tiene rol "admin"
3. SI un usuario sin rol "admin" intenta acceder, EL Panel Administrativo DEBERÁ mostrar un mensaje de error y denegar el acceso
4. EL Panel Administrativo DEBERÁ almacenar el token de autenticación de forma segura
5. EL Panel Administrativo DEBERÁ proporcionar una opción para cerrar sesión
