<?php

namespace App\Services;

use App\Models\Faq;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class FaqService
{
    public function getAll(): LengthAwarePaginator
    {
        return Faq::query()
            ->orderBy('sort_order')
            ->latest('id')
            ->paginate(10);
    }

    public function create(array $data): Faq
    {
        return DB::transaction(function () use ($data) {
            return Faq::create([
                'question' => $data['question'],
                'answer' => $data['answer'],
                'sort_order' => $data['sort_order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);
        });
    }

    public function update(Faq $faq, array $data): Faq
    {
        return DB::transaction(function () use ($faq, $data) {
            $faq->update([
                'question' => $data['question'],
                'answer' => $data['answer'],
                'sort_order' => $data['sort_order']
                    ?? $faq->sort_order,
                'is_active' => $data['is_active']
                    ?? $faq->is_active,
            ]);

            return $faq->fresh();
        });
    }

    public function delete(Faq $faq): void
    {
        DB::transaction(function () use ($faq) {
            $faq->delete();
        });
    }
}
