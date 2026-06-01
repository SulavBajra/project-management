<?php

namespace App\States\Transitions;

use App\States\InReview;
use App\States\Rejected;

class RejectTransition extends ApprovalTransition
{
    public function handle(): Rejected
    {
        $this->recordHistory(InReview::$name, Rejected::$name);

        return new Rejected($this->workflow);
    }
}
