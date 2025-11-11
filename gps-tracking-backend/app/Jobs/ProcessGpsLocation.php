<?php

namespace App\Jobs;

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
            GpsLog::create($this->data);

            Log::info('Ubicación GPS guardada exitosamente', [
                'device_id' => $this->data['device_id'],
                'user_id' => $this->data['user_id'],
            ]);

            // Aquí se puede agregar broadcast para tiempo real
            // broadcast(new LocationUpdated($this->data));

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
