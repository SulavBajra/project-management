<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\ProfileUpdateRequest;
use App\Http\Resources\User\UserResource;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function update(ProfileUpdateRequest $request)
    {
        $validated = $request->validated();

        $user = Auth::user();

        $user->name = $validated['name'];

        if (! empty($validated['password'])) {
            $user->password = $validated['password'];
        }

        $user->save();

        return new UserResource($user);
    }
}
