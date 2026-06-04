<?php

namespace App\Repositories;

use App\Exceptions\BudgetPlanAlreadyExistsException;
use App\Models\BudgetPlan;
use App\Repositories\Contracts\BudgetPlanRepositoryInterface;
use Illuminate\Support\Facades\DB;

class BudgetPlanRepository implements BudgetPlanRepositoryInterface
{
    public function __construct(private BudgetPlan $model)
    {
        //
    }

    public function create(
        int $projectId,
        string $name,
        array $budgetHeadIds,
    ): BudgetPlan {
        if ($this->exists($projectId)) {
            throw new BudgetPlanAlreadyExistsException(
                "Budget plan already exists for project",
            );
        }
        return DB::transaction(function () use (
            $projectId,
            $name,
            $budgetHeadIds,
        ) {
            $plan = $this->model->create([
                "project_id" => $projectId,
                "name" => $name,
            ]);

            $plan
                ->items()
                ->createMany(
                    array_map(
                        fn($id) => ["budget_head_id" => $id],
                        $budgetHeadIds,
                    ),
                );

            return $plan->load("items.budgetHead");
        });
    }

    public function exists(int $projectId): bool
    {
        return $this->model->where("project_id", $projectId)->exists();
    }

    public function find(int $projectId)
    {
        return $this->model
            ->with("items.budgetHead")
            ->where("project_id", $projectId)
            ->first();
    }

    public function getId(int $projectId): ?int
    {
        return $this->model->where("project_id", $projectId)->value("id");
    }
}
