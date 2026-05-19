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
        Schema::create('timeline_project', function (Blueprint $table) {
            $table->foreignId('timeline_id')->constrained('timelines');
            $table->foreignId('project_id')->constrained('projects');
            $table->primary(['timeline_id', 'project_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timeline_project');
    }
};
