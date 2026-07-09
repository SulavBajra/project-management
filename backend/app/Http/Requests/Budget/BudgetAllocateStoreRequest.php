<?php

namespace App\Http\Requests\Budget;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class BudgetAllocateStoreRequest extends FormRequest
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
            'budget_head_id' => [
                'required',
                'integer',
                'exists:budget_heads,id',
            ],
            'allocations' => ['required', 'array', 'min:1'],
            'allocations.*.period_id' => [
                'required',
                'integer',
                'exists:timeline_periods,id',
            ],
            'allocations.*.allocated_amount' => [
                'required',
                'numeric',
                'min:0',
                'max:999999999.99',
                'decimal:0,2',
            ],
        ];
    }
}
