<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('client')->after('password');
            $table->string('phone')->nullable()->after('email');
            $table->string('firebase_uid')->nullable()->unique()->after('id');
            $table->string('avatar_url')->nullable()->after('remember_token');
            $table->json('metadata')->nullable()->after('avatar_url');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['firebase_uid']);
            $table->dropColumn(['role', 'phone', 'firebase_uid', 'avatar_url', 'metadata']);
        });
    }
};
