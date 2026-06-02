<?php

namespace App\Services;

use App\Exceptions\FlowAlreadyExistsException;
use App\Models\Approvals\ApprovalWorkflow;
use Illuminate\Support\Facades\DB;

class ApprovalFlowService
{
    public function getApprovalFlows()
    {
        return DB::table("approval_workflows")
            ->select("id", "name", "approvable_type", "is_active")
            ->get();
    }

    public function createApprovalFlow(array $data): void
    {
        DB::transaction(function () use ($data) {
            if (
                ApprovalWorkflow::where(
                    "approvable_type",
                    $data["model_name"],
                )->exists()
            ) {
                throw new FlowAlreadyExistsException(
                    "Flow for this {$data["model_name"]} already exists.",
                );
            }
            $workflow = ApprovalWorkflow::create([
                "name" => $data["name"],
                "approvable_type" => $data["model_name"],
                "is_active" => true,
            ]);

            $version = $workflow->versions()->create([
                "version" => 1,
                "is_current" => true,
            ]);

            $statuses = [];
            foreach ($data["statuses"] as $name) {
                $statuses[$name] = $version
                    ->statuses()
                    ->create(["name" => $name]);
            }

            $steps = collect($data["steps"])
                ->map(
                    fn($step) => [
                        "name" => $step["name"],
                        "role_id" => $step["role_id"],
                        "approval_status_id" => $statuses[$step["status"]]->id,
                        "order_no" => $step["order_no"],
                        "is_final" => $step["is_final"] ?? false,
                    ],
                )
                ->toArray();

            $version->steps()->createMany($steps);
        });
    }
}
