# Requirements Document

## Introduction

Este documento define los requisitos para implementar comunicación en tiempo real mediante WebSockets usando Laravel Reverb, permitiendo que el dashboard del administrador reciba actualizaciones instantáneas de ubicaciones GPS sin necesidad de polling.

## Glossary

- **Reverb**: Servidor WebSocket nativo de Laravel para comunicación en tiempo real
- **Broadcasting**: Sistema de Laravel para emitir eventos a través de WebSockets
- **Echo**: Cliente JavaScript de Laravel para escuchar eventos WebSocket
- **Channel**: Canal de comunicación donde se transmiten eventos
- **Event**: Mensaje que se transmite a través de WebSocket
- **Polling**: Técnica de consultar el servidor repetidamente (actual, a reemplazar)
- **WebSocket**: Protocolo de comunicación bidireccional en tiempo real

## Requirements

### Requirement 1: Instalación y Configuración de Laravel Reverb

**User Story:** Como desarrollador, quiero instalar y configurar Laravel Reverb en el backend, para que el sistema pueda transmitir eventos en tiempo real.

#### Acceptance Criteria

1. WHEN el desarrollador ejecuta el comando de instalación, THE Backend SHALL instalar el paquete laravel/reverb mediante Composer
2. WHEN el desarrollador ejecuta reverb:install, THE Backend SHALL crear los archivos de configuración necesarios
3. WHEN el desarrollador configura el archivo .env, THE Backend SHALL contener las variables REVERB_APP_ID, REVERB_APP_KEY, REVERB_APP_SECRET, REVERB_HOST y REVERB_PORT
4. WHEN el desarrollador inicia el servidor Reverb, THE Backend SHALL ejecutar en el puerto 8080 sin errores
5. WHEN el servidor Reverb está activo, THE Backend SHALL aceptar conexiones WebSocket

### Requirement 2: Creación del Evento LocationUpdated

**User Story:** Como sistema backend, quiero emitir un evento cuando se procesa una nueva ubicación GPS, para que los clientes conectados reciban la actualización instantáneamente.

#### Acceptance Criteria

1. THE Backend SHALL crear una clase LocationUpdated que implemente ShouldBroadcast
2. WHEN se crea el evento, THE Backend SHALL incluir deviceId, latitude, longitude, accuracy, userName y deviceName como propiedades públicas
3. WHEN se define el canal de transmisión, THE Backend SHALL usar el canal público 'locations'
4. WHEN el evento se serializa, THE Backend SHALL incluir todos los datos necesarios para actualizar el mapa
5. THE Backend SHALL configurar el evento para transmitirse a todos los clientes excepto el emisor

### Requirement 3: Modificación del Job ProcessGpsLocation

**User Story:** Como sistema backend, quiero que el Job de procesamiento GPS emita eventos en tiempo real, para notificar inmediatamente a los administradores conectados.

#### Acceptance Criteria

1. WHEN el Job guarda una ubicación en la base de datos, THE Backend SHALL emitir el evento LocationUpdated
2. WHEN se emite el evento, THE Backend SHALL incluir información del dispositivo y usuario asociado
3. WHEN ocurre un error al emitir el evento, THE Backend SHALL registrar el error en logs sin detener el procesamiento
4. WHEN el evento se emite exitosamente, THE Backend SHALL continuar con el flujo normal del Job
5. THE Backend SHALL mantener la funcionalidad existente de guardar en base de datos

### Requirement 4: Instalación de Laravel Echo en Frontend

**User Story:** Como desarrollador frontend, quiero instalar Laravel Echo y Pusher.js, para que la aplicación Vue pueda conectarse al servidor WebSocket.

#### Acceptance Criteria

1. WHEN el desarrollador ejecuta npm install, THE Frontend SHALL instalar laravel-echo y pusher-js
2. WHEN se configura el archivo .env, THE Frontend SHALL contener VITE_REVERB_APP_KEY, VITE_REVERB_HOST y VITE_REVERB_PORT
3. THE Frontend SHALL crear un archivo de configuración echo.ts en src/plugins
4. WHEN se inicializa Echo, THE Frontend SHALL configurar broadcaster como 'reverb'
5. WHEN la aplicación inicia, THE Frontend SHALL establecer conexión con el servidor Reverb

### Requirement 5: Escucha de Eventos en Dashboard Admin

