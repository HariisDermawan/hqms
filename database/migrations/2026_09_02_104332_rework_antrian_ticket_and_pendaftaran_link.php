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
        Schema::table('antrians', function (Blueprint $table) {
            $table->dropForeign(['pendaftaran_id']);
            $table->dropUnique(['pendaftaran_id']);
            $table->dropColumn('pendaftaran_id');
        });

        Schema::table('pendaftarans', function (Blueprint $table) {
            $table->foreignId('antrian_id')
                ->nullable()
                ->after('id')
                ->constrained('antrians')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftarans', function (Blueprint $table) {
            $table->dropForeign(['antrian_id']);
            $table->dropColumn('antrian_id');
        });

        Schema::table('antrians', function (Blueprint $table) {
            $table->foreignId('pendaftaran_id')
                ->nullable()
                ->constrained('pendaftarans')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }
};
