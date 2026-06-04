<?php

namespace App\Repositories;

use App\Models\BudgetHead;
use App\Repositories\Contracts\BudgetHeadRepositoryInterface;
use Illuminate\Support\Facades\DB;

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

    public function createBudgetPlan(int $projectId, array $budgetHeads)
    {
        DB::transaction(function () use ($projectId, $budgetHeads) {
            $plan = $this->model->create([
                "project_id" => $projectId,
            ]);
        });
    }
}
