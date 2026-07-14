<?php

namespace App\Http\Requests\Expense;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class ExpenseStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => 'required|string|max:100',
            'description' => 'nullable|string',
            'transaction_date' => 'required|date',
            'transactions' => 'required|array|min:1',
            'transactions.*.account_head_name' => 'required|string|max:255',
            'transactions.*.budget_head_id' => 'required|integer|exists:budget_heads,id',
            'transactions.*.debit' => 'required|numeric|min:0',
            'transactions.*.credit' => 'required|numeric|min:0',
            'transactions.*.transaction_date' => 'required|date',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $transactions = $this->input('transactions', []);
            $totalDebit = collect($transactions)->sum('debit');
            $totalCredit = collect($transactions)->sum('credit');

            if (round($totalDebit, 2) !== round($totalCredit, 2)) {
                $validator
                    ->errors()
                    ->add(
                        'transactions',
                        'Total debit must equal total credit.',
                    );
            }
        });
    }
}
