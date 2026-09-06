<?php

use App\Models\Dokter;
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
        Schema::table('dokters', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('name');
        });

        Dokter::withTrashed()
            ->whereNull('slug')
            ->get()
            ->each(function (Dokter $dokter) {
                $dokter->slug = $dokter->uniqueSlug($dokter->name);
                $dokter->save();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dokters', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
