<?php

namespace App\Services;

use App\Exceptions\ExpenseNotBalanceException;
use App\Imports\ExpenseTransactionsImport;
use App\Models\AccountHead;
use App\Models\Expense;
use App\Models\ExpenseTransaction;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class ExpenseService
{
    public function extractExpenses(
        UploadedFile $file,
        int $userId,
        int $projectId,
    ): void {
        $import = new ExpenseTransactionsImport();

        DB::transaction(function () use ($import, $file, $userId, $projectId) {
            Excel::import($import, $file);
            $rows = $import->rows;
            $groupedRows = $rows->groupBy("expense_code");
            Log::info("Imported rows count: " . $rows->count());
            Log::info("Sample row: ", $rows->first() ?? []);

            foreach ($groupedRows as $expenseCode => $items) {
                $debit = $items->sum("debit");
                $credit = $items->sum("credit");
                $existingTotal =
                    DB::table("expenses")
                        ->where("code", $expenseCode)
                        ->where("project_id", $projectId)
                        ->value("total") ?? 0;

                $total = bcadd((string) $existingTotal, (string) $debit, 2);

                if (bccomp((string) $debit, (string) $credit, 2) !== 0) {
                    throw new ExpenseNotBalanceException(
                        "Debit and credit do not match for expense $expenseCode. Debit: $debit, Credit: $credit",
                    );
                }

                $expense = Expense::updateOrCreate(
                    [
                        "code" => $expenseCode,
                        "project_id" => $projectId,
                    ],
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
                    ExpenseTransaction::updateOrCreate(
                        [
                            "expense_id" => $expense->id,
                            "account_head_id" => $item["account_head_id"],
                            "transaction_date" => $item["transaction_date"],
                        ],
                        [
                            "debit" => $item["debit"] ?? 0,
                            "credit" => $item["credit"] ?? 0,
                        ],
                    );
                }
            }
        });
    }

    public function addExpenses(array $data, int $projectId, int $userId): void
    {
        DB::transaction(function () use ($data, $projectId, $userId) {
            $total = collect($data["transactions"])->sum("debit");

            $expense = Expense::create([
                "user_id" => $userId,
                "project_id" => $projectId,
                "code" => $data["code"],
                "description" => $data["description"] ?? null,
                "total" => $total,
                "transaction_date" => $data["transaction_date"],
            ]);

            $accountHeads = collect($data["transactions"])
                ->pluck("account_head_name")
                ->unique()
                ->mapWithKeys(function (string $name) {
                    $accountHead = AccountHead::firstOrCreate(
                        ["name" => $name],
                        ["code" => Str::slug($name)],
                    );

                    return [$name => $accountHead];
                });

            foreach ($data["transactions"] as $item) {
                ExpenseTransaction::create([
                    "expense_id" => $expense->id,
                    "account_head_id" => $accountHeads->get(
                        $item["account_head_name"],
                    )->id,
                    "debit" => $item["debit"],
                    "credit" => $item["credit"],
                    "transaction_date" => $item["transaction_date"],
                ]);
            }
        });
    }
}
