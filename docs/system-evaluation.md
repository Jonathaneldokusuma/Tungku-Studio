# Evaluasi Sistem Ruang Tungku

Tanggal evaluasi: 6 Oktober 2026

## Perubahan yang Sudah Dilakukan

- Harga manual pada paket dan penawaran diganti menjadi sistem diskon.
- Penawaran client sekarang memakai pilihan paket diskon dan menyimpan `bundleName`, `basePrice`, `discountPercent`, `discountAmount`, dan `offeredPrice`.
- Manager dapat membuat paket bundle dari template bundle di Manajemen Paket.
- Kartu dashboard `Pengeluaran Bulan Ini` diarahkan langsung ke halaman navbar `Pengeluaran`.
- Halaman `Pengaturan` diberi status eksplisit `Belum Diimplementasikan`.

## Kekurangan yang Masih Perlu Diperbaiki

- Data pengeluaran masih berupa placeholder lokal, belum sepenuhnya realtime dari Firestore atau database backend.
- Halaman Pengaturan belum memiliki form konfigurasi profil studio, role, notifikasi, dan aturan booking.
- Alur notifikasi membutuhkan deploy Firestore rules terbaru agar client bisa membuat notifikasi untuk manager.
- Beberapa halaman internal seperti laporan, invoice, dan inventaris masih memakai data contoh.
- Evaluasi pembayaran masih manual confirmation, belum terhubung ke payment gateway asli.

## Rekomendasi Lanjutan

- Buat collection/table khusus `expenses` dan hubungkan halaman Pengeluaran ke data realtime.
- Implementasikan halaman Pengaturan secara bertahap: profil studio, role akses, notifikasi, dan booking rules.
- Deploy ulang Firestore rules dari akun Firebase yang sudah login.
- Tambahkan pengujian alur end-to-end: client beli paket, manager menerima notifikasi, manager assign operator, operator submit file, client download invoice.
- Rapikan source of truth data agar demo fallback tidak tercampur dengan data production.
