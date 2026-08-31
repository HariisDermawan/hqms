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
        Schema::create('jadwal_dokters', function (Blueprint $table) {
            $table->id();

            $table->foreignId('dokter_id')
                ->constrained('dokters')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('poli_id')
                ->constrained('polis')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->enum('day', [
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
                'sunday',
            ]);

            $table->time('start_time');

            $table->time('end_time');

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->softDeletes();

            $table->unique([
                'dokter_id',
                'poli_id',
                'day',
                'start_time',
                'end_time',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal_dokters');
    }
};
