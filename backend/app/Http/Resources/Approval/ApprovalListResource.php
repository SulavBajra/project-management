<?php

namespace App\Http\Resources\Approval;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApprovalListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "approvable_id" => $this->approvable_id,
            "approvable_type" => $this->approvable_type,
            "created_by" => $this->createdBy->name,
            "project_id" => $this->approvable->project->id,
            "project_name" => $this->approvable->project->name,
            "current_step_id" => $this->current_step_id,
            "order_no" => $this->currentStep->order_no,
            "is_final" => $this->currentStep->is_final,
            "current_status" => $this->currentStatus->name,
        ];
    }
}
