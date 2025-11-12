<?php

namespace App\Jobs;

use App\Events\LocationUpdated;
use App\Models\Device;
use App\Models\GpsLog;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessGpsLocation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $backoff = [10, 30, 60];

    protected $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function handle(): void
    {
        try {
            // Guardar ubicación en la base de datos
            $gpsLog = GpsLog::create($this->data);

            Log::info('Ubicación GPS guardada exitosamente', [
                'device_id' => $this->data['device_id'],
                'user_id' => $this->data['user_id'],
            ]);

            // Obtener información del dispositivo y usuario para el broadcast
            $device = Device::with('user')->find($this->data['device_id']);

            if ($device && $device->user) {
                // Emitir evento en tiempo real vía WebSocket
                broadcast(new LocationUpdated(
                    deviceId: $device->id,
                    latitude: (float) $this->data['latitude'],
                    longitude: (float) $this->data['longitude'],
                    accuracy: (float) $this->data['accuracy'],
                    userName: $device->user->name,
                    deviceName: $device->name,
                    timestamp: $this->data['timestamp']
                ));

                Log::info('Evento LocationUpdated emitido', [
                    'device_id' => $device->id,
                    'device_name' => $device->name,
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Error al guardar ubicación GPS', [
                'error' => $e->getMessage(),
                'data' => $this->data,
            ]);
            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Job ProcessGpsLocation falló después de todos los intentos', [
            'error' => $exception->getMessage(),
            'data' => $this->data,
        ]);
    }
}
