# Generar datos GPS para Maria
# Ejecutar: .\generate-maria-gps.ps1

$baseUrl = "http://localhost:8000/api"

Write-Host "Iniciando sesion como Maria..." -ForegroundColor Cyan
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{
    email = "maria@gps.com"
    password = "empleado123"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.token
Write-Host "Token obtenido exitosamente" -ForegroundColor Green

# Ruta diferente para Maria (zona Miraflores, Lima)
$route = @(
    @{ lat = -12.120000; lng = -77.030000 },
    @{ lat = -12.121000; lng = -77.031000 },
    @{ lat = -12.122000; lng = -77.032000 },
    @{ lat = -12.123000; lng = -77.033000 },
    @{ lat = -12.124000; lng = -77.034000 },
    @{ lat = -12.125000; lng = -77.035000 },
    @{ lat = -12.126000; lng = -77.036000 },
    @{ lat = -12.127000; lng = -77.037000 },
    @{ lat = -12.128000; lng = -77.038000 },
    @{ lat = -12.129000; lng = -77.039000 }
)

Write-Host ""
Write-Host "Enviando $($route.Count) ubicaciones GPS para Maria..." -ForegroundColor Cyan

$count = 0
foreach ($point in $route) {
    $count++
    
    $gpsData = @{
        device_id = 3
        latitude = $point.lat
        longitude = $point.lng
        accuracy = Get-Random -Minimum 5 -Maximum 20
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/gps" -Method Post `
            -Headers @{ "Authorization" = "Bearer $token" } `
            -Body $gpsData `
            -ContentType "application/json"
        
        Write-Host "  OK - Punto $count de $($route.Count): ($($point.lat), $($point.lng))" -ForegroundColor Green
        Start-Sleep -Milliseconds 500
    }
    catch {
        Write-Host "  ERROR en punto $count" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Datos GPS de Maria generados exitosamente!" -ForegroundColor Green
Write-Host "Total de puntos enviados: $count" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora:" -ForegroundColor Yellow
Write-Host "  1. Procesa la cola: php artisan queue:work --stop-when-empty" -ForegroundColor White
Write-Host "  2. Ve a http://localhost:5173/admin/history" -ForegroundColor White
Write-Host "  3. Selecciona Movil Maria" -ForegroundColor White
Write-Host "  4. Ver la ruta en el mapa" -ForegroundColor White
