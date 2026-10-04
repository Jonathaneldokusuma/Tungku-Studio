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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained();
            $table->string('type', 10); // po | final
            $table->unsignedBigInteger('amount');
 
            // pending | paid | failed | expired | refunded
            $table->string('status', 20)->default('pending');
 
            $table->string('provider', 20)->nullable(); // midtrans | xendit
            $table->string('order_id', 64)->unique();   // dikirim ke payment gateway
            $table->string('provider_transaction_id', 100)->nullable()->unique();
            $table->string('payment_method', 50)->nullable();
            $table->string('snap_token')->nullable();
            $table->text('payment_url')->nullable();
            $table->json('raw_payload')->nullable(); // payload webhook terakhir
            $table->dateTime('expires_at')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->timestamps();
 
            $table->index(['project_id', 'type']);
            $table->index(['status', 'paid_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
