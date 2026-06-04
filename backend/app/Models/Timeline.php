<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(["start_date", "end_date"])]
class Timeline extends Model
{
    protected function casts(): array
    {
        return [
            "start_date" => "date",
            "end_date" => "date",
        ];
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, "project_timeline");
    }

    public function periods(): HasMany
    {
        return $this->hasMany(TimelinePeriod::class)->orderBy(
            "start_date",
            "asc",
        );
    }
}
