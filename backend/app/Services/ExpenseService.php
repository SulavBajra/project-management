<?php

namespace App\Services;

use App\Exceptions\ExpenseNotBalanceException;
use App\Imports\ExpenseTransactionsImport;
use App\Models\AccountHead;
use App\Models\Expense;
use App\Models\ExpenseTransaction;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class ExpenseService
{
    public function extractExpenses(
        UploadedFile|string $file,
        int $userId,
        int $projectId,
    ): Collection {
        $import = new ExpenseTransactionsImport;

        return DB::transaction(function () use (
            $import,
            $file,
            $userId,
            $projectId,
        ) {
            Excel::import($import, $file);
            $rows = $import->rows;
            $groupedRows = $rows->groupBy('expense_code');
            $expenses = collect();
            foreach ($groupedRows as $expenseCode => $items) {
                $debit = $items->sum('debit');
                $credit = $items->sum('credit');
                $existingTotal =
                    Expense::where([
                        'code' => $expenseCode,
                        'project_id' => $projectId,
                    ])->value('total') ?? 0;

                $total = bcadd((string) $existingTotal, (string) $debit, 2);

                if (bccomp((string) $debit, (string) $credit, 2) !== 0) {
                    throw new ExpenseNotBalanceException(
                        "Debit and credit do not match for expense $expenseCode. Debit: $debit, Credit: $credit",
                    );
                }

                $expense = Expense::updateOrCreate(
                    [
                        'code' => $expenseCode,
                        'project_id' => $projectId,
                    ],
                    [
                        'user_id' => $userId,
                        'total' => $total,
                        'description' => 'Imported expense',
                        'transaction_date' => $items->first()[
                            'transaction_date'
                        ],
                    ],
                );

                $transactions = $items
                    ->map(
                        fn ($item) => [
                            'expense_id' => $expense->id,
                            'account_head_id' => $item['account_head_id'],
                            'transaction_date' => $item['transaction_date'],
                            'debit' => $item['debit'] ?? 0,
                            'credit' => $item['credit'] ?? 0,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ],
                    )
                    ->toArray();

                ExpenseTransaction::upsert(
                    $transactions,
                    ['expense_id', 'account_head_id', 'transaction_date'],
                    ['debit', 'credit', 'updated_at'],
                );
                $expenses->push($expense);
            }

            return $expenses;
        });
    }

    public function addExpenses(
        array $data,
        int $projectId,
        int $userId,
    ): Expense {
        return DB::transaction(function () use ($data, $projectId, $userId) {
            $total = collect($data['transactions'])->sum('debit');

            $expense = Expense::create([
                'user_id' => $userId,
                'project_id' => $projectId,
                'code' => $data['code'],
                'description' => $data['description'] ?? null,
                'total' => $total,
                'transaction_date' => $data['transaction_date'],
            ]);

            $accountHeads = collect($data['transactions'])
                ->pluck('account_head_name')
                ->unique()
                ->mapWithKeys(function ($name) {
                    $model = AccountHead::firstOrCreate(
                        ['name' => $name],
                        ['code' => Str::slug($name)],
                    );

                    return [$name => $model->id];
                });

            $transactions = collect($data['transactions'])
                ->map(function ($item) use ($expense, $accountHeads) {
                    return [
                        'expense_id' => $expense->id,
                        'account_head_id' => $accountHeads[$item['account_head_name']],
                        'debit' => $item['debit'],
                        'credit' => $item['credit'],
                        'transaction_date' => $item['transaction_date'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })
                ->toArray();

            ExpenseTransaction::insert($transactions);

            return $expense;
        });
    }
}