**User Story:** Como administrador, quiero que el mapa se actualice automáticamente cuando un empleado envía su ubicación, para ver movimientos en tiempo real sin refrescar la página.

#### Acceptance Criteria

1. WHEN el dashboard se monta, THE Frontend SHALL suscribirse al canal 'locations'
2. WHEN llega un evento LocationUpdated, THE Frontend SHALL actualizar o agregar el marcador correspondiente en el mapa
3. WHEN se actualiza un marcador existente, THE Frontend SHALL animar la transición de posición
4. WHEN llega una ubicación de un dispositivo nuevo, THE Frontend SHALL crear un nuevo marcador
5. WHEN el componente se desmonta, THE Frontend SHALL desconectarse del canal para liberar recursos

### Requirement 6: Indicador de Conexión WebSocket

**User Story:** Como administrador, quiero ver el estado de la conexión WebSocket, para saber si estoy recibiendo actualizaciones en tiempo real.

#### Acceptance Criteria

1. THE Frontend SHALL mostrar un indicador visual del estado de conexión WebSocket
2. WHEN la conexión está activa, THE Frontend SHALL mostrar un chip verde con icono de wifi
3. WHEN la conexión se pierde, THE Frontend SHALL mostrar un chip rojo con icono de wifi desconectado
4. WHEN se intenta reconectar, THE Frontend SHALL mostrar un chip amarillo con icono de carga
5. THE Frontend SHALL intentar reconectar automáticamente si la conexión se pierde

### Requirement 7: Eliminación del Polling

**User Story:** Como sistema, quiero eliminar el polling del dashboard, para reducir la carga del servidor y usar solo WebSockets.

#### Acceptance Criteria

1. THE Frontend SHALL remover el setInterval que consulta ubicaciones cada 10 segundos
2. WHEN el dashboard se monta, THE Frontend SHALL cargar ubicaciones iniciales una sola vez
3. WHEN llegan eventos WebSocket, THE Frontend SHALL actualizar el estado sin consultas adicionales
4. THE Frontend SHALL mantener la funcionalidad de carga inicial para mostrar ubicaciones existentes
5. THE Frontend SHALL depender únicamente de eventos WebSocket para actualizaciones

### Requirement 8: Script de Inicio Automático

**User Story:** Como desarrollador, quiero un script que inicie todos los servicios necesarios, para facilitar el desarrollo y testing.

#### Acceptance Criteria

1. THE Sistema SHALL crear un script start-all.ps1 que inicie Backend, Reverb y Frontend
2. WHEN se ejecuta el script, THE Sistema SHALL abrir tres ventanas de PowerShell separadas
3. WHEN se inicia Reverb, THE Sistema SHALL reiniciar automáticamente si falla
4. WHEN todos los servicios están activos, THE Sistema SHALL mostrar las URLs de acceso
5. THE Sistema SHALL permitir detener todos los servicios cerrando las ventanas

### Requirement 9: Testing de Tiempo Real

**User Story:** Como desarrollador, quiero verificar que las actualizaciones en tiempo real funcionan correctamente, para asegurar la calidad del sistema.

#### Acceptance Criteria

1. WHEN un empleado envía una ubicación, THE Sistema SHALL mostrarla en el dashboard del admin en menos de 1 segundo
2. WHEN múltiples empleados envían ubicaciones simultáneamente, THE Sistema SHALL actualizar todos los marcadores correctamente
3. WHEN se pierde la conexión WebSocket, THE Sistema SHALL reconectar automáticamente
4. WHEN el servidor Reverb se reinicia, THE Sistema SHALL restablecer todas las conexiones activas
5. THE Sistema SHALL funcionar correctamente en Chrome, Firefox y Edge

### Requirement 10: Documentación de Reverb

**User Story:** Como desarrollador futuro, quiero documentación clara sobre cómo funciona Reverb en el proyecto, para facilitar mantenimiento y mejoras.

#### Acceptance Criteria

1. THE Sistema SHALL crear un documento REVERB_SETUP.md con instrucciones de instalación
2. THE Sistema SHALL documentar la estructura de eventos y canales utilizados
3. THE Sistema SHALL incluir ejemplos de cómo agregar nuevos eventos
4. THE Sistema SHALL documentar troubleshooting común de WebSockets
5. THE Sistema SHALL incluir comandos para monitorear conexiones activas
