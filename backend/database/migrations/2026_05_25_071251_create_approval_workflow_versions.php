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
        Schema::create("approval_workflow_versions", function (
            Blueprint $table,
        ) {
            $table->id();
            $table
                ->foreignId("approval_workflow_id")
                ->constrained("approval_workflows")
                ->cascadeOnDelete();
            $table->integer("version");
            $table->boolean("is_current")->default(false);
            $table->timestamps();

            $table->unique(["approval_workflow_id", "version"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("approval_workflow_versions");
    }
};
