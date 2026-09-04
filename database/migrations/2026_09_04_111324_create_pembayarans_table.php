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
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pemeriksaan_id')
                ->constrained('pemeriksaans')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->string('invoice_number', 40)->unique();

            $table->decimal('total', 12, 2)->default(0);

            $table->enum('metode', [
                'cash',
                'transfer',
                'debit',
                'credit',
                'qris',
            ])->default('cash');

            $table->enum('status', [
                'unpaid',
                'paid',
                'refunded',
                'cancelled',
            ])->default('unpaid');

            $table->date('tanggal');

            $table->json('detail_items')->nullable();

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
        Schema::dropIfExists('pembayarans');
    }
};
