<?php

namespace App\Repositories\Contracts;

use App\Models\BudgetPlan;

interface BudgetPlanRepositoryInterface
{
    public function create(
        int $projectId,
        string $name,
        array $budgetHeadIds,
    ): BudgetPlan;

    public function exists(int $projectId): bool;

    public function find(int $projectId);
}
