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
