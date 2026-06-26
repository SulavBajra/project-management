<?php

namespace App\Models\Approvals;

use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[
    Fillable([
        "approvable_type",
        "approvable_id",
        "approval_workflow_version_id",
        "created_by",
        "current_step_id",
        "current_status_id",
    ]),
]
class Approval extends Model
{
    public function approvable(): MorphTo
    {
        return $this->morphTo();
    }

    public function version(): BelongsTo
    {
        return $this->belongsTo(
            ApprovalWorkflowVersion::class,
            "approval_workflow_version_id",
        );
    }

    public function currentStep(): BelongsTo
    {
        return $this->belongsTo(ApprovalStep::class);
    }

    public function currentStatus(): BelongsTo
    {
        return $this->belongsTo(ApprovalStatus::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, "created_by");
    }

    public function histories(): HasMany
    {
        return $this->hasMany(ApprovalHistory::class);
    }
}
