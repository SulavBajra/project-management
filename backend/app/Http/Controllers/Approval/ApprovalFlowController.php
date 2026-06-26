<?php

namespace App\Http\Controllers\Approval;

use App\Http\Controllers\Controller;
use App\Http\Requests\Approval\ApprovalFlowStoreRequest;
use App\Http\Resources\Approval\ApprovalInfoResource;
use App\Models\Approvals\ApprovalWorkflow;
use App\Services\ApprovalFlowService;
use Illuminate\Http\Request;

class ApprovalFlowController extends Controller
{
    public function __construct(private ApprovalFlowService $flowService)
    {
        //
    }

    public function index()
    {
        $flows = ApprovalWorkflow::with(
            "currentVersion.statuses",
            "currentVersion.steps",
        )->get();

        // return response()->json(ApprovalResource::collection($flows));
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

    public function show(int $id, Request $request)
    {
        $model = $this->flowService->checkflowinfo(
            $id,
            $request->input("name", "default"),
        );
        if (!$model) {
            return response()->json([
                "message" => "Data not found",
            ]);
        }
        // return new ApprovalInfoResource($model);
        return response()->json($model);
    }
}
