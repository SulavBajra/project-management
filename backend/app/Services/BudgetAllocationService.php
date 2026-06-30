<?php

namespace App\Services;

use App\Exceptions\ApprovalExistsException;
use App\Models\BudgetHeadAllocation;
use App\Models\BudgetPlan;
use App\Models\BudgetPlanItem;
use App\Models\Project;
use App\Models\TimelinePeriod;
use App\Repositories\ApprovalRepository;
use App\Repositories\BudgetHeadAllocationRepository;
use App\Repositories\BudgetPlanItemRepository;
use Illuminate\Support\Facades\DB;

class BudgetAllocationService
{
    public function __construct(
        private BudgetPlanItemRepository $itemRepo,
        private BudgetHeadAllocationRepository $allocationRepo,
        private ApprovalRepository $approvalRepo,
    ) {
        //
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

    public function removeAllocations(BudgetPlanItem $item): void
    {
        $item->allocations()->update(["allocated_amount" => null]);
    }

    public function createItemWithAllocations(
        BudgetPlan $plan,
        array $data,
        int $projectId,
    ): void {
        if ($this->approvalRepo->isFinal($projectId)) {
            throw new ApprovalExistsException(
                "Already approved cannot make changes now",
            );
        }

        DB::transaction(function () use ($plan, $data) {
            $item = $this->itemRepo->firstOrCreate(
                $plan,
                $data["budget_head_id"],
            );

            foreach ($data["allocations"] as $allocation) {
                $this->allocationRepo->updateForPeriod(
                    $item,
                    $allocation["period_id"],
                    $allocation["allocated_amount"],
                );
            }
        });
    }
}
