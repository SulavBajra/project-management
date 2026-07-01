<?php

use App\Http\Controllers\Admin\BudgetHeadController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExpenseTransactionController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\RolePermissionController;
use App\Http\Controllers\Admin\TimelineController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Approval\ApprovalController;
use App\Http\Controllers\Approval\ApprovalFlowController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Budgets\BudgetPlanController;
use App\Http\Controllers\Budgets\BudgetPlanItemController;
use App\Http\Controllers\Expense\ExpenseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get("/user", function (Request $request) {
    return $request->user();
})->middleware("auth:sanctum");

Route::post("/register", [AuthController::class, "register"]);

Route::middleware(["auth:sanctum"])->group(function () {
    Route::get("/dashboard", [DashboardController::class, "index"]);
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
            Route::delete("/{project}", "destroy");

            Route::post("{id}", "endProject");

            Route::get("{id}/stat", "getStatOfProject");
            Route::get("{id}/timeline", "getProjectTimeline");
            Route::post("{id}/timeline", "extendProjectTimeline");
            Route::get("{id}/stat/compare", "getBudgetVsExpense");

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

        Route::get("expenses/{project_id}", "index");
        // Manual Addition of expenses
        Route::post("projects/{project_id}/expenses", "store");
    });

    Route::get("expenses/{id}/approval", [ExpenseController::class, "index"]);

    Route::prefix("budget-heads")
        ->name("budget-heads.")
        ->controller(BudgetHeadController::class)
        ->group(function () {
            Route::get("/", "index");
            Route::post("/", "store");
            Route::get("/stats", "getBudgetHeadStats");
            Route::get("/{item}", "show");
        });

    Route::prefix("projects")
        ->name("projects.")
        ->controller(BudgetPlanController::class)
        ->group(function () {
            Route::get("{project}/budget-plan", "show");
            Route::post("{project}/budget-plan", "store");
            Route::patch("budget-plan/items/{item}/allocations", "update");
            //this is to clear the allocated value in the budget head
            Route::delete("budget-plan/items/{item}", "destroy");
        });

    Route::prefix("projects")
        ->name("projects.budget-plan.")
        ->controller(BudgetPlanItemController::class)
        ->group(function () {
            Route::get("{project}/budget-plan/items", "show");
            //this is to delete the allocated budget head
            Route::delete("budget-plan/{item}", "destroy");
            Route::post("{project}/budget-plan/{plan}", "store");
            Route::get("{project}/budget-plan/{plan}/export", "export");
            Route::post(
                "{project}/budget-plan/{plan}/import",
                "import",
            )->middleware("throttle:import");
        });

    Route::controller(ApprovalFlowController::class)->group(function () {
        Route::get("approval-flow", "index");
        Route::post("approval-flow", "store");
        Route::get("approval-flow/{id}", "show");
    });

    Route::controller(ApprovalController::class)->group(function () {
        Route::post("approvals/{id}", "store");
        Route::post("approvals/{id}/reject", "reject");
    });
});

//test field
// Route::get("projects/budget-plan/{plan}/export", [
//     BudgetPlanItemController::class,
//     "export",
// ]);
// Route::get("projects/{id}/stat/compare", [
//     ProjectController::class,
//     "getBudgetVsExpense",
// ]);
// Route::put("approvals/{id}", [ApprovalController::class, "store"]);
// Route::get("approval-flow/{id}", [ApprovalFlowController::class, "show"]);
// Route::post("approvals/{id}", [ApprovalController::class, "store"]);
// Route::get("expenses/{project_id}", [
//     ExpenseTransactionController::class,
//     "getExpenses",
// ]);
