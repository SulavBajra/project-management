<?php

namespace Database\Factories;

use App\Models\AccountHead;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AccountHead>
 */
class AccountHeadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name" => $this->faker->name,
            "code" => $this->faker->unique()->word,
        ];
    }
}
