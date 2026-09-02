<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('polis', function (Blueprint $table) {
            $table->string('queue_prefix', 1)->nullable()->after('code');
        });

        DB::table('polis')
            ->select('id')
            ->orderBy('id')
            ->get()
            ->each(function (object $poli, int $index) {
                DB::table('polis')
                    ->where('id', $poli->id)
                    ->update([
                        'queue_prefix' => chr(65 + min($index, 25)),
                    ]);
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('polis', function (Blueprint $table) {
            $table->dropColumn('queue_prefix');
        });
    }
};
