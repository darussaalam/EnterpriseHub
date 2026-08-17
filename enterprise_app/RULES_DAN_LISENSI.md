# 📜 ATURAN PENGGUNAAN & LISENSI KOMERSIAL (COMMERCIAL LICENSE)
### EnterpriseHub Pro — Web Admin & Mobile PWA Suite

Harap membaca aturan dan ketentuan lisensi ini sebelum menggunakan, memodifikasi, atau mendistribusikan source code ini kepada klien atau pihak ketiga.

---

## 1. HAK CIPTA & KEPEMILIKAN LISENSI

Dengan memiliki atau membeli paket source code **EnterpriseHub Pro**, Anda diberikan **Lisensi Komersial Terbuka (White-Label & Developer Commercial License)** dengan ketentuan sebagai berikut:

### ✅ Hal yang DIIZINKAN (Allowed):
1. **Penggunaan untuk Klien & Perusahaan**:
   - Anda berhak menggunakan source code ini untuk keperluan internal perusahaan Anda sendiri atau diinstal pada proyek klien Anda tanpa batasan jumlah klien (Unlimited Clients).
2. **Rebranding & White-Label**:
   - Anda berhak mengubah nama aplikasi (*EnterpriseHub*), logo, warna tema, favicon, nama PT/perusahaan pada slip gaji, serta seluruh teks hak cipta (*copyright*) menjadi merek / brand milik Anda atau klien Anda.
3. **Kustomisasi & Modifikasi Source Code**:
   - Anda berhak mengubah, menambah, menghapus, atau memodifikasi modul, controller, database migration, API, dan tampilan antarmuka (UI/UX) sesuai kebutuhan bisnis.
4. **Penjualan Jasa Instalasi & Maintenance**:
   - Anda berhak mengenakan biaya jasa instalasi, kustomisasi, server hosting, dan biaya langganan maintenance berkala kepada klien Anda.

---

## 2. BATASAN & LARANGAN (RESTRICTIONS & RULES)

Untuk menjaga etika bisnis dan perlindungan ekosistem developer, diberlakukan larangan ketat berikut:

### ❌ Hal yang DILARANG (Prohibited):
1. **Dilarang Membagikan Secara Gratis / Publik**:
   - Dilarang mengunggah (*upload*) source code mentah ini ke repository publik tanpa proteksi (seperti public GitHub repo dengan file backend `.env` terbuka) atau membagikannya secara gratis di forum/grup unduhan bajakan.
2. **Dilarang Menjual Mentah di Marketplace Template dengan Klaim Originality**:
   - Dilarang menjual file mentah apa adanya di marketplace global (seperti CodeCanyon atau Envato) tanpa modifikasi fitur yang signifikan.
3. **Dilarang Menyertakan Kunci API Pribadi dalam Paket**:
   - Saat menyerahkan aplikasi ke klien, pastikan file `.env` telah dibersihkan dari kredensial database pribadi atau secret key pengembang.

---

## 3. PANDUAN PENYERAHAN KEPADA KLIEN (CLIENT DELIVERY RULES)

Saat Anda menjual dan menyerahkan aplikasi ini ke klien perusahaan:
1. **Ubah Kredensial Default**:
   - Segera minta klien atau buatkan akun Super Admin baru dan ubah password bawaan (`password123`) demi keamanan sistem.
2. **Konfigurasi Database MySQL Produksi**:
   - Pada server produksi klien, gunakan database MySQL dan pastikan `APP_DEBUG=false` di file `.env`.
3. **Atur Koordinat Kantor Klien**:
   - Masuk ke menu **Web Admin -> Lokasi GPS Kantor** dan masukkan titik Latitude/Longitude serta radius kantor klien yang sebenarnya.

---

## 4. DISCLAIMER & BATASAN TANGGUNG JAWAB

- Source code ini disediakan *"sebagaimana adanya"* (*As-Is*) dan telah diuji fungsionalitasnya secara komprehensif.
- Pengembang/penjual tidak bertanggung jawab atas kerugian finansial, kehilangan data, atau masalah hukum yang disebabkan oleh penyalahgunaan aplikasi oleh pihak ketiga atau kegagalan konfigurasi server pihak pembeli.
- Pastikan selalu melakukan pencadangan (*backup*) berkala pada database MySQL dan direktori `storage/` aplikasi Anda.

---

*Hak Cipta © 2026 EnterpriseHub Suite. Lisensi Komersial Multi-Penggunaan.*
