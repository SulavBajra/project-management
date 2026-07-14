<?php

namespace App\Http\Controllers\Report;

use App\Http\Controllers\Controller;
use App\Models\BudgetPlan;
use App\Models\ExpenseTransaction;
use App\Models\Project;
use App\Services\ReportService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(private readonly ReportService $reportService)
    {
        //
    }

    public function show(Request $request, int $projectId)
    {
        $project = Project::findOrFail($projectId);

        $timeline = $project->timelines()->first();
        if (! $timeline) {
            return response()->json(['message' => 'No timeline found for this project.'], 404);
        }

        $allPeriods = $timeline->periods()->orderBy('start_date')->get();

        $periodIdsParam = $request->query('period_ids');
        if ($periodIdsParam) {
            $selectedIds = array_map('intval', explode(',', $periodIdsParam));
            $selectedPeriods = $allPeriods->whereIn('id', $selectedIds);
        } else {
            $selectedPeriods = $allPeriods;
        }

        $availablePeriods = $allPeriods->map(fn ($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'start_date' => $p->start_date->toDateString(),
            'end_date' => $p->end_date->toDateString(),
        ]);

        if ($selectedPeriods->isEmpty()) {
            return response()->json([
                'project' => ['id' => $project->id, 'name' => $project->name],
                'totals' => ['budgeted' => 0, 'actual' => 0, 'variance' => 0, 'variance_percentage' => 0],
                'heads' => [],
                'available_periods' => $availablePeriods,
                'selected_period_ids' => [],
            ]);
        }

        $periodIds = $selectedPeriods->pluck('id');

        $firstPeriod = $selectedPeriods->sortBy('start_date')->first();
        $lastPeriod = $selectedPeriods->sortByDesc('end_date')->first();

        $budgetPlan = BudgetPlan::where('project_id', $projectId)
            ->with(['items.budgetHead', 'items.allocations' => function ($q) use ($periodIds) {
                $q->whereIn('timeline_period_id', $periodIds);
            }])
            ->first();

        $expenseTransactions = ExpenseTransaction::selectRaw('budget_head_id, SUM(debit) as total_actual')
            ->whereHas('expense', fn ($q) => $q->where('project_id', $projectId))
            ->whereBetween('transaction_date', [$firstPeriod->start_date, $lastPeriod->end_date])
            ->groupBy('budget_head_id')
            ->get()
            ->keyBy('budget_head_id');

        if (! $budgetPlan) {
            return response()->json([
                'project' => ['id' => $project->id, 'name' => $project->name],
                'totals' => ['budgeted' => 0, 'actual' => 0, 'variance' => 0, 'variance_percentage' => 0],
                'heads' => [],
                'available_periods' => $availablePeriods,
                'selected_period_ids' => $periodIds,
            ]);
        }

        $heads = [];
        $totalBudgeted = 0;
        $totalActual = 0;

        foreach ($budgetPlan->items as $item) {
            $budgetHead = $item->budgetHead;
            if (! $budgetHead) {
                continue;
            }
            $budgeted = (float) $item->allocations->sum('allocated_amount');
            $actual = (float) ($expenseTransactions->get($budgetHead->id)?->total_actual ?? 0);
            $variance = $budgeted - $actual;
            $variancePercentage = $budgeted > 0 ? round(($variance / $budgeted) * 100, 2) : 0;

            $totalBudgeted += $budgeted;
            $totalActual += $actual;

            $heads[] = [
                'head_id' => $budgetHead->id,
                'head_name' => $budgetHead->name,
                'head_code' => $budgetHead->code,
                'budgeted' => $budgeted,
                'actual' => $actual,
                'variance' => $variance,
                'variance_percentage' => $variancePercentage,
            ];
        }

        $uncategorizedActual = (float) ($expenseTransactions->get(null)?->total_actual ?? 0);
        if ($uncategorizedActual > 0) {
            $totalActual += $uncategorizedActual;
            $heads[] = [
                'head_id' => null,
                'head_name' => 'Uncategorized',
                'head_code' => null,
                'budgeted' => 0,
                'actual' => $uncategorizedActual,
                'variance' => -$uncategorizedActual,
                'variance_percentage' => -100,
            ];
        }

        $totalVariance = $totalBudgeted - $totalActual;
        $totalVariancePercentage = $totalBudgeted > 0 ? round(($totalVariance / $totalBudgeted) * 100, 2) : 0;

        return response()->json([
            'project' => ['id' => $project->id, 'name' => $project->name],
            'totals' => [
                'budgeted' => $totalBudgeted,
                'actual' => $totalActual,
                'variance' => $totalVariance,
                'variance_percentage' => $totalVariancePercentage,
            ],
            'heads' => $heads,
            'available_periods' => $availablePeriods,
            'selected_period_ids' => $periodIds,
        ]);
    }

    public function index()
    {
        $today = Carbon::today();
        $projects = Project::all();

        $result = [];

        foreach ($projects as $project) {
            $timeline = $project->timelines()->first();
            if (! $timeline) {
                continue;
            }

            $selectedPeriods = $timeline->periods()->orderBy('start_date')->get();

            if ($selectedPeriods->isEmpty()) {
                continue;
            }

            $periodIds = $selectedPeriods->pluck('id');

            $budgetPlan = BudgetPlan::where('project_id', $project->id)
                ->with(['items.allocations' => function ($q) use ($periodIds) {
                    $q->whereIn('timeline_period_id', $periodIds);
                }])
                ->first();

            $budgeted = $budgetPlan ? (float) $budgetPlan->items->flatMap->allocations->sum('allocated_amount') : 0;

            $actual = (float) ExpenseTransaction::whereHas('expense', fn ($q) => $q->where('project_id', $project->id))
                ->sum('debit');

            $variance = $budgeted - $actual;
            $variancePercentage = $budgeted > 0 ? round(($variance / $budgeted) * 100, 2) : 0;

            $result[] = [
                'project_id' => $project->id,
                'project_name' => $project->name,
                'budgeted' => $budgeted,
                'actual' => $actual,
                'variance' => $variance,
                'variance_percentage' => $variancePercentage,
            ];
        }

        return response()->json(['projects' => $result]);
    }
}
