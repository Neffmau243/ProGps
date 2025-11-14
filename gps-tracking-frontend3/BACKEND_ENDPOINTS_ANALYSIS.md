# Análisis de Endpoints del Backend

## ⚠️ PROBLEMAS ENCONTRADOS Y SOLUCIONES

### 1. **Nombres de Campos Diferentes**

#### Problema: Campo `serial_number` vs `serial`
- **Frontend espera:** `serial_number`
- **Backend retorna:** `serial`

**Ubicaciones afectadas:**
- `DevicesManagement.vue` - Muestra "Serial: {{ device.serial_number }}"
- `types/index.ts` - Interface Device tiene `serial_number`

**Solución:** Actualizar el frontend para usar `serial` O actualizar el backend.

---

#### Problema: Status en español vs inglés
- **Frontend espera:** `'active' | 'inactive' | 'maintenance'`
- **Backend usa:** `'activo' | 'inactivo' | 'mantenimiento'`

**Ubicaciones afectadas:**
- `DevicesManagement.vue` - Todos los filtros y badges de estado
- `devicesService.ts` - Endpoint changeStatus
- `types/index.ts` - Interface Device.status

**Solución:** Crear función de mapeo o actualizar backend.

---

### 2. **Estructura de Respuesta de `/locations/history`**

#### Problema: Estructura anidada
**Backend retorna:**
```json
{
  "device": { "id": 1, "name": "...", "user_name": "..." },
  "locations": [
    { "latitude": 0, "longitude": 0, "accuracy": 0, "timestamp": "..." }
  ],
  "statistics": { "total_points": 0, "distance_km": 0, "duration_minutes": 0 }
}
```

**Frontend espera (según locationsService.ts):**
```json
{
  "data": [
    { "id": 1, "latitude": 0, "longitude": 0, "created_at": "...", "speed": 0 }
  ]
}
```

**Solución:** Actualizar `locationsService.ts` para procesar la respuesta correcta.

---

### 3. **Campos Faltantes en GpsLog**

#### Problema: Frontend espera campos que no existen
- **Frontend espera:** `id`, `created_at`, `battery_level`
- **Backend retorna:** `timestamp` (no `created_at`), no incluye `id` ni `battery_level`

**El modelo GpsLog tiene:**
- ✅ `speed`
- ✅ `heading`
- ✅ `altitude`
- ❌ `battery_level` (no existe)

**Solución:** 
1. Mapear `timestamp` → `created_at` en el frontend
2. Eliminar referencias a `battery_level` o agregar campo al backend
3. Backend debe incluir `id` en la respuesta

---

### 4. **Endpoint `/locations/current` - Formato Incorrecto**

**Backend retorna:**
```json
[
  {
    "device_id": 1,
    "device_name": "...",
    "device_serial": "...",
    "user_id": 1,
    "user_name": "...",
    "latitude": 0,
    "longitude": 0,
    "accuracy": 0,
    "timestamp": "...",
    "minutes_ago": 0
  }
]
```

**Frontend espera (según types/index.ts):**
```json
{
  "data": [
    {
      "id": 1,
      "latitude": 0,
      "longitude": 0,
      "accuracy": 0,
      "device_id": 1,
      "device": { ... },
      "user_id": 1,
      "user": { ... },
      "timestamp": "...",
      "created_at": "..."
    }
  ]
}
```

**Solución:** Actualizar el controlador para retornar formato estándar.

---

## 📋 TABLA DE ENDPOINTS

