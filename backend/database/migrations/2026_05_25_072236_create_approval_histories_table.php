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
        Schema::create('approval_histories', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('approval_workflow_id')
                ->constrained('approval_workflows')
                ->cascadeOnDelete();
            $table
                ->foreignId('approval_step_id')
                ->nullable()
                ->constrained('approval_steps');
            $table->foreignId('acted_by')->constrained('users');
            $table->string('from_state');
            $table->string('to_state');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_histories');
    }
};
