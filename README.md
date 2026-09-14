<div align="center">

# 🏥 HQMS — Hospital Queue Management System

**Sistem Manajemen Rumah Sakit dengan Antrean Kiosk Self-Service**

[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?style=flat&logo=php&logoColor=white)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-v3-9553E9?style=flat&logo=inertia&logoColor=white)](https://inertiajs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📋 Daftar Isi

- [Deskripsi](#-deskripsi)
- [Fitur Utama](#-fitur-utama)
- [Teknologi](#-teknologi)
- [Arsitektur](#-arsitektur)
- [Peran Pengguna (RBAC)](#-peran-pengguna-rbac)
- [Cara Instalasi & Menjalankan](#-cara-instalasi--menjalankan)
- [Akun Demo](#-akun-demo)
- [Modul & Halaman](#-modul--halaman)
- [Testing](#-testing)
- [Struktur Proyek](#-struktur-proyek)
- [Dokumentasi API](#-dokumentasi-api)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 📖 Deskripsi

**HQMS** adalah sistem manajemen rumah sakit (Hospital Management System) yang dirancang untuk RS Merdeka. Aplikasi ini menggabungkan:

1. **Kiosk pengambilan tiket antrean mandiri (self-service)** — pasien memilih poli lalu mendapatkan nomor antrean (contoh: `B-001`).
2. **Alur pelayanan pasien** dari pendaftaran, antrean, pemeriksaan dokter, peresepan obat, hingga pembayaran.
3. **Manajemen operasional RS** — poli, dokter, perawat, jadwal dokter, kamar/ruangan, fasilitas, presensi karyawan, serta konten publik (berita, penawaran, FAQ, testimoni).
4. **Tampilan TV / ticker antrean** untuk ruang tunggu, lengkap dengan informasi nomor yang sedang dilayani per loket.

Aplikasi dibangun sebagai **Single Page Application (SPA)** dengan pola **Inertia.js** — backend Laravel mengelola data (MySQL/SQLite), sedangkan antarmukanya di-render oleh React di sisi klien.

---

## ✨ Fitur Utama

### 🎫 Manajemen Antrean & Kiosk
- **Pengambilan tiket mandiri** di kiosk dengan pemilihan poli aktif.
- Nomor antrean otomatis per poli per hari, format `KODE-POLI-NNN` (contoh: `B-001`).
- Pengelolaan antrean: panggil (`called`), layani (`serving`), selesaikan (`completed`), lewati (`skipped`), batalkan, dan panggil ulang.
- Penomoran loket untuk setiap antrean yang sedang dilayani.
- Tampilan **"Now Serving"** untuk TV ruang tunggu.
- **Ticker antrean** real-time (antrian yang sudah dipanggil/dilayani hari itu).

### 🧑‍⚕️ Alur Pelayanan Pasien
- **Pasien**: data pasien dengan nomor rekam medis, NIK, dll.
- **Pendaftaran**: mendaftarkan pasien ke poli (bisa langsung dari tiket antrean), menghasilkan nomor registrasi `REG-YYYYMMDD-KODE-NNN`.
- **Pemeriksaan**: catatan pemeriksaan dokter (keluhan, diagnosis, tindakan) yang terhubung ke antrean & pasien.
- **Obat**: resep obat per pemeriksaan.
- **Pembayaran**: transaksi pembayaran atas pemeriksaan.

### 🏥 Data Master Rumah Sakit
- **Fasilitas**: unit layanan utama (UGD, IRJ, perawatan, OK, penunjang, umum) yang bisa menampung banyak ruangan.
- **Ruangan / Kamar**: kamar atau bangsal di bawah fasilitas, bisa dihubungkan ke poli, dan menampung pasien.
- **Poli**: unit poliklinik dengan kode antrean (prefix).
- **Dokter**: dokter aktif/non-aktif, spesialisasi, nomor SIP, jadwal.
- **Jadwal Dokter**: jadwal mingguan (hari + jam praktik) per dokter.
- **Perawat**: data perawat lengkap dengan kartu RFID untuk presensi.

### 🕐 Presensi & Kehadiran
- **Presensi berbasis RFID**: scan kartu/perangkat RFID di kiosk → check-in / check-out otomatis.
- Riwayat presensi per perawat per hari dengan status.

### 📢 Konten Publik (Landing Page)
- Halaman depan publik: daftar dokter, jadwal poli, fasilitas, ruangan.
- **Berita** & **Penawaran** (promosi layanan) dengan paginasi.
- **FAQ** dan **Testimoni** yang dapat diurutkan.
- **Formulir pesan** untuk pengunjung yang ingin menghubungi RS.

### 📊 Dashboard & Monitoring
- **Dashboard** ringkasan statistik (jumlah pasien, poli, dll).
- **Monitoring antrean**: grafik pasien per bulan, pasien per poli, pendaftaran per hari, pendaftaran per poli, dan status antrean.

### 🔐 Keamanan & Hak Akses
- Autentikasi berbasis **session/cookie** (Sanctum — *stateful*).
- **RBAC** dengan Spatie Permission: 6 peran bawaan dengan izin terperinci per modul.
- Sesi kadaluarsa otomatis setelah masa aktif berakhir.

---

## 🛠️ Teknologi

| Lapisan | Teknologi |
| --- | --- |
| **Backend** | Laravel 13 · PHP 8.3 · Eloquent ORM |
| **Frontend** | React 19 · TypeScript · Tailwind CSS 4 |
| **Integrasi** | Inertia.js v3 (SPA tanpa REST API manual) |
| **Auth** | Laravel Sanctum (session-based) |
| **OTORISASI** | spatie/laravel-permission (RBAC) |
| **Build Tool** | Vite 8 · vite-plus (`vite.config.ts`) · @vitejs/plugin-react |
| **Generasi Route TS** | laravel/wayfinder (typed routes dari sisi Laravel) |
| **Chart** | Recharts |
| **Database** | MySQL (pengembangan) / SQLite (testing) |
| **Testing** | Pest (PHP) · PHPUnit |
| **Static Analysis** | Pint (format) · PHPStan (opsional) · `tsc` |
| **CI** | GitHub Actions (`.github/workflows/tests.yml`) |

---

## 🏗️ Arsitektur

Aplikasi mengikuti pola **Controller → Service → Request → Resource** per modul:

```
Http\Controllers\Api\PoliController
        │  (thin, hanya memanggil service)
        ▼
Services\PoliService
        │  (mengelola logika bisnis & transaksi DB)
        ▼
Http\Requests\StorePoliRequest
        │  (validasi)
        ▼
Http\Resources\PoliResource
        (transformasi output JSON)
```

### Envelope Respons API
Seluruh endpoint JSON memakai format konsisten:

```json
{
  "success": true,
  "message": "Pesan singkat.",
  "data": {
    "items": [],
    "pagination": { "current_page": 1, "per_page": 10, "total": 0, "last_page": 1 }
  }
}
```

### Struktur API (`/api/v1`)
- **Publik (tanpa login)** — `auth/register`, `auth/login`, dan grup `kiosk/*`.
- **Terproteksi (`auth:sanctum`)** — `auth/me`, `auth/logout`, dan CRUD seluruh resource (`polis`, `pasiens`, `pendaftarans`, `antrians`, `dokters`, `perawats`, `presensis`, `jadwal-dokters`, `pemeriksaans`, `obats`, `pembayarans`, `fasilitas`, `ruangans`, `beritas`, `penawarans`, `faqs`, `testimonials`, `messages`), serta endpoint `monitoring`.

---

## 👥 Peran Pengguna (RBAC)

Terdapat **6 peran** (Spatie Permission) yang masing-masing memiliki izin berbeda:

| Peran | Cakupan akses utama |
| --- | --- |
| **Super Admin** | Semua izin (CRUD seluruh modul + user) |
| **Admin** | CRUD poli, ruangan, dokter, perawat, presensi, jadwal, pasien, obat, pembayaran, antrean, & konten; izin user view/create/update |
| **Dokter** | Lihat poli, dokter, jadwal, pasien; resep obat (`medicine.create`); kelola antrean (panggil/layani/selesaikan) |
| **Staf Loket** | Kelola pasien & antrean penuh (create, call, recall, skip, complete, cancel), monitoring, dashboard |
| **Staf Obat** | Lihat pasien & antrean; kelola obat (`create`/`update`); lihat pembayaran; dashboard |
| **Perawat** | Lihat poli, dokter, jadwal, pasien, ruangan; kelola data perawat & presensi; kelola antrean |

---

## 🚀 Cara Instalasi & Menjalankan

### Prasyarat
- **PHP** versi 8.3 atau lebih baru
- **Composer**
- **Node.js** (versi 20+)
- **npm** (atau pnpm — proyek ini mendukung keduanya)
- Server database (MySQL/MariaDB untuk pengembangan, atau SQLite untuk tes cepat)

### 1. Clone & install dependency

```bash
git clone <url-repository-anda> hqms
cd hqms

composer install
npm install
```

### 2. Siapkan aplikasi

```bash
php artisan key:generate
```

Atur koneksi database pada konfigurasi aplikasi (buat database sesuai yang digunakan, misalnya `hqms_db`). Pastikan struktur tabel menunggu migrasi di langkah berikutnya.

### 3. Migrasi database & seed data contoh

```bash
php artisan migrate --seed
```

Perintah ini membuat seluruh tabel sekaligus mengisi **data contoh** (poli, fasilitas, ruangan, pasien, dokter, perawat, jadwal, obat, berita, penawaran, FAQ, testimoni, pesan, hingga akun demo).

> Untuk hanya membuat struktur tabel tanpa data contoh: `php artisan migrate`.

### 4. Bangun aset frontend

```bash
npm run build
```

Untuk pengembangan frontend secara real-time (hot reload), gunakan:

```bash
npm run dev
```

### 5. Jalankan aplikasi

```bash
composer run dev
```

Perintah ini menjalankan server Laravel **dan** Vite secara bersamaan. Buka **http://localhost:8000** di browser.

> Jika aset tidak termuat (error *manifest*), jalankan `npm run build` terlebih dahulu.

---

## 👤 Akun Demo

Semua akun berikut menggunakan password: **`password`**

| Email | Peran |
| --- | --- |
| `admin@hqms` | Super Admin |
| `staf_loket@hqms` | Staf Loket |
| `staf_obat@hqms` | Staf Obat |
| `dr.budi@hqms` | Dokter |
| `drg.siti@hqms` | Dokter |
| `dr.andi@hqms` | Dokter |
| `dr.dewi@hqms` | Dokter |
| `dr.rahmat@hqms` | Dokter |

---

## 🧩 Modul & Halaman

### Public (tanpa login)
| Halaman | URL |
| --- | --- |
| Beranda (landing) | `/` |
| Cari Dokter | `/cari-dokter` |
| Detail Dokter | `/dokter/{slug}` |
| Detail Berita | `/berita/{slug}` |
| Login | `/login` |
| Register | `/register` |
| Kiosk pengambilan tiket | `/ticket` |
| Ticker antrean (TV) | `/antrians-ticker` |
| Absen Karyawan (scan RFID) | `/absen-karyawan` |
| Detail Fasilitas | `/fasilitas/{slug}` |

### Terproteksi (perlu login)
- **Dashboard** — `/dashboard`
- **Monitoring Antrean** — `/monitorings`
- **Profil** — `/profile`
- CRUD per modul (Index/Create/Edit/Show): `polis`, `pasiens`, `pendaftarans`, `antrians`, `dokters`, `jadwal-dokters`, `perawats`, `presensis`, `pemeriksaans`, `obats`, `pembayarans`, `fasilitas`, `ruangans`, `beritas`, `penawarans`, `faqs`, `testimonials`, `messages`.

Beberapa halaman *Create* mendukung *query parameter* untuk alur kerja cepat:
- `…/pendaftarans/create?antrian_id=N`
- `…/pemeriksaans/create?antrian_id=N&pasien_id=N&poli_id=N`
- `…/obats/create?pemeriksaan_id=N`
- `…/pembayarans/create?pemeriksaan_id=N`
- `…/messages/{id}/edit?reply=1`

---

## 🧪 Testing

Proyek menggunakan **Pest** untuk pengujian. Tes berjalan di atas SQLite in-memory sehingga cepat dan tidak membutuhkan MySQL.

```bash
# Jalankan seluruh suite
php artisan test --compact

# Jalankan satu file/filter tertentu
php artisan test --filter=NamaTest
vendor/bin/pest tests/Feature/AntrianApiTest.php
```

Perintah verifikasi lain yang tersedia:

```bash
vendor/bin/pint                     # Format kode PHP
php artisan test --compact          # Tes PHP (Pest)
npm run types:check                 # Cek tipe TypeScript (tsc)
npm run check                       # Lint + format frontend (vite-plus)
```

Pipeline CI (GitHub Actions) otomatis menjalankan: install dependency → salin konfigurasi → generate key → migrasi (`--force`) → build frontend → verifikasi kode & seluruh tes.

---

## 📁 Struktur Proyek

```
hqms/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/        # Controller API per modul (tipis)
│   │   ├── Requests/               # Form Request / validasi
│   │   └── Resources/              # Eloquent API Resources (output JSON)
│   ├── Models/                     # Model Eloquent (Poli, Pasien, Antrian, ...)
│   ├── Services/                   # Logika bisnis & transaksi database
│   └── Policies/                   # (bila ada) otorisasi Gate
├── bootstrap/
├── config/                         # Konfigurasi aplikasi
├── database/
│   ├── factories/                  # Factory untuk testing/seeding
│   ├── migrations/                 # Skema database (portabel MySQL & SQLite)
│   └── seeders/                    # Data contoh per modul
├── resources/
│   ├── css/                        # Gaya global (Tailwind)
│   └── js/
│       ├── pages/                  # Halaman React per modul (Index/Create/Edit/Show)
│       ├── components/             # Komponen UI (shadcn-style)
│       ├── api/                    # Pembungkus axios per modul
│       └── lib/                    # Utilitas (axios instance, format, dsb.)
├── routes/
│   ├── web.php                     # Halaman Inertia (SPA)
│   └── api.php                     # API v1
├── tests/                          # Pest feature/unit tests
├── vite.config.ts                  # Konfigurasi Vite (vite-plus)
└── composer.json                   # Dependency PHP & script
```

---

## 📡 Dokumentasi API

Dokumentasi lengkap endpoint terbagi dua:

**1. Kiosk & Public (`/api/v1/kiosk`)**
- `GET  /kiosk/polis` — daftar poli aktif
- `GET  /kiosk/dokters` — daftar dokter aktif
- `GET  /kiosk/beritas` — berita terkini (paginasi)
- `GET  /kiosk/penawarans` — penawaran terkini (paginasi)
- `GET  /kiosk/faqs` — FAQ aktif
- `GET  /kiosk/testimonials` — testimoni aktif
- `POST /kiosk/messages` — kirim pesan kontak
- `GET  /kiosk/jadwal-dokters` — jadwal dokter aktif
- `GET  /kiosk/ruangans` — daftar ruangan aktif
- `GET  /kiosk/fasilitas` — daftar fasilitas aktif
- `POST /kiosk/tickets` — **buat tiket antrean** (pilih poli → nomor antrean)
- `GET  /kiosk/now-serving` — antrean yang sedang dipanggil/dilayani
- `POST /kiosk/attendance/scan` — scan RFID untuk presensi (check-in/out)

**2. Autentikasi (`/api/v1/auth`)**
- `POST /auth/register` · `POST /auth/login` · `POST /auth/logout`
- `GET  /auth/me` · `PUT /auth/me` · `POST /auth/me/password`

**3. Resource Terproteksi (`auth:sanctum`)**
`apiResource` standar (index/show/store/update/destroy) untuk: `polis`, `fasilitas`, `ruangans`, `pasiens`, `pendaftarans`, `antrians`, `beritas`, `penawarans`, `dokters`, `perawats`, `presensis`, `jadwal-dokters`, `pemeriksaans`, `obats`, `pembayarans`, `faqs`, `testimonials`, `messages` — plus:
- `GET /ruangans/{ruangan}/antrians`
- `POST /ruangans/{ruangan}/pasiens` · `DELETE /ruangans/{ruangan}/pasiens/{ruanganPasien}`
- `GET /monitoring`

> Versi API saat ini: **v1** (`/api/v1/...`).

---

## 🤝 Kontribusi

1. Kerjakan dari cabang (`git checkout -b fitur/fitur-baru`).
2. Pastikan mengikuti konvensi pola `Controller → Service → Request → Resource`.
3. Format kode PHP dengan Pint sebelum commit: `vendor/bin/pint`.
4. Tambahkan tes Pest untuk setiap perubahan logika.
5. Jalankan tes sebelum membuat Pull Request: `php artisan test --compact`.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**. Lihat file `composer.json` untuk detail.

---

<div align="center">

Dibuat dengan ❤️ untuk **RS Merdeka**

</div>