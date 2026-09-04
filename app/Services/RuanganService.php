<?php

namespace App\Services;

use App\Models\Antrian;
use App\Models\Pasien;
use App\Models\Ruangan;
use App\Models\RuanganPasien;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RuanganService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Ruangan::query()
            ->with([
                'poli',
                'ruanganPasiens.antrian.poli',
                'ruanganPasiens.pendaftaran',
            ])
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): Ruangan
    {
        return DB::transaction(function () use ($data) {
            return Ruangan::create($data);
        });
    }

    public function update(Ruangan $ruangan, array $data): Ruangan
    {
        return DB::transaction(function () use ($ruangan, $data) {
            $ruangan->update($data);

            return $ruangan->fresh();
        });
    }

    public function delete(Ruangan $ruangan): void
    {
        DB::transaction(function () use ($ruangan) {
            $ruangan->delete();
        });
    }

    public function assignPasien(Ruangan $ruangan, array $data): RuanganPasien
    {
        return DB::transaction(function () use ($ruangan, $data) {
            $pasienId = $data['pasien_id'];

            $pasien = Pasien::query()
                ->whereKey($pasienId)
                ->firstOrFail();

            $antrianId = $data['antrian_id'] ?? null;
            $antrian = null;
            $pendaftaranId = $data['pendaftaran_id'] ?? null;

            if ($antrianId !== null) {
                $antrian = Antrian::query()
                    ->with(['pendaftaran'])
                    ->whereKey($antrianId)
                    ->firstOrFail();

                if (
                    $ruangan->poli_id !== null
                    && $antrian->poli_id !== $ruangan->poli_id
                ) {
                    throw ValidationException::withMessages([
                        'antrian_id' => 'Tiket antrian tidak sesuai dengan poli ruangan ini.',
                    ]);
                }

                $pendaftaranId = $antrian->pendaftaran?->id
                    ?? $pendaftaranId;
            }

            if (
                strtolower($ruangan->category) === 'poli'
                && $antrianId === null
            ) {
                throw ValidationException::withMessages([
                    'antrian_id' => 'Ruang poli membutuhkan pilihan tiket antrian.',
                ]);
            }

            return $ruangan->ruanganPasiens()->create([
                'pasien_id' => $pasien->id,
                'antrian_id' => $antrianId,
                'pendaftaran_id' => $pendaftaranId,
                'pasien_name' => $pasien->name,
                'pasien_mrn' => $pasien->medical_record_number,
                'pasien_gender' => $pasien->gender,
                'pasien_age' => $pasien->age,
                'tanggal_masuk' => $data['tanggal_masuk'] ?? now()->toDateString(),
            ]);
        });
    }

    public function removePasien(
        Ruangan $ruangan,
        RuanganPasien $ruanganPasien
    ): RuanganPasien {
        return DB::transaction(function () use ($ruanganPasien) {
            $ruanganPasien->update([
                'tanggal_keluar' => now()->toDateString(),
            ]);

            return $ruanganPasien->fresh();
        });
    }
}
