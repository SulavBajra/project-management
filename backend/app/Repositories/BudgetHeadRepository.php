<?php

namespace App\Repositories;

use App\Models\BudgetHead;
use App\Repositories\Contracts\BudgetHeadRepositoryInterface;

class BudgetHeadRepository implements BudgetHeadRepositoryInterface
{
    protected BudgetHead $model;

    public function __construct(BudgetHead $model)
    {
        $this->model = $model;
    }

    public function findById(int $id): ?BudgetHead
    {
        return $this->model->find($id);
    }

    public function getBudgetHeadsNotInPlan(int $planId): array
    {
        return $this->model
            ->whereNotIn('id', function ($query) use ($planId) {
                $query
                    ->select('budget_head_id')
                    ->from('budget_plan_items')
                    ->where('budget_plan_id', $planId);
            })
            ->select('id', 'name', 'code')
            ->get()
            ->toArray();
    }
}
