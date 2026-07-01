<?php

namespace App\Repositories;

use App\Models\BudgetHeadAllocation;
use App\Models\BudgetPlanItem;

class BudgetHeadAllocationRepository
{
    public function __construct(private BudgetHeadAllocation $allocation)
    {
        //
    }

    public function bulkInsert(array $allocations): void
    {
        BudgetHeadAllocation::insert($allocations);
    }

    public function updateForPeriod(
        BudgetPlanItem $item,
        int $periodId,
        mixed $amount,
    ): void {
        $item->allocations()->createMany([
            [
                "timeline_period_id" => $periodId,
                "allocated_amount" => $amount,
            ],
        ]);
    }

    public function getAllocations(int $planId)
    {
        return $this->allocation
            ->with(["planItem.budgetHead", "timelinePeriod"])
            ->where("budget_plan_id", $planId)
            ->get();
    }

    public function insert(array $allocations): void
    {
        BudgetHeadAllocation::insert($allocations);
    }
}
