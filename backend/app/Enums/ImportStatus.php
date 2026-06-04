<?php

namespace App\Enums;

enum ImportStatus: string
{
    case PENDING = 'pending';
    case PROCESSING = 'processing';
    case COMPLETED = 'completed';
    case FAILED = 'failed';

    public function isTerminal(): bool
    {
        return match ($this) {
            self::COMPLETED, self::FAILED => true,
            default => false,
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::PROCESSING => 'Processing',
            self::COMPLETED => 'Completed',
            self::FAILED => 'Failed',
        };
    }
}
