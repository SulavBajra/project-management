<?php

namespace App\States;

class CheckedToApproved extends ApprovalTransition
{
    public function handle(): Approved
    {
        $this->recordHistory(
            Checked::getMorphClass(),
            Approved::getMorphClass(),
        );

        return new Approved;
    }
}
