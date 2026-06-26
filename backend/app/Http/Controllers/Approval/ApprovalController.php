<?php

namespace App\Http\Controllers\Approval;

use App\Http\Controllers\Controller;
use App\Services\ApprovalService;
use Illuminate\Http\Request;

class ApprovalController extends Controller
{
    public function __construct(protected ApprovalService $approvalService)
    {
        //
    }

    public function store(Request $request, int $projectId)
    {
        $user = $request->user();
        if ($request->current_step_id == 1) {
            $this->approvalService->beginApproval(
                $projectId,
                $request->toArray(),
                1,
            );

            return response()->json(
                [
                    "message" => "Approval flow started",
                ],
                201,
            );
        }
        $this->approvalService->nextStep();
        return response()->json(
            ["message" => "Approval request has been sent"],
            200,
        );
    }
}
