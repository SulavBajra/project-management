<?php

namespace App\Models\Approvals;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Permission\Models\Role;

#[
    Fillable([
        "approval_workflow_version_id",
        "role_id",
        "approval_status_id",
        "order_no",
        "name",
        "is_final",
        "is_auto_approve",
    ]),
]
class ApprovalStep extends Model
{
    protected function casts(): array
    {
        return [
            "is_final" => "boolean",
            "is_auto_approve" => "boolean",
        ];
    }

    public function version(): BelongsTo
    {
        return $this->belongsTo(ApprovalWorkflowVersion::class);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function scopeIsFinal(Builder $query): Builder
    {
        return $query->where("is_final", true);
    }

    public function approvalStatus(): BelongsTo
    {
        return $this->belongsTo(ApprovalStatus::class);
    }
}
