# 💰 Kalkulator Gaji & Offering (PPh 21 TER PMK 168/2023 + BPJS)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-gaji.ritonga.xyz-emerald?style=for-the-badge&logo=cloudflare)](https://gaji.ritonga.xyz)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

Aplikasi web modern untuk menghitung gaji bersih (*Take Home Pay* / THP), estimasi kenaikan negosiasi penawaran kerja (*job offering*), simulasi slip THR & Desember, dan komparasi *side-by-side* secara akurat sesuai regulasi perpajakan Indonesia terbaru.

🔗 **Akses Online**: [https://gaji.ritonga.xyz](https://gaji.ritonga.xyz)

---

## 🏛️ Landasan Regulasi & Formula Perhitungan

Sistem kalkulasi mengacu pada ketentuan perpajakan dan ketenagakerjaan resmi di Indonesia:

1. **PPh 21 Bulanan (Skema TER - PP No. 58 Tahun 2023 & PMK No. 168 Tahun 2023)**:
   - **Kategori TER A**: TK/0 (Rp 54 Jt), TK/1 (Rp 58.5 Jt), K/0 (Rp 58.5 Jt).
   - **Kategori TER B**: TK/2 (Rp 63 Jt), TK/3 (Rp 67.5 Jt), K/1 (Rp 63 Jt), K/2 (Rp 67.5 Jt).
   - **Kategori TER C**: K/3 (Rp 72 Jt).
   - Tarif Efektif Rata-Rata (0% hingga 34%) diterapkan langsung terhadap Penghasilan Bruto per bulan (Januari – November).

2. **PPh 21 Masa Desember & Tahunan (Pasal 17 UU No. 7 Tahun 2021 tentang Harmonisasi Peraturan Perpajakan / HPP)**:
   - Tarif progresif 5 lapisan:
     - Lapisan 1: Rp 0 s/d Rp 60.000.000 (5%)
     - Lapisan 2: > Rp 60.000.000 s/d Rp 250.000.000 (15%)
     - Lapisan 3: > Rp 250.000.000 s/d Rp 500.000.000 (25%)
     - Lapisan 4: > Rp 500.000.000 s/d Rp 5.000.000.000 (30%)
     - Lapisan 5: > Rp 5.000.000.000 (35%)
   - Biaya Jabatan 5% (maks. Rp 500.000/bln atau Rp 6.000.000/thn).

3. **Iuran BPJS Kesehatan**:
   - **1% Karyawan** dan **4% Pemberi Kerja**.
   - Batas plafon maksimal upah perhitungan: **Rp 12.000.000 / bulan**.

4. **Iuran BPJS Ketenagakerjaan**:
   - **JHT (Jaminan Hari Tua)**: 2% Karyawan, 3.7% Pemberi Kerja.
   - **JP (Jaminan Pensiun)**: 1% Karyawan, 2% Pemberi Kerja (dengan batas plafon penyesuaian regulasi).
   - **JKK (Jaminan Kecelakaan Kerja)**: 0.24% Pemberi Kerja (masuk penambah bruto pajak).
   - **JKM (Jaminan Kematian)**: 0.30% Pemberi Kerja (masuk penambah bruto pajak).

---

## 🚀 Fitur Unggulan

### 1. 🎛️ Status PTKP Global Terpadu
- Pemilihan status PTKP (TK/0 hingga K/3) ditempatkan **1 saja di toolbar atas**.
- Menyinkronkan perhitungan gaji saat ini (*Existing*) dan seluruh penawaran baru (*Offering*) secara *real-time*.
- Dilengkapi badge kategori TER dinamis (A, B, C) beserta batas nominalnya secara otomatis.

### 2. ⚖️ Komparasi Side-by-Side Interaktif
- Perbandingan langsung antara gaji saat ini vs penawaran baru.
- Dukungan **Multiple Offerings** (tambah, namai, dan hapus beberapa penawaran sekaligus).
- Tampilan kartu ringkasan eksekutif kenaikan bulanan (*Delta Net THP*) dan akumulasi tahunan.
- Metode pemajakan fleksibel: **Gross**, **Gross-up**, atau **Nett**.

### 3. 📊 Rincian Detail Komparasi (Executive Breakdown)
- Tampilan modern terpisah antara:
  - **Arus Kas Bulanan (Monthly Routine)**: Rincian Gaji Pokok, Tunjangan Tetap, PPh 21 TER, BPJS Kesehatan, BPJS TK, dan Net THP masuk rekening.
  - **Proyeksi Akumulasi Tahunan**: Paket tahunan (12x, 13x THR, 14x, 15x), Tunjangan Tidak Tetap/Bonus, PPh 21 Pasal 17 progresif, dan kontribusi fasilitas BPJS perusahaan.
- Tab selector: **Bulanan**, **Tahunan**, atau **Semua (Lengkap Berdampingan)**.
- Desain *tabular figures* (`tabular-nums`) untuk kemudahan membaca digit nominal keuangan.
- Pill badge selisih (*Delta Badge*) interaktif untuk memudahkan analisis.

### 4. 🎯 Pop-up Modal Alat Negosiasi & Target Gaji
- **Mode Persentase (+%)**: Tombol preset cepat (+10%, +15%, +20%, +25%, +30%, +35%, +40%, +50%) dan slider interaktif target kenaikan (0% – 100%).
- **Mode Reverse (Target Net ➔ Gross)**: Masukkan ekspektasi Take Home Pay bersih yang diinginkan, sistem otomatis mencari besaran Gaji Pokok kotor (Gross) yang harus diminta ke HRD.
- Tombol *Terapkan ke Penawaran* untuk menerapkan hasil negosiasi ke form penawaran secara instan.

### 5. 📑 Pop-up Modal Simulasi Slip THR & Bulan Desember
- **Simulasi Slip Bulan THR**: Mensimulasikan lonjakan tarif TER bulanan ketika menerima gaji pokok + THR sekaligus dalam 1 bulan kalender.
- **Simulasi Slip Bulan Desember (True-up)**: Menghitung penyesuaian pajak akhir tahun dengan rumus PPh 21 Pasal 17 setahun dikurangi kredit pajak TER yang telah dipotong (Jan–Nov).

### 6. 🔄 Fitur Reset & Clear All (Kosongkan Data)
- **Global Reset Modal**: Tombol `Reset` di bilah atas untuk memilih antara:
  - **Kosongkan Semua Angka (0)**: Mengosongkan seluruh angka gaji saat ini dan seluruh offering ke Rp 0 untuk input baru dari awal.
  - **Kembalikan ke Contoh Bawaan (Demo)**: Mengembalikan form ke data simulasi bawaan.
- **Per-Card Quick Reset**: Tombol ikon *rotate/clear* di masing-masing kartu Existing dan Offering untuk pengosongan cepat secara granular.

### 7. 🌐 Pengganti Bahasa (Bilingual: Indonesia & English)
- **Toggle ID / EN**: Terletak di bilah atas (*header action bar*) bersebelahan dengan tombol Privasi.
- **Penerjemahan Menyeluruh**: Seluruh antarmuka—termasuk Header, Drawer Opsi, Kartu Ringkasan, Formulir Input, Rincian Komparasi Bulanan/Tahunan, Pop-up Negosiasi & Reverse Gross, Simulator Slip THR & Desember, Modal Reset, hingga teks Salin Ringkasan—diterjemahkan secara lengkap dan akurat.
- **Penyimpanan Preferensi**: Bahasa yang dipilih tersimpan otomatis di `localStorage` (`salary_calc_lang`) sehingga tetap aktif saat halaman dimuat ulang.

### 8. 📱 Pengalaman Mobile & PWA Layaknya Aplikasi Native
- **Header Mobile Bersih & Bebas Geser Samping**: Header ringkas bebas luapan (*zero overflow / no horizontal scroll*), menyembunyikan teks deskripsi panjang dan tombol desktop sekunder pada layar ponsel kecil agar tampilan tetap lega dan rapi layaknya aplikasi iOS/Android.
- **Kontrol Penawaran Responsif (Tanpa Scroll Samping)**: Pilihan penawaran kerja otomatis membungkus (*flex-wrap*) dengan rapi tanpa memunculkan bilah geser horizontal (*horizontal scrollbar*), dan tombol aksi ganda di bar atas dialihkan ke bilah dock bawah.
- **Dock Navigasi Bawah (Mobile Bottom Nav)**: Bilah navigasi bawah modern ramah jempol (*thumb-friendly*) dengan 5 menu utama: *Input Form*, *Rincian Komparasi*, *Alat Negosiasi*, *Slip Khusus*, dan *Pengaturan*.
- **Bottom Sheet Modals**: Seluruh modal (Alat Negosiasi, Simulator Slip, Reset) bertransformasi menjadi *Bottom Sheet* dengan indikator tarikan geser (*drag handle*) dan sudut melengkung halus khas aplikasi modern.
- **Laci Pengaturan & Aksi Cepat Mobile**: Tombol menu navigasi bawah membuka laci pengaturan yang dilengkapi tombol tutup (X) dan pintasan cepat (Cetak PDF, Salin Ringkasan, Reset).
- **Segmented Mobile Filter Card**: Switcher praktis di atas form input (*Saat Ini / Penawaran / Berdampingan*) untuk mengurangi beban scrolling di layar ponsel.
- **Floating Quick KPI Strip**: Bar mengambang otomatis yang menampilkan selisih kenaikan Take Home Pay saat pengguna menggulir halaman ke bawah.
- **PWA Prompt & Standalone Mode**: Banner instalasi aplikasi instan (`beforeinstallprompt`), dukungan penuh layar `viewport-fit=cover`, penanganan area poni/notch & home bar (`safe-area-insets`), dan Service Worker (`salary-calc-v9`).

### 9. 🔒 Mode Privasi & Utilitas Tambahan
- **Mode Privasi (Sensor Angka)**: Mengaburkan seluruh nominal rupiah dengan efek blur interaktif (cukup sentuh atau arahkan kursor untuk melihat angka), aman saat digunakan di ruang publik / kantor.
- **Salin Ringkasan (Copy Summary)**: Menyalin format ringkasan negosiasi siap kirim ke clipboard sesuai bahasa yang aktif (ID/EN).
- **Ekspor / Cetak PDF**: Format cetak bersih (`@media print`) yang menghilangkan elemen navigasi dan tombol.
- **Progressive Web App (PWA)**: Dilengkapi Service Worker (`salary-calc-v9`) dan manifest untuk instalasi di smartphone / desktop dan dapat diakses saat offline.

---

## 🛠️ Tech Stack

- **Frontend Core**: [React 18](https://react.dev/), [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment & Server**: Multi-stage [Docker](https://www.docker.com/) (Node.js Alpine builder + Nginx Alpine)
- **Container Port**: `3000`
- **Reverse Proxy / Tunnel**: Cloudflare Tunnel (`gaji.ritonga.xyz`)

---

## 📦 Menjalankan dengan Docker

### 1. Menggunakan Docker Compose (Direkomendasikan)

```bash
docker compose up -d --build
```

Aplikasi dapat langsung diakses di browser: `http://localhost:3000`

Untuk menghentikan kontainer:
```bash
docker compose down
```

### 2. Menggunakan Docker CLI Standar

```bash
# Build image
docker build -t salary-calculator .

# Jalankan container di port 3000
docker run -d -p 3000:3000 --name salary-calculator-app salary-calculator
```

---

## 💻 Menjalankan Secara Lokal (Development)

Prasyarat: Pastikan telah menginstal **Node.js (v18+)** dan **npm**.

```bash
# 1. Clone repositori
git clone https://github.com/andoritonga/salary-calculator.git
cd salary-calculator

# 2. Install dependensi
npm install

# 3. Jalankan development server
npm run dev
```

Buka browser di `http://localhost:3000`.

Untuk membangun bundle produksi:
```bash
npm run build
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT** - lihat berkas [LICENSE](LICENSE) untuk detail.

Dibuat dengan ❤️ oleh [Ando Ritonga](https://github.com/andoritonga).
