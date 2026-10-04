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
        Schema::create('recording_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms');
            // Nullable karena slot di-hold sebelum PO dibayar
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('project_stage_id')->nullable()->constrained('project_stages')->nullOnDelete();
            $table->foreignId('client_id')->constrained('users'); // pemegang hold atau booking
 
            // Disimpan UTC. Konversi ke Asia/Jakarta di frontend.
            $table->dateTime('start_at');
            $table->dateTime('end_at');
 
            // held | confirmed | completed | cancelled | expired
            $table->string('status', 20)->default('held');
            $table->dateTime('held_until')->nullable(); // batas hold sebelum PO dibayar
 
            // Sesi tambahan dari perpanjangan waktu
            $table->boolean('is_extension')->default(false);
            $table->unsignedBigInteger('extra_fee')->default(0); // ditambahkan ke pelunasan
            $table->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
 
            // Mendukung query cek tumpang tindih
            $table->index(['room_id', 'start_at', 'end_at'], 'rec_sessions_overlap_idx');
            $table->index(['status', 'held_until']);
            $table->index('project_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recording_sessions');
    }
};
