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
        Schema::table('pemeriksaans', function (Blueprint $table) {
            $table->dropForeign(['antrian_id']);
            $table->dropForeign(['dokter_id']);
            $table->dropColumn(['antrian_id', 'dokter_id']);

            $table->foreignId('pasien_id')
                ->nullable()
                ->after('id')
                ->constrained('pasiens')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('poli_id')
                ->nullable()
                ->after('pasien_id')
                ->constrained('polis')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('category', 100)
                ->nullable()
                ->after('poli_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pemeriksaans', function (Blueprint $table) {
            $table->dropForeign(['pasien_id']);
            $table->dropForeign(['poli_id']);
            $table->dropColumn(['pasien_id', 'poli_id', 'category']);

            $table->foreignId('antrian_id')
                ->constrained('antrians')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->foreignId('dokter_id')
                ->constrained('dokters')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }
};
