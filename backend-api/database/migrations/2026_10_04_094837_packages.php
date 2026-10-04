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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->tinyText('description')->nullable();

            $table->unsignedSmallInteger('track_count')->default(1);
            $table->unsignedSmallInteger('recording_hours')->default(1);

            $table->boolean('include_recording')->default(false);
            $table->boolean('include_editing')->default(false);
            $table->boolean('include_mixing')->default(false);
            $table->boolean('include_mastering')->default(false);

            $table->unsignedBigInteger('auto_price');
            $table->unsignedBigInteger('manual_price')->nullable();
            $table->boolean('is_price_manual')->default(false);

            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
