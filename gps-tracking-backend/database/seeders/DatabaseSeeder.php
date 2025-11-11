<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear usuario administrador
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gps.com',
            'password' => bcrypt('admin123'),
            'role_id' => 1, // admin
        ]);

        // Crear usuario empleado
        $empleado = User::create([
            'name' => 'Juan Pérez',
            'email' => 'juan@gps.com',
            'password' => bcrypt('empleado123'),
            'role_id' => 2, // empleado
        ]);

        // Crear dispositivo para el empleado
        \App\Models\Device::create([
            'user_id' => $empleado->id,
            'name' => 'Móvil Juan',
            'serial' => 'ABC123',
            'status' => 'activo',
        ]);
    }
}
