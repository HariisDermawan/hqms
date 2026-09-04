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
        Schema::table('ruangan_pasien', function (Blueprint $table) {
            $table->foreignId('antrian_id')
                ->nullable()
                ->after('pasien_id')
                ->constrained('antrians')
                ->nullOnDelete();

            $table->foreignId('pendaftaran_id')
                ->nullable()
                ->after('antrian_id')
                ->constrained('pendaftarans')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ruangan_pasien', function (Blueprint $table) {
            $table->dropConstrainedForeignId('antrian_id');
            $table->dropConstrainedForeignId('pendaftaran_id');
        });
    }
};
