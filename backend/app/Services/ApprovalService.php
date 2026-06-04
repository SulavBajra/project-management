<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class ApprovalService
{
    public function beginApproval(Model $model, User $user): void
    {
        DB::transaction(function () use ($model, $user) {
            $model->approvals()->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
