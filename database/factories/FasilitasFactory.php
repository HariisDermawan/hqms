<?php

namespace Database\Factories;

use App\Models\Fasilitas;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Fasilitas>
 */
class FasilitasFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => $name,
            'slug' => \Illuminate\Support\Str::slug($name),
            'description' => fake()->optional()->sentence(),
            'is_active' => true,
        ];
    }
}
