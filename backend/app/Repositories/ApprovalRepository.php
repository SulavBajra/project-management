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
                "version",
                "currentStep:id,role_id,order_no,is_final",
                "currentStatus",
            ])
            ->where("id", $id)
            ->first();
        return $approval;
    }

    public function hasApproval(string $name, int $id)
    {
        return $this->model
            ->query()
            ->where("approvable_type", $name)
            ->where("approvable_id", $id)
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
}
