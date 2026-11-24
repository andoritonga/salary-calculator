# DESIGN.md - Kalkulator Gaji & Offering (`salary-calculator`)

## Design Read

Reading this as: Indonesian compensation & PPh 21 negotiation workbench for salaried professionals evaluating job offers, in an editorial payroll-ledger (Lombard Paper & Obsidian Ledger) visual language, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

## Three Dials

| Dial | Nilai | Penjelasan Satu Baris |
|---|---|---|
| **ENERGY** | **2** (Balanced) | Tegas di angka putusan (selisih Net THP dan tombol terapkan target), tenang di area formulir serta tabel rincian agar fokus pada perbandingan finansial. |
| **RHYTHM** | **2** (Consistent with breaks) | Komposisi bervariasi terarah antara tiket putusan eksekutif, bilah parameter horizontal, dua lembar kerja berdampingan, dan matriks audit penuh. |
| **MOTION** | **1** (Hover & state feedback only) | Tanpa animasi masuk kartu atau loop berkelanjutan; transisi interaksi 150ms berhenti total saat `prefers-reduced-motion: reduce`. |

## Alasan Keputusan Desain Satu Baris (R-31)

- **Mengapa Tema Ganda (`Lombard Paper` terang bawaan & `Obsidian Ledger` gelap):** Pekerja meninjau tawaran gaji di meja kerja pada siang hari sekaligus di ponsel saat malam, sehingga tema kertas terang bawaan dan tema gelap sama-sama fungsional (`R-21`, `R-34`).
- **Mengapa Palet `2-3 Inti + 1 Aksen`:** Menggunakan netral batu tulis (`slate` terang/gelap) sebagai kanvas ledger, satu aksen tunggal zamrud (`emerald`) khusus untuk kenaikan THP dan CTA terapkan target, serta satu warna semantik mawar (`rose`) khusus untuk potongan pajak/BPJS dan nilai negatif (`R-29`).
- **Mengapa Tipografi `Plus Jakarta Sans` dengan `tabular-nums`:** Satu keluarga sans-serif geometris dengan angka tabular menjaga perataan ribuan dan jutaan rupiah tetap lurus di setiap kolom tanpa mencampur font monospasi sistem (`R-06`).
- **Mengapa Motif Identitas Lembar Slip Gaji Indonesia:** Garis putus-putus perforasi antara bruto dan potongan, garis ganda akuntansi pada total akhir *Net Take Home Pay*, dan cap regulasi `PP 58/2023 • PMK 168/2023 • UU HPP Ps. 17` mengikat antarmuka langsung pada konteks slip gaji dan pajak Indonesia (`R-20`).
- **Mengapa Tata Letak Berbasis Keputusan (`C-3`):** Tiket putusan kenaikan bulanan dan tahunan ditempatkan sebagai titik fokus utama di bagian paling atas, diikuti kontrol skenario & PTKP, lembar input berdampingan, lalu tabel audit bulanan/tahunan (`R-05`).
- **Mengapa Batas Dosis Teknik (`R-01`, `R-04`, `R-09`, `R-10`, `R-12`, `R-19`):** Nol orb gradasi latar dan nol gradasi modal; `backdrop-filter: blur` hanya pada 1 elemen (bilah `<header>` lengket) agar angka tidak bertabrakan saat digulir; bayangan hanya pada lembar penawaran aktif dan dialog modal; badge dan ikon hanya dipakai bila membawa arti fungsional langsung.
- **Mengapa Kontras & Aksesibilitas Ketat (`R-03`, `R-25`, `R-32`, `R-39`):** Seluruh teks minimal rasio WCAG AA `4.5:1`, seluruh kontrol dan input minimal `44px`, seluruh tab dan pemilih memakai elemen `<button>` native, modal mendukung `Escape` dan perangkap fokus, dan seluruh form memiliki `<label>` tertaut.
