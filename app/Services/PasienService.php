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
}
