<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class HasNoAccessException extends Exception
{
    public function __construct(
        string $message = "User doesn't has right.",
        int $code = 403,
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, $code, $previous);
    }
    public function render(): JsonResponse
    {
        return response()->json(
            [
                "message" => $this->getMessage(),
            ],
            $this->getCode(),
        );
    }
}
