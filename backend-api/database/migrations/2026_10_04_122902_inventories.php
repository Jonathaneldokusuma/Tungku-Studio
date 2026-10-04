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
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('code', 30)->unique();
            $table->string('name', 100);
            $table->foreignId('inventory_category_id')->constrained('inventory_categories');
            $table->string('brand', 50)->nullable();
            $table->string('model', 50)->nullable();
            $table->string('serial_number', 100)->nullable();

            $table->date('purchase_date');
            $table->unsignedBigInteger('purchase_price');
            $table->unsignedBigInteger('residual_value')->default(0);
            $table->unsignedSmallInteger('useful_life_months');

            // active | in_repair | sold | disposed
            $table->string('status', 20)->default('active');
            $table->date('disposed_on')->nullable();
            $table->unsignedBigInteger('disposal_value')->nullable();

            $table->foreignId('room_id')->nullable()->constrained('rooms')->nullOnDelete();
            $table->foreignId('expense_id')->nullable()->constrained('expenses')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
