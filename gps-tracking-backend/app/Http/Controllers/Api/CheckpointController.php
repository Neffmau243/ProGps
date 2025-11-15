<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Checkpoint;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class CheckpointController extends Controller
{
    /**
     * Display a listing of checkpoints.
     * Solo muestra checkpoints del admin autenticado.
     */
    public function index(): JsonResponse
    {
        $checkpoints = Checkpoint::forUser(Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $checkpoints
        ]);
    }

    /**
     * Display a listing of active checkpoints.
     * Usado para verificar ubicaciones en tiempo real.
     */
    public function active(): JsonResponse
    {
        $checkpoints = Checkpoint::forUser(Auth::id())
            ->active()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $checkpoints
        ]);
    }

    /**
     * Store a newly created checkpoint.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'required|integer|min:10|max:10000',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'active' => 'boolean'
        ]);

        $checkpoint = Checkpoint::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'radius' => $validated['radius'],
            'color' => $validated['color'],
            'active' => $validated['active'] ?? true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Checkpoint creado exitosamente',
            'data' => $checkpoint
        ], 201);
    }

    /**
     * Display the specified checkpoint.
     */
    public function show(string $id): JsonResponse
    {
        $checkpoint = Checkpoint::forUser(Auth::id())->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $checkpoint
        ]);
    }

    /**
     * Update the specified checkpoint.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $checkpoint = Checkpoint::forUser(Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'latitude' => 'sometimes|required|numeric|between:-90,90',
            'longitude' => 'sometimes|required|numeric|between:-180,180',
            'radius' => 'sometimes|required|integer|min:10|max:10000',
            'color' => 'sometimes|required|string|regex:/^#[0-9A-Fa-f]{6}$/',
            'active' => 'boolean'
        ]);

        $checkpoint->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Checkpoint actualizado exitosamente',
            'data' => $checkpoint->fresh()
        ]);
    }

    /**
     * Toggle checkpoint active status.
     */
    public function toggleStatus(string $id): JsonResponse
    {
        $checkpoint = Checkpoint::forUser(Auth::id())->findOrFail($id);
        
        $checkpoint->active = !$checkpoint->active;
        $checkpoint->save();

        return response()->json([
            'success' => true,
            'message' => $checkpoint->active 
                ? 'Checkpoint activado exitosamente' 
                : 'Checkpoint desactivado exitosamente',
            'data' => $checkpoint
        ]);
    }

    /**
     * Remove the specified checkpoint.
     */
    public function destroy(string $id): JsonResponse
    {
        $checkpoint = Checkpoint::forUser(Auth::id())->findOrFail($id);
        $checkpoint->delete();

        return response()->json([
            'success' => true,
            'message' => 'Checkpoint eliminado exitosamente'
        ]);
    }

    /**
     * Check if a location is within any active checkpoint.
     */
    public function checkLocation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $activeCheckpoints = Checkpoint::forUser(Auth::id())
            ->active()
            ->get();

        $matchedCheckpoints = [];

        foreach ($activeCheckpoints as $checkpoint) {
            if ($checkpoint->containsLocation($validated['latitude'], $validated['longitude'])) {
                $matchedCheckpoints[] = $checkpoint;
            }
        }

        return response()->json([
            'success' => true,
            'matched' => count($matchedCheckpoints) > 0,
            'data' => $matchedCheckpoints
        ]);
    }
}
