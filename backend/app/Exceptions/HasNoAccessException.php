<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class HasNoAccessException extends Exception
{
    public function __construct(
        string $message = "You don't have the required role to accept the request.",
        int $code = 403,
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, $code, $previous);
    }

    public function render(): JsonResponse
    {
        return response()->json(
            [
                'message' => $this->getMessage(),
            ],
            $this->getCode(),
        );
    }
}
