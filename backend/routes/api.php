<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\UserController;

Route::get("/user", function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

Route::post("/login", [AuthController::class, "login"])->middleware(
    "throttle:login",
);
Route::post("/register", [AuthController::class, "register"]);
Route::post("/logout", [AuthController::class, "logout"])->middleware(
    "auth:sanctum",
);

Route::middleware(["auth:sanctum"])->group(function () {
    Route::resource("users", UserController::class)->except(["create", "edit"]);
});
