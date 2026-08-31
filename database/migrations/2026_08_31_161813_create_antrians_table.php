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
        Schema::create('antrians', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pendaftaran_id')
                ->constrained('pendaftarans')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('poli_id')
                ->constrained('polis')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('queue_number', 20);

            $table->enum('status', [
                'waiting',
                'called',
                'serving',
                'completed',
                'skipped',
            ])->default('waiting');

            $table->timestamp('called_at')->nullable();

            $table->timestamp('started_at')->nullable();

            $table->timestamp('completed_at')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();

            $table->softDeletes();

            $table->unique([
                'pendaftaran_id',
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('antrians');
    }
};
