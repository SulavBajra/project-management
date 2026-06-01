<?php

namespace App\States\Transitions;

use App\States\Approved;
use App\States\InReview;

class ApproveTransition extends ApprovalTransition
{
    public function handle(): Approved
    {
        $this->recordHistory(InReview::$name, Approved::$name);

        return new Approved($this->workflow);
    }
}
