<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Canal público para actualizaciones de ubicación en tiempo real
Broadcast::channel('locations', function () {
    return true; // Canal público, todos pueden escuchar
});
