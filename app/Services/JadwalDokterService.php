<?php

namespace App\Services;

use App\Models\JadwalDokter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class JadwalDokterService
{
    public function getAll(): LengthAwarePaginator
    {
        return JadwalDokter::query()
            ->with([
                'dokter',
                'poli',
            ])
            ->latest()
            ->paginate(10);
    }

    public function create(array $data): JadwalDokter
    {
        return DB::transaction(function () use ($data) {
            $jadwal = JadwalDokter::create([
                'dokter_id' => $data['dokter_id'],
                'poli_id' => $data['poli_id'],
                'day' => $data['day'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            return $jadwal->load([
                'dokter',
                'poli',
            ]);
        });
    }

    public function update(
        JadwalDokter $jadwalDokter,
        array $data
    ): JadwalDokter {
        return DB::transaction(function () use ($jadwalDokter, $data) {
            $jadwalDokter->update([
                'dokter_id' => $data['dokter_id'],
                'poli_id' => $data['poli_id'],
                'day' => $data['day'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'is_active' => $data['is_active']
                    ?? $jadwalDokter->is_active,
            ]);

            return $jadwalDokter->fresh([
                'dokter',
                'poli',
            ]);
        });
    }

    public function delete(JadwalDokter $jadwalDokter): void
    {
        DB::transaction(function () use ($jadwalDokter) {
            $jadwalDokter->delete();
        });
    }
}

