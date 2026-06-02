<?php

namespace Database\Seeders;

use App\Models\Approvals\ApprovalWorkflow;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $workflow = ApprovalWorkflow::create([
                "name" => "Expense Approval",
                "approvable_type" => "expense",
                "is_active" => true,
            ]);

            $version = $workflow->versions()->create([
                "version" => 1,
                "is_current" => true,
            ]);

            $statuses = collect([
                "Pending",
                "Checked",
                "Approved",
                "Rejected",
            ])->mapWithKeys(
                fn($name) => [
                    $name => $version->statuses()->create(["name" => $name]),
                ],
            );

            $pmRole = Role::where("name", "project_manager")->firstOrFail();
            $adminRole = Role::where("name", "admin")->firstOrFail();

            $version->steps()->createMany([
                [
                    "role_id" => $pmRole->id,
                    "approval_status_id" => $statuses["Checked"]->id,
                    "order_no" => 1,
                    "name" => "Project Manager Review",
                    "is_final" => false,
                ],
                [
                    "role_id" => $adminRole->id,
                    "approval_status_id" => $statuses["Approved"]->id,
                    "order_no" => 2,
                    "name" => "Admin Approval",
                    "is_final" => true,
                ],
            ]);
        });
    }
}
