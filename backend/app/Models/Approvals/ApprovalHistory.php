<?php

namespace App\Models\Approvals;

use App\Models\User;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[
    Fillable([
        'approval_workflow_id',
        'approval_step_id',
        'acted_by',
        'from_state',
        'to_state',
        'comment',
    ]),
]
class ApprovalHistory extends Model
{
    protected function casts(): array
    {
        return [
            'from_state' => 'string',
            'to_state' => 'string',
        ];
    }

    public function approvalWorkflow(): BelongsTo
    {
        return $this->belongsTo(ApprovalWorkflow::class);
    }

    public function approvalStep(): BelongsTo
    {
        return $this->belongsTo(ApprovalStep::class);
    }

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'acted_by');
    }
}
