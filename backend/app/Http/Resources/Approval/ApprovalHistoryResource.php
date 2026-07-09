<?php

namespace App\Http\Resources\Approval;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApprovalHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'history_id' => $this->id,
            'from_state' => $this->from_state,
            'to_state' => $this->to_state,
            'acted_by' => $this->actor->name,
        ];
    }
}
