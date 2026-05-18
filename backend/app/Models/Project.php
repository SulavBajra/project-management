<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(["name", "description", "code", "is_active", "created_by"])]
class Project extends Model
{
    protected function casts(): array
    {
        return [
            "is_active" => "boolean",
        ];
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, "project_user");
    }

    public function timelines(): BelongsToMany
    {
        return $this->belongsToMany(Timeline::class, "timeline_project");
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where("is_active", true);
    }
}
