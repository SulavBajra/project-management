<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ExpenseService;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Validators\ValidationException;

class ExpenseTransactionController extends Controller
{
    public function __construct(protected ExpenseService $expenseService) {}

    public function import(Request $request)
    {
        $request->validate([
            "file" => "required|file|mimes:xlsx,csv,xls",
            "project_id" => "required|integer|exists:projects,id",
        ]);
        try {
            $this->expenseService->extractExpenses(
                $request->file("file"),
                1,
                $request->project_id,
            );
        } catch (ValidationException $e) {
            return response()->json(
                [
                    "message" => "Import failed.",
                    "errors" => $e->failures(),
                ],
                422,
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    "message" => $e->getMessage(),
                    "file" => $e->getFile(),
                    "line" => $e->getLine(),
                ],
                500,
            );
        }
    }
}
