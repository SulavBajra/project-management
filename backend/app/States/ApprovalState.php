<?php

namespace App\States;

use Spatie\ModelStates\State;
use Spatie\ModelStates\StateConfig;

class ApprovalState extends State
{
    public function config(): StateConfig
    {
        return parent::config()
            ->defaultState(Pending::class)
            ->allowTransition(Pending::class, Checked::class)
            ->allowTransition(Pending::class, Rejected::class)
            ->allowTransition(Checked::class, Approved::class)
            ->allowTransition(Checked::class, Rejected::class)
            ->registerStatesFromDirectory(app_path('States'));
    }
}
