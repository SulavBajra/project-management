<?php

namespace App\Http\Resources\Approval;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VersionResource extends JsonResource
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
            'version' => $this->version,
            'is_current' => $this->is_current,
            'statuses' => $this->whenLoaded('statuses', function () {
                return $this->statuses->map(
                    fn ($status) => [
                        'id' => $status->id,
                        'name' => $status->name,
                    ],
                );
            }),
            'steps' => $this->whenLoaded('steps', function () {
                return $this->steps->map(
                    fn ($step) => [
                        'id' => $step->id,
                        'name' => $step->name,
                        'order_no' => $step->order_no,
                        'is_final' => $step->is_final,
                        'is_auto_approve' => $step->is_auto_approve,
                        'role' => $step->relationLoaded('role') && $step->role
                            ? ['id' => $step->role->id, 'name' => $step->role->name]
                            : null,
                    ],
                );
            }),
        ];
    }
}
