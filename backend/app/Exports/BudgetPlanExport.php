<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Override;

class BudgetPlanExport implements FromCollection, ShouldAutoSize, WithHeadings
{
    private array $date;

    public function __construct(private array $data, private array $periods)
    {
        foreach ($periods as $period) {
            $startDate = Carbon::parse($period['start_date'])->format('M');
            $endDate = Carbon::parse($period['end_date'])->format('M');
            $name = $period['name'];
            $this->date[] = "{$startDate}-{$endDate}"."({$name})";
        }
    }

    public function collection()
    {
        return collect($this->data);
    }

    #[Override]
    public function headings(): array
    {
        return [
            'budget code',
            'budget head',
            $this->date[0] ?? '',
            $this->date[1] ?? '',
            $this->date[2] ?? '',
            $this->date[3] ?? '',
        ];
    }
}
