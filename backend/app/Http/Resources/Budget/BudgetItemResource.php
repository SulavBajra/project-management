<?php

namespace App\Http\Resources\Budget;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetItemResource extends JsonResource
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
            'budget_head_id' => $this->budget_head_id,
            'budget_head_name' => $this->budgetHead->name,
            'budget_head_code' => $this->budgetHead->code,
            'allocations' => BudgetAllocationResource::collection(
                $this->allocations,
            ),
        ];
    }
}
