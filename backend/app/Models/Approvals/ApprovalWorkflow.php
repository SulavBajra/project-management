<?php

namespace App\Models\Approvals;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(["is_active", "name", "approvable_type"])]
class ApprovalWorkflow extends Model
{
    protected function casts(): array
    {
        return [
            "is_active" => "boolean",
        ];
    }

    public function versions(): HasMany
    {
        return $this->hasMany(ApprovalWorkflowVersion::class);
    }

    public function currentVersion(): HasOne
    {
        return $this->hasOne(ApprovalWorkflowVersion::class)->ofMany(
            [],
            fn($q) => $q->where("is_current", true),
        );
    }
}
