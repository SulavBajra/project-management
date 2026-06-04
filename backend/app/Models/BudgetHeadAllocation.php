<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(["budget_plan_item_id", "timeline_period_id", "allocated_amount"])]
class BudgetHeadAllocation extends Model
{
    protected function casts(): array
    {
        return [
            "allocated_amount" => "decimal:2",
        ];
    }

    public function planItem(): BelongsTo
    {
        return $this->belongsTo(BudgetPlanItem::class, "budget_plan_item_id");
    }

    public function timelinePeriod(): BelongsTo
    {
        return $this->belongsTo(TimelinePeriod::class);
    }
}
