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
        Schema::create('project_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('stage', 20);
            $table->unsignedTinyInteger('sequence');
            $table->foreignId('operator_id')->nullable()->constrained('users')->nullOnDelete();
 
            $table->string('status', 20)->default('locked'); // locked | ready | in_progress | completed
            $table->dateTime('deadline_at')->nullable();
            $table->dateTime('assigned_at')->nullable();
            $table->dateTime('started_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
 
            $table->unique(['project_id', 'stage']);
            $table->index(['operator_id', 'status']);
            $table->index('deadline_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_stages');
    }
};
