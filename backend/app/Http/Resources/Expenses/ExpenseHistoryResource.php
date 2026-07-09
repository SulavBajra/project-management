<?php

namespace App\Http\Resources\Expenses;

use App\Http\Resources\Approval\ApprovalHistoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseHistoryResource extends JsonResource
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
            'total' => $this->total,
            'transaction_date' => $this->transaction_date->format('Y-m-d'),
            'approval_id' => $this->approval->id,
            'created_by' => $this->approval->createdBy->name,
            'histories' => $this->whenLoaded('approval', function () {
                return ApprovalHistoryResource::collection(
                    $this->approval->histories,
                );
            }),
        ];
    }
}
