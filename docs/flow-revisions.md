# Revisi Flow Sistem Tungku Studio

Dokumen ini mencocokkan flowchart manager, operator, dan client dengan migration Laravel dari teman:

- `rooms`
- `base_prices`
- `packages`
- `quotations`
- `quotation_offers`
- `projects`
- `project_tracks`
- `project_stages`
- `track_stage_progress`
- `recording_sessions`
- `payments`
- `expense_categories`
- `expenses`
- `payrolls`
- `payroll_items`
- `crm_campaigns`
- `crm_campaign_recipients`
- `inventory_categories`
- `inventories`

## Manager - Buat Paket

Status: perlu revisi kecil.

Masalah di flowchart:
- Node akhir tertulis `Mulai`, harusnya `Selesai`.
- Cabang `Override?` kalau `No` tidak perlu `Input Harga Manual`; harus langsung simpan harga otomatis.
- Nama proses lebih cocok mengikuti tabel `base_prices` dan `packages`.

Flow revisi:

```txt
Mulai
Input / Update Base Price per Tahap
Pilih Tahap: Recording, Editing, Mixing, Mastering
Input Track Count dan Recording Hours
Hitung Auto Price
Override Harga?
  Ya -> Input Manual Price -> Set is_price_manual = true
  Tidak -> Pakai Auto Price -> Set is_price_manual = false
Simpan Package
Selesai
```

Tabel terkait:
- `base_prices`
- `packages`

## Manager - Assign Tugas

Status: sudah hampir benar, perlu tambah stage/track detail.

Masalah di flowchart:
- `Project Dibuat` sebaiknya setelah pembayaran PO berhasil.
- `Lengkap?` harus mengecek operator setiap `project_stages`, bukan cuma satu operator.
- Setelah submit perlu membuat data progress per track dan stage.

Flow revisi:

```txt
Mulai
Project Status = awaiting_assignment
Buat Project Stages
Buat Project Tracks
Assign Operator per Stage
Set Deadline per Stage
Lengkap?
  Tidak -> Lengkapi Operator / Deadline
  Ya -> Submit Assignment
Generate Track Stage Progress
Notifikasi Operator
Project Status = in_progress
Selesai
```

Tabel terkait:
- `projects`
- `project_tracks`
- `project_stages`
- `track_stage_progress`

## Manager - Keuangan Bulanan

Status: benar secara konsep, perlu pakai tabel `payments`, `expenses`, `payrolls`.

Masalah di flowchart:
- `Hitung Profit` harus ambil revenue dari payment paid dan expense dari expenses.
- `Override %` harus tersimpan per operator di `payroll_items`.
- Cabang `<= 100%?` kalau tidak, balik ke override persen.

Flow revisi:

```txt
Mulai
Catat Pengeluaran
Ambil Payment Paid Bulan Ini
Hitung Revenue
Hitung Expense
Hitung Net Profit
Rekomendasi Persentase Operator
Override Persentase
Total Persentase <= 100%?
  Tidak -> Revisi Persentase
  Ya -> Simpan Payroll dan Payroll Items
Finalize Payroll
Selesai
```

Tabel terkait:
- `payments`
- `expense_categories`
- `expenses`
- `payrolls`
- `payroll_items`

## Manager - CRM

Status: perlu revisi supaya sesuai table campaign.

Masalah di flowchart:
- `Daftar Sistem` kurang jelas. Di schema yang ada CRM memakai campaign dan recipient.
- Harus ada proses pilih channel.

Flow revisi:

```txt
Mulai
Buat CRM Campaign
Rekomendasi Klien?
  Ya -> Sistem pilih recipient dari client aktif / histori paket
  Tidak -> Manager pilih client manual
Pilih Paket Promo
Pilih Channel: WhatsApp / Email
Kirim Pesan
Update Recipient Status
Selesai
```

Tabel terkait:
- `crm_campaigns`
- `crm_campaign_recipients`
- `users`
- `packages`

