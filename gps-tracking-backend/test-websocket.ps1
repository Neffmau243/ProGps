# Script para probar el sistema de WebSockets con Reverb
# Ejecutar desde: gps-tracking-backend/

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  PRUEBA DE WEBSOCKETS - REVERB  " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que Reverb esté configurado
Write-Host "[1/5] Verificando configuración..." -ForegroundColor Yellow
$envContent = Get-Content .env -Raw
if ($envContent -match "BROADCAST_CONNECTION=reverb") {
    Write-Host "✓ Broadcasting configurado correctamente" -ForegroundColor Green
} else {
    Write-Host "✗ Error: BROADCAST_CONNECTION no está configurado" -ForegroundColor Red
    exit 1
}

# Verificar archivos creados
Write-Host ""
Write-Host "[2/5] Verificando archivos..." -ForegroundColor Yellow
$files = @(
    "app/Events/LocationUpdated.php",
    "routes/channels.php",
    "config/broadcasting.php"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✓ $file existe" -ForegroundColor Green
    } else {
        Write-Host "✗ $file no encontrado" -ForegroundColor Red
    }
}

# Limpiar cache
Write-Host ""
Write-Host "[3/5] Limpiando cache..." -ForegroundColor Yellow
php artisan config:clear | Out-Null
php artisan cache:clear | Out-Null
Write-Host "✓ Cache limpiado" -ForegroundColor Green

# Verificar que el servidor Reverb esté corriendo
Write-Host ""
Write-Host "[4/5] Verificando servidor Reverb..." -ForegroundColor Yellow
$reverbPort = 8080
try {
    $connection = Test-NetConnection -ComputerName localhost -Port $reverbPort -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($connection.TcpTestSucceeded) {
        Write-Host "✓ Reverb está corriendo en puerto $reverbPort" -ForegroundColor Green
    } else {
        Write-Host "✗ Reverb NO está corriendo" -ForegroundColor Red
        Write-Host ""
        Write-Host "Para iniciar Reverb, ejecuta en otra terminal:" -ForegroundColor Yellow
        Write-Host "  php artisan reverb:start" -ForegroundColor Cyan
        Write-Host ""
    }
} catch {
    Write-Host "✗ No se pudo verificar el puerto" -ForegroundColor Red
    Write-Host "Para iniciar Reverb, ejecuta en otra terminal:" -ForegroundColor Yellow
    Write-Host "  php artisan reverb:start" -ForegroundColor Cyan
    Write-Host ""
}

# Verificar queue worker
Write-Host ""
Write-Host "[5/5] Verificando Queue Worker..." -ForegroundColor Yellow
Write-Host "⚠ Asegúrate de tener el queue worker corriendo:" -ForegroundColor Yellow
Write-Host "  php artisan queue:work" -ForegroundColor Cyan
Write-Host ""

# Resumen
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "         RESUMEN DEL SISTEMA      " -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para que el sistema funcione necesitas:" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 1: Servidor Laravel" -ForegroundColor Yellow
Write-Host "  php artisan serve" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 2: Servidor Reverb (WebSockets)" -ForegroundColor Yellow
Write-Host "  php artisan reverb:start" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 3: Queue Worker" -ForegroundColor Yellow
Write-Host "  php artisan queue:work" -ForegroundColor Cyan
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
