<?php

namespace App\Http\Resources\Approval;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApprovalHistoryListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            "id" => $this->id,
            "approval_id" => $this->approval_id,
            "approval_type" => str($this->approval->approvable_type)->ucfirst(),
            "from_state" => $this->from_state,
            "to_state" => $this->to_state,
            "acted_by" => str($this->actor->name)->ucfirst(),
            "created_at" => $this->created_at->format('Y-m-d'),
        ];
    }
}
