<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ruangans', function (Blueprint $table) {
            $table->foreignId('facility_id')->nullable()->after('code')->constrained('fasilitas')->nullOnDelete();
        });

        Schema::table('ruangans', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }

    public function down(): void
    {
        Schema::table('ruangans', function (Blueprint $table) {
            $table->dropConstrainedForeignId('facility_id');
        });

        Schema::table('ruangans', function (Blueprint $table) {
            $table->string('category', 100)->after('name');
        });
    }
};
