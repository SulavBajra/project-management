<?php

namespace App\Repositories;

use App\Models\BudgetPlanItem;
use App\Repositories\Contracts\BudgetPlanItemRepositoryInterface;

class BudgetPlanItemRepository implements BudgetPlanItemRepositoryInterface
{
    public function __construct(private BudgetPlanItem $model)
    {
        //
    }

    public function findAllocationsByBudgetPlanId(int $budgetPlanId)
    {
        return BudgetPlanItem::where("budget_plan_id", $budgetPlanId)
            ->with([
                "budgetHead:id,name,code",
                "allocations.timelinePeriod:id,name,start_date,end_date",
            ])
            ->get();
    }
}
