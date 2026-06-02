<?php

namespace App\Http\Controllers\Approval;

use App\Http\Controllers\Controller;
use App\Http\Requests\Approval\ApprovalFlowStoreRequest;
use App\Models\Approvals\Approval;
use App\Services\ApprovalFlowService;

class ApprovalController extends Controller
{
    public function __construct(private ApprovalFlowService $flowService)
    {
        //
    }

    public function index()
    {
        $flows = $this->flowService->getApprovalFlows();
        return response()->json($flows);
    }

    public function store(ApprovalFlowStoreRequest $request)
    {
        $this->flowService->createApprovalFlow($request->validated());

        return response()->json(
            [
                "message" => "Flow created successfully",
            ],
            201,
        );
    }
}
