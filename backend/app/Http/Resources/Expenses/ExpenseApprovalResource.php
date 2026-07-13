<?php

namespace App\Http\Resources\Expenses;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseApprovalResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
                    'id' => $this->id,
                    'code' => $this->code,
                    'approval_id' => $this->approval->id,
                    'approval_status' => $this->approval->currentStatus->name,
                    'approval_step' => $this->approval->currentStep->is_final,
                ];
    }
}
