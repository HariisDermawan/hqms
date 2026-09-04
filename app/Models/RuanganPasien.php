<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class RuanganPasien extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'ruangan_pasien';

    protected $fillable = [
        'ruangan_id',
        'pasien_id',
        'antrian_id',
        'pendaftaran_id',
        'pasien_name',
        'pasien_mrn',
        'pasien_gender',
        'pasien_age',
        'tanggal_masuk',
        'tanggal_keluar',
    ];

    protected function casts(): array
    {
        return [
            'pasien_age' => 'integer',
            'tanggal_masuk' => 'date',
            'tanggal_keluar' => 'date',
        ];
    }

    public function ruangan(): BelongsTo
    {
        return $this->belongsTo(Ruangan::class);
    }

    public function pasien(): BelongsTo
    {
        return $this->belongsTo(Pasien::class);
    }

    public function antrian(): BelongsTo
    {
        return $this->belongsTo(Antrian::class);
    }

    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }
}
