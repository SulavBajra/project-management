<?php

namespace App\Http\Resources\Project;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetExpenseOverviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $budgetPlan = $this['allocation']->first();

        if (! $budgetPlan) {
            return [
                'budget_plan_id' => null,
                'periods' => [],
            ];
        }
        $expenses = $this['expenses'];

        $periods = $budgetPlan->items
            ->flatMap(fn ($item) => $item->allocations)
            ->groupBy('timeline_period_id')
            ->map(
                fn ($allocs) => [
                    'period' => $allocs->first()->timelinePeriod,
                    'budgeted' => $allocs->sum('allocated_amount'),
                ],
            );

        $transactions = $expenses->flatMap(fn ($e) => $e->transactions);

        return [
            'budget_plan_id' => $budgetPlan->id,
            'periods' => $periods
                ->map(function ($data) use ($transactions) {
                    $period = $data['period'];

                    $actual = $transactions
                        ->filter(
                            fn ($t) => Carbon::parse(
                                $t->transaction_date,
                            )->between($period->start_date, $period->end_date),
                        )
                        ->sum('debit');

                    return [
                        'id' => $period->id,
                        'name' => $period->name,
                        'label' => Carbon::parse($period->start_date)->format(
                            'M',
                        ).
                            '-'.
                            Carbon::parse($period->end_date)->format(
                                'M',
                            ).
                            "({$period->name})",
                        'budgeted' => (float) $data['budgeted'],
                        'actual' => (float) $actual,
                    ];
                })
                ->values(),
        ];
    }
}
