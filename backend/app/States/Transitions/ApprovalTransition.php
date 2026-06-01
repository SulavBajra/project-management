<?php

namespace App\States\Transitions;

use App\Models\Approvals\ApprovalHistory;
use App\Models\Approvals\ApprovalStep;
use App\Models\Approvals\ApprovalWorkflow;
use App\Models\User;
use Spatie\ModelStates\Transition;

abstract class ApprovalTransition extends Transition
{
    public function __construct(
        protected ApprovalWorkflow $workflow,
        protected User $user,
        protected ?ApprovalStep $step = null,
        protected ?string $comment = null,
    ) {
        //
    }

    protected function recordHistory(string $fromState, string $toState): void
    {
        ApprovalHistory::create([
            'approval_workflow_id' => $this->workflow->id,
            'approval_step_id' => $this->step?->id,
            'acted_by' => $this->user->id,
            'from_state' => $fromState,
            'to_state' => $toState,
            'comment' => $this->comment,
        ]);
    }
}
