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
        Schema::create('ruangan_pasien', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ruangan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('pasien_id')->constrained()->cascadeOnDelete();
            $table->string('pasien_name');
            $table->string('pasien_mrn')->nullable();
            $table->string('pasien_gender', 1)->nullable();
            $table->unsignedInteger('pasien_age')->nullable();
            $table->date('tanggal_masuk')->nullable();
            $table->date('tanggal_keluar')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ruangan_pasien');
    }
};
