<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignId('custom_offer_id')->nullable()->constrained('custom_offers')->nullOnDelete();
            $table->string('invoice_number')->nullable()->unique();
            $table->string('order_id')->nullable()->unique();
            $table->string('package_name')->nullable();
            $table->unsignedBigInteger('amount')->default(0);
            $table->string('status')->default('unpaid');
            $table->string('method')->nullable();
            $table->string('payment_url')->nullable();
            $table->string('snap_token')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->json('gateway_payload')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
