<?php

namespace App\Http\Resources\Approval;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApprovalStepResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'approval_workflow_id' => $this->approval_workflow_id,
            'version' => $this->version,
            'steps' => $this->steps->map(fn ($step) => [
                'step_id' => $step->id,
                'step_name' => $step->name,
                'version_id' => $step->approval_workflow_version_id,
                'auto' => $step->is_auto_approve,
            ]),
            'workflow_name' => $this->approvalWorkflow->name,
        ];
    }
}
