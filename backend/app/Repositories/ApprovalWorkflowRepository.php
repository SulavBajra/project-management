<?php

namespace App\Repositories;

use App\Models\Approvals\Approval;
use App\Models\Approvals\ApprovalWorkflow;
use App\Models\BudgetPlan;
use App\Models\Expense;

class ApprovalWorkflowRepository
{
    public function __construct(
        private ApprovalWorkflow $model,
        private BudgetPlan $plan,
        private Expense $expense,
    ) {
        //
    }

    public function findWorkFlowAndVersion(string $modelName)
    {
        $workflow = $this->model
            ->query()
            ->with([
                'currentVersion:id,approval_workflow_id,version,is_current',
                'currentVersion.firstStep:id,approval_workflow_version_id',
            ])
            ->where('approvable_type', $modelName)
            ->first();

        return $workflow;
    }

    public function getModelId(string $name, int $id)
    {
        $approvableId = [];
        switch ($name) {
            case 'budget':
                $id = $this->plan
                    ->query()
                    ->where('project_id', $id)
                    ->value('id');
                $approvableId = $id ? [$id] : [];
                break;
            case 'expense':
                $approvableId = $this->expense
                    ->query()
                    ->where('project_id', $id)
                    ->pluck('id')
                    ->toArray();
                break;
            default:
                break;
        }

        return $approvableId;
    }

    public function getNextStep(Approval $approval)
    {
        $nextStep = $approval->version
            ->steps()
            ->with(['approvalStatus', 'role'])
            ->where('order_no', '>', $approval->currentStep->order_no)
            ->orderBy('order_no')
            ->first();

        return $nextStep;
    }
}
