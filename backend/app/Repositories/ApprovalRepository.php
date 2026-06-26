<?php

namespace App\Repositories;

use App\Models\Approvals\Approval;

class ApprovalRepository
{
    public function __construct(private Approval $model)
    {
        //
    }

    public function findApproval(string $name, int $id)
    {
        $approval = $this->model
            ->query()
            ->where("approvable_type", $name)
            ->where("approvable_id", $id)
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
}
