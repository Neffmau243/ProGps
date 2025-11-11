<?php

namespace App\Http\Middleware;

use App\Models\Device;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckDeviceOwnership
{
    public function handle(Request $request, Closure $next): Response
    {
        $deviceId = $request->input('device_id') ?? $request->route('id');

        if (!$deviceId) {
            return response()->json([
                'message' => 'ID de dispositivo no proporcionado'
            ], 400);
        }

        $device = Device::find($deviceId);

        if (!$device) {
            return response()->json([
                'message' => 'Dispositivo no encontrado'
            ], 404);
        }

        if ($device->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Este dispositivo no te pertenece'
            ], 403);
        }

        return $next($request);
    }
}
