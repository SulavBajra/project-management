<?php

namespace App\Http\Controllers\Admin;

use App\Exceptions\ExpenseNotBalanceException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Expense\ExpenseExtractRequest;
use App\Http\Requests\Expense\ExpenseStoreRequest;
use App\Http\Resources\Expenses\ExpenseTransactionsResource;
use App\Models\ExpenseTransaction;
use App\Services\ExpenseService;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Validators\ValidationException;

class ExpenseTransactionController extends Controller
{
    public function __construct(protected ExpenseService $expenseService) {}

    public function import(ExpenseExtractRequest $request)
    {
        $validated = $request->validated();
        try {
            $this->expenseService->extractExpenses(
                $validated["file"],
                $request->user()->id,
                $validated["project_id"],
            );

            return response()->json(
                ["message" => "Expenses imported successfully."],
                201,
            );
        } catch (ValidationException $e) {
            return response()->json(
                [
                    "message" => "Import failed.",
                    "errors" => $e->failures(),
                ],
                422,
            );
        } catch (ExpenseNotBalanceException $e) {
            return response()->json(
                [
                    "message" => $e->getMessage(),
                ],
                422,
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    "message" => $e->getMessage(),
                    "file" => $e->getFile(),
                    "line" => $e->getLine(),
                ],
                500,
            );
        }
    }

    public function storeExpenses(ExpenseStoreRequest $request)
    {
        $validated = $request->validated();
        $projectId = $request->route("project_id");

        $this->expenseService->addExpenses(
            $validated,
            (int) $projectId,
            $request->user()->id,
        );

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
