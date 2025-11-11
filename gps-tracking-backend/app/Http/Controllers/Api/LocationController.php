<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\GpsLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LocationController extends Controller
{
    public function current()
    {
        $locations = Device::with(['user', 'latestLocation'])
            ->where('status', 'activo')
            ->get()
            ->filter(fn($device) => $device->latestLocation)
            ->map(function ($device) {
                $location = $device->latestLocation;
                return [
                    'device_id' => $device->id,
                    'device_name' => $device->name,
                    'device_serial' => $device->serial,
                    'user_id' => $device->user->id,
                    'user_name' => $device->user->name,
                    'latitude' => $location->latitude,
                    'longitude' => $location->longitude,
                    'accuracy' => $location->accuracy,
                    'timestamp' => $location->timestamp,
                    'minutes_ago' => $location->timestamp->diffInMinutes(now()),
                ];
            })
            ->values();

        return response()->json($locations);
    }

    public function history(Request $request)
    {
        $request->validate([
            'device_id' => 'required|exists:devices,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'limit' => 'sometimes|integer|max:1000',
        ]);

        // Validar rango máximo de 30 días
        $start = \Carbon\Carbon::parse($request->start_date);
        $end = \Carbon\Carbon::parse($request->end_date);

        if ($start->diffInDays($end) > 30) {
            return response()->json([
                'message' => 'El rango máximo permitido es de 30 días'
            ], 400);
        }

        $device = Device::with('user')->findOrFail($request->device_id);

        $locations = GpsLog::where('device_id', $request->device_id)
            ->whereBetween('timestamp', [$request->start_date, $request->end_date])
            ->orderBy('timestamp', 'asc')
            ->limit($request->limit ?? 1000)
            ->get();

        // Calcular estadísticas
        $statistics = [
            'total_points' => $locations->count(),
            'distance_km' => $this->calculateTotalDistance($locations),
            'duration_minutes' => $locations->count() > 0 
                ? $locations->first()->timestamp->diffInMinutes($locations->last()->timestamp)
                : 0,
        ];

        return response()->json([
            'device' => [
                'id' => $device->id,
                'name' => $device->name,
                'user_name' => $device->user->name,
            ],
            'locations' => $locations->map(fn($loc) => [
                'latitude' => $loc->latitude,
                'longitude' => $loc->longitude,
                'accuracy' => $loc->accuracy,
                'timestamp' => $loc->timestamp,
            ]),
            'statistics' => $statistics,
        ]);
    }

    private function calculateTotalDistance($locations)
    {
        if ($locations->count() < 2) {
            return 0;
        }

        $totalDistance = 0;
        for ($i = 0; $i < $locations->count() - 1; $i++) {
            $totalDistance += $this->haversineDistance(
                $locations[$i]->latitude,
                $locations[$i]->longitude,
                $locations[$i + 1]->latitude,
                $locations[$i + 1]->longitude
            );
        }

        return round($totalDistance, 2);
    }

    private function haversineDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // km

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
