<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            "email" => "required|email",
            "password" => "required",
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(
                [
                    "message" => "Invalid credentials",
                ],
                401,
            );
        }

        $token = $request->user()->createToken("api-token")->plainTextToken;
        return response()->json([
            "message" => "Login successful",
            "token" => $token,
        ]);
    }

    public function register(Request $request)
    {
        $credentials = $request->validate([
            "name" => "required|string|max:100",
            "email" => "required|email",
            "password" => "required|confirmed|min:8",
        ]);

        $user = User::create($credentials);
        $token = $user->createToken("api-token")->plainTextToken;
        $user->assignRole("projectManager");
        return response()->json([
            "message" => "Registration successful",
            "token" => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            "message" => "Logout successful",
        ]);
    }
}
