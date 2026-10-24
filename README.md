# SPK Seleksi Penerima Beasiswa (SAW)

Cara menjalankan: buka `dashboard.html` (atau `index.html`) di browser. Tidak perlu server atau instalasi.

Struktur folder:
- `dashboard.html`, `kriteria.html`, `alternatif.html`, `penilaian.html`, `perhitungan.html`, `hasil.html`, `validasi.html`, `profil.html`: satu file per halaman
- `css/style.css`: seluruh tampilan dan animasi
- `js/data.js`: data simulasi kelompok dan referensi
- `js/saw.js`: perhitungan SAW, skenario bobot, dan penyimpanan otomatis (localStorage)
- `js/export.js`: export Excel dengan rumus aktif (butuh internet untuk memuat ExcelJS dari CDN)
- `js/ui.js`, `js/pages.js`: kerangka halaman dan isi tiap halaman

Syarat: di Data Kriteria tiap kriteria punya kolom Syarat Minimum / Maksimum. Benefit: syarat minimum (nilai harus >= batas). Cost: syarat maksimum (nilai harus <= batas). Kosong = tanpa syarat. Alternatif yang tidak lolos tidak ikut normalisasi dan ranking (nilai max/min hanya dari yang lolos). Bawaan: IPK minimal 2,5 dan penghasilan orang tua maksimal Rp 3.000.000.

Mode terang/gelap: tombol matahari/bulan di bar atas, di samping tulisan ADMIN. Pilihan tersimpan di browser.

Data yang diubah di browser tersimpan otomatis. Tombol "Kembalikan data awal" mengembalikan data awal.

File Excel hasil export: ubah sel kuning di sheet Data, semua sheet menghitung ulang.
