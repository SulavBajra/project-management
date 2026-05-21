<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expense_transactions', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('expense_id')
                ->constrained('expenses')
                ->cascadeOnDelete();
            $table->foreignId('account_head_id')->constrained('account_heads');
            $table->decimal('debit', 10, 2);
            $table->decimal('credit', 10, 2);
            $table->date('transaction_date');
            $table->timestamps();
            $table->unique(
                ['expense_id', 'account_head_id', 'transaction_date'],
                'exp_trans_unique',
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expense_transactions');
    }
};
