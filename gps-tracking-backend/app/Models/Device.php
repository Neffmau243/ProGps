<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    protected $fillable = ['user_id', 'name', 'serial', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function gpsLogs()
    {
        return $this->hasMany(GpsLog::class);
    }

    public function latestLocation()
    {
        return $this->hasOne(GpsLog::class)->latestOfMany('timestamp');
    }
}
