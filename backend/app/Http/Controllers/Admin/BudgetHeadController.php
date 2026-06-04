<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Budget\BudgetHeadRequest;
use App\Http\Resources\Budget\BudgetAllocationResource;
use App\Models\BudgetHead;
use App\Models\BudgetHeadAllocation;
use App\Models\BudgetPlanItem;
use App\Models\Project;
use Illuminate\Http\Request;

class BudgetHeadController extends Controller
{
    public function index()
    {
        $budgetHeads = BudgetHead::select("id", "name", "code")
            ->orderBy("name")
            ->get();

        return response()->json($budgetHeads);
    }

    public function getBudgetHeadStats()
    {
        $count = BudgetHead::count();

        return response()->json(["count" => $count]);
    }

    public function createBudgetHead(BudgetHeadRequest $request)
    {
        $request->validated();

        $budgetHead = BudgetHead::create($request->all());

        return response()->json($budgetHead, 201);
    }

    public function allocateBudgetHead(Request $request, Project $project)
    {
        $request->validate([
            "budget_heads" => "required|exists:budget_heads,id",
            "amount" => "required|numeric",
        ]);

        BudgetHeadAllocation::create([
            "project_id" => $project->id,
            "budget_head_id" => $request->budget_head_id,
            "amount" => $request->amount,
        ]);

        return response()->json([
            "message" => "Budget head allocated successfully",
        ]);
    }
}
