<?php

namespace App\Services;

class ApprovalService
{
    protected ApprovalWorkflow $workflow;

    public function __construct(ApprovalWorkflow $workflow)
    {
        $this->workflow = $workflow;
    }
}
