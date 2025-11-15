<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CheckpointController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\GpsController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/auth/login', [AuthController::class, 'login']);

// Rutas protegidas con autenticación
Route::middleware('auth:sanctum')->group(function () {
    
    // Autenticación
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // GPS - Registro de ubicaciones (empleados)
    Route::post('/gps', [GpsController::class, 'store']);

    // Dispositivos
    Route::get('/devices', [DeviceController::class, 'index']);
    Route::get('/devices/{id}', [DeviceController::class, 'show']);

    // Rutas solo para administradores
    Route::middleware('role:admin')->group(function () {
        
        // Gestión de usuarios
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);

        // Gestión de dispositivos
        Route::post('/devices', [DeviceController::class, 'store']);
        Route::put('/devices/{id}', [DeviceController::class, 'update']);
        Route::delete('/devices/{id}', [DeviceController::class, 'destroy']);
        Route::patch('/devices/{id}/status', [DeviceController::class, 'updateStatus']);

        // Consulta de ubicaciones
        Route::get('/locations/current', [LocationController::class, 'current']);
        Route::get('/locations/history', [LocationController::class, 'history']);

        // Gestión de checkpoints
        Route::get('/checkpoints', [CheckpointController::class, 'index']);
        Route::get('/checkpoints/active', [CheckpointController::class, 'active']);
        Route::post('/checkpoints', [CheckpointController::class, 'store']);
        Route::get('/checkpoints/{id}', [CheckpointController::class, 'show']);
        Route::put('/checkpoints/{id}', [CheckpointController::class, 'update']);
        Route::patch('/checkpoints/{id}/toggle', [CheckpointController::class, 'toggleStatus']);
        Route::delete('/checkpoints/{id}', [CheckpointController::class, 'destroy']);
        Route::post('/checkpoints/check-location', [CheckpointController::class, 'checkLocation']);
    });
});
