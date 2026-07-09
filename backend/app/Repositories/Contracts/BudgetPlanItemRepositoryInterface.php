<?php

namespace App\Repositories\Contracts;

use App\Models\BudgetPlan;
use App\Models\BudgetPlanItem;

interface BudgetPlanItemRepositoryInterface
{
    public function findAllocationsByBudgetPlanId(int $budgetPlanId);

    public function deleteItemWithAllocations(BudgetPlanItem $item): void;

    public function firstOrCreate(
        BudgetPlan $plan,
        int $budgetHeadId,
    ): BudgetPlanItem;
}
