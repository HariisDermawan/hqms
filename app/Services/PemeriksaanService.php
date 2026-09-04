<?php

namespace App\Services;

use App\Models\Pemeriksaan;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PemeriksaanService
{
    public function getAll(): LengthAwarePaginator
    {
        return Pemeriksaan::query()
            ->with([
                'antrian',
                'pasien',
                'poli',
                'dokter',
            ])
            ->latest()
            ->paginate(10);
    }

    public function create(array $data): Pemeriksaan
    {
        return DB::transaction(function () use ($data) {

            $pemeriksaan = Pemeriksaan::create([
                'antrian_id' => $data['antrian_id'] ?? null,
                'pasien_id' => $data['pasien_id'],
                'poli_id' => $data['poli_id'],
                'dokter_id' => $data['dokter_id'] ?? null,
                'category' => $data['category'],
                'examined_at' => $data['examined_at'],
                'complaint' => $data['complaint'] ?? null,
                'diagnosis' => $data['diagnosis'] ?? null,
                'treatment' => $data['treatment'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            return $pemeriksaan->load([
                'antrian',
                'pasien',
                'poli',
                'dokter',
            ]);
        });
    }

    public function update(
        Pemeriksaan $pemeriksaan,
        array $data
    ): Pemeriksaan {
        return DB::transaction(function () use (
            $pemeriksaan,
            $data
        ) {
            $pemeriksaan->update([
                'antrian_id' => $data['antrian_id'] ?? $pemeriksaan->antrian_id,
                'pasien_id' => $data['pasien_id'],
                'poli_id' => $data['poli_id'],
                'dokter_id' => $data['dokter_id'] ?? null,
                'category' => $data['category'],
                'examined_at' => $data['examined_at'],
                'complaint' => $data['complaint'] ?? null,
                'diagnosis' => $data['diagnosis'] ?? null,
                'treatment' => $data['treatment'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            return $pemeriksaan->fresh([
                'antrian',
                'pasien',
                'poli',
                'dokter',
            ]);
        });
    }

    public function delete(Pemeriksaan $pemeriksaan): void
    {
        DB::transaction(function () use ($pemeriksaan) {
            $pemeriksaan->delete();
        });
    }
}
