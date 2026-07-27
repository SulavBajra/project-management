<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Expense\ExpenseExtractRequest;
use App\Http\Requests\Expense\ExpenseStoreRequest;
use App\Http\Resources\Expenses\ExpenseTransactionsResource;
use App\Jobs\ProcessExcelImport;
use App\Models\BudgetPlan;
use App\Models\ExpenseImport;
use App\Models\ExpenseTransaction;
use App\Services\ApprovalService;
use App\Services\ExpenseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExpenseTransactionController extends Controller
{
    public function __construct(
        private ExpenseService $expenseService,
        private ApprovalService $approvalService,
    ) {
        //
    }

    public function import(ExpenseExtractRequest $request)
    {
        $validated = $request->validated();
        $path = $validated['file']->store('imports/expneses', 'local');
        $import = ExpenseImport::create([
            'user_id' => $request->user()->id,
            'project_id' => $validated['project_id'],
            'status' => 'pending',
        ]);

        ProcessExcelImport::dispatch(
            $path,
            $request->user()->id,
            $validated['project_id'],
            $import->id,
        );

        // $this->approvalService->beginApproval();
        return response()->json(
            [
                'message' => 'Import started. Check back for results.',
                'import_id' => $import->id,
            ],
            202,
        );
    }

    public function importStatus(ExpenseImport $import)
    {
        return response()->json([
            'data' => [
                'id' => $import->id,
                'status' => $import->status,
                'error_message' => $import->errors,
            ],
        ]);
    }

    public function store(ExpenseStoreRequest $request)
    {
        $validated = $request->validated();
        $projectId = $request->route('project_id');

        $planExists = BudgetPlan::where('project_id', $projectId)->exists();

        if (! $planExists) {
            return response()->json([
                'message' => 'Create budget plan first',
            ], 400);
        }

        DB::transaction(function () use ($validated, $projectId, $request) {
            $expense = $this->expenseService->addExpenses(
                $validated,
                (int) $projectId,
                $request->user()->id,
            );
            $this->approvalService->beginApproval(
                $expense->id,
                'expense',
                $request->user()->id,
            );
        });

        return response()->json(
            ['message' => 'Expense stored successfully.'],
            201,
        );
    }

    public function index(Request $request)
    {
        $projectId = $request->route('project_id');

        $transactions = ExpenseTransaction::with([
            'accountHead',
            'expense.approval.currentStatus',
        ])
            ->whereRelation('expense', 'project_id', $projectId)
            ->latest()
            ->paginate(12);

        return ExpenseTransactionsResource::collection($transactions);
    }
}
