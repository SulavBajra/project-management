<?php

namespace App\Services;

use App\Exceptions\FlowAlreadyExistsException;
use App\Models\Approvals\Approval;
use App\Models\Approvals\ApprovalWorkflow;
use App\Repositories\ApprovalWorkflowRepository;
use Illuminate\Support\Facades\DB;

class ApprovalFlowService
{
    public function __construct(private ApprovalWorkflowRepository $flowRepo)
    {
        //
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

    // public function getModelId(string $name, int $id)
    // {
    //     $approvableId = [];
    //     switch ($name) {
    //         case "budget":
    //             $id = BudgetPlan::query()
    //                 ->where("project_id", $id)
    //                 ->value("id");
    //             $approvableId = $id ? [$id] : [];
    //             break;
    //         case "expense":
    //             $approvableId = Expense::query()
    //                 ->where("project_id", $id)
    //                 ->pluck("id")
    //                 ->toArray();
    //             break;
    //         default:
    //             break;
    //     }
    //     return $approvableId;
    // }

    public function checkFlowInfo(int $id, string $name)
    {
        $approvableId = $this->flowRepo->getModelId($name, $id);
        $model = Approval::query()
            ->select([
                "id",
                "approvable_type",
                "current_step_id",
                "current_status_id",
                "approval_workflow_version_id",
            ])
            ->with([
                "currentStep:id,role_id,name,is_final",
                "currentStep.role:id,name",
                "currentStatus:id,name",
                "version:id",
            ])
            ->where("approvable_type", $name)
            ->whereIn("approvable_id", $approvableId)
            ->first();
        return $model;
    }
}
