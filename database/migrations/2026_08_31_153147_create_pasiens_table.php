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
        Schema::create('pasiens', function (Blueprint $table) {
            $table->id();

    $table->foreignId('poli_id')
        ->constrained('polis')
        ->cascadeOnUpdate()
        ->restrictOnDelete();

    $table->string('medical_record_number', 50)->unique();
    $table->string('name');
    $table->string('nik', 16)->unique();
    $table->enum('gender', ['L', 'P']);
    $table->date('birth_date');
    $table->unsignedTinyInteger('age');
    $table->string('phone', 20)->nullable();
    $table->text('address')->nullable();
    $table->boolean('is_active')->default(true);

    $table->timestamps();
    $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pasiens');
    }
};
