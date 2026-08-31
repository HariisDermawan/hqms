<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pasien extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'poli_id',
        'medical_record_number',
        'name',
        'nik',
        'gender',
        'birth_date',
        'age',
        'phone',
        'address',
        'is_active',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'age' => 'integer',
        'is_active' => 'boolean',
    ];

    public function poli(): BelongsTo
    {
        return $this->belongsTo(Poli::class);
    }
}
