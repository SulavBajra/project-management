<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            "email" => "required|email",
            "password" => "required",
            "remember" => "sometimes|boolean",
        ]);
        $remember = $credentials["remember"] ?? false;
        if (
            Auth::attempt(
                [
                    "email" => $credentials["email"],
                    "password" => $credentials["password"],
                ],
                $remember,
            )
        ) {
            $request->session()->regenerate();
            $role = $request->user()->getRoleNames()->first();
            return response()->json(
                [
                    "message" => "Login Successful",
                    "role" => $role,
                ],
                200,
            );
        }

        // $token = $request->user()->createToken("api-token")->plainTextToken;
        return response()->json(
            [
                "message" => "Login Unsuccessful",
            ],
            401,
        );
    }

    public function register(Request $request)
    {
        $credentials = $request->validate([
            "name" => "required|string|max:100",
            "email" => "required|email",
            "password" => "required|confirmed|min:8",
        ]);

        $request->session()->regenerate();
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
