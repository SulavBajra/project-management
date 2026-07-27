<?php

namespace App\Http\Resources\Project;

use App\Http\Resources\Timeline\TimelineResource;
use App\Http\Resources\User\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectViewResource extends JsonResource
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
        "code" => $this->code,
        "is_active" => $this->is_active,
        "name" => $this->name,
        "description" => $this->description,
        "created_by" => $this->created_by,
        "timelines" => TimelineResource::collection($this->whenLoaded('timelines')),
        'users' => UserResource::collection($this->whenLoaded('users')),
        ];
    }
}
