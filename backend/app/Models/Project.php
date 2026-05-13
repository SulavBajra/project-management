<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(["name", "description", "code", "is_active"])]
class Project extends Model
{
    protected function casts(): array
    {
        return [
            "is_active" => "boolean",
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where("is_active", true);
    }
}
