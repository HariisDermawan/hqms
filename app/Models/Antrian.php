<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Antrian extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'antrians';

    protected $fillable = [
        'poli_id',
        'queue_number',
        'status',
        'called_at',
        'started_at',
        'completed_at',
        'notes',
    ];

    protected $casts = [
        'called_at' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    public function poli(): BelongsTo
    {
        return $this->belongsTo(Poli::class);
    }

    public function pendaftaran(): HasOne
    {
        return $this->hasOne(Pendaftaran::class);
    }
}
