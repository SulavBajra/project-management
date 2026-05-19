<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[
    Fillable([
        'budget_head_id',
        'project_id',
        'timeline_period_id',
        'allocated_amount',
    ]),
]
class BudgetHeadAllocation extends Model
{
    protected function casts(): array
    {
        return [
            'allocated_amount' => 'decimal:2',
        ];
    }

    public function budgetHead(): BelongsTo
    {
        return $this->belongsTo(BudgetHead::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function timelinePeriod(): BelongsTo
    {
        return $this->belongsTo(TimelinePeriod::class);
    }
}
