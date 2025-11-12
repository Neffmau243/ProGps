<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LocationUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $deviceId;
    public float $latitude;
    public float $longitude;
    public float $accuracy;
    public string $userName;
    public string $deviceName;
    public string $timestamp;

    public function __construct(
        int $deviceId,
        float $latitude,
        float $longitude,
        float $accuracy,
        string $userName,
        string $deviceName,
        string $timestamp
    ) {
        $this->deviceId = $deviceId;
        $this->latitude = $latitude;
        $this->longitude = $longitude;
        $this->accuracy = $accuracy;
        $this->userName = $userName;
        $this->deviceName = $deviceName;
        $this->timestamp = $timestamp;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('locations'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'LocationUpdated';
    }

    public function broadcastWith(): array
    {
        return [
            'deviceId' => $this->deviceId,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'accuracy' => $this->accuracy,
            'userName' => $this->userName,
            'deviceName' => $this->deviceName,
            'timestamp' => $this->timestamp,
        ];
    }
}
