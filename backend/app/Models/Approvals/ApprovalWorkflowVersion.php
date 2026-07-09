<?php

namespace App\Models\Approvals;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['approval_workflow_id', 'version', 'is_current'])]
class ApprovalWorkflowVersion extends Model
{
    protected function casts(): array
    {
        return [
            'is_current' => 'boolean',
        ];
    }

    public function approvalWorkflow(): BelongsTo
    {
        return $this->belongsTo(ApprovalWorkflow::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(ApprovalStep::class)->orderBy('order_no');
    }

    public function statuses(): HasMany
    {
        return $this->hasMany(ApprovalStatus::class);
    }

    public function firstStep(): HasOne
    {
        return $this->hasOne(ApprovalStep::class)->orderBy('order_no');
    }
}
