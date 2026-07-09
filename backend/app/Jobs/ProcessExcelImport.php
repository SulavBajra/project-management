<?php

namespace App\Jobs;

use App\Exceptions\ExpenseNotBalanceException;
use App\Models\ExpenseImport;
use App\Services\ApprovalService;
use App\Services\ExpenseService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Validators\ValidationException;

class ProcessExcelImport implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private string $filePath,
        private int $userId,
        private int $projectId,
        private int $importId,
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(
        ExpenseService $expenseService,
        ApprovalService $approvalService,
    ): void {
        $import = ExpenseImport::findOrFail($this->importId);
        if ($import->isTerminal()) {
            return;
        }
        $import->markProcessing();

        try {
            $absolutePath = Storage::disk('local')->path($this->filePath);

            DB::transaction(function () use (
                $expenseService,
                $approvalService,
                $absolutePath,
            ) {
                $expenses = $expenseService->extractExpenses(
                    $absolutePath,
                    $this->userId,
                    $this->projectId,
                );
                foreach ($expenses as $expense) {
                    $approvalService->beginApproval(
                        $expense->id,
                        'expense',
                        $this->userId,
                    );
                }
            });
            $import->markCompleted();
        } catch (ValidationException $e) {
            $import->markFailed($e->failures());
        } catch (ExpenseNotBalanceException $e) {
            $import->markFailed([['message' => $e->getMessage()]]);
        } catch (\Exception $e) {
            $import->markFailed([['message' => $e->getMessage()]]);
        } finally {
            Storage::disk('local')->delete($this->filePath);
        }
    }

    public function failed(\Throwable $e): void
    {
        ExpenseImport::where('id', $this->importId)->update([
            'status' => 'failed',
            'errors' => [['message' => $e->getMessage()]],
        ]);
    }
}
