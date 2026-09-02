<?php

namespace App\Services;

use App\Models\Pasien;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PasienService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Pasien::query()
            ->with('poli')
            ->latest()
            ->paginate($perPage);
    }

    public function create(array $data): Pasien
    {
        return DB::transaction(function () use ($data) {

            $data['age'] = Carbon::parse($data['birth_date'])
                ->diffInYears(now());

            if (blank($data['medical_record_number'] ?? null)) {
                $data['medical_record_number'] = $this->generateMedicalRecordNumber();
            }

            $pasien = Pasien::create($data);

            return $pasien->load('poli');
        });
    }

    public function update(Pasien $pasien, array $data): Pasien
    {
        return DB::transaction(function () use ($pasien, $data) {

            $data['age'] = Carbon::parse($data['birth_date'])
                ->diffInYears(now());

            $pasien->update($data);

            return $pasien->fresh()->load('poli');
        });
    }

    public function delete(Pasien $pasien): void
    {
        DB::transaction(function () use ($pasien) {
            $pasien->delete();
        });
    }

    private function generateMedicalRecordNumber(): string
    {
        $last = Pasien::withTrashed()
            ->where('medical_record_number', 'like', 'RM%')
            ->lockForUpdate()
            ->orderByDesc('id')
            ->value('medical_record_number');

        $lastSequence = $last
            ? (int) preg_replace('/\D/', '', (string) $last)
            : 0;

        return 'RM'.str_pad($lastSequence + 1, 6, '0', STR_PAD_LEFT);
    }
}
