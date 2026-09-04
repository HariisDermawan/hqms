<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pemeriksaan extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pemeriksaans';

    protected $fillable = [
        'antrian_id',
        'pasien_id',
        'poli_id',
        'dokter_id',
        'category',
        'examined_at',
        'complaint',
        'diagnosis',
        'treatment',
        'notes',
    ];

    protected $casts = [
        'examined_at' => 'datetime',
    ];

    public function antrian(): BelongsTo
    {
        return $this->belongsTo(Antrian::class);
    }

    public function pasien(): BelongsTo
    {
        return $this->belongsTo(Pasien::class);
    }

    public function poli(): BelongsTo
    {
        return $this->belongsTo(Poli::class);
    }

    public function dokter(): BelongsTo
    {
        return $this->belongsTo(Dokter::class);
    }

    public function obats(): HasMany
    {
        return $this->hasMany(Obat::class);
    }

    public function pembayarans(): HasMany
    {
        return $this->hasMany(Pembayaran::class);
    }
}