## Operator - Eksekusi Tugas

Status: benar secara konsep, perlu loop revisi.

Masalah di flowchart:
- Jika `Disetujui? Tidak`, flow harus kembali ke `Kerjakan Tugas`, bukan berhenti.
- Upload file masuk ke `track_stage_progress.result_url`.
- Approval dilakukan per track-stage.

Flow revisi:

```txt
Mulai
Operator Terima Notifikasi Tugas
Lihat Deadline
Kerjakan Task per Track
Submit File / Result URL
Status = in_review
Disetujui Manager?
  Tidak -> Status = revision -> Kerjakan Revisi
  Ya -> Status = approved
Jika semua track di stage approved
Notifikasi Stage Berikutnya
Selesai
```

Tabel terkait:
- `project_stages`
- `track_stage_progress`
- `project_tracks`
- `users`

## Client - Pilih Paket Siap PO

Status: benar, perlu detail hold slot dan status project.

Masalah di flowchart:
- `Buat Project` harus terjadi setelah pembayaran PO berhasil.
- Sebelum bayar, slot recording status `held`.
- Setelah bayar, project status `awaiting_assignment`.

Flow revisi:

```txt
Mulai
Pilih Paket
Pilih Slot Waktu
Isi Nama Project
Hold Recording Session
Buat Project status = pending_payment
Buat Payment type = po
Bayar PO
Payment Paid?
  Tidak -> Slot tetap held sampai expired
  Ya -> Confirm Recording Session
        Project status = awaiting_assignment
        Notifikasi Manager
Selesai
```

Tabel terkait:
- `packages`
- `recording_sessions`
- `projects`
- `payments`

## Client - Custom Paket Penawaran

Status: perlu revisi cabang.

Masalah di flowchart:
- Cabang `Diterima?` di gambar membingungkan. Jika diterima harus checkout, jika tidak bisa revisi atau batal.
- `Tinjau Harga` dilakukan manager/studio, bukan client.

Flow revisi:

```txt
Mulai
Client Racik Paket
Submit Tawaran
Studio Tinjau Harga
Studio Kirim Offer
Client Terima Offer?
  Ya -> Lanjut Checkout / Bayar PO
        Buat Project
        Selesai
  Tidak -> Revisi Tawaran?
        Ya -> Client Submit Tawaran Baru
        Tidak -> Batal
Selesai
```

Tabel terkait:
- `quotations`
- `quotation_offers`
- `projects`
- `payments`

## Client - Extend Waktu Recording

Status: benar, perlu cek ketersediaan slot.

Masalah di flowchart:
- Harus ada keputusan slot tersedia atau tidak.
- Bayar extend dilakukan sebelum session tambahan confirmed.

Flow revisi:

```txt
Mulai
Client Butuh Extend
Cari Slot Waktu
Slot Tersedia?
  Tidak -> Pilih Slot Lain / Batal
  Ya -> Hitung Tambah Biaya
        Buat Payment Extend
        Bayar Extend
        Payment Paid?
          Tidak -> Tidak Tambah Waktu
          Ya -> Tambah Recording Session Extension
Selesai
```

Tabel terkait:
- `recording_sessions`
- `payments`

## Client - Pelunasan

Status: perlu revisi detail lock/unlock.

Masalah di flowchart:
- `Pelunasan PO` seharusnya `Pelunasan Final`, karena PO adalah pembayaran awal.
- File finish terkunci sampai payment final lunas.
- Jika belum lunas, user diarahkan ke payment final.

Flow revisi:

```txt
Mulai
Project Completed
File Final Locked
Buat Payment type = final
Client Bayar Pelunasan Final
Lunas?
  Tidak -> File tetap locked
           Tampilkan Tagihan Final
  Ya -> Unlock File
        Download File
Selesai
```

Tabel terkait:
- `projects`
- `payments`
- `track_stage_progress`

