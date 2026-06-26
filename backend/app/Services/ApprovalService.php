<?php

namespace App\Services;

use App\Exceptions\ApprovalExistsException;
use App\Exceptions\WorkFlowDoesntExistException;
use App\Models\Approvals\Approval;
use App\Repositories\ApprovalRepository;
use App\Repositories\ApprovalWorkflowRepository;
use Illuminate\Support\Facades\DB;

class ApprovalService
{
    public function __construct(
        private ApprovalWorkflowRepository $workflowRepo,
        private ApprovalRepository $approvalRepo,
    ) {
        //
    }

    public function beginApproval(
        int $projectId,
        string $modelName,
        int $userId,
    ): void {
        DB::transaction(function () use ($projectId, $modelName, $userId) {
            //this is to check if a workflow exists for the given model or not
            $workflow = $this->workflowRepo->findWorkFlowAndVersion($modelName);
            if (!$workflow) {
                throw new WorkFlowDoesntExistException();
            }

            $modelId = $this->workflowRepo->getModelId($modelName, $projectId);
            if ($this->approvalRepo->hasApproval($modelName, $modelId[0])) {
                throw new ApprovalExistsException();
            }
            Approval::firstOrCreate(
                [
                    "approvable_type" => $modelName,
                    "approvable_id" => $modelId[0],
                ],
                [
                    "approval_workflow_version_id" => $workflow
                        ->currentVersion()
                        ->first()->id,
                    "created_by" => $userId,
                    "current_step_id" => $workflow->currentVersion()->first()
                        ->firstStep->id,
                    "current_status_id" => $workflow->currentVersion()->first()
                        ->firstStep->approval_status_id,
                ],
            );
        });
    }

    public function nextStep()
    {
        //
    }
}
