<?php

namespace App\Http\Controllers\Budgets;

use App\Exports\BudgetPlanExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\Budget\BudgetAllocateImportRequest;
use App\Http\Requests\Budget\BudgetAllocateStoreRequest;
use App\Http\Resources\Budget\BudgetItemResource;
use App\Jobs\ProcessBudgetImport;
use App\Models\BudgetPlan;
use App\Models\BudgetPlanItem;
use App\Models\ExpenseImport;
use App\Models\Project;
use App\Models\TimelinePeriod;
use App\Repositories\BudgetPlanItemRepository;
use App\Repositories\BudgetPlanRepository;
use App\Services\BudgetAllocationService;
use App\Services\BudgetService;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class BudgetPlanItemController extends Controller
{
    public function __construct(
        private BudgetAllocationService $allocationService,
        private BudgetPlanItemRepository $itemRepo,
        private BudgetPlanRepository $planRepository,
        private BudgetService $budgetService,
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

    public function export(Project $project, BudgetPlan $plan)
    {
        $periods = TimelinePeriod::select("start_date", "end_date", "name")
            ->where("timeline_id", $project->timelines()->pluck("id"))
            ->get()
            ->toArray();
        $data = $this->budgetService->createExcelSkeleton($plan->id);
        return Excel::download(
            new BudgetPlanExport($data, $periods),
            "budget-plan-" . $plan->id . ".xlsx",
        );
    }

    public function import(
        Project $project,
        BudgetPlan $plan,
        BudgetAllocateImportRequest $request,
    ) {
        $validated = $request->validated();
        $path = $validated["file"]->store("imports/budget", "local");
        $import = ExpenseImport::create([
            "user_id" => $request->user()->id,
            "project_id" => $project->id,
            "status" => "pending",
        ]);

        ProcessBudgetImport::dispatch(
            $path,
            $project->id,
            $import->id,
            $plan->id,
        );

        return response()->json(
            [
                "message" => "Import started. Check back for results.",
                "import_id" => $import->id,
            ],
            202,
        );
    }
}
