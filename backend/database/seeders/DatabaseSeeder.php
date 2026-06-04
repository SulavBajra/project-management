<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call(RolePermissionSeeder::class);
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        $employee = User::factory()->create([
            'name' => 'Employees User',
            'email' => 'emp@example.com',
        ]);
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ]);
        $user->assignRole('project_manager');
        $employee->assignRole('employee');
        $admin->assignRole('admin');
        $this->call(StatusSeeder::class);
    }
}
