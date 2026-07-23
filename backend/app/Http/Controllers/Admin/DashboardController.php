<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Approvals\Approval;
use App\Models\BudgetHeadAllocation;
use App\Models\BudgetPlan;
use App\Models\Expense;
use App\Models\ExpenseTransaction;
use App\Models\Project;
use App\Models\Timeline;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalProject = Project::count();
        $projectCount = Project::active()->count();
        $totalUser = User::count();
        $pendingApprovals = Approval::with(['currentStep', 'currentStatus'])
            ->whereRelation('currentStep', 'role_id', '=', 1)
            ->whereRelation('currentStatus', 'name', '!=', 'Approved')->count();

        return response()->json([
            'total_project' => $totalProject,
            'project_count' => $projectCount,
            'total_users' => $totalUser,
            'pending_approvals' => $pendingApprovals,
        ]);
    }

    public function kpi()
    {
        $totalProjects = Project::count();
        $activeProjects = Project::active()->count();
        $totalUsers = User::count();

        $pendingApprovals = Approval::with(['currentStep', 'currentStatus'])
            ->whereRelation('currentStep', 'role_id', '=', 1)
            ->whereRelation('currentStatus', 'name', '!=', 'Approved')
            ->count();

        $totalBudgeted = (float) BudgetHeadAllocation::sum('allocated_amount');
        $totalExpenses = (float) ExpenseTransaction::sum('debit');
        $budgetUtilization = $totalBudgeted > 0
            ? round(($totalExpenses / $totalBudgeted) * 100, 1)
            : 0;

        $activeTimelines = Timeline::where('end_date', '>=', now())->count();

        $overdueProjects = Project::whereHas('timelines', function ($q) {
            $q->where('end_date', '<', now());
        })->count();

        $recentProjects = Project::latest()
            ->take(5)
            ->get(['id', 'code', 'name', 'is_active', 'created_at']);

        $recentExpenses = Expense::with('project:id,code,name')
            ->latest()
            ->take(5)
            ->get(['id', 'code', 'description', 'total', 'transaction_date', 'project_id']);

        $recentApprovals = Approval::with(['currentStep', 'currentStatus', 'approvable'])
            ->whereRelation('currentStatus', 'name', '!=', 'Approved')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'total_projects' => $totalProjects,
            'active_projects' => $activeProjects,
            'total_users' => $totalUsers,
            'pending_approvals' => $pendingApprovals,
            'total_budgeted' => $totalBudgeted,
            'total_expenses' => $totalExpenses,
            'budget_utilization_percentage' => $budgetUtilization,
            'active_timelines' => $activeTimelines,
            'overdue_projects' => $overdueProjects,
            'recent_projects' => $recentProjects,
            'recent_expenses' => $recentExpenses,
            'recent_approvals' => $recentApprovals,
        ]);
    }

    public function chart()
    {
        $totalBudgeted = (float) BudgetHeadAllocation::sum('allocated_amount');
        $totalExpenses = (float) ExpenseTransaction::sum('debit');
        $variance = $totalBudgeted - $totalExpenses;
        $variancePercentage = $totalBudgeted > 0
            ? round(($variance / $totalBudgeted) * 100, 1)
            : 0;

        $monthlyExpenses = ExpenseTransaction::select(
            DB::raw("DATE_FORMAT(transaction_date, '%Y-%m') as month"),
            DB::raw('COALESCE(SUM(debit), 0) as amount')
        )
            ->where('transaction_date', '>=', now()->subMonths(12))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $trend = collect();
        $start = now()->subMonths(12)->startOfMonth();
        for ($i = 0; $i <= 12; $i++) {
            $month = $start->copy()->addMonths($i)->format('Y-m');
            $entry = $monthlyExpenses->firstWhere('month', $month);
            $trend->push([
                'month' => $month,
                'amount' => $entry ? (float) $entry->amount : 0,
            ]);
        }

        $projects = Project::with('timelines.periods')->get();
        $projectComparisons = [];

        foreach ($projects as $project) {
            $timeline = $project->timelines->first();
            if (! $timeline) {
                continue;
            }

            $periodIds = $timeline->periods->pluck('id');

            $budgetPlan = BudgetPlan::where('project_id', $project->id)
                ->with(['items.allocations' => function ($q) use ($periodIds) {
                    $q->whereIn('timeline_period_id', $periodIds);
                }])
                ->first();

            $budgeted = $budgetPlan
                ? (float) $budgetPlan->items->flatMap->allocations->sum('allocated_amount')
                : 0;

            $actual = (float) ExpenseTransaction::whereHas(
                'expense',
                fn ($q) => $q->where('project_id', $project->id),
            )->sum('debit');

            $projectComparisons[] = [
                'project_id' => $project->id,
                'project_name' => $project->name,
                'budgeted' => $budgeted,
                'actual' => $actual,
            ];
        }

        return response()->json([
            'budget_vs_actual' => [
                'budgeted' => $totalBudgeted,
                'actual' => $totalExpenses,
                'variance' => $variance,
                'variance_percentage' => $variancePercentage,
            ],
            'monthly_expense_trend' => $trend,
            'project_comparisons' => $projectComparisons,
        ]);
    }
}
