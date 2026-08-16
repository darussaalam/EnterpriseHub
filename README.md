# ⚽ EA SPORTS FC 27 - Web Edition (Game Sepak Bola 3D Browser)

Game simulasi sepak bola 3D bertema **EA SPORTS FC 27** yang dirancang khusus untuk berjalan langsung di browser modern (Chrome, Edge, Firefox, Safari, Mobile Browser) tanpa perlu download/install aplikasi tambahan.

---

## 🌟 Fitur Utama

- **Grafis 3D & Fisika Realistis**:
  - Lapangan rumput bertekstur dengan garis potong (*mower lines*), stadion berlampu sorot malam hari (*floodlights*), papan iklan elektronik LED animasi di pinggir lapangan.
  - Gawang 3D dengan tiang dan jaring gawang dinamis.
  - Efek pantulan tiang/mistar (*post collision*), defleksi kiper, dan gaya putar bola (*Magnus effect/curl*).
- **Klub & Timnas Top Dunia**:
  - Real Madrid, Manchester City, FC Barcelona, Arsenal, Bayern München.
  - Tim Nasional: Indonesia (Jay Idzes, Maarten Paes, Marselino, Thom Haye, Ragnar), Argentina (Messi, Alvarez), Brazil (Vinicius, Endrick).
- **Mode Permainan**:
  - **Kick Off**: Pertandingan persahabatan 11v11 dengan pengaturan tingkat kesulitan AI (*Professional / World Class*).
  - **Champions Cup Tournament**: Mode turnamen gugur (Quarter-Finals -> Semi-Finals -> Grand Final).
  - **Ultimate Team & Taktik**: Formasi tim (4-3-3, 4-2-3-1, 4-4-2, 3-5-2) dan kartu rating pemain (*FUT Style Card*).
- **Kontrol Lengkap (Keyboard, Gamepad Stik & Mobile Touch)**:
  - Dribbling lincah, Sprint dengan sistem stamina.
  - Umpan Datar (*Ground Pass*), Umpan Terobosan (*Through Ball*), Umpan Lambung (*Lob Pass / Crossing*).
  - Tembakan Bertenaga (*Power Shot*) dengan indikator *Power Meter*.
  - Bertahan: *Slide Tackle* dan tombol *Switch Player*.
  - Skill Move: *Roulette 360 Spin*.
- **Fitur Siaran TV**:
  - Papan Skor & Timer siaran pertandingan.
  - Mini Radar 2D di bawah layar melacak 22 pemain dan posisi bola secara real-time.
  - Selebrasi Gol & **Instant Replay Slow-Motion** dengan kamera sinematik berputar.
  - Laporan statistik lengkap di akhir laga (*Possession, Shots, Shots on Target, Tackles*).
- **Audio Engine (Web Audio API)**:
  - Efek suara peluit wasit, dentuman tendangan bola, denting tiang gawang, dan gemuruh sorakan penonton saat terjadi gol.

---

## 🎮 Panduan Kontrol

### ⌨️ Keyboard (PC / Laptop)
| Aksi | Tombol Utama | Tombol Alternatif |
| :--- | :--- | :--- |
| **Pergerakan / Dribble** | `W / A / S / D` | `Panah Atas / Kiri / Bawah / Kanan` |
| **Umpan Pendek (Pass)** | `X` | `J` |
| **Umpan Terobosan (Through Ball)** | `W` | `I` |
| **Tembak / Shooting (Tahan untuk Power)** | `D` | `K` |
| **Umpan Lambung (Lob / Cross)** | `A` | `L` |
| **Lari Cepat (Sprint)** | `Shift Kiri` | `Spasi` |
| **Tekel Geser (Slide Tackle)** | `C` | `;` (Semicolon) |
| **Ganti Pemain Aktif** | `Q` | `U` |
| **Skill Move (Roulette 360)** | `E` | `O` |

### 🎮 Gamepad / Stik Controller (Xbox / PlayStation)
- **Analog Kiri**: Menggerakkan pemain.
- **Tombol A / Silang (X)**: Umpan pendek.
- **Tombol B / Bulat (O)**: Tembakan bertenaga (*Power Shot*).
- **Tombol Y / Segitiga (Δ)**: Umpan terobosan.
- **Tombol X / Kotak (□)**: Umpan lambung / Tekel geser saat bertahan.
- **Tombol RT / R2**: Sprint.
- **Tombol LB / L1**: Ganti kursor pemain aktif.
- **Tekan Analog Kanan (R3)**: Skill move.

### 📱 Layar Sentuh Smartphone (Mobile Touch)
- **Virtual Joystick** di kiri bawah untuk mengarahkan pemain.
- Tombol aksi di kanan bawah: **PASS**, **SHOOT**, **THRU**, **LOB**, **SWITCH**, **SKILL**, dan **SLIDE TACKLE**.

---

## 🚀 Cara Deploy Online (1-Click GitHub Pages)

Game ini dibangun dengan arsitektur web murni (*pure client-side*), sehingga **100% siap di-deploy secara instan dan gratis ke GitHub Pages**.

### Langkah-langkah Deploy ke GitHub:
1. Buat repository baru di akun GitHub Anda (misalnya: `ea-fc27-web`).
2. Masukkan semua file dari folder ini ke dalam repository tersebut:
   ```bash
   git init
   git add .
   git commit -m "Initial release EA FC 27 Web Edition"
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/ea-fc27-web.git
   git push -u origin main
   ```
3. Buka halaman repository di GitHub, lalu klik tab **Settings** > **Pages**.
4. Pada bagian **Branch**, pilih `main` dan folder `/ (root)`, lalu klik **Save**.
5. Tunggu sekitar 1-2 menit, link game online Anda akan langsung aktif di:
   `https://USERNAME-ANDA.github.io/ea-fc27-web/`
6. Bagikan link tersebut ke teman atau buka langsung dari HP / Laptop mana saja di seluruh dunia!

---

## 💻 Cara Menjalankan Secara Lokal di Komputer

Cukup buka file `index.html` menggunakan browser modern apa saja, atau gunakan local web server (misalnya VS Code Live Server atau Python simple server):

```bash
# Menggunakan Python
python -m http.server 8080
```
Lalu buka `http://localhost:8080` di browser Anda.
