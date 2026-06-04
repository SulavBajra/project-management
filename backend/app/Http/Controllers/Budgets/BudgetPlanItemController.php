<?php

namespace App\Http\Controllers\Budgets;

use App\Http\Controllers\Controller;
use App\Http\Resources\Budget\BudgetAllocationResource;
use App\Http\Resources\Budget\BudgetItemResource;
use App\Models\Project;
use App\Repositories\BudgetPlanItemRepository;
use App\Repositories\BudgetPlanRepository;

class BudgetPlanItemController extends Controller
{
    public function __construct(
        private BudgetPlanItemRepository $planItemRepository,
        private BudgetPlanRepository $planRepository,
    ) {
        //
    }

    public function show(Project $project)
    {
        $planId = $this->planRepository->getId($project->id);
        $items = $this->planItemRepository->findAllocationsByBudgetPlanId(
            $planId,
        );

        return BudgetItemResource::collection($items);
    }
}
