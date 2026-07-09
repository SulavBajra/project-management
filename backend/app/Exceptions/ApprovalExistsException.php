<?php

namespace App\Exceptions;

use Exception;

class ApprovalExistsException extends Exception
{
    public function __construct(
        string $message = 'Approval already exists.',
        int $code = 409,
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, $code, $previous);
    }
}
