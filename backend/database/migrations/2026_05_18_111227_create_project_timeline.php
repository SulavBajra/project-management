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
        Schema::create("project_timeline", function (Blueprint $table) {
            $table
                ->foreignId("project_id")
                ->constrained("projects")
                ->cascadeOnDelete();
            $table->foreignId("timeline_id")->constrained("timelines");
            $table->primary(["timeline_id", "project_id"]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("project_timeline");
    }
};
