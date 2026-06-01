<?php

namespace App\Models\Approvals;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Spatie\ModelStates\HasStates;

#[Fillable(['is_active', 'state', 'name'])]
class ApprovalWorkflow extends Model
{
    use HasStates;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'state' => ApprovalState::class,
        ];
    }

    public function approvable(): MorphTo
    {
        return $this->morphTo();
    }

    public function steps(): HasMany
    {
        return $this->hasMany(ApprovalStep::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(ApprovalHistory::class);
    }
}
