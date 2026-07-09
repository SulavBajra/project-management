<?php

namespace App\Services;

use App\Imports\BudgetPlanImport;
use App\Models\BudgetPlanItem;
use App\Models\Timeline;
use App\Models\TimelinePeriod;
use App\Repositories\BudgetHeadAllocationRepository;
use App\Repositories\BudgetPlanItemRepository;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class BudgetService
{
    public function __construct(
        private BudgetPlanItemRepository $itemRepo,
        private BudgetHeadAllocationRepository $allocationRepo,
    ) {
        //
    }

    public function extractBudgetData(
        UploadedFile|string $file,
        int $planId,
        int $projectId,
    ): void {
        $import = new BudgetPlanImport;
        Excel::import($import, $file);

        $periodIds = Timeline::whereHas(
            'projects',
            fn ($q) => $q->where('project_id', $projectId),
        )
            ->first()
            ->periods()
            ->pluck('id');

        $planItems = BudgetPlanItem::with('budgetHead')
            ->where('budget_plan_id', $planId)
            ->get()
            ->keyBy(fn ($item) => $item->budgetHead->code);

        $periodMap = TimelinePeriod::whereIn('id', $periodIds)
            ->get()
            ->keyBy(function ($period) {
                $start = Carbon::parse($period->start_date)->format('M');
                $end = Carbon::parse($period->end_date)->format('M');

                return "{$start}-{$end}({$period->name})";
            });

        DB::transaction(function () use ($import, $planItems, $periodMap) {
            foreach ($import->data as $item) {
                $planItem = $planItems->get($item['budget_head_code']);

                if (! $planItem) {
                    continue;
                }

                foreach ($item['allocations'] as $periodName => $amount) {
                    $periodId = $periodMap->get($periodName)?->id;

                    if (! $periodId) {
                        continue;
                    }

                    $planItem
                        ->allocations()
                        ->where('timeline_period_id', $periodId)
                        ->update(['allocated_amount' => $amount]);
                }
            }
        });
    }

    public function createExcelSkeleton(int $planId)
    {
        $allocations = $this->itemRepo
            ->getItemsAndAllocations($planId)
            ->toArray();
        $data = [];
        foreach ($allocations as $item) {
            $data[] = [
                'budget_head_code' => $item['budget_head']['code'],
                'budget_head' => $item['budget_head']['name'],
                'amount' => null,
            ];
        }

        return $data;
    }
}
