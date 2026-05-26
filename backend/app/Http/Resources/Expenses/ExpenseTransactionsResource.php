<?php

namespace App\Http\Resources\Expenses;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseTransactionsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "expense_id" => $this->expense_id,
            "user_id" => $this->expense->user_id,
            "code" => $this->expense->code,

            "transaction_id" => $this->id,
            "debit" => $this->debit,
            "credit" => $this->credit,
            "transaction_date" => $this->transaction_date->format("Y-m-d"),
            "account_head_id" => $this->account_head_id,
            "account_head" => $this->accountHead?->name,
        ];
    }
}
