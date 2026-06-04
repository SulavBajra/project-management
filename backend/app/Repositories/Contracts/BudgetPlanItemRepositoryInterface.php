<?php

namespace App\Repositories\Contracts;

interface BudgetPlanItemRepositoryInterface
{
    public function findAllocationsByBudgetPlanId(int $budgetPlanId);
}
