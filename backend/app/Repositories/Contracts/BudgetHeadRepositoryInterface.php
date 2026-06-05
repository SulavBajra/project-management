<?php

namespace App\Repositories\Contracts;

use App\Models\BudgetHead;

interface BudgetHeadRepositoryInterface
{
    public function findById(int $id): ?BudgetHead;
}
