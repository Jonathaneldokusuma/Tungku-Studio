# Tungku Studio

Sistem booking studio musik dengan tiga bagian utama: client portal, internal manager/operator, dan backend API.

## Komponen Aplikasi

- `client-web`: aplikasi React + Vite untuk client. Dipakai untuk login/register client, forgot password, melihat booking, quotation, invoice, payment, dan progress project.
- `internal-web`: aplikasi React + Vite untuk manager dan operator. Dipakai untuk dashboard internal, booking, quotation, project, inventaris, CRM, invoice, laporan, pengeluaran, operator, dan pengaturan.
- `backend-api`: Laravel API. Dipakai untuk endpoint server-side seperti payment, webhook, dokumen invoice/quotation, dan integrasi service yang butuh secret.
- `firebase`: konfigurasi Firebase. Dipakai untuk Authentication, Firestore realtime database, Storage rules, indexes, dan seed data awal.
- `assets`: asset visual dari desain, termasuk logo, icon Figma, mockup, dan screenshot referensi.
- `docs`: dokumentasi setup deployment dan integrasi.

## Teknologi yang Dipakai

- Frontend: React, Vite, Firebase Web SDK, Axios, React Router, React Hook Form, Zod, Zustand, Tailwind CSS, Lucide React.
- Backend: Laravel, Kreait Firebase PHP, Laravel DomPDF, Scribe API Documentation.
- Realtime: Firebase Firestore listener.
- Auth: Firebase Authentication.
- Storage: Firebase Storage.
- Email verifikasi/reset password: Firebase Authentication email action.
- Payment: Midtrans Snap/Core API lewat Laravel backend.
- Hosting frontend: Vercel.

## Domain Production

- Client: `https://tungku-studio.vercel.app`
- Manager/operator: `https://work-studiotungku.vercel.app`

## Setup Lanjutan

Panduan setup Firebase, Gmail verification, Vercel env, seed data, dan payment ada di:

- [docs/integration-setup.md](docs/integration-setup.md)
- [docs/free-tier-deployment.md](docs/free-tier-deployment.md)
