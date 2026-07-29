<?php

namespace App\Repositories;

use App\Models\Approvals\Approval;

class ApprovalRepository
{
    public function __construct(private Approval $model)
    {
        //
    }

    public function findApproval(int $id)
    {
        $approval = $this->model
            ->query()
            ->with([
                'version',
                'currentStep:id,role_id,order_no,is_final,approval_status_id,is_auto_approve',
                'currentStep.approvalStatus:id,name',
                'currentStep.role',
                'currentStatus',
            ])
            ->where('id', $id)
            ->first();

        return $approval;
    }

    public function hasApproval(string $name, int $id)
    {
        return $this->model
            ->query()
            ->where('approvable_type', $name)
            ->where('approvable_id', $id)
            ->exists();
    }

    public function updateApproval(Approval $approval, array $approvalData)
    {
        return $approval->update($approvalData);
    }

    public function isFinal(int $projectId): bool
    {
        $approval = $this->findApproval($projectId);

        return $approval->currentStep->is_final;
    }

    public function findApprovalFromRole(int $roleId)
    {
        return $this->model
            ->query()
            ->select(
                'id',
                'approvable_id',
                'approvable_type',
                'created_by',
                'current_step_id',
                'current_status_id',
            )
            ->with([
                'approvable:id,project_id',
                'approvable.project:id,name',
                'createdBy:id,name',
                'currentStatus:id,name',
                'currentStep:id,role_id,order_no,is_final,approval_status_id',
                'currentStep.approvalStatus:id,name',
            ])
            ->whereRelation('currentStep', 'role_id', '=', $roleId)
            ->whereRelation('currentStatus', 'name', '!==', "Approved")
            ->paginate(10);
    }
}
