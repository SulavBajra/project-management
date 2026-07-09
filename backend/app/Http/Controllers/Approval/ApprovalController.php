<?php

namespace App\Http\Controllers\Approval;

use App\Exceptions\HasNoAccessException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Approval\ApprovalStepStoreRequest;
use App\Http\Resources\Approval\ApprovalListResource;
use App\Repositories\ApprovalRepository;
use App\Services\ApprovalService;
use Illuminate\Http\Request;

class ApprovalController extends Controller
{
    public function __construct(
        protected ApprovalService $approvalService,
        private ApprovalRepository $approvalRepo,
    ) {
        //
    }

    // This is to show the approval request according to the role
    public function show(int $roleId)
    {
        $approvals = $this->approvalRepo->findApprovalFromRole($roleId);

        return ApprovalListResource::collection($approvals);
        // return $approvals;
    }

    public function store(ApprovalStepStoreRequest $request, int $approvalId)
    {
        $validated = $request->validated();
        $this->approvalService->advanceStep(
            $approvalId,
            $request->user(),
            $validated['comment'] ?? null,
        );

        return response()->json(
            ['message' => 'Successfully started next step'],
            200,
        );
    }

    public function reject(Request $request, int $approvalId)
    {
        $validated = $request->validate([
            'comment' => 'nullable|string|max:250',
        ]);
        $user = $request->user();
        if (! $user->hasPermissionTo('reject_budget')) {
            throw new HasNoAccessException(
                'You donot have the role to reject the request',
            );
        }
        $this->approvalService->rejectRequest(
            $approvalId,
            $user->id,
            $validated['comment'] ?? null,
        );

        return response()->json(['message' => 'Approval request rejected.']);
    }
}
