<?php

namespace App\Http\Controllers\Budgets;

use App\Http\Controllers\Controller;
use App\Http\Requests\Budget\BudgetAllocateStoreRequest;
use App\Http\Resources\Budget\BudgetItemResource;
use App\Models\BudgetPlan;
use App\Models\BudgetPlanItem;
use App\Models\Project;
use App\Repositories\BudgetPlanItemRepository;
use App\Repositories\BudgetPlanRepository;
use App\Services\BudgetAllocationService;

class BudgetPlanItemController extends Controller
{
    public function __construct(
        private BudgetAllocationService $allocationService,
        private BudgetPlanItemRepository $itemRepo,
        private BudgetPlanRepository $planRepository,
    ) {
        //
    }

    public function store(BudgetPlan $plan, BudgetAllocateStoreRequest $request)
    {
        $validated = $request->validated();
        $this->allocationService->createItemWithAllocations($plan, $validated);

        return response()->json([
            "message" => "Budget plan item created successfully",
        ]);
    }

    public function show(Project $project)
    {
        $planId = $this->planRepository->getId($project->id);

        if (!$planId) {
            return response()->json(["data" => []]);
        }

        $items = $this->itemRepo->findAllocationsByBudgetPlanId($planId);

        return response()->json([
            "budget_plan_id" => $planId,
            "data" => BudgetItemResource::collection($items),
        ]);
    }

    public function destroy(BudgetPlanItem $item)
    {
        $this->itemRepo->deleteItemWithAllocations($item);

        return response()->json([
            "message" => "Budget plan item deleted successfully",
        ]);
    }
}
