<?php

namespace App\Http\Resources\Project;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'code' => $this->code,
            'is_active' => $this->is_active,
            'name' => $this->name,
            'description' => $this->description,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at->format('Y-m-d'),
            'users_count' => $this->users_count,
        ];
    }
}
