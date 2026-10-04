<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('client_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('company_name')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('instagram')->nullable();
            $table->json('preferences')->nullable();
            $table->timestamps();
        });

        Schema::create('operator_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->string('specialization')->nullable();
            $table->json('skills')->nullable();
            $table->string('status')->default('active');
            $table->date('joined_at')->nullable();
            $table->timestamps();
        });

        Schema::create('studio_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->nullable();
            $table->unsignedInteger('capacity')->default(1);
            $table->unsignedBigInteger('hourly_rate')->default(0);
            $table->string('status')->default('available');
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('booking_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('studio_room_id')->nullable()->constrained('studio_rooms')->nullOnDelete();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->cascadeOnDelete();
            $table->date('slot_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('status')->default('available');
            $table->timestamps();
        });

        Schema::create('package_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('package_id')->constrained('packages')->cascadeOnDelete();
            $table->string('name');
            $table->string('stage')->nullable();
            $table->unsignedBigInteger('unit_price')->default(0);
            $table->string('unit')->default('item');
            $table->unsignedInteger('quantity')->default(1);
            $table->timestamps();
        });

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

        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('quotation_request_id')->nullable()->constrained('quotation_requests')->nullOnDelete();
            $table->string('quotation_number')->unique();
            $table->string('title');
            $table->unsignedBigInteger('subtotal')->default(0);
            $table->unsignedBigInteger('discount')->default(0);
            $table->unsignedBigInteger('tax')->default(0);
            $table->unsignedBigInteger('total')->default(0);
            $table->string('status')->default('draft');
            $table->date('valid_until')->nullable();
            $table->text('terms')->nullable();
            $table->timestamps();
        });

        Schema::create('quotation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quotation_id')->constrained('quotations')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedBigInteger('unit_price')->default(0);
            $table->unsignedBigInteger('total')->default(0);
            $table->timestamps();
        });

        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignId('payment_id')->nullable()->constrained('payments')->nullOnDelete();
            $table->foreignId('quotation_id')->nullable()->constrained('quotations')->nullOnDelete();
            $table->string('invoice_number')->unique();
            $table->date('issued_date')->nullable();
            $table->date('due_date')->nullable();
            $table->unsignedBigInteger('subtotal')->default(0);
            $table->unsignedBigInteger('discount')->default(0);
            $table->unsignedBigInteger('tax')->default(0);
            $table->unsignedBigInteger('total')->default(0);
            $table->string('status')->default('unpaid');
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained('invoices')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedBigInteger('unit_price')->default(0);
            $table->unsignedBigInteger('total')->default(0);
            $table->timestamps();
        });

        Schema::create('payment_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments')->cascadeOnDelete();
            $table->string('provider')->default('midtrans');
            $table->string('transaction_id')->nullable();
            $table->string('status')->default('pending');
            $table->string('payment_type')->nullable();
            $table->json('payload')->nullable();
            $table->timestamps();
        });

        Schema::create('project_tracks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('title');
            $table->unsignedInteger('track_number')->default(1);
            $table->string('stage')->default('Recording');
            $table->unsignedTinyInteger('progress')->default(0);
            $table->string('status')->default('todo');
            $table->string('drive_url')->nullable();
            $table->timestamps();
        });

        Schema::create('project_files', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('track_id')->nullable()->constrained('project_tracks')->cascadeOnDelete();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('name');
            $table->string('file_type')->nullable();
            $table->string('drive_url');
            $table->string('visibility')->default('client');
            $table->timestamps();
        });

        Schema::create('project_stage_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('from_stage')->nullable();
            $table->string('to_stage');
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('task_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->text('comment');
            $table->timestamps();
        });

        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained('inventory_items')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type');
            $table->integer('quantity')->default(0);
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('equipment_maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_item_id')->nullable()->constrained('inventory_items')->nullOnDelete();
            $table->date('maintenance_date')->nullable();
            $table->string('status')->default('scheduled');
            $table->unsignedBigInteger('cost')->default(0);
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('work_date');
            $table->time('clock_in')->nullable();
            $table->time('clock_out')->nullable();
            $table->string('status')->default('present');
            $table->timestamps();
        });

        Schema::create('app_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->string('group')->nullable();
            $table->timestamps();
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action');
            $table->string('entity_type')->nullable();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->json('before')->nullable();
            $table->json('after')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('app_settings');
        Schema::dropIfExists('attendance_logs');
        Schema::dropIfExists('equipment_maintenances');
        Schema::dropIfExists('inventory_movements');
        Schema::dropIfExists('task_comments');
        Schema::dropIfExists('project_stage_logs');
        Schema::dropIfExists('project_files');
        Schema::dropIfExists('project_tracks');
        Schema::dropIfExists('payment_attempts');
        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('quotation_items');
        Schema::dropIfExists('quotations');
        Schema::dropIfExists('quotation_requests');
        Schema::dropIfExists('package_services');
        Schema::dropIfExists('booking_slots');
        Schema::dropIfExists('studio_rooms');
        Schema::dropIfExists('operator_profiles');
        Schema::dropIfExists('client_profiles');
    }
};
