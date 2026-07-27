<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Budget\BudgetHeadRequest;
use App\Http\Requests\Budget\BudgetHeadUpdateRequest;
use App\Models\BudgetHead;
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
        $budgetHeads = BudgetHead::select('id', 'name', 'code')
            ->orderBy('name')
            ->get();

        return response()->json($budgetHeads);
    }

    public function getBudgetHeadStats()
    {
        $count = BudgetHead::count();

        return response()->json(['count' => $count]);
    }

    public function store(BudgetHeadRequest $request)
    {
        $validated = $request->validated();

        $budgetHead = BudgetHead::create($validated);

        return response()->json($budgetHead, 201);
    }

    public function update(BudgetHeadUpdateRequest $request, BudgetHead $budgetHead)
    {
        $validated = $request->validated();

        $budgetHead->update($validated);

        return response()->json($budgetHead);
    }

    public function destroy(BudgetHead $budgetHead)
    {
        $budgetHead->delete();

        return response()->json(['message' => 'Budget head deleted successfully']);
    }

    public function show(BudgetPlanItem $item)
    {
        $heads = $this->budgetHeadRepo->getBudgetHeadsNotInPlan(
            $item->budget_plan_id,
        );

        return response()->json($heads);
    }
}
