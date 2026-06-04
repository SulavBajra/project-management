<?php

namespace App\Http\Resources\Budget;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BudgetAllocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "period_id" => $this->timeline_period_id,
            "period_name" => $this->timelinePeriod->name,
            "period_start" => $this->timelinePeriod->start_date->format(
                "Y-m-d",
            ),
            "period_end" => $this->timelinePeriod->end_date->format("Y-m-d"),
            "allocated_amount" => $this->allocated_amount,
        ];
    }
}
