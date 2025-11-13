<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('gps_logs', function (Blueprint $table) {
            $table->decimal('speed', 8, 2)->nullable()->after('accuracy')->comment('Velocidad en m/s');
            $table->decimal('heading', 5, 2)->nullable()->after('speed')->comment('Dirección en grados (0-360)');
            $table->decimal('altitude', 8, 2)->nullable()->after('heading')->comment('Altitud en metros');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gps_logs', function (Blueprint $table) {
            $table->dropColumn(['speed', 'heading', 'altitude']);
        });
    }
};
