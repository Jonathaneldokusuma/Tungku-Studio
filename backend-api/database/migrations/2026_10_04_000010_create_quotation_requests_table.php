<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quotation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('custom_offer_id')->nullable()->constrained('custom_offers')->nullOnDelete();
            $table->string('title');
            $table->text('brief')->nullable();
            $table->json('requested_services')->nullable();
            $table->unsignedBigInteger('budget')->default(0);
            $table->string('status')->default('requested');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotation_requests');
    }
};
