<?php

namespace App\Models;

use App\Models\Approvals\Approval;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

#[Fillable(["project_id", "name"])]
class BudgetPlan extends Model
{
    public function items(): HasMany
    {
        return $this->hasMany(BudgetPlanItem::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function approval(): MorphOne
    {
        return $this->morphOne(Approval::class, "approvable");
    }
}
