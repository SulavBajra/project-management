<?php

namespace App\Services;

use App\Exceptions\ApprovalExistsException;
use App\Exceptions\HasNoAccessException;
use App\Exceptions\NoNextStepException;
use App\Exceptions\WorkFlowDoesntExistException;
use App\Models\Approvals\Approval;
use App\Models\Approvals\ApprovalHistory;
use App\Models\Approvals\ApprovalStatus;
use App\Models\User;
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
        int $modelId,
        string $modelName,
        int $userId,
    ): void {
        DB::transaction(function () use ($modelId, $modelName, $userId) {
            //this is to check if a workflow exists for the given model or not
            $workflow = $this->workflowRepo->findWorkFlowAndVersion($modelName);
            if (!$workflow) {
                throw new WorkFlowDoesntExistException();
            }

            if ($this->approvalRepo->hasApproval($modelName, $modelId)) {
                throw new ApprovalExistsException();
            }
            $version = $workflow->currentVersion()->first();
            Approval::create([
                "approvable_type" => $modelName,
                "approvable_id" => $modelId,
                "approval_workflow_version_id" => $version->id,
                "created_by" => $userId,
                "current_step_id" => $version->firstStep->id,
                "current_status_id" => $version->firstStep->approval_status_id,
            ]);
        });
    }

    public function test(int $projectId, User $user)
    {
        $approval = $this->approvalRepo->findApproval($projectId);
        $nextStep = $this->workflowRepo->getNextStep($approval);
        return !$user->hasRole($nextStep->role);
        //
    }

    public function advanceStep(
        int $approvalId,
        User $user,
        ?string $comment = null,
    ) {
        $approval = $this->approvalRepo->findApproval($approvalId);
        $nextStep = $this->workflowRepo->getNextStep($approval);
        if (!$nextStep) {
            throw new NoNextStepException();
        }
        if (!$user->hasRole($nextStep->role)) {
            throw new HasNoAccessException();
        }
        DB::transaction(function () use (
            $approval,
            $comment,
            $nextStep,
            $user,
        ) {
            $data = [
                "current_step_id" => $nextStep->id,
                "current_status_id" => $nextStep->approval_status_id,
            ];
            ApprovalHistory::create([
                "approval_id" => $approval->id,
                "approval_step_id" => $approval->current_step_id,
                "approval_workflow_version_id" =>
                    $approval->approval_workflow_version_id,
                "acted_by" => $user->id,
                "from_state" => $approval->currentStatus->name,
                "to_state" => $nextStep->approvalStatus->name,
                "comment" => $comment,
            ]);
            $approval->update($data);
        });
    }

    public function rejectRequest(
        int $approvalId,
        int $userId,
        ?string $comment = null,
    ) {
        $approval = $this->approvalRepo->findApproval($approvalId);
        $rejectStatus = ApprovalStatus::where("name", "Rejected")->first();

        if (!$rejectStatus) {
            throw new \RuntimeException("Rejected status not found");
        }
        DB::transaction(function () use (
            $approval,
            $userId,
            $rejectStatus,
            $comment,
        ) {
            $data = [
                "approval_id" => $approval->id,
                "approval_step_id" => $approval->current_step_id,
                "approval_workflow_version_id" =>
                    $approval->approval_workflow_version_id,
                "acted_by" => $userId,
                "from_state" => $approval->currentStatus->name,
                "to_state" => $rejectStatus->name,
                "comment" => $comment,
            ];
            $approval->histories()->create($data);
            $approval->update(["current_status_id" => $rejectStatus->id]);
        });
    }
}
