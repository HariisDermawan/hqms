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
                'antrian.pendaftaran.pasien',
                'antrian.poli',
                'dokter',
            ])
            ->latest()
            ->paginate(10);
    }

    public function create(array $data): Pemeriksaan
    {
        return DB::transaction(function () use ($data) {

            $pemeriksaan = Pemeriksaan::create([
                'antrian_id' => $data['antrian_id'],
                'dokter_id' => $data['dokter_id'],
                'examined_at' => $data['examined_at'],
                'complaint' => $data['complaint'] ?? null,
                'diagnosis' => $data['diagnosis'] ?? null,
                'treatment' => $data['treatment'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            return $pemeriksaan->load([
                'antrian.pendaftaran.pasien',
                'antrian.poli',
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
                'antrian_id' => $data['antrian_id'],
                'dokter_id' => $data['dokter_id'],
                'examined_at' => $data['examined_at'],
                'complaint' => $data['complaint'] ?? null,
                'diagnosis' => $data['diagnosis'] ?? null,
                'treatment' => $data['treatment'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            return $pemeriksaan->fresh([
                'antrian.pendaftaran.pasien',
                'antrian.poli',
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
