<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\User\UserStoreRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $request->validated();
        $remember = $request->remember ?? false;

        if (
            !Auth::attempt(
                [
                    "email" => $request->email,
                    "password" => $request->password,
                ],
                $remember,
            )
        ) {
            return response()->json(
                ["message" => "The provided credentials are incorrect."],
                422,
            );
        }

        $request->session()->regenerate();
        $role = $request->user()->getRoleNames()->first();
        $permissions = $request->user()->getAllPermissions()->pluck("name");

        if (is_null($role)) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json(
                ["message" => "Account not yet activated."],
                403,
            );
        }

        return response()->json(
            [
                "message" => "Login Successful",
                "user" => [
                    "id" => $request->user()->id,
                    "name" => $request->user()->name,
                    "email" => $request->user()->email,
                    "role" => $role,
                    "permissions" => $permissions,
                ],
            ],
            200,
        );
    }

    public function register(UserStoreRequest $request)
    {
        $credentials = $request->validated();
        $request->session()->regenerate();
        User::create($credentials);

        return response()->json([
            "message" => "Registration successful",
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        Log::info("User logged out");

        return response()->json([
            "message" => "Logout successful",
        ]);
    }
}
