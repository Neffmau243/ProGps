<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $devices = Device::with('user')->get();
        } else {
            $devices = Device::where('user_id', $user->id)->get();
        }

        return response()->json($devices);
    }

    public function show(Request $request, $id)
    {
        $device = Device::with('user')->findOrFail($id);

        // Verificar permisos
        if (!$request->user()->isAdmin() && $device->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'No tienes permisos para ver este dispositivo'
            ], 403);
        }

        return response()->json($device);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'serial' => 'required|string|unique:devices,serial',
            'status' => 'sometimes|in:activo,inactivo,mantenimiento',
        ]);

        // Establecer valores por defecto
        $validated['status'] = $validated['status'] ?? 'activo';

        $device = Device::create($validated);

        return response()->json($device->load('user'), 201);
    }

    public function update(Request $request, $id)
    {
        $device = Device::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'sometimes|string|max:255',
            'serial' => 'sometimes|string|unique:devices,serial,' . $id,
            'status' => 'sometimes|in:activo,inactivo,mantenimiento',
        ]);

        $device->update($validated);

        return response()->json($device->load('user'));
    }

    public function destroy($id)
    {
        $device = Device::findOrFail($id);
        $device->delete();

        return response()->json([
            'message' => 'Dispositivo eliminado exitosamente'
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $device = Device::findOrFail($id);

        $request->validate([
            'status' => 'required|in:activo,inactivo,mantenimiento',
        ]);

        $device->update(['status' => $request->status]);

        return response()->json($device);
    }
}
