<?php

namespace App\Repositories;

use App\Models\BudgetPlan;
use App\Models\BudgetPlanItem;
use App\Repositories\Contracts\BudgetPlanItemRepositoryInterface;
use Illuminate\Support\Facades\DB;

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

    public function deleteItemWithAllocations(BudgetPlanItem $item): void
    {
        DB::transaction(function () use ($item) {
            $item->allocations()->delete();
            $item->delete();
        });
    }

    public function firstOrCreate(
        BudgetPlan $plan,
        int $budgetHeadId,
    ): BudgetPlanItem {
        return $plan->items()->firstOrCreate([
            "budget_head_id" => $budgetHeadId,
        ]);
    }

    public function delete(BudgetPlanItem $item): void
    {
        $item->delete();
    }
}
