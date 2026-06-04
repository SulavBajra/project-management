<?php

use App\Http\Controllers\Admin\BudgetHeadController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExpenseTransactionController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\RolePermissionController;
use App\Http\Controllers\Admin\TimelineController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Approval\ApprovalController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Budgets\BudgetPlanController;
use App\Http\Controllers\Budgets\BudgetPlanItemController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("/user", function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

Route::post("/register", [AuthController::class, "register"]);

Route::get("/dashboard", [DashboardController::class, "index"]);

Route::prefix("budget-heads")
    ->name("budget-heads.")
    ->controller(BudgetHeadController::class)
    ->group(function () {
        Route::get("/", "index");
        Route::post("/", "createBudgetHead");
        Route::get("/stats", "getBudgetHeadStats");
    });

Route::middleware(["auth:sanctum"])->group(function () {
    Route::get("users/{role}", [UserController::class, "getUsersByRole"]);
    Route::resource("users", UserController::class)->except(["create", "edit"]);

    // Projects
    Route::prefix("projects")
        ->name("projects.")
        ->controller(ProjectController::class)
        ->group(function () {
            Route::get("/", "getAllProjects");
            Route::get("/list", "listActiveProjects");
            Route::post("/", "storeProject");

            Route::post("{id}", "endProject");

            Route::get("{id}/stat", "getStatOfProject");
            Route::get("{id}/timeline", "getProjectTimeline");
            Route::post("{id}/timeline", "extendProjectTimeline");

            Route::get("{id}/users", "getUsers");
            Route::patch("{id}/users", "addUsers");
        });

    // Timeline
    Route::prefix("timelines")
        ->name("timelines.")
        ->controller(TimelineController::class)
        ->group(function () {
            Route::get("/", "getAllTimelines");
            Route::post("/", "createTimeline");
        });

    //Project PLan

    Route::controller(RolePermissionController::class)->group(function () {
        Route::get("roles", "getRoles");
        Route::post("roles", "assignPermissionToRole");
        Route::post("users/{user}/role", "assignRole");
    });

    Route::controller(ExpenseTransactionController::class)->group(function () {
        // using to handle csv file import
        Route::post("expenses/import", "import")->middleware([
            "throttle:import",
            "permission:import_expense",
        ]);
        Route::get(
            "/expenses/import/{import}/status",
            "importStatus",
        )->middleware("permission:import_expense");

        // Manual Addition of expenses
        Route::post("projects/{project_id}/expenses", "storeExpenses");
        Route::get("expenses/{project_id}", "getExpenses");
    });

    Route::controller(ApprovalController::class)->group(function () {
        Route::get("approvals", "index");
    });
});

Route::controller(BudgetPlanController::class)->group(function () {
    Route::get("projects/{project}/budget-plan", "show");
    Route::post("projects/{project}/budget-plan", "store");
    Route::patch("projects/budget-plan/items/{item}/allocations", "update");
});

Route::controller(BudgetPlanItemController::class)->group(function () {
    Route::get("projects/{project}/budget-plan/items", "show");
});
