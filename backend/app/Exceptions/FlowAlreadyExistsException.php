<?php

namespace App\Exceptions;

use RuntimeException;

class FlowAlreadyExistsException extends RuntimeException
{
    public function __construct(
        string $message = "Workflow for this already exists.",
        int $code = 409,
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, $code, $previous);
    }
}
