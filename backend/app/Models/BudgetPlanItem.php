<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(["budget_plan_id", "budget_head_id"])]
class BudgetPlanItem extends Model
{
    public function budgetPlan(): BelongsTo
    {
        return $this->belongsTo(BudgetPlan::class);
    }

    public function budgetHead(): BelongsTo
    {
        return $this->belongsTo(BudgetHead::class);
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(BudgetHeadAllocation::class);
    }
}
