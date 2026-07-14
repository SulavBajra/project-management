<?php

namespace App\Http\Resources\Expenses;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
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
            'user_id' => $this->user_id,
            'code' => $this->code,
            'description' => $this->description,
            'total' => $this->total,
            'date' => $this->transaction_date->format('Y-m-d'),
            'project_id' => $this->project_id,
            'project_name' => $this->project->name,
            'user' => $this->user->name,
            'approval_id' => $this->approval->id,
            'approval_status' => $this->approval->currentStatus->name,
            'approval_step' => $this->approval->currentStep->is_final,
            'transactions' => $this->transactions->map(fn ($transaction) => [
                'transaction_id' => $transaction->id,
                'account_head_id' => $transaction->accountHead->id,
                'account_head' => $transaction->accountHead->name,
                'debit' => $transaction->debit,
                'credit' => $transaction->credit,
                'transaction_date' => $transaction->transaction_date->format('Y-m-d'),
            ]),
        ];
    }
}
