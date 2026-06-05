<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    private array $baseActions = ["create", "read", "update", "delete"];

    private array $workflowActions = ["approve", "check", "reject"];

    private array $modules = [
        "project" => ["end", "add_user"],
        "budget" => [],
        "expense" => ["import"],
        "timeline" => [],
        "approval_workflow" => [],
        "status" => [],
        "role" => [],
        "permission" => [],
    ];

    private array $roles = [
        "admin" => "*",

        "project_manager" => [
            "create_project",
            "read_project",
            "update_project",
            "end_project",
            "add_user_project",
            "approve_project",
            "read_budget",
            "read_expense",
            "read_timeline",
            "approve_expense",
            "import_expense",
            "approve_budget",
        ],

        // "finance_officer" => [
        //     "read_project",
        //     "create_budget",
        //     "read_budget",
        //     "update_budget",
        //     "approve_budget",
        //     "check_budget",
        //     "reject_budget",
        //     "create_expense",
        //     "read_expense",
        //     "update_expense",
        //     "approve_expense",
        //     "check_expense",
        //     "reject_expense",
        // ],

        "employee" => [
            "read_project",
            "read_budget",
            "create_expense",
            "read_expense",
            "import_expense",
            "read_timeline",
        ],

        "viewer" => [],
    ];

    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $allActions = array_merge($this->baseActions, $this->workflowActions);
        $permissionNames = [];

        foreach ($this->modules as $module => $extras) {
            $actions = array_merge($allActions, $extras);
            foreach ($actions as $action) {
                $permissionNames[] = "{$action}_{$module}";
            }
        }

        foreach ($permissionNames as $name) {
            Permission::firstOrCreate([
                "name" => $name,
                "guard_name" => "web",
            ]);
        }

        $this->roles["viewer"] = array_values(
            array_filter(
                $permissionNames,
                fn($p) => str_starts_with($p, "read_"),
            ),
        );

        foreach ($this->roles as $roleName => $permissions) {
            $role = Role::firstOrCreate([
                "name" => $roleName,
                "guard_name" => "web",
            ]);

            if ($permissions === "*") {
                $role->syncPermissions(
                    Permission::where("guard_name", "web")->pluck("name"),
                );

                continue;
            }

            $invalid = array_diff($permissions, $permissionNames);
            if (!empty($invalid)) {
                $this->command->warn(
                    "Role [{$roleName}] references unknown permissions: " .
                        implode(", ", $invalid),
                );
            }

            $role->syncPermissions(
                array_intersect($permissions, $permissionNames),
            );
        }

        $this->command->info(
            sprintf(
                "Seeded %d permissions across %d modules and %d roles.",
                count($permissionNames),
                count($this->modules),
                count($this->roles),
            ),
        );
    }
}
