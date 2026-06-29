<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class NoNextStepException extends Exception
{
    public function __construct(
        string $message = "There is no next step.",
        int $code = 409,
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
