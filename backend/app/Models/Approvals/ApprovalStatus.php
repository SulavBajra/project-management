<?php

namespace App\Models\Approvals;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['approval_workflow_version_id', 'name'])]
class ApprovalStatus extends Model
{
    public function version(): BelongsTo
    {
        return $this->belongsTo(ApprovalWorkflowVersion::class);
    }

    public function approvalSteps(): HasMany
    {
        return $this->hasMany(ApprovalStep::class);
    }
}
