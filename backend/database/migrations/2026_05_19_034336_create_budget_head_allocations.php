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
        Schema::create('budget_head_allocations', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('budget_plan_item_id')
                ->constrained('budget_plan_items')
                ->cascadeOnDelete();
            $table
                ->foreignId('timeline_period_id')
                ->constrained('timeline_periods')
                ->cascadeOnDelete();
            $table->decimal('allocated_amount', 15, 2)->nullable();
            $table->timestamps();

            $table->unique(
                ['budget_plan_item_id', 'timeline_period_id'],
                'budget_alloc_unique',
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget_head_allocations');
    }
};
