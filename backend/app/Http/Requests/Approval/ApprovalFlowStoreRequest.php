<?php

namespace App\Http\Requests\Approval;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApprovalFlowStoreRequest extends FormRequest
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
            'name' => ['required', 'string'],
            'model_name' => [
                'required',
                'string',
                Rule::in(array_keys(Relation::morphMap())),
            ],
            'statuses' => ['required', 'array'],
            'statuses.*' => ['required', 'string'],

            'steps' => ['required', 'array'],
            'steps.*.name' => ['required', 'string'],
            'steps.*.role_id' => ['required', 'integer', 'exists:roles,id'],
            'steps.*.status' => ['required', 'string'],
            'steps.*.order_no' => ['required', 'integer', 'min:1'],
            'steps.*.is_final' => ['sometimes', 'boolean'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $statuses = $this->input('statuses', []);
            $steps = $this->input('steps', []);

            foreach ($steps as $index => $step) {
                if (! in_array($step['status'] ?? null, $statuses)) {
                    $validator
                        ->errors()
                        ->add(
                            "steps.$index.status",
                            'The selected status must be one of the provided statuses.',
                        );
                }
            }

            $finalCount = collect($steps)
                ->filter(fn ($s) => ($s['is_final'] ?? false) == true)
                ->count();

            if ($finalCount !== 1) {
                $validator
                    ->errors()
                    ->add('steps', 'Exactly one step must be marked as final.');
            }

            $orders = collect($steps)->pluck('order_no');
            if ($orders->count() !== $orders->unique()->count()) {
                $validator
                    ->errors()
                    ->add('steps', 'Each step must have a unique order_no.');
            }
        });
    }
}
