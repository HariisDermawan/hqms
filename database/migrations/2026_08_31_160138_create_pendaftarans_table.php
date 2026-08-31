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
        Schema::create('pendaftarans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pasien_id')
                ->constrained('pasiens')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('poli_id')
                ->constrained('polis')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('registration_number', 50)->unique();

            $table->string('queue_number', 20);

            $table->date('registration_date');

            $table->enum('status', [
                'waiting',
                'called',
                'serving',
                'completed',
                'cancelled',
            ])->default('waiting');

            $table->text('notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->unique([
                'poli_id',
                'registration_date',
                'queue_number',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pendaftarans');
    }
};
