<?php

use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\RolePermissionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("/user", function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

Route::post("/register", [AuthController::class, "register"]);

Route::middleware(["auth:sanctum"])->group(function () {
    Route::resource("users", UserController::class)->except(["create", "edit"]);
    Route::get("roles", [RolePermissionController::class, "getRoles"]);
    Route::post("users/{user}/role", [
        RolePermissionController::class,
        "assignRole",
    ]);

    //Projects
    Route::get("projects", [ProjectController::class, "listActiveProjects"]);
});
