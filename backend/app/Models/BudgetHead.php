<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

#[Fillable(["name", "code"])]
class BudgetHead extends Model
{
    public function items(): HasMany
    {
        return $this->hasMany(BudgetPlanItem::class);
    }

    public function plans(): HasManyThrough
    {
        return $this->hasManyThrough(BudgetPlan::class, BudgetPlanItem::class);
    }
}
