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
        Schema::create('obats', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pemeriksaan_id')
                ->constrained('pemeriksaans')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->string('nama_obat');
            $table->string('dosis')->nullable();
            $table->unsignedInteger('jumlah')->default(1);
            $table->string('satuan')->nullable();
            $table->decimal('harga', 12, 2)->default(0);

            $table->text('keterangan')->nullable();

            $table->timestamps();

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('obats');
    }
};
