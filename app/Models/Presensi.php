<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Presensi extends Model
{
    use HasFactory;

    protected $table = 'presensis';

    protected $fillable = [
        'perawat_id',
        'date',
        'time_in',
        'time_out',
        'status',
        'note',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function perawat(): BelongsTo
    {
        return $this->belongsTo(Perawat::class);
    }
}
