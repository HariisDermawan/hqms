<?php

namespace Database\Factories;

use App\Models\Pasien;
use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Testimonial>
 */
class TestimonialFactory extends Factory
{
    public function definition(): array
    {
        return [
            'pasien_id' => Pasien::factory(),
            'name' => fake()->name(),
            'role' => fake()->optional()->jobTitle(),
            'message' => fake()->paragraph(),
            'rating' => fake()->numberBetween(1, 5),
            'sort_order' => fake()->numberBetween(0, 100),
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the testimonial is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
