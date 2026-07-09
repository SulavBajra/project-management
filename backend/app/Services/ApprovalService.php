<?php

namespace App\Services;

use App\Exceptions\ApprovalExistsException;
use App\Exceptions\HasNoAccessException;
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
            // this is to check if a workflow exists for the given model or not
            $workflow = $this->workflowRepo->findWorkFlowAndVersion($modelName);
            if (! $workflow) {
                throw new WorkFlowDoesntExistException;
            }

            if ($this->approvalRepo->hasApproval($modelName, $modelId)) {
                throw new ApprovalExistsException;
            }
            DB::transaction(function () use (
                $workflow,
                $modelName,
                $modelId,
                $userId,
            ) {
                $version = $workflow->currentVersion()->first();
                $firstStatus = $version->statuses()->first();

                $approval = Approval::create([
                    'approvable_type' => $modelName,
                    'approvable_id' => $modelId,
                    'approval_workflow_version_id' => $version->id,
                    'created_by' => $userId,
                    'current_step_id' => $version->firstStep->id,
                    'current_status_id' => $firstStatus->id,
                ]);
                ApprovalHistory::create([
                    'approval_id' => $approval->id,
                    'approval_step_id' => $approval->current_step_id,
                    'approval_workflow_version_id' => $approval->approval_workflow_version_id,
                    'acted_by' => $userId,
                    'from_state' => null,
                    'to_state' => $approval->currentStatus->name,
                    'comment' => 'Started Approval',
                ]);
                $this->autoApproval($approval->id, $userId, "Auto Approved");
            });
        });
    }

    public function advanceStep(
        int $approvalId,
        User $user,
        ?string $comment = null,
    ) {
        $approval = $this->approvalRepo->findApproval($approvalId);
        $nextStep = $this->workflowRepo->getNextStep($approval);
        $currentStep = $approval->currentStep;
        if (! $user->hasRole($currentStep->role)) {
            throw new HasNoAccessException;
        }
        if ($currentStep->is_final) {
            $this->finalStep($approval, $user, $comment);

            return;
        }
        DB::transaction(function () use (
            $approval,
            $comment,
            $currentStep,
            $nextStep,
            $user,
        ) {
            $historyData = [
                'approval_id' => $approval->id,
                'approval_step_id' => $approval->current_step_id,
                'approval_workflow_version_id' => $approval->approval_workflow_version_id,
                'acted_by' => $user->id,
                'from_state' => $approval->currentStatus->name,
                'to_state' => $nextStep->approvalStatus->name,
                'comment' => $comment,
            ];
            $approval->update([
                'current_step_id' => $nextStep->id,
                'current_status_id' => $currentStep->approval_status_id,
            ]);
            $approval->histories()->create($historyData);
            $this->autoApproval($approval->id, $user->id, "Auto Approved");
        });
    }

    public function finalStep(
        Approval $approval,
        User $user,
        ?string $comment = null,
    ) {
        DB::transaction(function () use ($approval, $comment, $user) {
            $historyData = [
                'approval_id' => $approval->id,
                'approval_step_id' => $approval->current_step_id,
                'approval_workflow_version_id' => $approval->approval_workflow_version_id,
                'acted_by' => $user->id,
                'from_state' => $approval->currentStatus->name,
                'to_state' => $approval->currentStep->approvalStatus->name,
                'comment' => $comment,
            ];
            $approval->update([
                'current_step_id' => $approval->currentStep->id,
                'current_status_id' => $approval->currentStep->approval_status_id,
            ]);
            $approval->histories()->create($historyData);
        });
    }

    public function rejectRequest(
        int $approvalId,
        int $userId,
        ?string $comment = null,
    ) {
        $approval = $this->approvalRepo->findApproval($approvalId);
        $rejectStatus = ApprovalStatus::where('name', 'Rejected')->first();

        if (! $rejectStatus) {
            throw new \RuntimeException('Rejected status not found');
        }
        DB::transaction(function () use (
            $approval,
            $userId,
            $rejectStatus,
            $comment,
        ) {
            $data = [
                'approval_id' => $approval->id,
                'approval_step_id' => $approval->current_step_id,
                'approval_workflow_version_id' => $approval->approval_workflow_version_id,
                'acted_by' => $userId,
                'from_state' => $approval->currentStatus->name,
                'to_state' => $rejectStatus->name,
                'comment' => $comment,
            ];
            $approval->histories()->create($data);
            $approval->update(['current_status_id' => $rejectStatus->id]);
        });
    }

    public function autoApproval(int $approvalId, int $userId, ?string $comment = null)
    {
        $user = User::find($userId);
        $approval = $this->approvalRepo->findApproval($approvalId);
        if ($approval->currentStep->is_auto_approve) {
            $approval = $this->approvalRepo->findApproval($approvalId);
            $nextStep = $this->workflowRepo->getNextStep($approval);
            $currentStep = $approval->currentStep;
            if ($currentStep->is_final) {
                $this->finalStep($approval, $user, $comment);

                return;
            }
            DB::transaction(function () use (
                $approval,
                $comment,
                $currentStep,
                $nextStep,
                $user,
            ) {
                $historyData = [
                    'approval_id' => $approval->id,
                    'approval_step_id' => $approval->current_step_id,
                    'approval_workflow_version_id' => $approval->approval_workflow_version_id,
                    'acted_by' => $user->id,
                    'from_state' => $approval->currentStatus->name,
                    'to_state' => $nextStep->approvalStatus->name,
                    'comment' => $comment,
                ];
                $approval->update([
                    'current_step_id' => $nextStep->id,
                    'current_status_id' => $currentStep->approval_status_id,
                ]);
                $approval->histories()->create($historyData);
                if ($currentStep->is_auto_approve) {
                    $this->autoApproval($approval->id, $user->id, 'Auto approved');
                }
            });
        }
    }
}
