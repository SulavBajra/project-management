<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class WorkFlowDoesntExistException extends Exception
{
    public function __construct(
        string $message = "Workflow doesn't exists.",
        int $code = 409,
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
