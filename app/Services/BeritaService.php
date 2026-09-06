<?php

namespace App\Services;

use App\Models\Berita;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class BeritaService
{
    public function getAll(int $perPage = 10): LengthAwarePaginator
    {
        return Berita::query()
            ->latest()
            ->paginate($perPage);
    }

    /**
     * @return Collection<int, Berita>
     */
    public function getActive(): Collection
    {
        return Berita::query()
            ->latest()
            ->get();
    }

    public function create(array $data): Berita
    {
        return DB::transaction(function () use ($data) {

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                $data['image'] = $image->store('beritas', 'public');
            }

            return Berita::create($data);
        });
    }

    public function update(Berita $berita, array $data): Berita
    {
        return DB::transaction(function () use ($berita, $data) {

            /** @var UploadedFile|null $image */
            $image = $data['image'] ?? null;

            unset($data['image']);

            if ($image) {
                if ($berita->image) {
                    Storage::disk('public')->delete($berita->image);
                }

                $data['image'] = $image->store('beritas', 'public');
            }

            $berita->update($data);

            return $berita->fresh();
        });
    }

    public function delete(Berita $berita): void
    {
        DB::transaction(function () use ($berita) {

            if ($berita->image) {
                Storage::disk('public')->delete($berita->image);
            }

            $berita->delete();
        });
    }
}
