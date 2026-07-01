<?php

namespace App\Http\Controllers\Expense;

use App\Http\Controllers\Controller;
use App\Http\Resources\Expenses\ExpenseResource;
use App\Models\Expense;

class ExpenseController extends Controller
{
    public function index(int $projectId)
    {
        $expenses = Expense::query()
            ->select(["id", "code"])
            ->with([
                "approval:id,approvable_id,current_step_id,current_status_id",
                "approval.currentStatus:id,name",
                "approval.currentStep:id,is_final",
            ])
            ->where("project_id", $projectId)
            ->whereRelation("approval.currentStatus", "name", "!=", "Approved")
            ->get();
        return ExpenseResource::collection($expenses);
    }
}
