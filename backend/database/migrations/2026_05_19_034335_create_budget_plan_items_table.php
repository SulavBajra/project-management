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
        Schema::create('budget_plan_items', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('budget_plan_id')
                ->constrained('budget_plans')
                ->cascadeOnDelete();
            $table
                ->foreignId('budget_head_id')
                ->constrained('budget_heads')
                ->cascadeOnDelete();
            $table->timestamps();
            $table->unique(
                ['budget_plan_id', 'budget_head_id'],
                'budget_plan_item_unique',
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget_plan_items');
    }
};
