<?php

namespace App\Services;

use App\Imports\ExpenseTransactionsImport;
use App\Models\Expense;
use App\Models\ExpenseTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Maatwebsite\Excel\Facades\Excel;

class ExpenseService
{
    public function extractExpenses(
        UploadedFile $file,
        int $userId,
        int $projectId,
    ): void {
        $import = new ExpenseTransactionsImport();

        Excel::import($import, $file);
        $rows = $import->rows;

        DB::transaction(function () use ($rows, $userId, $projectId) {
            $groupedRows = $rows->groupBy("expense_id");

            foreach ($groupedRows as $expenseId => $items) {
                $total = $items->sum("debit");
                $expense = Expense::firstOrCreate(
                    ["code" => "EXP-" . $expenseId, "project_id" => $projectId],
                    [
                        "user_id" => $userId,
                        "total" => $total,
                        "description" => "Imported expense",
                        "transaction_date" => $items->first()[
                            "transaction_date"
                        ],
                    ],
                );

                foreach ($items as $item) {
                    ExpenseTransaction::create([
                        "expense_id" => $expense->id,
                        "account_head_id" => $item["account_head_id"],
                        "debit" => $item["debit"] ?? 0,
                        "credit" => $item["credit"] ?? 0,
                        "transaction_date" => $item["transaction_date"],
                    ]);
                }
            }
        });
    }
}
