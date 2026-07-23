<?php

namespace App\Http\Resources\Approval;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApprovalResource extends JsonResource
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
            'name' => $this->name,
            'description' => $this->description,
            'approvable_type' => $this->approvable_type,
            'is_active' => $this->is_active,
            'current_version' => $this->whenLoaded(
                'currentVersion',
                fn () => new VersionResource($this->currentVersion),
            ),
        ];
    }
}
