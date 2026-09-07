<?php

namespace Database\Factories;

use App\Models\Penawaran;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Penawaran>
 */
class PenawaranFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->sentence(4);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraphs(3, true),
            'image' => 'penawarans/default.jpg',
        ];
    }
}
