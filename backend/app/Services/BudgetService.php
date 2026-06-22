<?php

namespace App\Services;

use App\Imports\BudgetPlanItem;
use App\Repositories\BudgetHeadAllocationRepository;
use App\Repositories\BudgetPlanItemRepository;
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

    public function extractBudgetData(UploadedFile|string $file): void
    {
        $import = new BudgetPlanItem();

        DB::transaction(function () use ($import, $file) {
            Excel::import($import, $file);
            $rows = $import->data;
            $groupedRows = $rows->groupBy("budget head");
            foreach ($groupedRows as $budgetCode => $group) {
                $group->each(function ($row) use ($budgetCode) {
                    $budgetHead = $row["budget head"];
                    $budgetAmount = (float) $row["budget amount"];
                    $date = $row["date"];
                });
            }
        });
    }

    public function createExcelSkeleton(int $planId)
    {
        $allocations = $this->itemRepo
            ->getItemsAndAllocations($planId)
            ->toArray();
        $periods = $allocations;
        $data = [];
        foreach ($allocations as $item) {
            $data[] = [
                "budget_head" => $item["budget_head"]["name"],
                "amount" => null,
            ];
        }
        return $data;
    }
}
