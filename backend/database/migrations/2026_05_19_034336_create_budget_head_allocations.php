<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("budget_head_allocations", function (Blueprint $table) {
            $table->id();
            $table->foreignId("budget_head_id")->constrained("budget_heads");
            $table->foreignId("project_id")->constrained("projects");
            $table
                ->foreignId("timeline_period_id")
                ->constrained("timeline_periods");
            $table->decimal("allocated_amount", 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("budget_head_allocations");
    }
};
