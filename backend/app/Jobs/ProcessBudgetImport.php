<?php

namespace App\Jobs;

use App\Models\ExpenseImport;
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
    }
}
