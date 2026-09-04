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
        Schema::table('ruangans', function (Blueprint $table) {
            $table->unsignedBigInteger('poli_id')->nullable()->after('category');
            $table->foreign('poli_id')->references('id')->on('polis')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ruangans', function (Blueprint $table) {
            $table->dropForeign(['poli_id']);
            $table->dropColumn('poli_id');
        });
    }
};
