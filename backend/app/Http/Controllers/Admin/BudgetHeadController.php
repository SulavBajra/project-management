<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Budget\BudgetHeadRequest;
use App\Models\BudgetHead;
use App\Models\BudgetPlan;
use App\Models\BudgetPlanItem;
use App\Repositories\BudgetHeadRepository;

class BudgetHeadController extends Controller
{
    public function __construct(private BudgetHeadRepository $budgetHeadRepo)
    {
        //
    }

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

    public function store(BudgetHeadRequest $request)
    {
        $request->validated();

        $budgetHead = BudgetHead::create($request->all());

        return response()->json($budgetHead, 201);
    }

    public function show(BudgetPlanItem $item)
    {
        $heads = $this->budgetHeadRepo->getBudgetHeadsNotInPlan(
            $item->budget_plan_id,
        );
        return response()->json($heads);
    }
}
