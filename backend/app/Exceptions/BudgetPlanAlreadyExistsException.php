<?php

namespace App\Exceptions;

use Exception;

class BudgetPlanAlreadyExistsException extends Exception
{
    public function __construct(
        string $message = 'Budget plan already exists for project',
        int $code = 409,
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, $code, $previous);
    }
}
