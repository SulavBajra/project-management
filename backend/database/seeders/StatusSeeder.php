<?php

namespace Database\Seeders;

use App\Models\Approvals\ApprovalWorkflow;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use App\Models\BudgetHead;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            BudgetHead::create(["name" => "Salary","code" => "bh-001"]);
            BudgetHead::create(["name" => "Transport","code" => "bh-002"]);

            $workflow = ApprovalWorkflow::create([
                'name' => 'Expense Approval',
                'approvable_type' => 'expense',
                'is_active' => true,
            ]);
            $workflowBudget = ApprovalWorkflow::create([
                'name' => 'Budget Approval',
                'approvable_type' => 'budget',
                'is_active' => true,
            ]);

            $version = $workflow->versions()->create([
                'version' => 1,
                'is_current' => true,
            ]);
            $versionBudget = $workflowBudget->versions()->create([
                'version' => 1,
                'is_current' => true,
            ]);

            $statuses = collect([
                'Pending',
                'Checked',
                'Reviewed',
                'Approved',
                'Rejected',
            ])->mapWithKeys(
                fn ($name) => [
                    $name => $version->statuses()->create(['name' => $name]),
                ],
            );

            $budgetStatuses = collect([
                'Pending',
                'Checked',
                'Reviewed',
                'Approved',
                'Rejected',
            ])->mapWithKeys(
                fn ($name) => [
                    $name => $versionBudget
                        ->statuses()
                        ->create(['name' => $name]),
                ],
            );
            $empRole = Role::where('name', 'employee')->firstOrFail();
            $pmRole = Role::where('name', 'project_manager')->firstOrFail();
            $adminRole = Role::where('name', 'admin')->firstOrFail();

            $version->steps()->createMany([
                [
                    'role_id' => $empRole->id,
                    'approval_status_id' => $statuses['Checked']->id,
                    'order_no' => 1,
                    'name' => 'Employee Processing',
                    'is_final' => false,
                ],
                [
                    'role_id' => $pmRole->id,
                    'approval_status_id' => $statuses['Reviewed']->id,
                    'order_no' => 2,
                    'name' => 'Project_Manager Review',
                    'is_final' => false,
                ],
                [
                    'role_id' => $adminRole->id,
                    'approval_status_id' => $statuses['Approved']->id,
                    'order_no' => 3,
                    'name' => 'Admin Approval',
                    'is_final' => true,
                ],
            ]);

            $versionBudget->steps()->createMany([
                [
                    'role_id' => $empRole->id,
                    'approval_status_id' => $budgetStatuses['Checked']->id,
                    'order_no' => 1,
                    'name' => 'Employee Processing',
                    'is_final' => false,
                ],
                [
                    'role_id' => $pmRole->id,
                    'approval_status_id' => $budgetStatuses['Reviewed']->id,
                    'order_no' => 2,
                    'name' => 'Project Manager Review',
                    'is_final' => false,
                ],
                [
                    'role_id' => $adminRole->id,
                    'approval_status_id' => $budgetStatuses['Approved']->id,
                    'order_no' => 3,
                    'name' => 'Admin Approval',
                    'is_final' => true,
                ],
            ]);
        });
    }
}
