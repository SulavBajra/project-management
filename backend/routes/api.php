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
use App\Http\Controllers\Approval\ApprovalHistoryController;
use App\Http\Controllers\Approval\ApprovalStepController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Budgets\BudgetPlanController;
use App\Http\Controllers\Budgets\BudgetPlanItemController;
use App\Http\Controllers\Expense\ExpenseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Report\ReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register'])->middleware("throttle:login");

Route::middleware(['auth:sanctum','throttle:api'])->group(function () {
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/kpi', [DashboardController::class, 'kpi']);
    Route::get('/dashboard/chart', [DashboardController::class, 'chart']);

    Route::get('users/{role}', [UserController::class, 'getUsersByRole']);
    Route::resource('users', UserController::class)->except(['create', 'edit']);

    // Projects
    Route::prefix('projects')
        ->name('projects.')
        ->controller(ProjectController::class)
        ->group(function () {
            Route::get('/list', 'listActiveProjects');
            Route::get('/{userId}', 'getAllProjects');
            Route::get('/view/{id}', 'show');
            Route::put('/{projectId}', 'update');
            Route::post('/', 'storeProject');
            Route::delete('/{project}', 'destroy');

            Route::post('{id}', 'endProject');

            Route::get('{id}/stat', 'getStatOfProject');
            Route::get('{id}/timeline', 'getProjectTimeline');
            Route::post('{id}/timeline', 'extendProjectTimeline');
            Route::get('{id}/stat/compare', 'getBudgetVsExpense');

            Route::get('{id}/users', 'getUsers');
            Route::patch('{id}/users', 'addUsers');
        });

    // Timeline
    Route::prefix('timelines')
        ->name('timelines.')
        ->controller(TimelineController::class)
        ->group(function () {
            Route::get('/', 'getAllTimelines');
            Route::post('/', 'createTimeline');
        });

    // Project PLan

    Route::controller(RolePermissionController::class)->group(function () {
        Route::get('roles', 'getRoles');
        Route::post('roles', 'assignPermissionToRole');
        Route::post('users/{user}/role', 'assignRole');
        Route::patch('users/{user}/role', 'update');
    });

    Route::controller(ExpenseTransactionController::class)->group(function () {
        // using to handle csv file import
        Route::post('expenses/import', 'import')->middleware([
            'throttle:import',
            'permission:import_expense',
        ]);
        Route::get(
            '/expenses/import/{import}/status',
            'importStatus',
        )->middleware('permission:import_expense');

        Route::get('expenses/{project_id}', 'index');
        // Manual Addition of expenses
        Route::post('projects/{project_id}/expenses', 'store');
    });

    Route::controller(ExpenseController::class)->group(function () {
        Route::get('expenses/{id}/approval', 'index');
        Route::get('expenses/{id}/history', 'history');
        Route::delete('expenses/{id}', 'destroy');
        Route::get('projects/{id}/expenses', 'show');
    });

    Route::prefix('budget-heads')
        ->name('budget-heads.')
        ->controller(BudgetHeadController::class)
        ->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
            Route::get('/stats', 'getBudgetHeadStats');
            Route::get('/{item}', 'show');
            Route::put('/{budgetHead}', 'update');
            Route::delete('/{budgetHead}', 'destroy');
        });

    Route::prefix('projects')
        ->name('projects.')
        ->controller(BudgetPlanController::class)
        ->group(function () {
            Route::get('{project}/budget-plan', 'show');
            Route::post('{project}/budget-plan', 'store');
            Route::patch('budget-plan/items/{item}/allocations', 'update');
            // this is to clear the allocated value in the budget head
            Route::delete('budget-plan/items/{item}', 'destroy');
        });

    Route::prefix('projects')
        ->name('projects.budget-plan.')
        ->controller(BudgetPlanItemController::class)
        ->group(function () {
            Route::get('{project}/budget-plan/items', 'show');
            // this is to delete the allocated budget head
            Route::delete('budget-plan/{item}', 'destroy');
            Route::post('{project}/budget-plan/{plan}', 'store');
            Route::get('{project}/budget-plan/{plan}/export', 'export');
            Route::post(
                '{project}/budget-plan/{plan}/import',
                'import',
            )->middleware('throttle:import');
        });

    Route::get('approvals/history', [ApprovalHistoryController::class, 'index']);

    Route::controller(ApprovalFlowController::class)->group(function () {
        Route::get('approval-flow', 'index');
        Route::post('approval-flow', 'store');
        Route::get('approval-flow/{id}', 'show');
    });

    Route::controller(ApprovalController::class)->group(function () {
        Route::post('approvals/{id}', 'store');
        Route::post('approvals/{id}/reject', 'reject');
        Route::get('approvals/{id}', 'show');
    });

    Route::controller(ApprovalStepController::class)->group(function () {
        Route::get('approvals/steps/{role_id}', 'show');
        Route::patch('/approvals/steps/{step}', 'update');
    });

    Route::prefix('reports')
    ->name('reports.')
    ->controller(ReportController::class)
    ->group(function () {
        Route::get('budget-vs-actual', 'index');
        Route::get('budget-vs-actual/{project_id}', 'show');
    });
});
