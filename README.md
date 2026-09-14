<div align="center">

# 🏥 HQMS — Hospital Queue Management System

**Sistem Manajemen Rumah Sakit dengan Antrean Kiosk Self-Service (RS Merdeka)**

[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?style=flat&logo=php&logoColor=white)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?style=flat&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-v3-9553E9?style=flat&logo=inertia&logoColor=white)](https://inertiajs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

HQMS adalah sistem manajemen rumah sakit lengkap untuk **RS Merdeka** dengan antrean **kiosk self-service** (pasien mengambil tiket sendiri), alur pelayanan dari pendaftaran sampai pembayaran, hingga tampilan **ticker/TV antrean** di ruang tunggu. Dibangun sebagai **Single Page Application (SPA)** dengan pola **Inertia.js v3** — Laravel di sisi server, React + TypeScript di sisi klien.

---

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Alur Penggunaan](#-alur-penggunaan)
- [Teknologi](#-teknologi)
- [Prasyarat](#-prasyarat)
- [Cara Instalasi](#-cara-instalasi)
- [Akun Demo](#-akun-demo)
- [Halaman & Modul](#-halaman--modul)
- [Menjalankan Server](#-menjalankan-server)
- [Testing](#-testing)
- [Struktur Proyek](#-struktur-proyek)
- [Rangkuman API](#-rangkuman-api)
- [Troubleshooting](#-troubleshooting)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## ✨ Fitur Utama

### 🎫 Antrean Kiosk & TV Ticker
- Pengambilan **tiket antrean mandiri** di kiosk; pasien memilih poli aktif → dapat nomor.
- Nomor antrean otomatis **per poli per hari**, format `{KODE-POLI}-NNN` (contoh: `B-001`). Kode berasal dari `queue_prefix` (satu huruf A–Z) milik masing-masing poli.
- Pengelolaan antrean oleh staf: `called` (panggil) → `serving` (layani) → `completed` (selesai), plus `skipped` (lewati) dan panggil ulang, lengkap dengan penomoran **loket**.
- Halaman **"Now Serving"** + **ticker antrean** real-time untuk TV ruang tunggu.

### 🧑‍⚕️ Alur Pelayanan Pasien
- **Pasien** — data pasien dengan nomor rekam medis (RM) & NIK.
- **Pendaftaran** — mendaftarkan pasien ke poli. Bisa langsung dari tiket antrean (`?antrian_id=N`), menghasilkan nomor registrasi `REG-YYYYMMDD-{KODE}NNN`, dan tiket otomatis ditandai `called`.
- **Pemeriksaan** — catatan dokter (keluhan, diagnosis, tindakan) terkait antrean & pasien.
- **Obat** — resep obat per pemeriksaan.
- **Pembayaran** — transaksi pembayaran atas pemeriksaan.

### 🏥 Data Master Rumah Sakit
- **Fasilitas** (UGD, IRJ, perawatan, OK, penunjang, umum) → **Ruangan/Kamar** (hierarki fasilitas→ruangan).
- **Poli**, **Dokter** (aktif/non-aktif, SIP), **Jadwal Dokter** mingguan, **Perawat** dengan kartu **RFID**.
- **Presensi RFID** — scan kartu di kiosk → check-in/check-out otomatis + riwayat harian.

### 📢 Konten & Frontend Publik
- Landing page, **Cari Dokter**, detail dokter/fasilitas, **Berita** & **Penawaran**, **FAQ**, **Testimoni**, dan formulir **Pesan/Message**.

### 📊 Dashboard & Monitoring
- Dashboard ringkasan statistik; halaman monitoring dengan grafik (Recharts): pasien per bulan/poli, pendaftaran per hari/poli, dan status antrean.

### 🔐 Keamanan
- Autentikasi **session/cookie** (Laravel Sanctum *stateful*), bukan bearer token.
- **RBAC** dengan `spatie/laravel-permission`: 5 peran dengan izin per modul.
- Sesi kedaluwarsa otomatis (default 24 jam, diatur `SESSION_LIFETIME`).

---

## 🚦 Alur Penggunaan

1. **Pasien di kiosk** membuka halaman `/ticket`, memilih poli, dan mendapat tiket bernomor (mis. `B-001`).
2. Nomor muncul di **ticker / now-serving** (`/antrians-ticker`) untuk TV ruang tunggu.
3. **Staf Loket** mendaftarkan pasien: menu **Pendaftaran → Create** dengan `?antrian_id=N` → status antrean berubah `called`, terbentuk nomor registrasi `REG-...`.
4. **Dokter** mengelola antrean (panggil/layani/selesaikan) dan membuat **Pemeriksaan** pada pasien.
5. **Staf Obat** membuat resep **Obat** per pemeriksaan, lalu **Staf Loket/Admin** menyelesaikannya di **Pembayaran**.
6. **Perawat** men–scan kartu RFID di `/absen-karyawan` untuk presensi harian.
7. **Admin** memantau semuanya lewat **Dashboard** & **Monitoring** serta mengelola data master dan konten publik.

---

## 🛠️ Teknologi

| Lapisan | Teknologi |
| --- | --- |
| **Backend** | Laravel 13 · PHP 8.3 · Eloquent ORM |
| **Frontend** | React 19 · TypeScript · Tailwind CSS 4 |
| **Integrasi** | Inertia.js v3 (SPA) |
| **Auth** | Laravel Sanctum (session-based) |
| **Otorisasi** | spatie/laravel-permission (RBAC) |
| **Build Tool** | Vite 8 via `vite-plus` (`vite.config.ts`) |
| **Route TS** | laravel/wayfinder (typed routes) |
| **Chart** | Recharts |
| **Editor Konten** | Summernote |
| **Database** | MySQL (dev) / SQLite in-memory (test) |
| **Testing** | Pest |
| **Kualitas Kode** | Pint (format) · tsc · vite-plus check |
| **CI** | GitHub Actions (`.github/workflows/tests.yml`) |

---

## 📋 Prasyarat

- **PHP 8.3+** dengan ekstensi umum (`pdo_mysql`, `mbstring`, `openssl`, dll.)
- **Composer**
- **Node.js 20+** dan **npm**
- **MySQL/MariaDB** (untuk dev) — atau SQLite untuk pemasangan ringan

---

## 🚀 Cara Instalasi

### 1. Clone project

```bash
git clone <url-repository-anda> hqms
cd hqms
```

### 2. Install dependency

```bash
composer install
npm install
```

### 3. Konfigurasi environment

```bash
cp .env.example .env      # Windows: copy .env.example .env
php artisan key:generate
```

Sesuaikan `.env` dengan database Anda (contoh MySQL):

```env
APP_NAME=HQMS
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hqms_db
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
```

Buat database-nya mis. `hqms_db`, lalu atur `SANCTUM_STATEFUL_DOMAINS` agar memuat host yang Anda pakai:

```env
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8000,127.0.0.1,127.0.0.1:8000
```

> **Penting (session auth):** aplikasi ini memakai cookie (bukan bearer token). Jika Anda membuka aplikasi di host/port lain (mis. `hqms.test` dari Laragon/XAMPP), port tersebut **wajib** ditambahkan ke `SANCTUM_STATEFUL_DOMAINS`, jika tidak login berhasil tetapi permintaan API pertama tetap berbalas `401`.

> **Ingin hemat tanpa MySQL?** Biarkan `DB_CONNECTION=sqlite` dari `.env.example`, buat file `database/database.sqlite`, dan lanjut ke langkah 4.

### 4. Migrasi database & seed data contoh

```bash
php artisan migrate --seed
```

Perintah ini membuat seluruh tabel **dan** mengisi data contoh (poli, fasilitas, ruangan, pasien, dokter, perawat, jadwal, obat, berita, penawaran, FAQ, testimoni, pesan, hingga akun demo).

> Hanya struktur tabel tanpa data contoh: `php artisan migrate`.

### 5. Symlink untuk gambar (upload)

```bash
php artisan storage:link
```

Diperlukan agar foto/gambar (fasilitas, dokter, berita, dll.) bisa tampil di browser.

### 6. Bangun & jalankan

```bash
composer run dev
```

Perintah ini menjalankan server Laravel **dan** Vite (hot reload) bersamaan. Buka **http://localhost:8000**.

> Alternatif manual: jalankan `php artisan serve` + `npm run dev` terpisah, atau `npm run build` (produksi) + `php artisan serve`.

---

## 👤 Akun Demo

Semua akun memakai password **`password`** (lihat `database/seeders/AdminSeeder.php`):

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

## 🧭 Halaman & Modul

### Publik (tanpa login)

| Halaman | URL |
| --- | --- |
| Beranda / landing | `/` |
| Cari Dokter | `/cari-dokter` |
| Detail Dokter | `/dokter/{slug}` |
| Detail Berita | `/berita/{slug}` |
| Detail Fasilitas | `/fasilitas/{slug}` |
| Login | `/login` |
| Register | `/register` |
| **Kiosk ambil tiket** | `/ticket` |
| **Ticker antrean (TV)** | `/antrians-ticker` |
| **Absen karyawan (scan RFID)** | `/absen-karyawan` |

### Terproteksi (harus login)

- **Dashboard** (`/dashboard`) dan **Monitoring** (`/monitorings`)
- **Profil** (`/profile`)
- CRUD per modul — `Index`/`Create`/`Edit`/`Show`: `pasiens`, `polis`, `fasilitas`, `ruangans`, `dokters`, `perawats`, `presensis`, `jadwal-dokters`, `pendaftarans`, `antrians`, `pemeriksaans`, `obats`, `pembayarans`, `beritas`, `penawarans`, `faqs`, `testimonials`, `messages`.

Halaman *Create* mendukung *query parameter* untuk alur kerja cepat:

| Halaman | Query |
| --- | --- |
| Pendaftaran baru | `pendaftarans/create?antrian_id=N` |
| Pemeriksaan baru | `pemeriksaans/create?antrian_id=N&pasien_id=N&poli_id=N` |
| Obat baru | `obats/create?pemeriksaan_id=N` |
| Pembayaran baru | `pembayarans/create?pemeriksaan_id=N` |
| Balas pesan | `messages/{id}/edit?reply=1` |

---

## 🧪 Testing

Tes menggunakan **Pest** dan berjalan di **SQLite in-memory** (tanpa MySQL):

```bash
php artisan test --compact                      # seluruh suite
php artisan test --filter=NamaTest              # satu test/filter
vendor/bin/pest tests/Feature/AntrianApiTest.php # satu file
```

Verifikasi kode lainnya:

```bash
vendor/bin/pint              # format kode PHP
npm run types:check          # cek tipe TypeScript (tsc)
npm run check                # lint + format frontend (vite-plus)
```

---

## 📁 Struktur Proyek

```
hqms/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/   # Controller API per modul (tipis)
│   │   ├── Requests/          # Form Request / validasi
│   │   └── Resources/         # Eloquent API Resources
│   ├── Models/                # Model Eloquent
│   ├── Services/              # Logika bisnis & transaksi DB
│   └── Policies/              # Otorisasi Gate
├── config/
├── database/
│   ├── factories/             # Factory untuk testing/seeding
│   ├── migrations/            # Skema portabel (MySQL & SQLite)
│   └── seeders/               # Data contoh per modul
├── resources/
│   └── js/
│       ├── pages/             # Halaman React per modul
│       ├── components/        # Komponen UI
│       ├── api/               # Pembungkus axios per modul
│       └── lib/               # Utilitas (axios instance, format)
├── routes/
│   ├── web.php                # Halaman Inertia (SPA)
│   └── api.php                # API v1
├── tests/                     # Pest feature/unit tests
├── vite.config.ts             # Vite (vite-plus)
└── composer.json
```

Pola per modul: **Controller (tipis) → Service (transaksi DB) → Request (validasi) → Resource (output JSON)**, dengan envelope respons JSON konsisten:

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

---

## 📡 Rangkuman API

Seluruh API di-prefix `/api/v1`:

**Kiosk & Publik (tanpa auth):** `kiosk/polis`, `kiosk/dokters`, `kiosk/beritas`, `kiosk/penawarans`, `kiosk/faqs`, `kiosk/testimonials`, `kiosk/jadwal-dokters`, `kiosk/ruangans`, `kiosk/fasilitas`, `POST kiosk/tickets` (buat tiket antrean), `kiosk/now-serving`, `POST kiosk/attendance/scan` (RFID), `POST kiosk/messages`, serta `auth/register` & `auth/login`.

**Auth (di bawah `auth:sanctum`):** `auth/me` (GET/PUT), `auth/me/password`, `auth/logout`.

**Resource terproteksi (CRUD `apiResource`):** `polis`, `fasilitas`, `ruangans`, `pasiens`, `pendaftarans`, `antrians`, `beritas`, `penawarans`, `dokters`, `perawats`, `presensis`, `jadwal-dokters`, `pemeriksaans`, `obats`, `pembayarans`, `faqs`, `testimonials`, `messages` — plus `ruangans/{ruangan}/antrians`, `POST/DELETE ruangans/{ruangan}/pasiens`, dan `monitoring`.

---

## 🛠️ Troubleshooting

| Gejala | Solusi |
| --- | --- |
| Login sukses tapi API langsung `401` (terlempar ke `/login`) | Host/port yang dibuka belum ada di `SANCTUM_STATEFUL_DOMAINS` — tambahkan dan restart server |
| Error *"Unable to locate file in Vite manifest"* | Jalankan `npm run build` (atau gunakan `composer run dev` / `npm run dev` agar Vite aktif) |
| Gambar/foto tidak tampil | Jalankan `php artisan storage:link` |
| "Symlink storage" gagal di Windows/Laragon | Pastikan folder `storage/app/public` ada, lalu ulangi `php artisan storage:link` |
| Sesi logout tiba-tiba | Default `SESSION_LIFETIME=1440` (24 jam); atur di `.env` bila perlu |

---

## 🤝 Kontribusi

1. Kerjakan dari cabang: `git checkout -b fitur/fitur-baru`.
2. Ikuti pola `Controller → Service → Request → Resource`.
3. Format kode PHP: `vendor/bin/pint`.
4. Tambahkan tes Pest untuk setiap perubahan logika.
5. Jalankan tes sebelum PR: `php artisan test --compact`.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

---

<div align="center">

Dibuat dengan ❤️ untuk **RS Merdeka**

</div>