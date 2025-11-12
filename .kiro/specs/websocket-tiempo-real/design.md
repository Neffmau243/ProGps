# Design Document

## Overview

Este diseño implementa comunicación en tiempo real mediante Laravel Reverb (WebSockets) para reemplazar el sistema actual de polling. El objetivo es lograr actualizaciones instantáneas (< 1 segundo) en el dashboard del administrador cuando los empleados envían ubicaciones GPS.

## Architecture

### Diagrama de Flujo en Tiempo Real

```
┌─────────────────┐
│   Empleado      │
│   (Vue.js)      │
└────────┬────────┘
         │ 1. Captura GPS cada 30s
         ↓
┌─────────────────┐
│  POST /api/gps  │
│   (Laravel)     │
└────────┬────────┘
         │ 2. Encola Job
         ↓
┌─────────────────┐
│  Queue Worker   │
│  ProcessGpsLog  │
└────────┬────────┘
         │ 3. Guarda en BD
         │ 4. Emite Evento
         ↓
┌─────────────────┐
│ Laravel Reverb  │
│  (WebSocket)    │
└────────┬────────┘
         │ 5. Broadcast
         ↓
┌─────────────────┐
│  Admin Dashboard│
│  (Vue + Echo)   │
└─────────────────┘
   6. Actualiza Mapa
```

### Componentes Principales

