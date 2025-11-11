# Script para insertar usuarios y dispositivos de prueba
# Ejecutar: .\seed-test-data.ps1

$baseUrl = "http://localhost:8000/api"

Write-Host "Iniciando sesion como admin..." -ForegroundColor Cyan
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body (@{
    email = "admin@gps.com"
    password = "admin123"
} | ConvertTo-Json) -ContentType "application/json"

$token = $loginResponse.token
Write-Host "Token obtenido exitosamente" -ForegroundColor Green
Write-Host ""

# Crear usuarios empleados
Write-Host "Creando usuarios empleados..." -ForegroundColor Cyan

$usuarios = @(
    @{ name = "Maria Garcia"; email = "maria@gps.com"; password = "empleado123"; role_id = 2 },
    @{ name = "Carlos Lopez"; email = "carlos@gps.com"; password = "empleado123"; role_id = 2 },
    @{ name = "Ana Martinez"; email = "ana@gps.com"; password = "empleado123"; role_id = 2 },
    @{ name = "Pedro Sanchez"; email = "pedro@gps.com"; password = "empleado123"; role_id = 2 },
    @{ name = "Sofia Rodriguez"; email = "sofia@gps.com"; password = "empleado123"; role_id = 2 }
)

$userIds = @()

foreach ($usuario in $usuarios) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/users" -Method Post `
            -Headers @{ "Authorization" = "Bearer $token" } `
            -Body ($usuario | ConvertTo-Json) `
            -ContentType "application/json"
        
        $userIds += $response.id
        Write-Host "  OK - Usuario creado: $($usuario.name) (ID: $($response.id))" -ForegroundColor Green
    }
    catch {
        Write-Host "  ERROR - No se pudo crear: $($usuario.name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Creando dispositivos..." -ForegroundColor Cyan

# Crear dispositivos para cada usuario
$dispositivos = @(
    @{ name = "Movil Maria"; serial = "DEV002"; user_id = $userIds[0]; status = "activo" },
    @{ name = "Tablet Carlos"; serial = "DEV003"; user_id = $userIds[1]; status = "activo" },
    @{ name = "Movil Ana"; serial = "DEV004"; user_id = $userIds[2]; status = "activo" },
    @{ name = "GPS Pedro"; serial = "DEV005"; user_id = $userIds[3]; status = "activo" },
    @{ name = "Tablet Sofia"; serial = "DEV006"; user_id = $userIds[4]; status = "activo" },
    @{ name = "GPS Vehiculo 1"; serial = "VEH001"; user_id = $userIds[0]; status = "activo" },
    @{ name = "GPS Vehiculo 2"; serial = "VEH002"; user_id = $userIds[1]; status = "mantenimiento" }
)

foreach ($dispositivo in $dispositivos) {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/devices" -Method Post `
            -Headers @{ "Authorization" = "Bearer $token" } `
            -Body ($dispositivo | ConvertTo-Json) `
            -ContentType "application/json"
        
        Write-Host "  OK - Dispositivo creado: $($dispositivo.name) (Serial: $($dispositivo.serial))" -ForegroundColor Green
    }
    catch {
        Write-Host "  ERROR - No se pudo crear: $($dispositivo.name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Datos de prueba insertados exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Resumen:" -ForegroundColor Yellow
Write-Host "  - 5 usuarios empleados creados" -ForegroundColor White
Write-Host "  - 7 dispositivos creados" -ForegroundColor White
Write-Host ""
Write-Host "Credenciales de acceso:" -ForegroundColor Yellow
Write-Host "  maria@gps.com / empleado123" -ForegroundColor White
Write-Host "  carlos@gps.com / empleado123" -ForegroundColor White
Write-Host "  ana@gps.com / empleado123" -ForegroundColor White
Write-Host "  pedro@gps.com / empleado123" -ForegroundColor White
Write-Host "  sofia@gps.com / empleado123" -ForegroundColor White
Write-Host ""
Write-Host "Ahora puedes:" -ForegroundColor Cyan
Write-Host "  1. Ver usuarios en http://localhost:5173/admin/users" -ForegroundColor White
Write-Host "  2. Ver dispositivos en http://localhost:5173/admin/devices" -ForegroundColor White
Write-Host "  3. Asignar dispositivos a usuarios" -ForegroundColor White
Write-Host "  4. Hacer login con cualquier empleado" -ForegroundColor White
