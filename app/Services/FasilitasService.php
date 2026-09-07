<?php

namespace App\Services;

use App\Models\Fasilitas;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class FasilitasService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Fasilitas::query()
            ->withCount('ruangans')
            ->latest()
            ->paginate($perPage);
    }

    /**
     * @return Collection<int, Fasilitas>
     */
    public function getActive(): Collection
    {
        return Fasilitas::query()
            ->withCount('ruangans')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function findBySlug(string $slug): ?Fasilitas
    {
        return Fasilitas::query()
            ->where('slug', $slug)
            ->first();
    }

    public function create(array $data): Fasilitas
    {
        return DB::transaction(function () use ($data) {
            return Fasilitas::create($data);
        });
    }

    public function update(Fasilitas $fasilitas, array $data): Fasilitas
    {
        return DB::transaction(function () use ($fasilitas, $data) {
            $fasilitas->update($data);

            return $fasilitas->fresh();
        });
    }

    public function delete(Fasilitas $fasilitas): void
    {
        DB::transaction(function () use ($fasilitas) {
            $fasilitas->delete();
        });
    }
}
