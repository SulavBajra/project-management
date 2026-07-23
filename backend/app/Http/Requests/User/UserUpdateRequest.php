<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50',
            'email' => [
                'required',
                'string',
                'email',
                'max:100',
                Rule::unique('users')->ignore($this->route('user')),
            ],
            'password' => 'nullable|string|min:8|confirmed',
        ];
    }
}
