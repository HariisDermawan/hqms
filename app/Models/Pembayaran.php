<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pembayaran extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'pembayarans';

    protected $fillable = [
        'pemeriksaan_id',
        'invoice_number',
        'total',
        'metode',
        'status',
        'tanggal',
        'detail_items',
        'keterangan',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'tanggal' => 'date',
        'detail_items' => 'array',
    ];

    public function pemeriksaan(): BelongsTo
    {
        return $this->belongsTo(Pemeriksaan::class);
    }
}
