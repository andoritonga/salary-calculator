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

### 6. 🔒 Mode Privasi & Utilitas Tambahan
- **Mode Privasi (Sensor Angka)**: Mengaburkan seluruh nominal rupiah dengan efek blur interaktif (cukup arahkan kursor untuk melihat angka), aman saat digunakan di ruang publik / kantor.
- **Salin Ringkasan (Copy Summary)**: Menyalin format ringkasan negosiasi siap kirim ke clipboard.
- **Ekspor / Cetak PDF**: Format cetak bersih (`@media print`) yang menghilangkan elemen navigasi dan tombol.
- **Progressive Web App (PWA)**: Dilengkapi Service Worker (`v4`) dan manifest untuk instalasi di smartphone / desktop dan dapat diakses saat offline.

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