| Endpoint | Método | Auth | Rol | Estado Frontend | Estado Backend | Notas |
|----------|--------|------|-----|----------------|----------------|-------|
| `/auth/login` | POST | ❌ | - | ✅ Funciona | ✅ OK | - |
| `/auth/logout` | POST | ✅ | - | ✅ Funciona | ✅ OK | - |
| `/auth/me` | GET | ✅ | - | ✅ Funciona | ✅ OK | - |
| `/users` | GET | ✅ | Admin | ✅ Implementado | ✅ OK | - |
| `/users` | POST | ✅ | Admin | ✅ Implementado | ✅ OK | - |
| `/users/{id}` | GET | ✅ | Admin | ❌ No usado | ✅ OK | - |
| `/users/{id}` | PUT | ✅ | Admin | ✅ Implementado | ✅ OK | - |
| `/users/{id}` | DELETE | ✅ | Admin | ✅ Implementado | ✅ OK | - |
| `/devices` | GET | ✅ | All | ✅ Implementado | ⚠️ Campo `serial` | Cambiar a `serial_number` |
| `/devices` | POST | ✅ | Admin | ✅ Implementado | ⚠️ Campo `serial` | Cambiar a `serial_number` |
| `/devices/{id}` | GET | ✅ | All | ❌ No usado | ✅ OK | - |
| `/devices/{id}` | PUT | ✅ | Admin | ✅ Implementado | ⚠️ Campo `serial` | Cambiar a `serial_number` |
| `/devices/{id}` | DELETE | ✅ | Admin | ✅ Implementado | ✅ OK | - |
| `/devices/{id}/status` | PATCH | ✅ | Admin | ✅ Implementado | ⚠️ Status español | Usar inglés |
| `/gps` | POST | ✅ | Employee | ❌ No usado aún | ✅ OK | Para enviar GPS |
| `/locations/current` | GET | ✅ | Admin | ❌ No usado aún | ⚠️ Formato | Actualizar formato |
| `/locations/history` | GET | ✅ | Admin | ✅ Implementado | ⚠️ Estructura | Actualizar respuesta |

---

## 🔧 CORRECCIONES NECESARIAS

### Opción A: Actualizar Frontend (Más rápido)

1. **Actualizar `types/index.ts`:**
```typescript
export interface Device {
  id: number;
  name: string;
  serial: string; // Cambiar de serial_number a serial
  status: 'activo' | 'inactivo' | 'mantenimiento'; // Cambiar a español
  user_id: number | null;
  user?: User;
  created_at?: string;
  updated_at?: string;
}
```

2. **Actualizar `DevicesManagement.vue`:**
- Cambiar `device.serial_number` → `device.serial`
- Actualizar labels de status
- Crear función de traducción de estados

3. **Actualizar `locationsService.ts`:**
```typescript
async getHistory(params: LocationsHistoryParams): Promise<Location[]> {
  const response = await apiClient.get('/locations/history', { params });
  
  // Transformar respuesta
  const locations = response.data.locations.map((loc: any) => ({
    id: loc.id || 0,
    latitude: loc.latitude,
    longitude: loc.longitude,
    accuracy: loc.accuracy,
    speed: loc.speed || null,
    device_id: params.device_id,
    user_id: response.data.device.user_id,
    timestamp: loc.timestamp,
    created_at: loc.timestamp,
  }));
  
  return locations;
}
```

### Opción B: Actualizar Backend (Más consistente)

1. **Actualizar migración y modelo Device:**
- Cambiar columna `serial` → `serial_number`
- Cambiar status a inglés: `activo` → `active`, etc.

2. **Actualizar `LocationController.php`:**
```php
public function history(Request $request) {
    // ... validación ...
    
    $locations = GpsLog::where('device_id', $request->device_id)
        ->whereBetween('timestamp', [$request->start_date, $request->end_date])
        ->orderBy('timestamp', 'asc')
        ->limit($request->limit ?? 1000)
        ->get();

    return response()->json([
        'data' => $locations->map(fn($loc) => [
            'id' => $loc->id,
            'latitude' => $loc->latitude,
            'longitude' => $loc->longitude,
            'accuracy' => $loc->accuracy,
            'speed' => $loc->speed,
            'device_id' => $loc->device_id,
            'user_id' => $loc->user_id,
            'timestamp' => $loc->timestamp,
            'created_at' => $loc->created_at,
        ])
    ]);
}
```

---

## ✅ RECOMENDACIÓN

**Actualizar el FRONTEND** porque:
1. Es más rápido (no requiere migraciones de BD)
2. El backend ya tiene datos en español
3. Menos riesgo de romper datos existentes
4. Solo requiere cambios en TypeScript y componentes

**Pasos siguientes:**
1. Actualizar types/index.ts
2. Actualizar DevicesManagement.vue
3. Crear helpers de traducción
4. Actualizar locationsService.ts para transformar respuesta
5. Probar todos los endpoints

