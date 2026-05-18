<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(["timeline_id", "name", "start_date", "end_date"])]
class TimelinePeriod extends Model
{
    protected function casts(): array
    {
        return [
            "start_date" => "date",
            "end_date" => "date",
        ];
    }

    protected function timeline(): BelongsTo
    {
        return $this->belongsTo(Timeline::class);
    }
}
