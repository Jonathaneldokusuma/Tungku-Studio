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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('period_year');
            $table->unsignedTinyInteger('period_month');
            $table->unsignedBigInteger('total_revenue')->default(0);
            $table->unsignedBigInteger('total_expense')->default(0);
            $table->bigInteger('net_profit')->default(0); // bisa negatif
 
            // draft | finalized
            $table->string('status', 20)->default('draft');
            $table->dateTime('finalized_at')->nullable();
            $table->foreignId('finalized_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
 
            $table->unique(['period_year', 'period_month']);
        });

        Schema::create('payroll_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_id')->constrained()->cascadeOnDelete();
            $table->foreignId('operator_id')->constrained('users');
            $table->unsignedInteger('jobs_count')->default(0); // dasar rekomendasi
            $table->decimal('recommended_percentage', 5, 2)->default(0);
            $table->decimal('percentage', 5, 2)->default(0); // nilai final, total maksimal 100
            $table->unsignedBigInteger('amount')->default(0);
            $table->timestamps();
 
            $table->unique(['payroll_id', 'operator_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_items');
        Schema::dropIfExists('payrolls');
    }
};
