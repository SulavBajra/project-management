<?php

namespace App\Http\Controllers\Budgets;

use App\Http\Controllers\Controller;
use App\Http\Requests\Budget\BudgetPlanStoreRequest;
use App\Http\Requests\Budget\BudgetPlanUpdateRequest;
use App\Http\Resources\BudgetPlan\BudgetPlanResource;
use App\Models\BudgetPlanItem;
use App\Models\Project;
use App\Repositories\BudgetPlanRepository;
use App\Services\BudgetAllocationService;
use Illuminate\Support\Facades\DB;

class BudgetPlanController extends Controller
{
    public function __construct(
        private BudgetPlanRepository $budgetPlanRepository,
        private BudgetAllocationService $budgetAllocationService,
    ) {
        //
    }

    public function store(BudgetPlanStoreRequest $request, Project $project)
    {
        $validated = $request->validated();

        DB::transaction(function () use ($validated, $project) {
            $plan = $this->budgetPlanRepository->create(
                $project->id,
                $validated["name"],
                $validated["budget_head_ids"],
            );

            $this->budgetAllocationService->createAllocationModel(
                $plan->items->pluck("id")->toArray(),
                $project->id,
            );
        });

        return response()->json(
            ["message" => "Budget plan created successfully"],
            201,
        );
    }

    public function show(Project $project)
    {
        $plan = $this->budgetPlanRepository->find($project->id);
        if (!$plan) {
            return response()->json(200);
        }
        return response()->json(new BudgetPlanResource($plan));
    }

    public function update(
        BudgetPlanUpdateRequest $request,
        BudgetPlanItem $item,
    ) {
        $this->budgetAllocationService->updateAllocations(
            $item,
            $request->validated()["allocations"],
        );

        return response()->json([
            "message" => "Allocations updated successfully",
        ]);
    }

    public function destroy(BudgetPlanItem $item)
    {
        $this->budgetAllocationService->removeAllocations($item);
        return response()->json([
            "message" => "Item removed successfully",
        ]);
    }
}
