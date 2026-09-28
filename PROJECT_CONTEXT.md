# Proyek: Kalkulator Gaji & Offering (Docker Web App)

Saya sedang membangun web app kalkulator gaji dan negosiasi berbasis Vite + React + Tailwind + Nginx Alpine yang berjalan di Docker MacBook (port 3000).

### Fitur & Struktur:
1. **Gaji Existing**: Basic salary, tunjangan tetap/lainnya, kalkulasi PPh 21 TER (PMK 168), BPJS Ketenagakerjaan & Kesehatan (dengan batas plafon).
2. **Ekspektasi Negosiasi**: Slider/tombol persentase (+15%, +20%, dst.) yang otomatis menghitung target gross & net THP.
3. **Tawaran Gaji (Offering)**: Input tawaran dari perusahaan baru untuk komparasi langsung side-by-side.

### Status Terakhir:
Kode frontend utama ada di `src/App.jsx`, sudah dikonfigurasi Dockerfile multi-stage dan docker-compose.yml.
