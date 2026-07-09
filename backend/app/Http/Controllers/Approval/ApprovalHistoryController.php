<?php

namespace App\Http\Controllers\Approval;

use App\Http\Controllers\Controller;
use App\Models\Approvals\ApprovalHistory;

class ApprovalHistoryController extends Controller
{
    public function index()
    {
        $history = ApprovalHistory::query()
            ->select(
                "id",
                "approval_id",
                "approval_step_id",
                "acted_by",
                "from_state",
                "to_state",
            )
            ->with([
                "actor:id,name",
                "approval:id,approvable_type,approvable_id",
            ])
            ->paginate(10);
        return response()->json($history);
    }
}
