<?php

namespace App\Repositories;

use App\Models\Expense;

final readonly class ExpenseRepository
{
    public function __construct(private Expense $model)
    {
        //
    }

    public function find(int $projectId)
    {
        $expenses = $this->model->query()
            ->select('id', 'user_id', 'project_id', 'code', 'description', 'total', 'transaction_date')
            ->with(['project:id,name',
                'transactions:id,expense_id,account_head_id,debit,credit,transaction_date',
                'transactions.accountHead:id,name',
                'user:id,name',
                'approval:id,approvable_id,current_status_id,current_step_id',
                'approval.currentStatus:id,name',
                'approval.currentStep:id,is_final'])
            ->where('project_id', $projectId)->paginate(10);

        return $expenses;
    }
}
