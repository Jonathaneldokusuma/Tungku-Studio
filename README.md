# Tungku Studio

Sistem booking studio musik dengan dua frontend dan satu backend API.

## Stack yang Dipakai

- `client-web`: React, Vite, Firebase Web SDK, Axios, React Hook Form, Zod, Zustand, React Router, Tailwind CSS.
- `internal-web`: React, Vite, Firebase Web SDK, Axios, React Hook Form, Zod, Zustand, React Router, Tailwind CSS.
- `backend-api`: Laravel API, Kreait Firebase PHP, Laravel DomPDF, Scribe API Documentation.
- `database/auth/storage/notification`: Firebase Firestore, Firebase Authentication, Firebase Storage, Firebase Cloud Messaging.
- `payment prototype`: manual payment terlebih dahulu, Midtrans Sandbox disiapkan lewat env untuk tahap berikutnya.

## Setup Env

Copy file env sebelum menjalankan project:

```bash
cp backend-api/.env.example backend-api/.env
cp client-web/.env.example client-web/.env
cp internal-web/.env.example internal-web/.env
```

Isi credential Firebase pada `.env` masing-masing. Backend memakai service account di:

```txt
backend-api/storage/app/firebase/service-account.json
```

## Command Development

Backend:

```bash
cd backend-api
composer install
php artisan key:generate
php artisan serve
```

Client web:

```bash
cd client-web
npm install
npm run dev
```

Internal web:

```bash
cd internal-web
npm install
npm run dev
```

## Deployment Gratis

Target free tier:

- Frontend `client-web`: Vercel Hobby, root directory `client-web`.
- Frontend `internal-web`: Vercel Hobby, root directory `internal-web`.
- Realtime database/auth: Firebase Spark memakai Firestore realtime listener.
- File rules: `firebase/storage.rules`.
- Firestore rules: `firebase/firestore.rules`.

Vercel Hobby dan Firebase Spark tidak punya tanggal kedaluwarsa, tetapi tetap punya quota pemakaian. Untuk tetap 100% gratis, pantau usage dan jangan aktifkan billing otomatis kecuali memang mau memakai fitur paid.

Panduan lengkap ada di `docs/free-tier-deployment.md`.

Production domains:

```txt
Client: https://tungku-studio.vercel.app
Internal manager/operator: https://work-studiotungku.vercel.app
```

Deploy Firebase rules:

```bash
firebase login
firebase use <firebase-project-id>
firebase deploy --only firestore:rules,firestore:indexes,storage
```

Deploy Vercel:

```bash
cd client-web
vercel

cd ../internal-web
vercel
```

## Data Realtime

Data client, manager, dan operator tersambung lewat collection Firestore yang sama:

- Client membuat booking atau payment di `bookings`, `projects`, dan `payments`.
- Manager membaca dan mengubah data yang sama untuk validasi, quotation, invoice, dan assign operator.
- Operator membaca `tasks` yang punya `operatorId`, lalu update progress task dan project.

Seed data awal tersedia di `firebase/seed-data.json`.

Jalankan seed setelah Firebase service account tersedia:

```bash
npm install
$env:FIREBASE_CREDENTIALS="backend-api/storage/app/firebase/service-account.json"
npm run seed:firestore
```

Contoh akun demo yang perlu dibuat di Firebase Authentication:

```txt
client@tungkustudio.com
manager@tungkustudio.com
operator@tungkustudio.com
```

Setiap Auth user perlu punya dokumen `users/{uid}` dengan role `client`, `manager`, atau `operator`. Untuk prototype, seed memakai ID demo agar hubungan data antar collection terlihat dulu.
