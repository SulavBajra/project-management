<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class BudgetPlanItem implements ToCollection, WithHeadingRow
{
    public Collection $rows;

    public function collection(Collection $rows): void
    {
        $this->rows = $rows->map(
            fn($row) => [
                "budget code" => isset($row["budget code"])
                    ? $row["budget code"]
                    : null,
                "budget head" => isset($row["budget head"])
                    ? $row["budget head"]
                    : null,
                "budget amount" => (float) isset($row["budget amount"])
                    ? $row["budget amount"]
                    : 0,
                "date" => isset($row["date"]) ? $row["date"] : null,
            ],
        );
    }
}
