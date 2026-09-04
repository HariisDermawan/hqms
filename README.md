🏥 HRS Medika

Hospital Management System — Integrated Healthcare Management Platform

HRS Medika adalah sistem manajemen rumah sakit yang dirancang untuk mendukung operasional rumah sakit secara terintegrasi, efisien, aman, dan real-time.

Sistem mencakup proses pelayanan pasien, pengelolaan antrian, presensi karyawan, manajemen pengguna, serta Role & Permission untuk memastikan setiap pengguna memiliki akses sesuai dengan tanggung jawabnya.

🚀 Core Features
🎫 Real-Time Queue Management
👤 Patient Management
👨‍⚕️ Doctor Management
👩‍⚕️ Employee Management
🕐 Employee Attendance
🔐 Role & Permission
🏥 Poli / Clinic Management
📊 Dashboard & Reports
📡 Real-Time Queue Display
🔔 Queue Calling System
🔄 System Flow
1. 🔐 Authentication Flow

Setiap pengguna harus melakukan authentication sebelum mengakses sistem.

flowchart TD
    A[User] --> B[Login]
    B --> C{Valid Credentials?}

    C -- No --> D[Login Failed]
    D --> B

    C -- Yes --> E[Create Session / Token]
    E --> F[Get User Role]
    F --> G[Load Permissions]
    G --> H[Dashboard]

Flow
User
 │
 ▼
Login
 │
 ▼
Validasi Credential
 │
 ├── ❌ Invalid
 │      │
 │      ▼
 │   Login Failed
 │
 └── ✅ Valid
        │
        ▼
   Authentication
        │
        ▼
   Get User Role
        │
        ▼
  Get Permissions
        │
        ▼
     Dashboard

🎫 2. Queue Management Flow

Flow utama untuk pasien yang ingin mendapatkan pelayanan.

Pasien
Pilih Poli / Layanan
Ambil Nomor Antrian
Generate Queue Number
Status: WAITING
Petugas Melihat Antrian
Panggil Nomor Antrian
Status: CALLED
Pasien Menuju Loket / Poli
Mulai Pelayanan
Status: SERVING
Selesai Pelayanan
Status: COMPLETED
Detail Flow
                    ┌─────────────┐
                    │   PASIEN    │
                    └──────┬──────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Pilih Poli      │
                  │ / Layanan       │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Ambil No        │
                  │ Antrian         │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ WAITING         │
                  │ A-001           │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ PETUGAS         │
                  │ Panggil         │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ CALLED          │
                  │ A-001           │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ SERVING         │
                  │ Pelayanan       │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ COMPLETED       │
                  │ Pelayanan Selesai│
                  └─────────────────┘

⚡ 3. Real-Time Queue Flow

Ketika petugas memanggil nomor antrian, perubahan akan dikirim ke seluruh client yang terhubung.

sequenceDiagram
    participant P as Petugas
    participant API as Backend API
    participant DB as Database
    participant WS as WebSocket
    participant TV as Queue Display
    participant U as User

    P->>API: Panggil Antrian A-001
    API->>DB: Update Status = CALLED
    DB-->>API: Success
    API->>WS: Broadcast Queue Event
    WS-->>TV: Update A-001
    WS-->>U: Update Queue Status

Real-Time Architecture
                  PETUGAS
                     │
                     │ Call A-001
                     ▼
              ┌──────────────┐
              │   BACKEND    │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   DATABASE   │
              └──────┬───────┘
                     │
                     │ Event
                     ▼
              ┌──────────────┐
              │  WEBSOCKET   │
              └──────┬───────┘
                     │
           ┌─────────┼─────────┐
           │         │         │
           ▼         ▼         ▼
       Queue TV   Dashboard  Patient


Dengan mekanisme tersebut, perubahan nomor antrian dapat tampil secara real-time tanpa melakukan refresh halaman.

🏥 4. Patient Service Flow

Flow pelayanan pasien dari registrasi sampai pelayanan selesai.

flowchart TD
    A[Pasien] --> B[Registrasi]
    B --> C{Sudah Terdaftar?}

    C -- Tidak --> D[Buat Data Pasien]
    C -- Ya --> E[Data Pasien]

    D --> E
    E --> F[Pilih Poli]
    F --> G[Ambil Nomor Antrian]
    G --> H[Menunggu]

    H --> I[Panggilan Antrian]
    I --> J[Verifikasi Pasien]
    J --> K[Pelayanan Dokter / Perawat]
    K --> L[Selesai]

🕐 5. Employee Attendance Flow

Sistem presensi digunakan untuk mencatat aktivitas kehadiran karyawan.

flowchart TD
    A[Karyawan] --> B[Login]
    B --> C[Attendance]
    C --> D{Sudah Check In?}

    D -- No --> E[Check In]
    E --> F[Simpan Waktu Masuk]

    D -- Yes --> G[Check Out]
    G --> H[Simpan Waktu Keluar]

    F --> I[Attendance History]
    H --> I

    I --> J[HRD / Admin]
    J --> K[Attendance Report]

