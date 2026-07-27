<?php

namespace App\Http\Requests\Budget;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BudgetHeadUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'code' => [
                'required',
                'string',
                'max:100',
                Rule::unique('budget_heads', 'code')->ignore(
                    $this->route('budgetHead'),
                ),
            ],
        ];
    }
}
