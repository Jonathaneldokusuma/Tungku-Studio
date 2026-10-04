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
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users');

            $table->unsignedSmallInteger('track_count')->default(1);
            $table->unsignedSmallInteger('recording_hours')->default(0);

            $table->boolean('include_recording')->default(false);
            $table->boolean('include_editing')->default(false);
            $table->boolean('include_mixing')->default(false);
            $table->boolean('include_mastering')->default(false);

            $table->text('notes')->nullable();
            $table->string('status', 20)->default('awaiting_studio');

            $table->unsignedBigInteger('auto_price')->nullable();
            $table->unsignedBigInteger('agreed_price')->nullable();
            $table->foreignId('closed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('closed_at')->nullable();
            $table->timestamps();

            $table->index(['client_id', 'status']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
