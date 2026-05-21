<?php

namespace App\Exceptions;

use Exception;

class ExpenseNotBalanceException extends Exception
{
    public function __construct(
        string $message = 'Expense is not balanced',
        int $code = 0,
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, $code, $previous);
    }
}
