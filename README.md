# 🏢 EnterpriseHub Pro — Enterprise Management & Mobile PWA Suite
### Source Code Komersial & White-Label Ready (Full Version)

> **Paket Source Code Enterprise Management System (Web Admin + Mobile PWA)** siap pakai, siap jual kembali, atau dideploy untuk kebutuhan klien perusahaan, UMKM, instansi, dan korporat.

---

## 🌟 Keunggulan Produk (Selling Points)

1. **Dual Interface Terintegrasi**:
   - **Web Admin Portal**: Untuk HRD, Manager, Finance, Supervisor, dan Super Admin (Layout Desktop & Tablet responsif).
   - **Mobile PWA Employee**: Dirancang khusus tampilan smartphone (Mobile App tanpa perlu instalasi rumit dari Play Store).
2. **Presensi Canggih Anti-Fraud**:
   - **Live Camera Selfie (WebRTC)**: Validasi foto wajah saat jam masuk dan pulang.
   - **GPS Geofencing**: Mengunci koordinat GPS dan memvalidasi radius jarak kantor terdaftar secara real-time.
   - **Kalkulasi Jam Kerja Otomatis**: Menghitung durasi kerja harian, lembur, dan status terlambat.
3. **PWA Standalone (Progressive Web App)**:
   - Bisa di-install langsung dari browser ke Home Screen HP Android & iOS.
   - Dilengkapi icon aplikasi, offline caching (Service Worker), dan dukungan Push Notification.
4. **Modul Lengkap Terpadu (Satu Database MySQL/SQLite)**:
   - **HR**: Manajemen Karyawan, Presensi Live Log, Approval Cuti/Izin, Approval WFH.
   - **Project & Task**: Monitoring Proyek, Task Assignment, Task Progress Slider (25%-100%).
   - **Finance**: Generator Payroll Otomatis, Cetak Slip Gaji Digital Resmi (Confidential).
   - **Asset Management**: Inventarisasi perangkat IT, serial number, kondisi, dan penanggung jawab.
   - **Geofence Setting**: Kelola koordinat GPS kantor cabang dan toleransi radius meter.
   - **Executive Reports**: Generator rekapitulasi presensi, pengeluaran gaji, dan kinerja proyek.

---

## 📁 Struktur Berkas Source Code

```text
📁 EnterpriseHub-Source-Code/
├── 📄 README.md                             # Ringkasan produk & quick start
├── 📄 RULES_DAN_LISENSI.md                  # Aturan lisensi komersial & hak jual kembali
├── 📄 PANDUAN_PEMBELI_DAN_INSTALASI.md      # Panduan instalasi (Localhost, cPanel, VPS, Cloud)
├── 📄 ARSITEKTUR_DAN_KUSTOMISASI.md         # Panduan developer untuk kustomisasi & branding
├── 📁 enterprise_app/                       # Backend Laravel 10 + Frontend Blade + API
│   ├── 📁 app/                              # Controllers, Models, Middleware
│   ├── 📁 database/                         # Migrations & Seeders (Demo data lengkap)
│   ├── 📁 public/                           # Manifest PWA, Service Worker, Custom CSS/JS, Icons
│   ├── 📁 resources/views/                  # Layouts, Auth, Mobile PWA, Web Admin Views
│   ├── 📁 routes/                           # web.php & api.php
│   ├── 📄 Dockerfile                        # Konfigurasi deploy cloud (Render / Railway)
│   └── 📄 render.yaml                       # Spek 1-click cloud deploy
└── 📁 docs/                                 # Static Live PWA Edition (Deploy 1-klik ke GitHub Pages)
    ├── 📄 index.html                        # Live interactive demo
    ├── 📄 manifest.json                     # PWA Manifest
    └── 📄 sw.js                             # Service Worker Cache
```

---

## ⚡ Quick Start (Jalankan dalam 1 Menit di Komputer Lokal)

1. Pastikan komputer Anda telah terpasang **PHP 8.1+** dan **Composer** (contoh: XAMPP).
2. Buka folder `enterprise_app` di Terminal / PowerShell:
   ```bash
   cd enterprise_app
   ```
3. Jalankan server lokal:
   ```bash
   php artisan serve
   ```
4. Buka di browser:
   - **Web Admin**: [http://127.0.0.1:8000/admin/dashboard](http://127.0.0.1:8000/admin/dashboard)
   - **Mobile PWA**: [http://127.0.0.1:8000/mobile/dashboard](http://127.0.0.1:8000/mobile/dashboard)

---

## 🔑 Akun & Kredensial Demo (Default Password: `password123`)

Tersedia tombol **⚡ 1-Click Demo Login** di halaman login untuk beralih akun secara instan:

| Akun | Email | Role | Akses Fitur |
| :--- | :--- | :--- | :--- |
| **Budi Santoso** | `budi@enterprise.com` | `employee` | Mobile PWA, Presensi Kamera/GPS, Tugas, Cuti, Slip Gaji |
| **Siti Rahmawati** | `siti@enterprise.com` | `employee` | Mobile PWA UI/UX, Tugas Selesai, Slip Gaji |
| **Super Admin** | `admin@enterprise.com` | `admin` | Seluruh Akses Web Admin, Settings, & Database |
| **Sarah Wijaya** | `hr@enterprise.com` | `hr` | Data Karyawan, Live Log Presensi, Approval Cuti/WFH |
| **Hendro Pratama** | `manager@enterprise.com` | `manager` | Manajemen Proyek & Pembagian Tugas Tim |
| **Dewi Anggraini** | `finance@enterprise.com` | `finance` | Generator Gaji (Payroll) & Pencairan Slip |

---

## 📖 Dokumen Panduan Pembeli
Silakan baca berkas berikut untuk petunjuk teknis lebih mendalam:
- 📜 [RULES_DAN_LISENSI.md](file:///e:/New%20folder/New%20folder/RULES_DAN_LISENSI.md) — Ketentuan lisensi komersial dan hak jual ulang.
- 🛠️ [PANDUAN_PEMBELI_DAN_INSTALASI.md](file:///e:/New%20folder/New%20folder/PANDUAN_PEMBELI_DAN_INSTALASI.md) — Panduan instalasi di cPanel, VPS, dan Docker.
- 🎨 [ARSITEKTUR_DAN_KUSTOMISASI.md](file:///e:/New%20folder/New%20folder/ARSITEKTUR_DAN_KUSTOMISASI.md) — Cara mengganti logo, warna, dan menambah fitur baru.
