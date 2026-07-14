<?php

namespace App\Http\Controllers\Expense;

use App\Http\Controllers\Controller;
use App\Http\Resources\Expenses\ExpenseApprovalResource;
use App\Http\Resources\Expenses\ExpenseHistoryResource;
use App\Http\Resources\Expenses\ExpenseResource;
use App\Models\Expense;
use App\Repositories\ExpenseRepository;

class ExpenseController extends Controller
{
    public function __construct(private ExpenseRepository $expenseRepo)
    {
        //
    }

    public function index(int $projectId)
    {
        $expenses = Expense::query()
            ->select(['id', 'code'])
            ->with([
                'approval:id,approvable_id,current_step_id,current_status_id',
                'approval.currentStatus:id,name',
                'approval.currentStep:id,is_final',
            ])
            ->where('project_id', $projectId)
            ->whereRelation('approval.currentStatus', 'name', '!=', 'Approved')
            ->get();

        return ExpenseApprovalResource::collection($expenses);
    }

    public function history(int $projectId)
    {
        $expense = Expense::query()
            ->select(
                'id',
                'user_id',
                'project_id',
                'code',
                'total',
                'transaction_date',
            )
            ->with([
                'approval:id,approvable_id,created_by,current_step_id,current_status_id',
                'approval.histories:id,approval_id,acted_by,from_state,to_state',
                'approval.histories.actor:id,name',
                'approval.createdBy:id,name',
            ])
            ->where('project_id', $projectId)
            ->get();

        return ExpenseHistoryResource::collection($expense);
    }

    public function show(int $projectId)
    {
        $expenses = $this->expenseRepo->find($projectId);

        // return response()->json($expenses);
        return ExpenseResource::collection($expenses);
    }

    public function destroy(int $expenseId)
    {
        Expense::destroy($expenseId);

        return response()->json(['message' => 'successfully deleted expense']);
    }
}
