<?php

namespace App\Http\Resources\Approval;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApprovalInfoResource extends JsonResource
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
            "approvable_type" => $this->approvable_type,
            "current_step" => $this->currentstep->name,
            "current_status" => $this->currentStatus->name,
            "role" => $this->currentStep->role->name,
            "is_final" => $this->currentStep->is_final,
        ];
    }
}
