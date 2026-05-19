<?php

use App\Http\Controllers\Admin\BudgetHeadController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\RolePermissionController;
use App\Http\Controllers\Admin\TimelineController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("/user", function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

Route::post("/register", [AuthController::class, "register"]);

Route::middleware(["auth:sanctum"])->group(function () {
    Route::get("users/{role}", [UserController::class, "getUsersByRole"]);
    Route::resource("users", UserController::class)->except(["create", "edit"]);

    Route::get("roles", [RolePermissionController::class, "getRoles"]);
    Route::post("users/{user}/role", [
        RolePermissionController::class,
        "assignRole",
    ]);

    // Projects
    Route::controller(ProjectController::class)->group(function () {
        Route::get("projects", "listActiveProjects");
        Route::post("projects", "storeProject");
    });

    // Timeline
    Route::controller(TimelineController::class)->group(function () {
        Route::get("timelines", "getAllTimelines");
        Route::post("timelines", "createTimeline");
    });

    Route::controller(BudgetHeadController::class)->group(function () {
        Route::get("budget-heads", "getBudgetHeads");
    });
});
