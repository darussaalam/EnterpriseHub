# 🎨 PANDUAN ARSITEKTUR & KUSTOMISASI DEVELOPER
### EnterpriseHub Pro — Web Admin & Mobile PWA Suite

Dokumen teknis ini ditujukan untuk programmer / developer yang ingin melakukan kustomisasi merek (white-labeling), penambahan fitur, atau integrasi API pihak ketiga (misalnya WhatsApp Gateway).

---

## 🏗️ 1. Arsitektur Folder & Kode

Aplikasi dibangun menggunakan arsitektur modular standar **Laravel 10**:

- `app/Models/` — Model Eloquent lengkap dengan relasi tabel:
  - `User.php`, `Employee.php`, `Department.php`
  - `Attendance.php`, `AttendanceLocation.php`
  - `LeaveRequest.php`, `WfhRequest.php`
  - `Project.php`, `Task.php`, `Notification.php`
  - `Payroll.php`, `Asset.php`, `Report.php`
- `app/Http/Controllers/`:
  - `AuthController.php` — Multi-role authentication & quick demo switcher.
  - `Mobile/` — Seluruh controller antarmuka Mobile PWA (`MobileDashboardController`, `AttendanceController`, `RequestController`, `TaskController`, `ProfileController`, `NotificationController`).
  - `Admin/` — Seluruh controller antarmuka Web Admin (`AdminDashboardController`, `HRController`, `ProjectController`, `FinanceController`, `AssetController`, `LocationController`, `ReportController`).
  - `Api/ApiController.php` — Endpoint RESTful API untuk sinkronisasi data mobile.
- `public/`:
  - `manifest.json` — Konfigurasi PWA (Icon, theme color, display standalone).
  - `sw.js` — Service worker untuk caching offline & push notification.
  - `css/custom.css` — Desain sistem, warna, dan komponen UI.
  - `js/pwa-app.js` — Handler kamera WebRTC, Geolocation GPS Haversine calculator, dan instalasi PWA.

---

## 🎨 2. Cara Mengganti Logo, Nama Aplikasi & Warna (White-Labeling)

### A. Mengganti Nama Aplikasi
1. Buka file `.env`, ubah:
   ```env
   APP_NAME="Nama Perusahaan Anda"
   ```
2. Buka file `public/manifest.json`, ubah:
   ```json
   {
     "name": "Nama Perusahaan Mobile App",
     "short_name": "NamaApp"
   }
   ```

### B. Mengganti Logo & Ikon Aplikasi
1. Ganti file ikon di: `public/icons/icon.svg` dan `public/icons/icon-192.png`.
2. Ikon ini akan otomatis tampil di tab browser, header aplikasi, dan menu layar utama smartphone saat aplikasi di-install.

### C. Mengubah Warna Tema Utama
Buka file `public/css/custom.css`, ubah variabel warna di bagian paling atas `:root`:
```css
:root {
  --primary-color: #2563eb;       /* Ganti dengan kode warna hex brand Anda */
  --primary-hover: #1d4ed8;
  --primary-light: #eff6ff;
  --dark-bg: #0f172a;             /* Warna latar sidebar admin */
}
```

### D. Mengubah Nama Perusahaan pada Slip Gaji Digital
Buka file `resources/views/mobile/payslip.blade.php`, cari teks:
```html
<h5 class="fw-bold text-slate-900 mb-0">PT ENTERPRISE DIGITAL INDONESIA</h5>
```
Ubah menjadi nama instansi / perusahaan klien Anda.

---

## 📍 3. Menyesuaikan Titik Koordinat GPS Kantor & Radius

Anda dapat mengatur titik kantor langsung dari antarmuka Web Admin tanpa mengubah kode:
1. Login ke Web Admin sebagai Super Admin atau HR.
2. Buka menu **Lokasi GPS Kantor** (`/admin/locations`).
3. Klik tombol **Tambah Lokasi Kantor**.
4. Masukkan Latitude, Longitude, dan Radius Toleransi (misal: 150 meter).
5. Sistem absensi mobile karyawan akan secara otomatis mencocokkan jarak ke kantor terdekat.

---

## 💬 4. Integrasi Notifikasi WhatsApp Gateway (Opsional)

Jika ingin mengirim notifikasi otomatis ke WhatsApp karyawan saat permohonan cuti disetujui atau saat slip gaji cair:
1. Buka `app/Http/Controllers/Admin/HRController.php`.
2. Pada fungsi `processLeave` atau `processWfh`, tambahkan panggilan HTTP client (contoh ke Fonnte / Wablas API):
```php
use Illuminate\Support\Facades\Http;

Http::withHeaders([
    'Authorization' => 'API_KEY_WHATSAPP_ANDA'
])->post('https://api.fonnte.com/send', [
    'target' => $leave->employee->phone,
    'message' => "Halo {$leave->employee->full_name}, pengajuan cuti Anda untuk tanggal {$leave->start_date->format('d/m/Y')} telah DISETUJUI oleh HRD."
]);
```

---

## 📦 5. Membuat Tambahan Modul Baru

1. Buat model & migration:
   ```bash
   php artisan make:model NamaModul -m
   ```
2. Buat controller:
   ```bash
   php artisan make:controller Admin/NamaModulController
   ```
3. Daftarkan rute di `routes/web.php` dan buat view Blade di `resources/views/admin/namamodul/`.
