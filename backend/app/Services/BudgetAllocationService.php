<?php

namespace App\Services;

use App\Models\BudgetHeadAllocation;
use App\Models\BudgetPlanItem;
use App\Models\Project;
use App\Models\Timeline;
use App\Models\TimelinePeriod;

class BudgetAllocationService
{
    public function allocateBudget(array $data)
    {
        BudgetHeadAllocation::create($data);
    }

    public function createAllocationModel(
        array $budgetPlanItemIds,
        int $projectId,
    ): void {
        $timeline = Project::findOrFail($projectId)
            ->timelines()
            ->where("end_date", ">", now())
            ->first();

        if (!$timeline) {
            throw new \Exception("No active timeline found for this project.");
        }

        $periods = TimelinePeriod::where("timeline_id", $timeline->id)
            ->orderBy("name")
            ->pluck("id");

        if ($periods->isEmpty()) {
            throw new \Exception("No timeline periods found for this project.");
        }

        $allocations = [];
        foreach ($budgetPlanItemIds as $itemId) {
            foreach ($periods as $periodId) {
                $allocations[] = [
                    "budget_plan_item_id" => $itemId,
                    "timeline_period_id" => $periodId,
                    "allocated_amount" => null,
                    "created_at" => now(),
                    "updated_at" => now(),
                ];
            }
        }

        BudgetHeadAllocation::insert($allocations);
    }

    public function updateAllocations(
        BudgetPlanItem $item,
        array $allocations,
    ): void {
        foreach ($allocations as $allocation) {
            $item
                ->allocations()
                ->where("timeline_period_id", $allocation["period_id"])
                ->update([
                    "allocated_amount" => $allocation["allocated_amount"],
                ]);
        }
    }
}
