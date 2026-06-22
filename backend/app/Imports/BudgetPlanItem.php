<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class BudgetPlanItem implements ToCollection
{
    public Collection $data;

    public function collection(Collection $rows): void
    {
        foreach ($rows as $row) {
            $this->data = collect([
                "budget head" => isset($row[0]) ? $row[0] : null,
                "budget amount 1" => (float) isset($row[1]) ? $row[1] : 0,
                "budget amount 2" => (float) isset($row[2]) ? $row[2] : 0,
                "budget amount 3" => (float) isset($row[3]) ? $row[3] : 0,
                "budget amount 4" => (float) isset($row[4]) ? $row[4] : 0,
            ]);
        }
    }
}
