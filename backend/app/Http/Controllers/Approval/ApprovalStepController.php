<?php

namespace App\Http\Controllers\Approval;

use App\Http\Controllers\Controller;
use App\Http\Resources\Approval\ApprovalStepResource;
use App\Models\Approvals\ApprovalStep;
use App\Models\Approvals\ApprovalWorkflowVersion;
use Illuminate\Http\Request;

class ApprovalStepController extends Controller
{
    public function show(int $roleId)
    {
        $versions = ApprovalWorkflowVersion::query()
            ->select(['id', 'approval_workflow_id', 'version', 'is_current'])
            ->where('is_current', true)
            ->with([
                'steps' => fn ($query) => $query
                    ->select(['id', 'approval_workflow_version_id', 'role_id', 'name', 'is_auto_approve'])
                    ->where('role_id', $roleId),
                'approvalWorkflow:id,name',
            ])
            ->whereHas('steps', fn ($query) => $query->where('role_id', $roleId))
            ->get();

        return ApprovalStepResource::collection($versions);
        // return response()->json($versions);
    }

    public function update(Request $request, ApprovalStep $step)
    {
        $request->validate(['auto' => 'required|boolean']);

        // if ($step->role_id !== (int) $request->user()->role_id) {
        //     abort(403, 'You are not authorized to modify this step.');
        // }

        $step->update(['is_auto_approve' => $request->boolean('auto')]);

        return response()->json([
            'step_id' => $step->id,
            'auto' => $step->is_auto_approve,
        ]);
    }
}
