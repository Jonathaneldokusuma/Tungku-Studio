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
        Schema::create('track_stage_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_stage_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_track_id')->constrained()->cascadeOnDelete();
 
            $table->string('status', 20)->default('pending'); // pending | in_progress | in_review | revision | approved
            $table->text('result_url')->nullable(); // tautan file hasil kerja
            $table->text('review_notes')->nullable();
            $table->unsignedSmallInteger('revision_count')->default(0);
            $table->dateTime('submitted_at')->nullable();
            $table->dateTime('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
 
            $table->unique(['project_stage_id', 'project_track_id'], 'song_stage_unique');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('track_stage_progress');
    }
};
