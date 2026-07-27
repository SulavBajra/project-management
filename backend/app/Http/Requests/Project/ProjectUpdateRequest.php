<?php

namespace App\Http\Requests\Project;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProjectUpdateRequest extends FormRequest
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
               "name" => "sometimes|string|min:1|max:100",
               "code" => [
                   "sometimes",
                   "string",
                   Rule::unique('projects', 'code')->ignore($this->route('projectId')),
               ],
               "description" => "sometimes|string|min:1|max:200",
           ];
    }
}
