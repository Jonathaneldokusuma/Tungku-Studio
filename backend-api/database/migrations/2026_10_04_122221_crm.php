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
        Schema::create('crm_campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users');
            $table->string('name', 150);
            $table->foreignId('package_id')->nullable()->constrained('packages')->nullOnDelete();
            $table->text('message');
            $table->json('channels'); // contoh: ["whatsapp","email"]
 
            // draft | sending | sent | failed
            $table->string('status', 20)->default('draft');
            $table->dateTime('sent_at')->nullable();
            $table->timestamps();
        });

        Schema::create('crm_campaign_recipients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('crm_campaign_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users');
            $table->string('channel', 15); // whatsapp | email
 
            // pending | sent | failed
            $table->string('status', 15)->default('pending');
            $table->dateTime('sent_at')->nullable();
            $table->text('error')->nullable();
            $table->timestamps();
 
            $table->unique(['crm_campaign_id', 'client_id', 'channel'], 'crm_recipient_unique');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crm_campaign_recipients');
        Schema::dropIfExists('crm_campaigns');
    }
};
