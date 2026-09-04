<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Obat extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'obats';

    protected $fillable = [
        'pemeriksaan_id',
        'nama_obat',
        'dosis',
        'jumlah',
        'satuan',
        'harga',
        'keterangan',
    ];

    protected $casts = [
        'jumlah' => 'integer',
        'harga' => 'decimal:2',
    ];

    public function pemeriksaan(): BelongsTo
    {
        return $this->belongsTo(Pemeriksaan::class);
    }
}
