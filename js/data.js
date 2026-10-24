// Data simulasi kelompok. Referensi kriteria dan pola data: lihat DATA.referensi.
// Elemen kriteria: [nama, bobot%, jenis, keterangan]. Keterangan: d=arti, a=alasan arah, s=sumber data,
// i=cara mengisi (angka asli), k=skala skor [[skor,arti,detail]], u=catatan skala,
// m=syarat (benefit: nilai harus >= m / minimum; cost: nilai harus <= m / maksimum; tanpa m = tidak ada syarat), cur=nilai berupa rupiah.
const DATA={
  referensi:"Mayasari dan Dari (2025), Jurnal Polygon 3(4):101-113",
  kelompok:["Christian Natanael","Muhammad Naufal","Agnes Putri","Desputri Lase","Monika Gulo","Alexander Laia"],
  names:["Christian Natanael","Muhammad Naufal","Agnes Putri","Desputri Lase","Monika Gulo"],
  C:[
    ["IPK",25,"benefit",{m:2.5,d:"Indeks Prestasi Kumulatif: rata-rata nilai akademik sejak semester pertama sampai terakhir, skala 0–4.",a:"IPK yang lebih tinggi menunjukkan prestasi akademik yang lebih baik, sehingga nilai terbesar dianggap terbaik.",s:"Transkrip nilai atau KHS terakhir.",i:"Isi dengan angka IPK asli, misalnya 3,25. Tidak diberi skor."}],
    ["Penghasilan orang tua (Rp/bln)",20,"cost",{cur:1,d:"Total penghasilan orang tua dalam satu bulan, dalam rupiah.",a:"Penghasilan yang lebih rendah berarti mahasiswa lebih membutuhkan bantuan, sehingga nilai terkecil dianggap terbaik.",s:"Surat keterangan penghasilan atau slip gaji.",i:"Isi dengan rupiah per bulan, misalnya 2500000. Tidak diberi skor."}],
    ["Jumlah tanggungan",15,"benefit",{d:"Total anggota keluarga yang menjadi tanggungan finansial orang tua.",a:"Semakin banyak tanggungan, semakin besar beban keluarga, sehingga nilai terbesar dianggap terbaik.",s:"Kartu Keluarga atau surat keterangan.",i:"Isi dengan jumlah orang, misalnya 3. Tidak diberi skor karena sudah berupa angka; rumus SAW (x ÷ max) yang menyetarakannya."}],
    ["Prestasi (skor 1-5)",20,"benefit",{d:"Tingkat prestasi non-akademik tertinggi yang pernah diraih mahasiswa (kejuaraan atau penghargaan).",a:"Tingkat prestasi yang lebih tinggi bernilai lebih baik, sehingga skor terbesar dianggap terbaik.",s:"Sertifikat atau piagam penghargaan.",k:[[0,"Tidak ada prestasi"],[1,"Tingkat kabupaten/kota"],[2,"Tingkat provinsi"],[3,"Tingkat nasional"],[5,"Tingkat internasional"]],u:"Skor 4 tidak dipakai karena skala mengikuti referensi yang melompat dari 3 ke 5. Kelompok boleh menetapkan skala sendiri asalkan berurutan dari rendah ke tinggi dan dituliskan di laporan."}],
    ["Jarak rumah (km)",10,"cost",{d:"Jarak tempat tinggal mahasiswa ke kampus dalam kilometer.",a:"Pada pengaturan saat ini jarak yang lebih dekat dianggap lebih baik (cost), mengikuti referensi data kelompok. Referensi lain memprioritaskan jarak yang lebih jauh karena biaya hidup lebih besar; arah ini bisa diubah pada kolom Jenis di atas.",s:"Alamat tinggal mahasiswa.",i:"Isi dengan kilometer, misalnya 25. Tidak diberi skor."}],
    ["Status kuliah (1-4)",10,"benefit",{d:"Tingkat keaktifan mahasiswa dalam menjalani perkuliahan.",a:"Mahasiswa yang lebih aktif dianggap lebih layak, sehingga skor terbesar dianggap terbaik.",s:"Data akademik (kehadiran, KRS).",k:[[1,"Kurang aktif","kehadiran di bawah 70%"],[2,"Cukup aktif","kehadiran 70–79%"],[3,"Aktif","kehadiran 80–89%"],[4,"Sangat aktif","kehadiran 90% atau lebih"]],u:"Batas kehadiran pada tabel adalah usulan definisi untuk kelompok (bukan dari referensi); sesuaikan dan tuliskan di laporan."}]
  ],
  V:[[3.45,2000000,3,2,25,3],[3.8,2800000,2,3,12,4],[3.1,1200000,4,1,40,3],[2.35,1800000,3,1,30,2],[3.65,4500000,2,5,8,4]]
};
