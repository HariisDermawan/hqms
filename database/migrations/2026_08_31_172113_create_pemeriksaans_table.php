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
        Schema::create('pemeriksaans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('antrian_id')
                ->constrained('antrians')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('dokter_id')
                ->constrained('dokters')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->dateTime('examined_at');

            $table->text('complaint')->nullable();

            $table->text('diagnosis')->nullable();

            $table->text('treatment')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemeriksaans');
    }
};
