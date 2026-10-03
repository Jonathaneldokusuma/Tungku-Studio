# Free Tier Deployment

Target setup ini adalah tetap gratis selama mungkin dengan resource kecil dan jelas pembagiannya.

## Pembagian Layanan

| Bagian | Layanan | Alasan |
| --- | --- | --- |
| Client web | Vercel Hobby | React static build ringan dan gratis untuk frontend. |
| Internal web | Vercel Hobby | React static build ringan dan bisa project Vercel terpisah. |
| Login user | Firebase Authentication Spark | Email/password tanpa backend session sendiri. |
| Realtime data | Firebase Firestore Spark | Update booking, project, payment, task, dan CRM secara realtime. |
| Upload file | Google Drive link | File disimpan di Google Drive studio, web hanya simpan link. |
| Notifikasi | Firebase Cloud Messaging | Bisa dipakai untuk update task dan status project. |
| Backend API | Laravel API | Dipakai untuk business logic, invoice PDF, role validation, dan proses yang butuh server. |

## Prinsip Supaya Tetap Gratis

- Vercel hanya menyimpan hasil build frontend di folder `dist`.
- Jangan upload bukti bayar, invoice, audio, atau file project ke Vercel.
- Semua file user masuk ke Google Drive studio, lalu link-nya disimpan di Firestore.
- Semua data realtime masuk ke Firestore.
- Laravel API tidak dipakai untuk realtime listener, hanya untuk proses bisnis yang butuh validasi server.
- Hindari polling. Pakai Firestore `onSnapshot`.
- Batasi akses link Google Drive sesuai kebutuhan client/operator.
- Jangan aktifkan billing Firebase kalau targetnya 100% gratis.

## Vercel Setup

Buat dua project Vercel dari repo yang sama.

Client web:

```txt
Framework Preset: Vite
Root Directory: client-web
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Internal web:

```txt
Framework Preset: Vite
Root Directory: internal-web
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Environment variables untuk dua project:

```txt
VITE_API_BASE_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_VAPID_KEY=
```

Jika backend Laravel belum deploy, `VITE_API_BASE_URL` boleh dikosongkan dulu atau isi endpoint lokal saat development.

## Firebase Setup

Aktifkan layanan berikut di Firebase Console:

- Authentication dengan provider Email/Password.
- Firestore Database.
- Cloud Messaging.

Deploy rules:

```bash
firebase login
firebase use <firebase-project-id>
firebase deploy --only firestore:rules,firestore:indexes
```

## Struktur Data Realtime

Collection utama:

```txt
users
packages
bookings
custom_offers
projects
payments
tasks
recording_extensions
notifications
crm_messages
finance_reports
```

Field minimum `users`:

```txt
uid
name
email
phone
role
status
createdAt
updatedAt
```

Role yang dipakai:

```txt
client
manager
operator
```

## Catatan Limit

Vercel Hobby dan Firebase Spark bisa dipakai tanpa tanggal expired, tetapi tetap punya quota resource. Jika traffic, read/write Firestore, bandwidth, atau build usage melewati limit, layanan bisa dibatasi sampai quota reset atau sampai upgrade plan.

Karena itu aplikasi harus dibuat ringan, realtime berbasis listener, dan file besar disimpan sebagai link Google Drive.
