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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->foreignId('client_id')->constrained('users');
            $table->foreignId('package_id')->nullable()->constrained('packages')->nullOnDelete();
            $table->foreignId('quotation_id')->nullable()->unique()->constrained('quotations')->nullOnDelete();
            $table->string('name', 150);

            $table->json('package_snapshot');
            $table->unsignedBigInteger('price');
            $table->unsignedBigInteger('po_amount');
 
            $table->string('status', 30)->default('pending_payment'); // pending_payment | awaiting_assignment | in_progress | completed | cancelled
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
 
            $table->index('status');
            $table->index(['client_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
