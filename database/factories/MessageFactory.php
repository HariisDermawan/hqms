<?php

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Message>
 */
class MessageFactory extends Factory
{
    public function definition(): array
    {
        $replied = $this->faker->boolean();

        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->optional()->numerify('08##########'),
            'subject' => $this->faker->optional()->sentence(4),
            'message' => $this->faker->paragraph(),
            'status' => $replied ? 'replied' : $this->faker->randomElement(['unread', 'read']),
            'admin_reply' => $replied ? $this->faker->sentence() : null,
            'replied_at' => $replied ? now() : null,
        ];
    }

    /**
     * Mark the message as unread.
     */
    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'unread',
            'admin_reply' => null,
            'replied_at' => null,
        ]);
    }

    /**
     * Mark the message as read.
     */
    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'read',
            'admin_reply' => null,
            'replied_at' => null,
        ]);
    }

    /**
     * Mark the message as replied.
     */
    public function replied(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'replied',
            'admin_reply' => $this->faker->sentence(),
            'replied_at' => now(),
        ]);
    }
}
