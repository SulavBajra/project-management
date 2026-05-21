<?php

namespace App\Imports;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\ToModel;

class ExpensesImport implements ToModel
{
    /**
     * @return Model|null
     */
    public function model(array $row)
    {
        return new Expense([
            //
        ]);
    }
}
