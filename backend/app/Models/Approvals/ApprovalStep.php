<?php

namespace App\Models\Approvals;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Permission\Models\Role;

#[
    Fillable([
        "approval_workflow_version_id",
        "role_id",
        "approval_status_id",
        "order_no",
        "name",
        "is_final",
    ]),
]
class ApprovalStep extends Model
{
    protected function casts(): array
    {
        return [
            "is_final" => "boolean",
        ];
    }

    public function approvalWorkflow(): BelongsTo
    {
        return $this->belongsTo(ApprovalWorkflow::class);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function scopeIsFinal(Builder $query): Builder
    {
        return $query->where("is_final", true);
    }
}
