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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('expense_category_id')->constrained('expense_categories');
            $table->foreignId('recorded_by')->constrained('users');
            $table->string('description', 255);
            $table->unsignedBigInteger('amount');
            $table->date('spent_on');
            $table->timestamps();

            $table->index('spent_on');
            $table->index(['expense_category_id', 'spent_on']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
