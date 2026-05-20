<?php

namespace App\Services;

use App\Models\BudgetHeadAllocation;

class BudgetAllocationService
{
    public function allocateBudget(array $data)
    {
        BudgetHeadAllocation::create($data);
    }
}
