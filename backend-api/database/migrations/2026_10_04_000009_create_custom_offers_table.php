<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('custom_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type')->default('custom_offer');
            $table->string('project_name')->nullable();
            $table->string('package_name')->nullable();
            $table->json('stages')->nullable();
            $table->unsignedInteger('duration_per_song')->default(0);
            $table->unsignedInteger('song_count')->default(1);
            $table->unsignedBigInteger('offered_price')->default(0);
            $table->boolean('manual_price_enabled')->default(false);
            $table->string('status')->default('pending');
            $table->string('requested_slot')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_offers');
    }
};
