<div align="center">

![HQMS Banner](https://github.com/HariisDermawan/hqms/blob/main/public/banner/bn.png)

# 🏥 HQMS — Hospital Queue Management System

**Sistem Manajemen Rumah Sakit dengan Kiosk Antrean Self-Service — RS Merdeka**

[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?style=flat\&logo=php\&logoColor=white)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?style=flat\&logo=laravel\&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat\&logo=react\&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat\&logo=tailwindcss\&logoColor=white)](https://tailwindcss.com)

</div>

HQMS adalah aplikasi manajemen rumah sakit untuk **RS Merdeka** yang mencakup antrean pasien, pendaftaran, pemeriksaan, obat, pembayaran, presensi RFID, serta tampilan antrean pada TV ruang tunggu.

## ✨ Fitur

* 🎫 Kiosk pengambilan tiket antrean
* 📺 TV / ticker antrean
* 🧑‍⚕️ Pendaftaran dan pemeriksaan pasien
* 💊 Manajemen resep obat
* 💳 Pembayaran
* 🏥 Manajemen poli, dokter, perawat, fasilitas, dan ruangan
* 📡 Presensi menggunakan RFID
* 📊 Dashboard dan monitoring
* 🔐 Authentication dan Role-Based Access Control (RBAC)
* 📰 Manajemen berita, FAQ, penawaran, dan konten publik

## 🛠️ Teknologi

* **Backend:** Laravel 13, PHP 8.3
* **Frontend:** React 19, TypeScript
* **Styling:** Tailwind CSS 4
* **SPA:** Inertia.js v3
* **Database:** MySQL
* **Authentication:** Laravel Sanctum
* **Authorization:** Spatie Laravel Permission
* **Testing:** Pest

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/HariisDermawan/hqms.git
cd hqms
```

### 2. Install Dependency

```bash
composer install
npm install
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
php artisan key:generate
```

Sesuaikan database pada `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hqms_db
DB_USERNAME=root
DB_PASSWORD=
```

Buat database:

```sql
CREATE DATABASE hqms_db;
```

### 4. Migrasi dan Seed

```bash
php artisan migrate --seed
php artisan storage:link
```

### 5. Jalankan Aplikasi

```bash
composer run dev
```

Buka:

```text
http://localhost:8000
```

## 👤 Akun Demo

Password semua akun: **`password`**

| Email             | Role        |
| ----------------- | ----------- |
| `admin@hqms`      | Super Admin |
| `staf_loket@hqms` | Staf Loket  |
| `staf_obat@hqms`  | Staf Obat   |
| `dr.budi@hqms`    | Dokter      |
| `drg.siti@hqms`   | Dokter      |


## 🧪 Testing

Menjalankan seluruh test:

```bash
php artisan test
```
---

<div align="center">

**HQMS — RS Merdeka**

</div>
