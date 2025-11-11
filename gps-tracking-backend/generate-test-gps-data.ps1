# Script para generar datos GPS de prueba
# Ejecutar: .\generate-test-gps-data.ps1

$baseUrl = "http://localhost:8000/api"

# Login como empleado
Write-Host "Iniciando sesion como empleado..." -ForegroundColor Cyan
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{
    email = "juan@gps.com"
    password = "empleado123"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.token
Write-Host "Token obtenido exitosamente" -ForegroundColor Green

# Coordenadas de una ruta de ejemplo en Lima, Peru
$route = @(
    @{ lat = -12.046374; lng = -77.042793 },
    @{ lat = -12.047123; lng = -77.043456 },
    @{ lat = -12.048234; lng = -77.044567 },
    @{ lat = -12.049345; lng = -77.045678 },
    @{ lat = -12.050456; lng = -77.046789 },
    @{ lat = -12.051567; lng = -77.047890 },
    @{ lat = -12.052678; lng = -77.048901 },
    @{ lat = -12.053789; lng = -77.049012 },
    @{ lat = -12.054890; lng = -77.050123 },
    @{ lat = -12.055901; lng = -77.051234 },
    @{ lat = -12.056012; lng = -77.052345 },
    @{ lat = -12.057123; lng = -77.053456 },
    @{ lat = -12.058234; lng = -77.054567 },
    @{ lat = -12.059345; lng = -77.055678 },
    @{ lat = -12.060456; lng = -77.056789 }
)

Write-Host ""
Write-Host "Enviando $($route.Count) ubicaciones GPS..." -ForegroundColor Cyan

$count = 0
foreach ($point in $route) {
    $count++
    
    $gpsData = @{
        device_id = 1
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
Write-Host "Datos GPS de prueba generados exitosamente!" -ForegroundColor Green
Write-Host "Total de puntos enviados: $count" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora puedes:" -ForegroundColor Yellow
Write-Host "  1. Ir a http://localhost:5173/admin/history" -ForegroundColor White
Write-Host "  2. Seleccionar Movil Juan" -ForegroundColor White
Write-Host "  3. Elegir fecha de hoy" -ForegroundColor White
Write-Host "  4. Clic en Buscar" -ForegroundColor White
Write-Host "  5. Ver la ruta en el mapa" -ForegroundColor White
