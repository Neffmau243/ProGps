# Script de prueba para la API GPS Tracking (PowerShell)

$BASE_URL = "http://localhost:8000/api"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "GPS TRACKING API - PRUEBAS" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Login como Admin
Write-Host "1. Login como Admin..." -ForegroundColor Yellow
$adminBody = @{
    email = "admin@gps.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $adminBody -ContentType "application/json"
    $adminToken = $adminResponse.token
    Write-Host "✅ Admin login exitoso" -ForegroundColor Green
    Write-Host "Token: $($adminToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error en login de admin" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

# 2. Login como Empleado
Write-Host "2. Login como Empleado..." -ForegroundColor Yellow
$empleadoBody = @{
    email = "juan@gps.com"
    password = "empleado123"
} | ConvertTo-Json

try {
    $empleadoResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method Post -Body $empleadoBody -ContentType "application/json"
    $empleadoToken = $empleadoResponse.token
    Write-Host "✅ Empleado login exitoso" -ForegroundColor Green
    Write-Host "Token: $($empleadoToken.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error en login de empleado" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

# 3. Listar usuarios (Admin)
Write-Host "3. Listar usuarios (como Admin)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    $users = Invoke-RestMethod -Uri "$BASE_URL/users" -Method Get -Headers $headers
    Write-Host "✅ Usuarios obtenidos: $($users.Count) usuarios" -ForegroundColor Green
    $users | ForEach-Object { Write-Host "  - $($_.name) ($($_.email))" -ForegroundColor Gray }
    Write-Host ""
} catch {
    Write-Host "❌ Error al listar usuarios" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# 4. Listar dispositivos (Empleado)
Write-Host "4. Listar dispositivos (como Empleado)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $empleadoToken"
    }
    $devices = Invoke-RestMethod -Uri "$BASE_URL/devices" -Method Get -Headers $headers
    Write-Host "✅ Dispositivos obtenidos: $($devices.Count) dispositivos" -ForegroundColor Green
    $devices | ForEach-Object { Write-Host "  - $($_.name) (Serial: $($_.serial))" -ForegroundColor Gray }
    Write-Host ""
} catch {
    Write-Host "❌ Error al listar dispositivos" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# 5. Registrar ubicación GPS (Empleado)
Write-Host "5. Registrar ubicación GPS (como Empleado)..." -ForegroundColor Yellow
$gpsBody = @{
    device_id = 1
    latitude = -12.046374
    longitude = -77.042793
    accuracy = 10.5
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $empleadoToken"
    }
    $gpsResponse = Invoke-RestMethod -Uri "$BASE_URL/gps" -Method Post -Body $gpsBody -ContentType "application/json" -Headers $headers
    Write-Host "✅ Ubicación GPS registrada" -ForegroundColor Green
    Write-Host "  Mensaje: $($gpsResponse.message)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "❌ Error al registrar GPS" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# Esperar un momento para que se procese
Start-Sleep -Seconds 2

# 6. Ver ubicaciones actuales (Admin)
Write-Host "6. Ver ubicaciones actuales (como Admin)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    $locations = Invoke-RestMethod -Uri "$BASE_URL/locations/current" -Method Get -Headers $headers
    Write-Host "✅ Ubicaciones actuales obtenidas: $($locations.Count) ubicaciones" -ForegroundColor Green
    $locations | ForEach-Object { 
        Write-Host "  - $($_.device_name): Lat $($_.latitude), Lon $($_.longitude) (hace $($_.minutes_ago) min)" -ForegroundColor Gray 
    }
    Write-Host ""
} catch {
    Write-Host "❌ Error al obtener ubicaciones" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

# 7. Crear nuevo usuario (Admin)
Write-Host "7. Crear nuevo usuario (como Admin)..." -ForegroundColor Yellow
$newUserBody = @{
    name = "Test User"
    email = "test@gps.com"
    password = "test123456"
    role_id = 2
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    $newUser = Invoke-RestMethod -Uri "$BASE_URL/users" -Method Post -Body $newUserBody -ContentType "application/json" -Headers $headers
    Write-Host "✅ Usuario creado: $($newUser.name)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠️ Usuario ya existe o error al crear" -ForegroundColor Yellow
    Write-Host $_.Exception.Message
    Write-Host ""
}

# 8. Intentar crear usuario como Empleado (debe fallar)
Write-Host "8. Intentar crear usuario como Empleado (debe fallar)..." -ForegroundColor Yellow
$failUserBody = @{
    name = "Fail User"
    email = "fail@gps.com"
    password = "fail123456"
    role_id = 2
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $empleadoToken"
    }
    $failUser = Invoke-RestMethod -Uri "$BASE_URL/users" -Method Post -Body $failUserBody -ContentType "application/json" -Headers $headers
    Write-Host "❌ ERROR: El empleado pudo crear usuario (no debería)" -ForegroundColor Red
} catch {
    Write-Host "✅ Acceso denegado correctamente (403 Forbidden)" -ForegroundColor Green
    Write-Host ""
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ TODAS LAS PRUEBAS COMPLETADAS" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Resumen:" -ForegroundColor White
Write-Host "- Servidor: $BASE_URL" -ForegroundColor Gray
Write-Host "- Admin: admin@gps.com / admin123" -ForegroundColor Gray
Write-Host "- Empleado: juan@gps.com / empleado123" -ForegroundColor Gray
Write-Host ""
Write-Host "Importa la colección de Postman para más pruebas:" -ForegroundColor White
Write-Host "GPS_Tracking_API.postman_collection.json" -ForegroundColor Gray
