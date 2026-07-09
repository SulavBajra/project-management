<?php

namespace App\Models;

use App\Enums\ImportStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'project_id', 'status', 'errors'])]
class ExpenseImport extends Model
{
    protected function casts(): array
    {
        return [
            'status' => ImportStatus::class,
            'errors' => 'json',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    protected function statusLabel(): Attribute
    {
        return Attribute::get(fn () => $this->status->label());
    }

    public function markProcessing(): void
    {
        $this->update(['status' => ImportStatus::PROCESSING]);
    }

    public function markCompleted(): void
    {
        $this->update(['status' => ImportStatus::COMPLETED]);
    }

    public function markFailed(array $errors): void
    {
        $this->update([
            'status' => ImportStatus::FAILED,
            'errors' => $errors,
        ]);
    }

    public function isTerminal(): bool
    {
        return $this->status->isTerminal();
    }
}
