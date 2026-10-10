<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $now = now();

        DB::table('users')->insert([
            [
                'id' => 1,
                'firebase_uid' => 'seed-client-uid',
                'name' => 'Singha Client',
                'email' => 'client@tungkustudio.com',
                'phone' => '+628111111111',
                'password' => Hash::make('TungkuClient123'),
                'role' => 'client',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'firebase_uid' => 'seed-manager-uid',
                'name' => 'Manager Tungku',
                'email' => 'manager@tungkustudio.com',
                'phone' => '+628222222222',
                'password' => Hash::make('TungkuManager123'),
                'role' => 'manager',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'firebase_uid' => 'seed-operator-uid',
                'name' => 'Operator Tungku',
                'email' => 'operator@tungkustudio.com',
                'phone' => '+628333333333',
                'password' => Hash::make('TungkuOperator123'),
                'role' => 'operator',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('packages')->insert([
            [
                'id' => 1,
                'name' => 'Paket Lengkap A',
                'description' => 'Paket lengkap untuk satu lagu, dari rekaman sampai siap dirilis.',
                'price' => 970000,
                'duration' => '6 Jam Rekaman',
                'duration_hours' => 6,
                'song_count' => 1,
                'stages' => json_encode(['Recording', 'Editing', 'Mixing', 'Mastering']),
                'is_active' => true,
                'sort_order' => 1,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'name' => 'Paket Lengkap B',
                'description' => 'Paket lengkap untuk dua lagu, dari rekaman sampai siap dirilis.',
                'price' => 1840000,
                'duration' => '12 Jam Rekaman',
                'duration_hours' => 12,
                'song_count' => 2,
                'stages' => json_encode(['Recording', 'Editing', 'Mixing', 'Mastering']),
                'is_active' => true,
                'sort_order' => 2,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 3,
                'name' => 'Rekaman Suara',
                'description' => 'Paket untuk rekaman suara saja.',
                'price' => 360000,
                'duration' => '2 Jam Rekaman',
                'duration_hours' => 2,
                'song_count' => 1,
                'stages' => json_encode(['Recording']),
                'is_active' => true,
                'sort_order' => 3,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('bookings')->insert([
            [
                'id' => 1,
                'client_id' => 1,
                'package_id' => 1,
                'project_name' => 'Bintang Kehidupan',
                'booking_date' => '2026-09-24',
                'start_time' => '13:00:00',
                'end_time' => '16:00:00',
                'status' => 'confirmed',
                'notes' => 'Booking awal untuk tracking client portal.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('custom_offers')->insert([
            [
                'id' => 1,
                'client_id' => 1,
                'type' => 'package_purchase',
                'project_name' => 'Bintang Kehidupan',
                'package_name' => 'Paket Lengkap A',
                'stages' => json_encode(['Recording', 'Editing', 'Mixing', 'Mastering']),
                'duration_per_song' => 6,
                'song_count' => 1,
                'bundle_name' => 'Bundle Rilis Single',
                'base_price' => 1078000,
                'discount_percent' => 10,
                'discount_amount' => 108000,
                'offered_price' => 970000,
                'status' => 'approved',
                'note' => 'Seed pembelian paket siap pakai.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'id' => 2,
                'client_id' => 1,
                'type' => 'custom_offer',
                'project_name' => 'Project Custom Demo',
                'package_name' => 'Penawaran Kustom',
                'stages' => json_encode(['Recording', 'Mixing']),
                'duration_per_song' => 3,
                'song_count' => 1,
                'bundle_name' => 'Bundle Vocal Polish',
                'base_price' => 1316000,
                'discount_percent' => 5,
                'discount_amount' => 66000,
                'offered_price' => 1250000,
                'status' => 'pending',
                'note' => 'Seed penawaran custom berbasis diskon menunggu manager.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('projects')->insert([
            [
                'id' => 1,
                'client_id' => 1,
                'package_id' => 1,
                'booking_id' => 1,
                'custom_offer_id' => 1,
                'name' => 'Bintang Kehidupan',
                'package_name' => 'Paket Lengkap A',
                'stage' => 'Mixing',
                'progress' => 68,
                'status' => 'in_progress',
                'deadline' => '2026-09-26',
                'drive_folder_url' => 'https://drive.google.com/demo-folder',
                'tracks' => json_encode(['Vokal Utama', 'Gitar', 'Drum', 'Bass', 'Backing Vocal']),
                'stages' => json_encode(['Recording', 'Editing', 'Mixing', 'Mastering']),
                'note' => 'Seed project utama.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('payments')->insert([
            [
                'id' => 1,
                'client_id' => 1,
                'project_id' => 1,
                'custom_offer_id' => 1,
                'invoice_number' => 'INV-20261004-001',
                'order_id' => 'ORDER-20261004-001',
                'package_name' => 'Paket Lengkap A',
                'amount' => 970000,
                'status' => 'unpaid',
                'method' => 'manual_confirmation',
                'payment_url' => null,
                'snap_token' => null,
                'note' => 'Seed invoice belum lunas.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('tasks')->insert([
            [
                'id' => 1,
                'project_id' => 1,
                'operator_id' => 3,
                'title' => 'Mixing Track 1',
                'stage' => 'Mixing',
                'status' => 'in_progress',
                'progress' => 40,
                'deadline' => '2026-09-25',
                'file_url' => 'https://drive.google.com/demo-track',
                'note' => 'Seed task operator.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('recording_extensions')->insert([
            [
                'id' => 1,
                'booking_id' => 1,
                'client_id' => 1,
                'extension_date' => '2026-09-24',
                'start_time' => '16:00:00',
                'end_time' => '18:00:00',
                'extra_hours' => 2,
                'extra_amount' => 480000,
                'status' => 'pending',
                'note' => 'Seed request perpanjangan jadwal.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('notifications')->insert([
            [
                'id' => 1,
                'user_id' => 1,
                'title' => 'Invoice baru',
                'message' => 'Invoice Paket Lengkap A sudah dibuat.',
                'type' => 'payment',
                'url' => '/transactions',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('crm_messages')->insert([
            [
                'id' => 1,
                'client_id' => 1,
                'manager_id' => 2,
                'subject' => 'Follow up project',
                'message' => 'Client menanyakan jadwal dan status invoice.',
                'status' => 'open',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('finance_reports')->insert([
            [
                'id' => 1,
                'type' => 'income',
                'title' => 'Invoice Paket Lengkap A',
                'amount' => 970000,
                'report_date' => '2026-10-04',
                'description' => 'Seed laporan pemasukan.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('inventory_items')->insert([
            [
                'id' => 1,
                'name' => 'Microphone Condenser',
                'category' => 'Recording',
                'quantity' => 2,
                'condition' => 'good',
                'note' => 'Seed inventaris studio.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('expenses')->insert([
            [
                'id' => 1,
                'title' => 'Maintenance Audio Interface',
                'category' => 'Maintenance',
                'amount' => 250000,
                'expense_date' => '2026-10-04',
                'note' => 'Seed pengeluaran studio.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);
    }
}
