<?php

namespace App\States\Transitions;

use App\States\InReview;
use App\States\Pending;

class SubmitTransition extends ApprovalTransition
{
    public function handle(): InReview
    {
        $this->recordHistory(Pending::$name, InReview::$name);

        return new InReview($this->workflow);
    }
}
