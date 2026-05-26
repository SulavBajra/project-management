<?php

namespace App\Imports;

use App\Models\AccountHead;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class ExpenseTransactionsImport implements ToCollection, WithHeadingRow
{
    public Collection $rows;

    protected array $accountHeadCache = [];

    public function collection(Collection $rows): void
    {
        $this->rows = $rows
            ->map(function ($row) {
                $accountHeadId = $this->resolveAccountHeadId(
                    $row["account_head_name"] ?? null,
                );

                return [
                    "expense_code" => $row["code"] ?? null,
                    "account_head_id" => $accountHeadId,
                    "debit" => $row["debit"] ?? 0,
                    "credit" => $row["credit"] ?? 0,
                    "transaction_date" => isset($row["transaction_date"])
                        ? Date::excelToDateTimeObject($row["transaction_date"])
                        : now(),
                ];
            })
            ->filter(
                fn($row) => $row["expense_code"] && $row["account_head_id"],
            );
    }

    protected function resolveAccountHeadId(?string $name): ?int
    {
        if (!$name) {
            return null;
        }

        $key = strtolower(trim($name));

        if (!array_key_exists($key, $this->accountHeadCache)) {
            $accountHead = AccountHead::firstOrCreate(
                ["name" => trim($name)],
                [
                    "code" => Str::slug($name),
                ],
            );
            $this->accountHeadCache[$key] = $accountHead->id;
        }

        return $this->accountHeadCache[$key];
    }
}
