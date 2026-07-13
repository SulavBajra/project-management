<?php

namespace App\Observers;

use App\Models\BudgetPlan;

class BudgetObserver
{
    /**
     * Handle the BudgetPlan "created" event.
     */
    public function created(BudgetPlan $budgetPlan): void
    {
        //
    }

    /**
     * Handle the BudgetPlan "updated" event.
     */
    public function updated(BudgetPlan $budgetPlan): void
    {
        //
    }

    /**
     * Handle the BudgetPlan "deleted" event.
     */
    public function deleted(BudgetPlan $budgetPlan): void
    {
        $budgetPlan->approval()->delete();
    }

    /**
     * Handle the BudgetPlan "restored" event.
     */
    public function restored(BudgetPlan $budgetPlan): void
    {
        //
    }

    /**
     * Handle the BudgetPlan "force deleted" event.
     */
    public function forceDeleted(BudgetPlan $budgetPlan): void
    {
        //
    }
}
