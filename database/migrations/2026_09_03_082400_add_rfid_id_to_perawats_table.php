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
        Schema::table('perawats', function (Blueprint $table) {
            $table->string('rfid_id', 64)->nullable()->unique()->after('str_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('perawats', function (Blueprint $table) {
            $table->dropUnique(['rfid_id']);
            $table->dropColumn('rfid_id');
        });
    }
};