1. **Laravel Reverb Server**
   - Puerto: 8080
   - Protocolo: WebSocket (ws://)
   - Canales: `locations` (público)

2. **Backend Broadcasting**
   - Driver: reverb
   - Eventos: `LocationUpdated`
   - Queue: sync (para desarrollo)

3. **Frontend Echo Client**
   - Librería: laravel-echo + pusher-js
   - Conexión: Persistente
   - Reconexión: Automática

## Components and Interfaces

### Backend Components

#### 1. Event: LocationUpdated

```php
<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $deviceId,
        public float $latitude,
        public float $longitude,
        public float $accuracy,
        public string $userName,
        public string $deviceName,
        public string $timestamp
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('locations'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'LocationUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'device_id' => $this->deviceId,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'accuracy' => $this->accuracy,
            'user_name' => $this->userName,
            'device_name' => $this->deviceName,
            'timestamp' => $this->timestamp,
            'minutes_ago' => 0
        ];
    }
}
```

#### 2. Modified Job: ProcessGpsLocation

```php
public function handle(): void
{
    try {
        $device = Device::with('user')->findOrFail($this->deviceId);

        if ($device->status !== 'activo') {
            Log::warning("Dispositivo {$this->deviceId} no está activo");
            return;
        }

        // Guardar en base de datos
        $gpsLog = GpsLog::create([
            'device_id' => $this->deviceId,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'accuracy' => $this->accuracy,
        ]);

        Log::info("Ubicación GPS guardada: {$gpsLog->id}");

        // Emitir evento en tiempo real
        broadcast(new LocationUpdated(
            deviceId: $device->id,
            latitude: (float) $this->latitude,
            longitude: (float) $this->longitude,
            accuracy: (float) $this->accuracy,
            userName: $device->user->name,
            deviceName: $device->name,
            timestamp: now()->toIso8601String()
        ))->toOthers();

        Log::info("Evento LocationUpdated emitido para dispositivo {$device->id}");

    } catch (\Exception $e) {
        Log::error("Error procesando GPS: {$e->getMessage()}");
        throw $e;
    }
}
```

### Frontend Components

#### 1. Echo Configuration

```typescript
// src/plugins/echo.ts
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: Echo
  }
}

window.Pusher = Pusher

export const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT ?? 8080,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
})

export default echo
```

#### 2. Dashboard with WebSocket

```typescript
// DashboardView.vue
import { ref, onMounted, onBeforeUnmount } from 'vue'
import echo from '@/plugins/echo'

const locations = ref<any[]>([])
const wsConnected = ref(false)
const isLoading = ref(false)

onMounted(() => {
  // Cargar ubicaciones iniciales
  loadInitialLocations()
  
  // Conectar a WebSocket
  connectWebSocket()
})

const connectWebSocket = () => {
  // Escuchar estado de conexión
  echo.connector.pusher.connection.bind('connected', () => {
    console.log('✅ WebSocket conectado')
    wsConnected.value = true
  })

  echo.connector.pusher.connection.bind('disconnected', () => {
    console.log('❌ WebSocket desconectado')
    wsConnected.value = false
  })

  echo.connector.pusher.connection.bind('connecting', () => {
    console.log('🔄 Conectando WebSocket...')
  })

  // Suscribirse al canal de ubicaciones
  echo.channel('locations')
    .listen('.LocationUpdated', (event: any) => {
      console.log('📍 Nueva ubicación recibida:', event)
      updateLocation(event)
    })
}

const updateLocation = (event: any) => {
  const index = locations.value.findIndex(
    l => l.device_id === event.device_id
  )

  const newLocation = {
    device_id: event.device_id,
    latitude: event.latitude,
    longitude: event.longitude,
    accuracy: event.accuracy,
    device_name: event.device_name,
    user_name: event.user_name,
    minutes_ago: 0,
    timestamp: event.timestamp
  }

  if (index >= 0) {
    // Actualizar ubicación existente
    locations.value[index] = newLocation
  } else {
    // Agregar nueva ubicación
    locations.value.push(newLocation)
  }
}

const loadInitialLocations = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/locations/current')
    locations.value = response.data
  } catch (error) {
    console.error('Error cargando ubicaciones:', error)
  } finally {
    isLoading.value = false
  }
}

onBeforeUnmount(() => {
  // Desconectar WebSocket
  echo.leave('locations')
})
```

## Data Models

### Event Payload Structure

```typescript
interface LocationUpdatedEvent {
  device_id: number
  latitude: number
  longitude: number
  accuracy: number
  user_name: string
  device_name: string
  timestamp: string
  minutes_ago: number
}
```

### WebSocket Connection State

```typescript
interface WebSocketState {
  connected: boolean
  connecting: boolean
  error: string | null
  lastUpdate: Date | null
}
```

## Configuration Files

### Backend: .env

```env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

### Frontend: .env

```env
VITE_REVERB_APP_KEY=your-app-key
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

## Error Handling

### Backend Error Scenarios

1. **Reverb Server Down**
   - Logs error but continues processing
   - Events queued for retry
   - System remains functional

2. **Broadcasting Failure**
   - Caught in try-catch
   - Logged for monitoring
   - GPS still saved to database

3. **Invalid Event Data**
   - Validation before broadcast
   - Logged with details
   - Skipped if invalid

### Frontend Error Scenarios

1. **Connection Lost**
   - Auto-reconnect after 3s
   - Show disconnected indicator
   - Queue events during downtime

2. **Invalid Event Received**
   - Validate event structure
   - Log warning
   - Skip invalid events

3. **Echo Initialization Failure**
   - Fallback to polling
   - Show error message
   - Retry connection

## Testing Strategy

### Unit Tests

1. **Event Broadcasting**
   - Test event creation
   - Test broadcast payload
   - Test channel selection

2. **Job Modification**
   - Test GPS saving
   - Test event emission
   - Test error handling

### Integration Tests

1. **End-to-End Flow**
   - Send GPS from frontend
   - Verify event received
   - Verify map updated

2. **Multiple Devices**
   - Send from 5+ devices
   - Verify all updates
   - Check performance

3. **Connection Resilience**
   - Disconnect/reconnect
   - Verify auto-recovery
   - Check data integrity

### Performance Tests

1. **Latency**
   - Measure end-to-end time
   - Target: < 1 second
   - Test with 10+ devices

2. **Concurrent Connections**
   - Test 50+ simultaneous connections
   - Monitor memory usage
   - Check CPU load

## Deployment Considerations

### Development

```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Reverb
php artisan reverb:start

# Terminal 3: Queue Worker
php artisan queue:work

# Terminal 4: Frontend
npm run dev
```

### Production

1. **Reverb as Service**
   - Use Supervisor or systemd
   - Auto-restart on failure
   - Log rotation

2. **SSL/TLS**
   - Use wss:// instead of ws://
   - Configure reverse proxy (Nginx)
   - Valid SSL certificate

3. **Scaling**
   - Redis for broadcasting
   - Multiple Reverb instances
   - Load balancer

## Security Considerations

1. **Channel Authorization**
   - Currently public channel
   - Future: Private channels per user
   - Token-based authentication

2. **Rate Limiting**
   - Limit events per device
   - Prevent spam/abuse
   - Monitor suspicious activity

3. **Data Validation**
   - Validate coordinates
   - Sanitize user input
   - Check device ownership

## Migration Path

### Phase 1: Parallel Operation
- Keep polling active
- Add WebSocket alongside
- Compare results

### Phase 2: Primary WebSocket
- WebSocket as primary
- Polling as fallback
- Monitor stability

### Phase 3: WebSocket Only
- Remove polling code
- Full WebSocket reliance
- Production ready

## Performance Metrics

### Target Metrics

- **Latency:** < 1 second end-to-end
- **Connection Stability:** > 99% uptime
- **Memory Usage:** < 100MB per 100 connections
- **CPU Usage:** < 10% idle, < 50% under load
- **Reconnection Time:** < 3 seconds

### Monitoring

- Log all broadcasts
- Track connection count
- Monitor event queue
- Alert on failures
- Dashboard for metrics
