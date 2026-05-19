<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
        return response()->json(["count" => $count]);
    }
}
