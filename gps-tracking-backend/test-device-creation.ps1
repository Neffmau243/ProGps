# Script para probar la creación de dispositivos
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  PRUEBA DE CREACION DE DISPOSITIVO" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Login como admin
Write-Host "[1/2] Iniciando sesion como admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@example.com"
    password = "password"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.token
Write-Host "Token obtenido exitosamente" -ForegroundColor Green
Write-Host ""

# Crear dispositivo SIN usuario
Write-Host "[2/2] Creando dispositivo sin usuario..." -ForegroundColor Yellow
$deviceBody = @{
    name = "Dispositivo Test $(Get-Date -Format 'HHmmss')"
    serial = "TEST-$(Get-Random -Minimum 1000 -Maximum 9999)"
    status = "activo"
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Accept" = "application/json"
    }
    
    $deviceResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/devices" -Method POST -Headers $headers -ContentType "application/json" -Body $deviceBody
    
    Write-Host "Dispositivo creado exitosamente:" -ForegroundColor Green
    Write-Host "  ID: $($deviceResponse.id)" -ForegroundColor Cyan
    Write-Host "  Nombre: $($deviceResponse.name)" -ForegroundColor Cyan
    Write-Host "  Serial: $($deviceResponse.serial)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "Error al crear dispositivo:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
}

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Prueba desde el frontend:" -ForegroundColor White
Write-Host "http://localhost:5173/admin/devices" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
