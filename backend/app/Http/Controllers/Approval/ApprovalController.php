<?php

namespace App\Http\Controllers\Approval;

use App\Http\Controllers\Controller;
use App\Http\Requests\Approval\ApprovalStepStoreRequest;
use App\Models\User;
use App\Services\ApprovalService;

class ApprovalController extends Controller
{
    public function __construct(protected ApprovalService $approvalService)
    {
        //
    }

    public function store(ApprovalStepStoreRequest $request, int $projectId)
    {
        $validated = $request->validated();
        $user = User::where("id", 1)->first();
        $this->approvalService->advanceStep(
            $projectId,
            $user,
            $validated["comment"] ?? null,
        );

        return response()->json(
            ["message" => "successfully started next step"],
            200,
        );
    }
}
