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
        Schema::create("expenses", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained("users");
            $table
                ->foreignId("project_id")
                ->constrained("projects")
                ->cascadeOnDelete();
            $table->string("code")->unique();
            $table->string("description")->nullable();
            $table->decimal("total", 10, 2);
            $table->date("transaction_date");
            $table->timestamps();
            $table->index(["user_id", "project_id"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("expenses");
    }
};
