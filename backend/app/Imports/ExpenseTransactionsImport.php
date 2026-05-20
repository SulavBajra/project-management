<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class ExpenseTransactionsImport implements ToCollection, WithHeadingRow
{
    public Collection $rows;

    public function collection(Collection $rows): void
    {
        $this->rows = $rows
            ->map(function ($row) {
                return [
                    "expense_id" => $row["expense_id"] ?? null,
                    "account_head_id" => $row["account_head_id"] ?? null,
                    "debit" => $row["debit"] ?? 0,
                    "credit" => $row["credit"] ?? 0,
                    "transaction_date" => isset($row["transaction_date"])
                        ? Date::excelToDateTimeObject($row["transaction_date"])
                        : now(),
                ];
            })
            ->filter(fn($row) => $row["expense_id"] && $row["account_head_id"]);
    }
}
