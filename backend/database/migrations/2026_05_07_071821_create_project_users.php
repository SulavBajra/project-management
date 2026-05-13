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
        Schema::create("project_users", function (Blueprint $table) {
            $table->foreignId("project_id")->constrained("projects");
            $table->foreignId("user_id")->constrained("users");
            $table->primary(["project_id", "user_id"]);
            $table->index(["project_id", "user_id"]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("project_users");
    }
};
