<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ProcessGpsLocation;
use App\Models\Device;
use Illuminate\Http\Request;

class GpsController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'device_id' => 'required|exists:devices,id',
            'latitude' => 'required|numeric|min:-90|max:90',
            'longitude' => 'required|numeric|min:-180|max:180',
            'accuracy' => 'nullable|numeric|min:0',
        ]);

        $device = Device::findOrFail($request->device_id);

        // Verificar que el dispositivo pertenece al usuario
        if ($device->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Este dispositivo no te pertenece'
            ], 403);
        }

        // Verificar que el dispositivo está activo
        if ($device->status !== 'activo') {
            return response()->json([
                'message' => 'El dispositivo no está activo'
            ], 400);
        }

        // Encolar el job para procesamiento asíncrono
        ProcessGpsLocation::dispatch([
            'user_id' => $request->user()->id,
            'device_id' => $request->device_id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'accuracy' => $request->accuracy,
            'timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Ubicación recibida y en proceso'
        ], 202);
    }
}
