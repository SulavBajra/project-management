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
        Schema::create('approval_steps', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('approval_workflow_id')
                ->constrained('approval_workflows')
                ->cascadeOnDelete();
            $table
                ->foreignId('role_id')
                ->constrained('roles')
                ->restrictOnDelete();
            $table->unsignedTinyInteger('order_no');
            $table->string('name');
            $table->boolean('is_final')->default(false);
            $table->timestamps();

            $table->unique(['approval_workflow_id', 'order_no']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_steps');
    }
};
