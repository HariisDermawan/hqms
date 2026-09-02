<?php

namespace App\Services;

use App\Models\Testimonial;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class TestimonialService
{
    public function getAll(): LengthAwarePaginator
    {
        return Testimonial::query()
            ->orderBy('sort_order')
            ->latest('id')
            ->paginate(10);
    }

    public function create(array $data): Testimonial
    {
        return DB::transaction(function () use ($data) {
            return Testimonial::create([
                'pasien_id' => $data['pasien_id'] ?? null,
                'name' => $data['name'],
                'role' => $data['role'] ?? null,
                'message' => $data['message'],
                'rating' => $data['rating'] ?? 5,
                'sort_order' => $data['sort_order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);
        });
    }

    public function update(
        Testimonial $testimonial,
        array $data
    ): Testimonial {
        return DB::transaction(function () use (
            $testimonial,
            $data
        ) {
            $testimonial->update([
                'pasien_id' => $data['pasien_id'] ?? null,
                'name' => $data['name'],
                'role' => $data['role'] ?? null,
                'message' => $data['message'],
                'rating' => $data['rating'] ?? $testimonial->rating,
                'sort_order' => $data['sort_order']
                    ?? $testimonial->sort_order,
                'is_active' => $data['is_active']
                    ?? $testimonial->is_active,
            ]);

            return $testimonial->fresh();
        });
    }

    public function delete(Testimonial $testimonial): void
    {
        DB::transaction(function () use ($testimonial) {
            $testimonial->delete();
        });
    }
}
