# 🛠️ PANDUAN LENGKAP INSTALASI & SETUP UNTUK PEMBELI
### EnterpriseHub Pro — Web Admin & Mobile PWA Suite

Panduan ini disusun secara bertahap agar pembeli atau klien dapat menginstal dan menjalankan sistem dengan mudah di berbagai platform server.

---

## 📋 1. Kebutuhan Sistem (System Requirements)

- **PHP Version**: PHP 8.1 atau PHP 8.2+
- **PHP Extensions Aktif**: `pdo`, `pdo_mysql`, `pdo_sqlite`, `mbstring`, `fileinfo`, `openssl`, `curl`, `json`, `bcmath`, `xml`.
- **Database**: MySQL 5.7+ / MariaDB 10.3+ ATAU SQLite 3 (bawaan PHP).
- **Composer**: Composer 2.x
- **Web Server**: Apache / Nginx / LiteSpeed.
- **SSL Certificate (HTTPS)**: Sangat direkomendasikan saat online agar fitur **Kamera Selfie** dan **GPS Geolocation** peramban berfungsi optimal.

---

## 💻 2. Instalasi di Komputer Lokal (Localhost XAMPP / Laragon)

### Langkah 1: Ekstrak Source Code
Ekstrak folder `enterprise_app` ke direktori web server lokal Anda:
- XAMPP: `C:\xampp\htdocs\enterprise_app`
- Laragon: `C:\laragon\www\enterprise_app`

### Langkah 2: Buka Terminal / CMD
Buka terminal di dalam folder `enterprise_app`:
```bash
cd enterprise_app
```

### Langkah 3: Konfigurasi File `.env`
Buka file `.env` dan atur konfigurasi database:
- **Jika Menggunakan SQLite (Paling Cepat & Instan)**:
  ```env
  DB_CONNECTION=sqlite
  ```
- **Jika Menggunakan MySQL (XAMPP / PhpMyAdmin)**:
  Buat database baru bernama `enterprise_db` di PhpMyAdmin, lalu atur:
  ```env
  DB_CONNECTION=mysql
  DB_HOST=127.0.0.1
  DB_PORT=3306
  DB_DATABASE=enterprise_db
  DB_USERNAME=root
  DB_PASSWORD=
  ```

### Langkah 4: Generate Database & Data Demo
Jalankan perintah berikut di terminal:
```bash
php artisan migrate:fresh --seed
```

### Langkah 5: Jalankan Server
```bash
php artisan serve
```
Akses di browser:
- Login Portal: **`http://127.0.0.1:8000/login`**
- Mobile Employee PWA: **`http://127.0.0.1:8000/mobile/dashboard`**
- Web Admin: **`http://127.0.0.1:8000/admin/dashboard`**

---

## 🌐 3. Instalasi di cPanel Shared Hosting (Hosting Umum)

1. **Upload File**:
   - Kompres seluruh isi folder `enterprise_app` menjadi file `.zip`.
   - Di cPanel File Manager, buat folder baru di root (misalnya `/home/username/enterprise_app`).
   - Ekstrak seluruh file proyek ke folder tersebut.
2. **Pindahkan Isi Folder `public/`**:
   - Pindahkan seluruh file yang ada di dalam `enterprise_app/public/` ke direktori `public_html` domain Anda.
   - Buka file `public_html/index.php` dan sesuaikan path autoload:
     ```php
     require __DIR__.'/../enterprise_app/vendor/autoload.php';
     $app = require_once __DIR__.'/../enterprise_app/bootstrap/app.php';
     ```
3. **Database MySQL di cPanel**:
   - Buat database MySQL dan user database melalui cPanel -> **MySQL Databases**.
   - Buka file `.env` di folder `enterprise_app` dan masukkan nama database, username, dan password yang baru dibuat.
4. **Import Database**:
   - Jalankan migration via cPanel Terminal: `php artisan migrate --seed` ATAU import file `.sql` via PhpMyAdmin.
5. **Aktifkan HTTPS / SSL**:
   - Pastikan SSL gratis (Let's Encrypt / AutoSSL) aktif pada domain Anda agar fitur kamera & GPS smartphone berjalan tanpa blokir izin keamanan browser.

---

## 🐧 4. Instalasi di VPS Ubuntu / Debian (Nginx & Apache)

1. **Clone / Upload Source Code**:
   ```bash
   cd /var/www/
   git clone <URL_REPO_ANDA> enterprise_app
   cd enterprise_app
   ```
2. **Set Permission Storage & Cache**:
   ```bash
   sudo chown -R www-data:www-data storage bootstrap/cache
   sudo chmod -R 775 storage bootstrap/cache
   ```
3. **Atur Virtual Host Nginx / Apache**:
   Arahkan `DocumentRoot` / `root` web server ke direktori:
   ```nginx
   root /var/www/enterprise_app/public;
   index index.php index.html;
   ```
4. **Instal SSL Certbot**:
   ```bash
   sudo certbot --nginx -d namadomainanda.com
   ```

---

## 📱 5. Panduan Pemasangan PWA di Smartphone Klien

1. Buka domain aplikasi yang sudah ber-HTTPS di browser smartphone (Google Chrome di Android / Safari di iPhone).
2. Login sebagai akun karyawan.
3. Klik tombol **"Install App"** pada banner notifikasi atau pilih menu browser **"Tambahkan ke Layar Utama (Add to Home Screen)"**.
4. Aplikasi akan terpasang di menu smartphone klien secara instan dengan icon resmi dan tampilan fullscreen (bebas bilah alamat URL peramban).
