<?php

namespace App\Services;

use App\Models\Obat;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ObatService
{
    public function getAll(): LengthAwarePaginator
    {
        return Obat::query()
            ->with([
                'pemeriksaan.pasien',
                'pemeriksaan.poli',
                'pemeriksaan.antrian',
            ])
            ->latest()
            ->paginate(10);
    }

    public function create(array $data): Obat
    {
        return DB::transaction(function () use ($data) {
            $obat = Obat::create([
                'pemeriksaan_id' => $data['pemeriksaan_id'],
                'nama_obat' => $data['nama_obat'],
                'dosis' => $data['dosis'] ?? null,
                'jumlah' => $data['jumlah'] ?? 1,
                'satuan' => $data['satuan'] ?? null,
                'harga' => $data['harga'] ?? 0,
                'keterangan' => $data['keterangan'] ?? null,
            ]);

            return $obat->load([
                'pemeriksaan.pasien',
                'pemeriksaan.poli',
                'pemeriksaan.antrian',
            ]);
        });
    }

    public function update(Obat $obat, array $data): Obat
    {
        return DB::transaction(function () use ($obat, $data) {
            $obat->update([
                'pemeriksaan_id' => $data['pemeriksaan_id'],
                'nama_obat' => $data['nama_obat'],
                'dosis' => $data['dosis'] ?? null,
                'jumlah' => $data['jumlah'] ?? 1,
                'satuan' => $data['satuan'] ?? null,
                'harga' => $data['harga'] ?? 0,
                'keterangan' => $data['keterangan'] ?? null,
            ]);

            return $obat->fresh([
                'pemeriksaan.pasien',
                'pemeriksaan.poli',
                'pemeriksaan.antrian',
            ]);
        });
    }

    public function delete(Obat $obat): void
    {
        DB::transaction(function () use ($obat) {
            $obat->delete();
        });
    }
}
