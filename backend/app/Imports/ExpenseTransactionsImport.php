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
        $this->preloadAccountHeads(
            $rows->pluck("account_head_name")->filter()->unique(),
        );

        $this->rows = $rows
            ->map(
                fn($row) => [
                    "expense_code" => isset($row["code"])
                        ? trim($row["code"])
                        : null,
                    "account_head_id" => $this->resolveAccountHeadId(
                        $row["account_head_name"] ?? null,
                    ),
                    "debit" => (float) ($row["debit"] ?? 0),
                    "credit" => (float) ($row["credit"] ?? 0),
                    "transaction_date" => $this->parseDate(
                        $row["transaction_date"] ?? null,
                    ),
                ],
            )
            ->filter(
                fn($row) => $row["expense_code"] && $row["account_head_id"],
            );
    }

    protected function preloadAccountHeads(Collection $names): void
    {
        $normalized = $names->map(fn($n) => trim($n));

        AccountHead::whereIn("name", $normalized)
            ->get()
            ->each(
                fn($head) => ($this->accountHeadCache[strtolower($head->name)] =
                    $head->id),
            );

        $normalized
            ->filter(
                fn($name) => !array_key_exists(
                    strtolower($name),
                    $this->accountHeadCache,
                ),
            )
            ->each(function ($name) {
                $head = AccountHead::create([
                    "name" => $name,
                    "code" => Str::slug($name) . "-" . crc32(strtolower($name)),
                ]);
                $this->accountHeadCache[strtolower($name)] = $head->id;
            });
    }

    protected function resolveAccountHeadId(?string $name): ?int
    {
        if (!$name) {
            return null;
        }

        return $this->accountHeadCache[strtolower(trim($name))] ?? null;
    }

    protected function parseDate(mixed $value): \DateTime
    {
        if (!$value) {
            return now()->toDateTime();
        }

        if (is_numeric($value)) {
            return Date::excelToDateTimeObject((float) $value);
        }

        try {
            return new \DateTime($value);
        } catch (\Exception) {
            return now()->toDateTime();
        }
    }
}
