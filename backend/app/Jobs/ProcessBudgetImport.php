<?php

namespace App\Jobs;

use App\Models\ExpenseImport;
use App\Services\ApprovalService;
use App\Services\BudgetService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;

class ProcessBudgetImport implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        private string $filePath,
        private int $projectId,
        private int $importId,
        private int $planId,
        private int $userId,
        private ApprovalService $approvalService,
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(BudgetService $service): void
    {
        $import = ExpenseImport::findOrFail($this->importId);
        if ($import->isTerminal()) {
            return;
        }
        $import->markProcessing();
        try {
            $absolutePath = Storage::disk("local")->path($this->filePath);
            $service->extractBudgetData(
                $absolutePath,
                $this->planId,
                $this->projectId,
            );
        } catch (\Exception $e) {
            $import->markFailed([["message" => $e->getMessage()]]);
        }
        $this->approvalService->beginApproval(
            $this->projectId,
            "budget",
            $this->userId,
        );
    }
}
