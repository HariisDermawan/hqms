<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Perawat extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'perawats';

    protected $fillable = [
        'code',
        'name',
        'gender',
        'str_number',
        'rfid_id',
        'phone',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function presensis(): HasMany
    {
        return $this->hasMany(Presensi::class);
    }
}
