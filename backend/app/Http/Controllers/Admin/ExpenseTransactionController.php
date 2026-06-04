<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\ExpenseNotBalanceException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Expense\ExpenseExtractRequest;
use App\Http\Requests\Expense\ExpenseStoreRequest;
use App\Http\Resources\Expenses\ExpenseTransactionsResource;
use App\Jobs\ProcessExcelImport;
use App\Models\ExpenseImport;
use App\Models\ExpenseTransaction;
use App\Services\ApprovalService;
use App\Services\ExpenseService;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Validators\ValidationException;

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
        $path = $validated["file"]->store("imports/expneses", "local");
        $import = ExpenseImport::create([
            "user_id" => $request->user()->id,
            "project_id" => $validated["project_id"],
            "status" => "pending",
        ]);

        ProcessExcelImport::dispatch(
            $path,
            $request->user()->id,
            $validated["project_id"],
            $import->id,
        );

        return response()->json(
            [
                "message" => "Import started. Check back for results.",
                "import_id" => $import->id,
            ],
            202,
        );
    }

    public function importStatus(ExpenseImport $import)
    {
        return response()->json([
            "status" => $import->status,
            "errors" => $import->errors,
        ]);
    }

    public function storeExpenses(ExpenseStoreRequest $request)
    {
        $validated = $request->validated();
        $projectId = $request->route("project_id");

        $expense = $this->expenseService->addExpenses(
            $validated,
            (int) $projectId,
            $request->user()->id,
        );
        // $this->approvalService->beginApproval($expense, $request->user());

        return response()->json(
            ["message" => "Expense stored successfully."],
            201,
        );
    }

    public function getExpenses(Request $request)
    {
        $projectId = $request->route("project_id");

        $transactions = ExpenseTransaction::with(["accountHead", "expense"])
            ->whereRelation("expense", "project_id", $projectId)
            ->latest()
            ->paginate(10);

        return ExpenseTransactionsResource::collection($transactions);
    }
}
