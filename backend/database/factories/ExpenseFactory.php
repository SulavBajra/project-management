<?php

namespace Database\Factories;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "user_id" => 1,
            "project_id" => 2,
            "code" => $this->faker->unique()->word(),
            "description" => "Expense description" . $this->faker->sentence(),
            "total" => 500,
            "transaction_date" => $this->faker->date(),
        ];
    }
}
