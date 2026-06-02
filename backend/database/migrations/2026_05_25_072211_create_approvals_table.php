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
        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            $table->morphs('approvable');
            $table
                ->foreignId('approval_workflow_version_id')
                ->constrained('approval_workflow_versions');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('current_step_id')->constrained('approval_steps');
            $table
                ->foreignId('current_status_id')
                ->constrained('approval_statuses');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvals');
    }
};
