<?php

use App\Http\Controllers\Admin\BudgetHeadController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExpenseTransactionController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\RolePermissionController;
use App\Http\Controllers\Admin\TimelineController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);

Route::get('/dashboard', [DashboardController::class, 'index']);

// Route::post("/expenses/import", [ExpenseTransactionController::class, "import"]);
Route::get('/expenses/{id}', [
    ExpenseTransactionController::class,
    'getExpenses',
]);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('users/{role}', [UserController::class, 'getUsersByRole']);
    Route::resource('users', UserController::class)->except(['create', 'edit']);

    Route::get('roles', [RolePermissionController::class, 'getRoles']);
    Route::post('users/{user}/role', [
        RolePermissionController::class,
        'assignRole',
    ]);

    // Projects
    Route::controller(ProjectController::class)->group(function () {
        Route::get('projects', 'listActiveProjects');
        Route::post('projects', 'storeProject');
        Route::post('projects/{id}', 'endProject');
        Route::get('projects/{id}/stat', 'getStatOfProject');
        Route::get('projects/{id}/timeline', 'getProjectTimeline');
        Route::post('projects/{id}/timeline', 'extendProjectTimeline');

        // Route::patch("");
    });

    // Timeline
    Route::controller(TimelineController::class)->group(function () {
        Route::get('timelines', 'getAllTimelines');
        Route::post('timelines', 'createTimeline');
    });

    Route::controller(BudgetHeadController::class)->group(function () {
        Route::get('budget-heads', 'getBudgetHeads');
    });

    Route::controller(ExpenseTransactionController::class)->group(function () {
        // using to handle csv file import
        Route::post('expenses/import', 'import');

        // Manual Addition of expenses
        Route::post('projects/{project_id}/expenses', 'storeExpenses');
        // Route::get("expenses", "getExpenses");
    });
});
