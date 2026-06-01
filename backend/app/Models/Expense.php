<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[
    Fillable([
        'user_id',
        'project_id',
        'code',
        'description',
        'total',
        'transaction_date',
    ]),
]
class Expense extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'transaction_date' => 'date',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(ExpenseTransaction::class);
    }
}
