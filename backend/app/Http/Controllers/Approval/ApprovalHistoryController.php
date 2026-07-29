<?php

namespace App\Http\Controllers\Approval;

use App\Http\Controllers\Controller;
use App\Http\Resources\Approval\ApprovalHistoryListResource;
use App\Models\Approvals\ApprovalHistory;
use Illuminate\Http\Request;

class ApprovalHistoryController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate([
            "user_id" => ['required','integer','exists:users,id']
        ]);

        $userId =  $data['user_id'];
        $history = ApprovalHistory::query()
            ->select(
                'id',
                'approval_id',
                'approval_step_id',
                'acted_by',
                'from_state',
                'to_state',
                'created_at'
            )
            ->with([
                'actor:id,name',
                'approval:id,approvable_type,approvable_id',
            ])
            ->whereRelation('actor', 'id', '=', $userId)
            ->paginate(10);

        return ApprovalHistoryListResource::collection($history);
    }
}
