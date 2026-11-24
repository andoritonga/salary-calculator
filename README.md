# Kalkulator Gaji & Offering (PPh 21 TER PMK 168/2023 + BPJS)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-gaji.ritonga.ai.id-emerald?style=for-the-badge&logo=cloudflare)](https://gaji.ritonga.ai.id)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

Aplikasi web modern untuk menghitung gaji bersih (*Take Home Pay* / THP), estimasi kenaikan negosiasi penawaran kerja (*job offering*), simulasi slip THR & Desember, dan komparasi *side-by-side* secara akurat sesuai regulasi perpajakan Indonesia terbaru.

Akses Online: [https://gaji.ritonga.ai.id](https://gaji.ritonga.ai.id)

---

## Landasan Regulasi & Formula Perhitungan

Sistem kalkulasi mengacu pada ketentuan perpajakan dan ketenagakerjaan resmi di Indonesia:

1. **PPh 21 Bulanan (Skema TER - PP No. 58 Tahun 2023 & PMK No. 168 Tahun 2023)**:
   - **Kategori TER A**: TK/0 (Rp 54 Jt), TK/1 (Rp 58,5 Jt), K/0 (Rp 58,5 Jt).
   - **Kategori TER B**: TK/2 (Rp 63 Jt), TK/3 (Rp 67,5 Jt), K/1 (Rp 63 Jt), K/2 (Rp 67,5 Jt).
   - **Kategori TER C**: K/3 (Rp 72 Jt).
   - Tarif Efektif Rata-Rata (0% hingga 34%) diterapkan langsung terhadap Penghasilan Bruto per bulan (Januari - November).

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
   - **JHT (Jaminan Hari Tua)**: 2% Karyawan, 3,7% Pemberi Kerja.
   - **JP (Jaminan Pensiun)**: 1% Karyawan, 2% Pemberi Kerja (dengan batas plafon penyesuaian regulasi Rp 10.042.300).
   - **JKK (Jaminan Kecelakaan Kerja)**: 0,24% Pemberi Kerja (masuk penambah bruto pajak bila opsi aktif).
   - **JKM (Jaminan Kematian)**: 0,30% Pemberi Kerja (masuk penambah bruto pajak bila opsi aktif).

---

## Fitur Utama

### 1. Status PTKP Global Terpadu
- Pemilihan status PTKP (TK/0 hingga K/3) ditempatkan pada bilah kontrol utama.
- Menyinkronkan perhitungan gaji saat ini (*Existing*) dan seluruh skenario penawaran baru (*Offering*) secara *real-time*.
- Menampilkan kategori TER dinamis (A, B, C) dan tarif efektif secara otomatis.

### 2. Komparasi Side-by-Side Interaktif
- Perbandingan langsung antara gaji saat ini vs penawaran baru dalam bahasa desain buku besar gaji (`Lombard Paper` / `Obsidian Ledger`).
- Dukungan **Multiple Offerings** (tambah hingga 4 skenario penawaran, ubah nama skenario, dan hapus per tab).
- Tiket putusan eksekutif untuk kenaikan bulanan (*Delta Net THP*), rasio retensi bersih vs potongan Pajak & BPJS, dan akumulasi tahunan.
- Penanda eksplisit saat menggunakan data simulasi contoh bawaan serta *Empty State* terpandu saat form dikosongkan ke Rp 0.
- Metode pemajakan fleksibel: **Gross**, **Gross-Up**, atau **Nett**.

### 3. Rincian Detail Komparasi (Audit Matrix)
- Tampilan terpisah antara:
  - **Arus Kas Bulanan (Rutin)**: Rincian Gaji Pokok, Tunjangan Tetap, PPh 21 TER, BPJS Kesehatan, BPJS TK, dan Net THP masuk rekening.
  - **Proyeksi Akumulasi Tahunan**: Paket tahunan (12x, 13x THR, 14x, 15x), Tunjangan Tidak Tetap/Bonus, PPh 21 Pasal 17 progresif, dan kontribusi BPJS perusahaan.
- Tab selector: **Bulanan**, **Tahunan**, atau **Semua (Lengkap)**.
- Angka *tabular figures* (`tabular-nums`) terpadu pada `Plus Jakarta Sans` untuk perataan kolom keuangan yang konsisten.

### 4. Modal Alat Negosiasi & Target Gaji
- **Mode Persentase (+%)**: Tombol preset cepat (+15%, +20%, +25%, +30%, +50%) dan slider interaktif target kenaikan (0% - 100%).
- **Mode Reverse (Target Net -> Gross)**: Masukkan ekspektasi Take Home Pay bersih yang diinginkan, sistem menghitung mundur Gaji Pokok Gross yang harus diminta ke HR.
- Mendukung penutupan via tombol `Escape`, navigasi keyboard `Tab` terperangkap di dalam dialog, dan pengembalian fokus otomatis.

### 5. Modal Simulasi Slip THR & Bulan Desember
- **Simulasi Slip Bulan THR**: Mensimulasikan lonjakan tarif TER bulanan ketika menerima gaji pokok + THR sekaligus dalam 1 bulan kalender.
- **Simulasi Slip Bulan Desember (True-Up)**: Menghitung penyesuaian pajak akhir tahun dengan rumus PPh 21 Pasal 17 setahun dikurangi kredit pajak TER Jan-Nov.

### 6. Tema Ganda (Terang & Gelap) + Bilingual (ID & EN) + Aksesibilitas
- **Toggle Tema Terang / Gelap**: Pilihan tampilan *Lombard Paper* (terang) dan *Obsidian Ledger* (gelap) dengan kontras terverifikasi WCAG AA dan tersimpan di `localStorage`.
- **Toggle Bahasa ID / EN**: Penerjemahan penuh di seluruh antarmuka dan teks salinan ringkasan, tersimpan di `localStorage`.
- **Aksesibilitas Keyboard & Mobile**: Target sentuh tombol minimal `44px`, `<label>` tertaut pada seluruh input, kontrol native `<button>`, dan *Error State* yang jelas bila izin clipboard ditolak browser.

### 7. Fitur Reset & Mode Privasi
- **Global Reset Modal**: Memilih antara mengosongkan seluruh angka ke Rp 0 atau mengembalikan data simulasi contoh bawaan.
- **Mode Privasi (Sensor Angka & Intip Ketuk)**: Mengaburkan seluruh nominal rupiah dan input, dilengkapi tombol ketuk *Intip Angka (8 dtk)* untuk layar sentuh serta pengintipan sementara saat hover/fokus.
- **100% Client-Side & Security Headers**: Seluruh kalkulasi berjalan di browser tanpa transmisi data ke server, dilengkapi CSP ketat (`script-src 'self'`) pada [`nginx.conf`](nginx.conf), [`security-headers.conf`](security-headers.conf), dan [`public/_headers`](public/_headers).
- **Layout Responsif 3-Status & PWA Offline**: Header 1 baris ringkas di ponsel (`< 768px`), komparasi 2 kolom berdampingan mulai tablet (`768px+`), dock bawah 4 aksi cepat (*Negosiasi*, *Slip THR*, *Salin*, *Privasi*) + dialog Opsi/PDF/Reset di ponsel, skala fluida `clamp()`, unit `dvh`, cetak PDF bersih (`@media print`), serta Service Worker (`salary-calc-v15`) untuk akses offline.

---

## Tech Stack

- **Frontend Core**: [React 18](https://react.dev/), [Vite 6](https://vite.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment & Server**: Multi-stage Non-Root [Docker](https://www.docker.com/) (Node.js Alpine builder + Nginx Alpine) & Cloudflare Edge
- **Container Port**: `3000`
- **Live Domain**: `https://gaji.ritonga.ai.id`

---

## Menjalankan dengan Docker

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

## Menjalankan Secara Lokal (Development)

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

## Lisensi

Proyek ini dilisensikan di bawah lisensi **MIT** - lihat berkas [LICENSE](LICENSE) untuk detail.

Dibuat oleh [Ando Ritonga](https://github.com/andoritonga).
