# 🧪 Checkpoints de Prueba - GPS Tracking

Ejemplos de checkpoints que puedes crear para probar el sistema.

## 📍 Checkpoints en Lima, Perú

### 1. Plaza de Armas (Centro de Lima)
```
Nombre: Plaza de Armas
Latitud: -12.046374
Longitud: -77.042793
Radio: 100m
Color: #C0F11C (Verde neón)
```

### 2. Parque Kennedy (Miraflores)
```
Nombre: Parque Kennedy
Latitud: -12.121111
Longitud: -77.030833
Radio: 80m
Color: #00D9FF (Cyan)
```

### 3. Larcomar (Malecón)
```
Nombre: Larcomar
Latitud: -12.132222
Longitud: -77.021667
Radio: 150m
Color: #FF00FF (Magenta)
```

### 4. Aeropuerto Jorge Chávez
```
Nombre: Aeropuerto
Latitud: -12.021944
Longitud: -77.114444
Radio: 500m
Color: #FFD700 (Dorado)
```

### 5. Estadio Nacional
```
Nombre: Estadio Nacional
Latitud: -12.067778
Longitud: -77.033056
Radio: 200m
Color: #FF6B6B (Rojo coral)
```

## 🏢 Ejemplo: Ruta de Oficinas

### Oficina Central
```
Nombre: Oficina Central
Latitud: -12.046374
Longitud: -77.042793
Radio: 50m
Color: #C0F11C
Estado: Activo
```

### Sucursal Norte
```
Nombre: Sucursal Norte  
Latitud: -12.000000
Longitud: -77.050000
Radio: 50m
Color: #4ECDC4
Estado: Activo
```

### Sucursal Sur
```
Nombre: Sucursal Sur
Latitud: -12.100000
Longitud: -77.040000
Radio: 50m
Color: #95E1D3
Estado: Activo
```

## 🚚 Ejemplo: Ruta de Delivery

### Almacén
```
Nombre: Almacén Central
Latitud: -12.046374
Longitud: -77.042793
Radio: 100m
Color: #C0F11C
```

### Cliente 1
```
Nombre: Cliente 1 - Centro
Latitud: -12.050000
Longitud: -77.045000
Radio: 50m
Color: #00D9FF
```

### Cliente 2
```
Nombre: Cliente 2 - Miraflores
Latitud: -12.121111
Longitud: -77.030833
Radio: 50m
Color: #FF00FF
```

### Cliente 3
```
Nombre: Cliente 3 - San Isidro
Latitud: -12.095000
Longitud: -77.035000
Radio: 50m
Color: #FFD700
```

### Punto de Retorno
```
Nombre: Punto de Retorno
Latitud: -12.046374
Longitud: -77.042793
Radio: 100m
Color: #FFA500
```

## 🎯 Cómo Probar

### Método 1: Crear Manualmente
1. Ir a Dashboard Admin
2. Clic en "Checkpoints (0)"
3. Clic en "+"
4. Copiar y pegar los datos de arriba
5. Crear checkpoint

### Método 2: Script de Consola
Abre la consola del navegador y ejecuta:

```javascript
// Importar el composable (si no está disponible, ir a la página del dashboard)
const checkpoints = [
  {
    name: "Plaza de Armas",
    latitude: -12.046374,
    longitude: -77.042793,
    radius: 100,
    color: "#C0F11C",
    active: true
  },
  {
    name: "Parque Kennedy",
    latitude: -12.121111,
    longitude: -77.030833,
    radius: 80,
    color: "#00D9FF",
    active: true
  },
  {
    name: "Larcomar",
    latitude: -12.132222,
    longitude: -77.021667,
    radius: 150,
    color: "#FF00FF",
    active: true
  }
];

// Guardar en localStorage
localStorage.setItem('gps_checkpoints', JSON.stringify(
  checkpoints.map(cp => ({
    ...cp,
    id: `cp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  }))
));

// Recargar la página
location.reload();
```

## 📊 Configuraciones Recomendadas por Uso

### Control de Asistencia (Oficina)
- **Radio**: 30-50m (preciso)
- **Color**: Verde neón (#C0F11C)
- **Activo**: Sí

### Delivery/Logística
- **Radio**: 50-100m (flexible)
- **Color**: Variado (un color por parada)
- **Activo**: Sí (toda la ruta)

### Zonas de Seguridad
- **Radio**: 200-500m (amplio)
- **Color**: Azul (#00D9FF) o Turquesa (#4ECDC4)
- **Activo**: Sí

### Puntos de Interés
- **Radio**: 100-200m (moderado)
- **Color**: Magenta (#FF00FF) o Dorado (#FFD700)
- **Activo**: Según necesidad

## 🔍 Verificación de Detección

### Para probar si la detección funciona:

1. **Crear un checkpoint** en una ubicación conocida
2. **Simular una ubicación** cercana en el backend o app
3. **Ver la consola** del navegador para el mensaje:
   ```
   🎯 ¡Usuario llegó al checkpoint "Nombre"!
   ```

### Coordenadas de prueba cercanas a Plaza de Armas:
```
Dentro del radio:
- Lat: -12.046400, Lng: -77.042800 (≈30m)
- Lat: -12.046500, Lng: -77.042900 (≈50m)

Fuera del radio:
- Lat: -12.050000, Lng: -77.050000 (≈500m+)
```

## 🎨 Guía de Colores

| Color | Hex | Uso Recomendado |
|-------|-----|----------------|
| Verde neón | #C0F11C | Punto de inicio/fin, oficinas principales |
| Cyan | #00D9FF | Zonas de seguridad, checkpoints secundarios |
| Magenta | #FF00FF | Puntos importantes, clientes VIP |
| Dorado | #FFD700 | Objetivos especiales, metas |
| Rojo coral | #FF6B6B | Alertas, zonas restringidas |
| Turquesa | #4ECDC4 | Puntos de descanso, áreas comunes |
| Mint | #95E1D3 | Rutas alternativas, opcionales |
| Naranja | #FFA500 | Puntos de retorno, finalizaciones |

## 💡 Tips

- **Radio pequeño (10-50m)**: Para checkpoints precisos (oficinas, puertas)
- **Radio medio (50-200m)**: Para zonas generales (edificios, parques)
- **Radio grande (200-1000m)**: Para áreas amplias (campus, aeropuertos)

- **Checkpoints activos**: Solo se verifican los que están activos
- **Colores únicos**: Usa diferentes colores para identificar fácilmente cada tipo

## 🚦 Estado de Checkpoints

### Activo ✅
- Se muestra en el mapa
- Se verifica en tiempo real
- Aparece en la lista con 100% opacidad

### Inactivo ❌
- No se muestra en el mapa
- No se verifica
- Aparece en la lista con 50% opacidad (gris)

---

**¡Prueba diferentes configuraciones y encuentra la mejor para tu caso de uso! 🎯**
