<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class BudgetPlanImport implements ToCollection
{
    public Collection $data;

    private array $periods = [];

    public function collection(Collection $rows): void
    {
        $this->data = collect();

        foreach ($rows as $index => $row) {
            if ($index === 0) {
                $this->periods = $row->slice(2)->values()->toArray();

                continue;
            }

            if (empty($row[0])) {
                continue;
            }
            $allocations = [];
            foreach ($this->periods as $i => $period) {
                $allocations[$period] = (float) ($row[$i + 2] ?? 0);
            }

            $this->data->push([
                'budget_head_code' => $row[0],
                'budget_head' => $row[1],
                'allocations' => $allocations,
            ]);
        }
    }
}
