# ============================================
# Script de Prueba - API de Checkpoints
# ============================================
# Este script prueba todos los endpoints de checkpoints

$BASE_URL = "http://localhost:8000/api"
$TOKEN = "TU_TOKEN_AQUI" # Reemplazar con un token válido de admin

$headers = @{
    "Authorization" = "Bearer $TOKEN"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🧪 Pruebas API de Checkpoints" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Crear un checkpoint de prueba
Write-Host "1️⃣ Crear checkpoint..." -ForegroundColor Yellow
$newCheckpoint = @{
    name = "Checkpoint Test"
    description = "Checkpoint creado desde script de prueba"
    latitude = -16.382782
    longitude = -71.517853
    radius = 150
    color = "#C0F11C"
    active = $true
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/checkpoints" -Method Post -Headers $headers -Body $newCheckpoint
    $checkpointId = $response.data.id
    Write-Host "✅ Checkpoint creado: $checkpointId" -ForegroundColor Green
    Write-Host "   Nombre: $($response.data.name)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error al crear checkpoint: $_" -ForegroundColor Red
    exit
}

# 2. Listar todos los checkpoints
Write-Host "2️⃣ Listar checkpoints..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/checkpoints" -Method Get -Headers $headers
    Write-Host "✅ Checkpoints encontrados: $($response.data.Count)" -ForegroundColor Green
    foreach ($cp in $response.data) {
        Write-Host "   - $($cp.name) (ID: $($cp.id))" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error al listar checkpoints: $_" -ForegroundColor Red
}

# 3. Obtener checkpoint específico
Write-Host "3️⃣ Obtener checkpoint por ID..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/checkpoints/$checkpointId" -Method Get -Headers $headers
    Write-Host "✅ Checkpoint obtenido: $($response.data.name)" -ForegroundColor Green
    Write-Host "   Latitud: $($response.data.latitude)" -ForegroundColor Gray
    Write-Host "   Longitud: $($response.data.longitude)" -ForegroundColor Gray
    Write-Host "   Radio: $($response.data.radius)m" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error al obtener checkpoint: $_" -ForegroundColor Red
}

# 4. Actualizar checkpoint
Write-Host "4️⃣ Actualizar checkpoint..." -ForegroundColor Yellow
$updateData = @{
    name = "Checkpoint Test Actualizado"
    radius = 200
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/checkpoints/$checkpointId" -Method Put -Headers $headers -Body $updateData
    Write-Host "✅ Checkpoint actualizado: $($response.data.name)" -ForegroundColor Green
    Write-Host "   Nuevo radio: $($response.data.radius)m" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error al actualizar checkpoint: $_" -ForegroundColor Red
}

# 5. Toggle status
Write-Host "5️⃣ Desactivar checkpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/checkpoints/$checkpointId/toggle" -Method Patch -Headers $headers
    $status = if ($response.data.active) { "Activo" } else { "Inactivo" }
    Write-Host "✅ Estado cambiado: $status" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error al cambiar estado: $_" -ForegroundColor Red
}

# 6. Listar solo activos
Write-Host "6️⃣ Listar checkpoints activos..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/checkpoints/active" -Method Get -Headers $headers
    Write-Host "✅ Checkpoints activos: $($response.data.Count)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error al listar activos: $_" -ForegroundColor Red
}

# 7. Verificar ubicación
Write-Host "7️⃣ Verificar ubicación..." -ForegroundColor Yellow
$locationCheck = @{
    latitude = -16.382782
    longitude = -71.517853
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/checkpoints/check-location" -Method Post -Headers $headers -Body $locationCheck
    $matched = if ($response.matched) { "SÍ" } else { "NO" }
    Write-Host "✅ ¿Ubicación en checkpoint?: $matched" -ForegroundColor Green
    if ($response.matched) {
        Write-Host "   Checkpoints encontrados: $($response.data.Count)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error al verificar ubicación: $_" -ForegroundColor Red
}

# 8. Eliminar checkpoint
Write-Host "8️⃣ Eliminar checkpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/checkpoints/$checkpointId" -Method Delete -Headers $headers
    Write-Host "✅ Checkpoint eliminado exitosamente" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ Error al eliminar checkpoint: $_" -ForegroundColor Red
}

# Verificar eliminación
Write-Host "9️⃣ Verificar eliminación..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/checkpoints/$checkpointId" -Method Get -Headers $headers
    Write-Host "⚠️ El checkpoint aún existe (no debería)" -ForegroundColor Yellow
} catch {
    Write-Host "✅ Checkpoint eliminado correctamente (404 esperado)" -ForegroundColor Green
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ Pruebas completadas" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
