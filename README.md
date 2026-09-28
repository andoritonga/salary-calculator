# 💰 Kalkulator Gaji & Offering (PPh 21 TER + BPJS)

Aplikasi web modern untuk menghitung gaji bersih (*Take Home Pay* / THP), estimasi kenaikan negosiasi offering, dan perbandingan komparasi *side-by-side* antara gaji saat ini vs penawaran baru secara akurat.

Sistem perhitungan mengacu pada regulasi perpajakan Indonesia terbaru:
- **PP No. 58 Tahun 2023** & **PMK No. 168 Tahun 2023** (PPh 21 Skema Tarif Efektif Rata-Rata / TER: Kategori A, B, dan C).
- **BPJS Kesehatan**: 1% pekerja, 4% pemberi kerja dengan batas plafon gaji Rp 12.000.000.
- **BPJS Ketenagakerjaan**:
  - JHT (Jaminan Hari Tua): 2% pekerja, 3.7% pemberi kerja.
  - JP (Jaminan Pensiun): 1% pekerja, 2% pemberi kerja dengan batas plafon gaji.
  - JKK & JKM: Beban pemberi kerja (masuk dalam penambah bruto pajak sesuai regulasi).

---

## 🚀 Fitur Utama

1. **Gaji Existing**:
   - Input Gaji Pokok (Basic Salary), Tunjangan Tetap, dan Tunjangan Tidak Tetap.
   - Pilihan status PTKP (TK/0 s/d K/3) dengan penentuan otomatis Kategori TER (A, B, atau C).
   - Kalkulasi otomatis PPh 21 bulanan dan potongan BPJS.
2. **Ekspektasi Negosiasi**:
   - Quick preset buttons (+10%, +15%, +20%, +25%, +30%, +40%, +50%).
   - Interactive slider persentase target kenaikan (0% s/d 100%).
   - Tombol instan untuk menerapkan hasil target ekspektasi langsung ke kolom Offering.
3. **Tawaran Gaji Baru (Offering)**:
   - Form input penawaran perusahaan baru.
   - Perhitungan langsung potongan dan estimasi Take Home Pay (THP) baru.
4. **Komparasi Side-by-Side**:
   - Delta Net THP nominal (+Rp/bln) dan persentase (+%).
   - Proyeksi total kenaikan tahunan (12x, 13x THR, 14x, atau 15x).
   - Tabel rincian komparasi tiap komponen (Basic, Tunjangan, Pajak, BPJS Pekerja & Perusahaan).
   - Tombol *Copy Summary* untuk menyalin ringkasan negosiasi ke clipboard.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/), [Vite 6](https://vite.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **Server / Container**: Multi-stage [Docker](https://www.docker.com/) (Node.js Build + Nginx Alpine)
- **Port**: `3000`

---

## 📦 Menjalankan dengan Docker

### 1. Menggunakan Docker Compose (Direkomendasikan)

```bash
docker compose up -d --build
```

Aplikasi akan berjalan di: `http://localhost:3000`

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

Pastikan sudah menginstal Node.js (v18+):

```bash
# Install dependencies
npm install

# Jalankan server development Vite
npm run dev
```

Buka browser di `http://localhost:3000`.

Untuk membangun bundle produksi:
```bash
npm run build
```

---

## 📄 Lisensi

MIT License © 2026 [Ando Ritonga](https://github.com/andoritonga)
