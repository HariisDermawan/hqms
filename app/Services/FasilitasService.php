<?php

namespace App\Services;

use App\Models\Fasilitas;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

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

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                $data['image'] = $image->store('fasilitas', 'public');
            }

            return Fasilitas::create($data);
        });
    }

    public function update(Fasilitas $fasilitas, array $data): Fasilitas
    {
        return DB::transaction(function () use ($fasilitas, $data) {

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                if ($fasilitas->image) {
                    Storage::disk('public')->delete($fasilitas->image);
                }

                $data['image'] = $image->store('fasilitas', 'public');
            }

            $fasilitas->update($data);

            return $fasilitas->fresh();
        });
    }

    public function delete(Fasilitas $fasilitas): void
    {
        DB::transaction(function () use ($fasilitas) {

            if ($fasilitas->image) {
                Storage::disk('public')->delete($fasilitas->image);
            }

            $fasilitas->delete();
        });
    }
}
