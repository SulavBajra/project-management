<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['project_id', 'start_date', 'end_date'])]
class Timeline extends Model
{
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function project(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }

    public function periods(): HasMany
    {
        return $this->hasMany(TimelinePeriod::class);
    }
}
