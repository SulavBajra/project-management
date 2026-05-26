<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::create(['name' => 'create project']);
        Permission::create(['name' => 'end project']);
        Permission::create(['name' => 'add user to project']);

        Role::create(['name' => 'projectManager'])->givePermissionTo([
            'create project',
            'end project',
            'add user to project',
        ]);
        Role::create(['name' => 'employee']);
        Role::create(['name' => 'admin'])->givePermissionTo(Permission::all());
    }
}
