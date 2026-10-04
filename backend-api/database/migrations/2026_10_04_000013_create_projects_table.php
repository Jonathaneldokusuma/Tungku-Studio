<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('package_id')->nullable()->constrained('packages')->nullOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();
            $table->foreignId('custom_offer_id')->nullable()->constrained('custom_offers')->nullOnDelete();
            $table->string('name');
            $table->string('package_name')->nullable();
            $table->string('stage')->default('Booking');
            $table->unsignedTinyInteger('progress')->default(0);
            $table->string('status')->default('pending');
            $table->date('deadline')->nullable();
            $table->string('drive_folder_url')->nullable();
            $table->json('tracks')->nullable();
            $table->json('stages')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
