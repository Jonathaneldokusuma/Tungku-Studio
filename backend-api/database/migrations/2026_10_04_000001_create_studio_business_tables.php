<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('client')->after('password');
            $table->string('phone')->nullable()->after('email');
            $table->string('firebase_uid')->nullable()->unique()->after('id');
            $table->string('avatar_url')->nullable()->after('remember_token');
            $table->json('metadata')->nullable()->after('avatar_url');
        });

        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('price')->default(0);
            $table->string('duration')->nullable();
            $table->unsignedInteger('duration_hours')->default(0);
            $table->unsignedInteger('song_count')->default(1);
            $table->json('stages')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('package_id')->nullable()->constrained('packages')->nullOnDelete();
            $table->string('project_name');
            $table->date('booking_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->string('status')->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

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

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->nullable()->constrained('projects')->cascadeOnDelete();
            $table->foreignId('operator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('stage')->nullable();
            $table->string('status')->default('todo');
            $table->unsignedTinyInteger('progress')->default(0);
            $table->date('deadline')->nullable();
            $table->string('file_url')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('recording_extensions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('extension_date')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->unsignedInteger('extra_hours')->default(0);
            $table->unsignedBigInteger('extra_amount')->default(0);
            $table->string('status')->default('pending');
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->text('message')->nullable();
            $table->string('type')->nullable();
            $table->string('url')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('crm_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('status')->default('open');
            $table->timestamps();
        });

        Schema::create('finance_reports', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('title');
            $table->unsignedBigInteger('amount')->default(0);
            $table->date('report_date')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('inventory_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->nullable();
            $table->unsignedInteger('quantity')->default(0);
            $table->string('condition')->default('good');
            $table->text('note')->nullable();
            $table->timestamps();
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category')->nullable();
            $table->unsignedBigInteger('amount')->default(0);
            $table->date('expense_date')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('inventory_items');
        Schema::dropIfExists('finance_reports');
        Schema::dropIfExists('crm_messages');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('recording_extensions');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('custom_offers');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('packages');

        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['firebase_uid']);
            $table->dropColumn(['role', 'phone', 'firebase_uid', 'avatar_url', 'metadata']);
        });
    }
};
