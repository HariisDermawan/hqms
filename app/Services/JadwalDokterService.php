<?php

namespace App\Services;

use App\Models\JadwalDokter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class JadwalDokterService
{
    public function getAll(
        ?int $poliId = null,
        ?int $dokterId = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        return JadwalDokter::query()
            ->with([
                'dokter',
                'poli',
            ])
            ->when($poliId, fn ($query) => $query->where('poli_id', $poliId))
            ->when($dokterId, fn ($query) => $query->where('dokter_id', $dokterId))
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): JadwalDokter
    {
        if ($this->exists($data)) {
            throw ValidationException::withMessages([
                'day' => 'Jadwal untuk dokter, poli, hari, dan jam ini sudah ada.',
            ]);
        }

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
        if ($this->exists($data, $jadwalDokter)) {
            throw ValidationException::withMessages([
                'day' => 'Jadwal untuk dokter, poli, hari, dan jam ini sudah ada.',
            ]);
        }

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

    private function exists(
        array $data,
        ?JadwalDokter $ignore = null
    ): bool {
        $query = JadwalDokter::query()
            ->where('dokter_id', $data['dokter_id'])
            ->where('poli_id', $data['poli_id'])
            ->where('day', $data['day'])
            ->where('start_time', $data['start_time'])
            ->where('end_time', $data['end_time']);

        if ($ignore) {
            $query->whereKeyNot($ignore->id);
        }

        return $query->exists();
    }
}
