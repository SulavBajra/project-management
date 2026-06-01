<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Budget\BudgetHeadRequest;
use App\Models\BudgetHead;

class BudgetHeadController extends Controller
{
    public function getBudgetHeads()
    {
        $budgetHeads = BudgetHead::paginate(10);

        return response()->json($budgetHeads);
    }

    public function getBudgetHeadStats()
    {
        $count = BudgetHead::count();

        return response()->json(['count' => $count]);
    }

    public function createBudgetHead(BudgetHeadRequest $request)
    {
        $request->validated();

        $budgetHead = BudgetHead::create($request->all());

        return response()->json($budgetHead, 201);
    }
}
