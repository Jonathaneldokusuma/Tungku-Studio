# Setup Integrasi Tungku Studio

Dokumen ini untuk setup service yang perlu credential asli. Secret jangan dimasukkan ke git.

## 1. Firebase

Pakai Firebase Spark supaya gratis selama tidak melewati quota.

Service yang perlu aktif:

- Authentication
- Firestore Database

Authentication provider:

- Email/Password: aktif
- Email link/password reset template: pakai template bawaan Firebase

Authorized domains di Firebase Authentication:

```txt
localhost
tungku-studio.vercel.app
work-studiotungku.vercel.app
```

Env frontend Vercel untuk `client-web` dan `internal-web`:

```txt
VITE_API_BASE_URL=<backend-api-url>/api
VITE_FIREBASE_API_KEY=<firebase-web-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
VITE_FIREBASE_APP_ID=<app-id>
VITE_FIREBASE_VAPID_KEY=<optional-fcm-vapid-key>
```

Deploy rules:

```bash
npx firebase-tools login
npx firebase-tools use <firebase-project-id>
npm run firebase:deploy
```

Seed data:

```bash
npm install
$env:FIREBASE_CREDENTIALS="backend-api/storage/app/firebase/service-account.json"
npm run seed:firestore
```

## 2. Verifikasi Gmail dan Forgot Password

Verifikasi email dan reset password client memakai Firebase Authentication email action.

Yang perlu disiapkan di Firebase Console:

- Authentication > Templates > Verification email
- Authentication > Templates > Password reset
- Authentication > Settings > Authorized domains

Untuk email pengirim custom seperti `admin@tungkustudio.com`, Firebase gratis tidak menyediakan custom SMTP penuh. Opsi gratis yang paling aman adalah pakai email bawaan Firebase. Kalau nanti mau brand email sendiri, gunakan provider seperti Resend/SMTP dan endpoint Laravel terpisah.

## 3. Backend API

Env backend:

```txt
APP_URL=<backend-api-url>
FRONTEND_CLIENT_URL=https://tungku-studio.vercel.app
FRONTEND_INTERNAL_URL=https://work-studiotungku.vercel.app

FIREBASE_PROJECT_ID=<project-id>
FIREBASE_CREDENTIALS=storage/app/firebase/service-account.json
FIREBASE_DATABASE_URL=
FIREBASE_MESSAGING_SENDER_ID=<sender-id>
FIREBASE_VAPID_KEY=
```

Endpoint cek setup:

```txt
GET /api/health
GET /api/config/status
```

## 4. Payment

Payment disiapkan memakai Midtrans karena cocok untuk Indonesia. Mulai dari sandbox dulu.

Env backend:

```txt
MIDTRANS_SERVER_KEY=<server-key>
MIDTRANS_CLIENT_KEY=<client-key>
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_SNAP_URL=
```

Endpoint backend:

```txt
POST /api/client/payments/snap-token
POST /api/client/payments/notification
```

Contoh payload snap token:

```json
{
  "gross_amount": 970000,
  "customer_name": "Nama Client",
  "customer_email": "client@example.com",
  "customer_phone": "+6281234567890",
  "item_id": "paket-lengkap-a",
  "item_name": "Paket Lengkap A"
}
```

Webhook Midtrans diarahkan ke:

```txt
<backend-api-url>/api/client/payments/notification
```

Catatan: agar payment benar-benar live, backend harus dipublish di hosting API yang mendukung Laravel/PHP. Vercel yang sekarang hanya frontend.

## 5. File Project dan Google Drive

Firebase Storage tidak dipakai karena project Spark baru tidak bisa setup Cloud Storage tanpa Blaze.

Flow file:

- File audio/gambar/dokumen di-upload manual ke Google Drive milik studio.
- Web hanya menyimpan URL Google Drive di Firestore.
- Manager/operator/client membuka file dari link tersebut.

Field yang disarankan di Firestore:

```txt
projects/{projectId}.driveFolderUrl
tasks/{taskId}.sourceFileUrl
tasks/{taskId}.resultFileUrl
payments/{paymentId}.proofUrl
```