Attendance Flow
KARYAWAN
   │
   ▼
 LOGIN
   │
   ▼
ATTENDANCE
   │
   ├───────────────┐
   │               │
   ▼               ▼
CHECK IN        CHECK OUT
   │               │
   ▼               ▼
Waktu Masuk     Waktu Keluar
   │               │
   └───────┬───────┘
           ▼
   Attendance History
           │
           ▼
      HRD / ADMIN
           │
           ▼
        REPORT

🔐 6. Role & Permission Flow

Akses sistem dikontrol berdasarkan role dan permission.

flowchart TD
    A[User Login] --> B[Authentication]
    B --> C[User Role]
    C --> D[Role Permission]
    D --> E{Has Permission?}

    E -- Yes --> F[Access Feature]
    E -- No --> G[403 Forbidden]

Role Structure
                    SUPER ADMIN
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
        ADMIN           HRD         MEDICAL STAFF
          │              │              │
          │              │        ┌─────┴─────┐
          │              │        │           │
          ▼              ▼        ▼           ▼
      SYSTEM          EMPLOYEE  DOKTER     PERAWAT
      MANAGEMENT      ATTENDANCE
                                     
                    PETUGAS
                       │
                       ▼
                  QUEUE SYSTEM

                    PASIEN
                       │
                       ▼
                  PATIENT SERVICE

👥 7. User Access Matrix
Module	Super Admin	Admin	Dokter	Perawat	Petugas	HRD	Pasien
Dashboard	✅	✅	✅	✅	✅	✅	✅
User Management	✅	✅	❌	❌	❌	❌	❌
Role & Permission	✅	✅	❌	❌	❌	❌	❌
Patient	✅	✅	✅	✅	✅	❌	👁️
Queue	✅	✅	👁️	👁️	✅	❌	✅
Queue Calling	✅	✅	❌	❌	✅	❌	❌
Employee	✅	✅	❌	❌	❌	✅	❌
Attendance	✅	👁️	❌	❌	❌	✅	❌
Reports	✅	✅	👁️	👁️	👁️	✅	❌

Permission dapat dikustomisasi sesuai kebutuhan rumah sakit.

🧩 8. Overall System Flow

Keseluruhan proses HRS Medika dapat digambarkan sebagai berikut:

Pasien
Petugas
Dokter
Perawat
HRD
Admin
User
Authentication
Role & Permission
User Type
Patient Service
Queue Management
Medical Service
Employee & Attendance
System Management
Queue System
Real-Time Event
Queue Display
Patient Service
Attendance Report
System Reports
🛠️ Tech Stack

Sesuaikan dengan teknologi yang digunakan pada project.

Backend
Laravel
PHP
REST API
WebSocket
Redis
Frontend
React / Vue / Blade
JavaScript / TypeScript
Tailwind CSS
Database
MySQL / PostgreSQL
Infrastructure
Docker
Nginx
Redis
WebSocket Server
📁 Project Structure
hrs-medika/
│
├── backend/
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── resources/
│   └── tests/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── services/
│
├── docs/
│
├── docker/
│
├── .env.example
├── docker-compose.yml
└── README.md

🚀 Installation
Clone Repository
git clone https://github.com/username/hrs-medika.git

cd hrs-medika

Backend
composer install

Frontend
npm install

Environment
cp .env.example .env


Configure .env:

DB_DATABASE=hrs_medika
DB_USERNAME=root
DB_PASSWORD=

Generate Key
php artisan key:generate

Migration
php artisan migrate --seed

Run Backend
php artisan serve

Run Frontend
npm run dev

📊 Roadmap
 Authentication
 Role & Permission
 User Management
 Patient Management
 Employee Management
 Employee Attendance
 Queue Management
 Real-Time Queue
 Queue Display
 Mobile Application
 QR Code Queue
 WhatsApp Notification
 Online Appointment
 BPJS Integration
 Electronic Medical Record
 Billing & Payment
 Advanced Reporting
🔒 Security

HRS Medika memperhatikan keamanan data dan akses pengguna melalui:

Authentication
Role-Based Access Control
Permission Management
Password Hashing
Input Validation
CSRF Protection
API Authentication
Audit Log
Database Backup

⚠️ Jangan menyimpan credential, API key, password database, atau data pasien asli di repository.

🎯 Project Goals

HRS Medika dikembangkan untuk:

🏥 Digitalisasi operasional rumah sakit
⚡ Mempercepat pelayanan pasien
🎫 Mengurangi proses antrian manual
📡 Menyediakan informasi antrian secara real-time
🕐 Mempermudah monitoring presensi karyawan
🔐 Meningkatkan keamanan akses sistem
📊 Memusatkan data rumah sakit
📈 Membantu pengambilan keputusan melalui laporan
📄 License

Copyright © 2026 HRS Medika

All Rights Reserved.

<p align="center"> <strong>🏥 HRS Medika</strong> <br> <i>Digitalizing Healthcare Management</i> </p>
