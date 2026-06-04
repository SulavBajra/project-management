<?php

namespace App\Http\Requests\Budget;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class BudgetPlanUpdateRequest extends FormRequest
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
            "allocations" => ["required", "array"],
            "allocations.*.period_id" => [
                "required",
                "integer",
                "exists:timeline_periods,id",
            ],
            "allocations.*.allocated_amount" => [
                "required",
                "numeric",
                "min:0",
            ],
        ];
    }
}
