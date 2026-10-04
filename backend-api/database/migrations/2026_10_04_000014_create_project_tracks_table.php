<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('project_tracks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('title');
            $table->unsignedInteger('track_number')->default(1);
            $table->string('stage')->default('Recording');
            $table->unsignedTinyInteger('progress')->default(0);
            $table->string('status')->default('todo');
            $table->string('drive_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_tracks');
    }
};
