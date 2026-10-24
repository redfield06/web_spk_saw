// Isi tiap halaman. Halaman dipilih dari atribut data-page pada <body>.
const PAL=["#7c3aed","#a78bfa","#ec4899","#14b8a6","#f59e0b","#3b82f6","#ef4444","#64748b"];
const head=(t,i)=>`<h1>${ic(i,26)} ${t}</h1>`;
const none=(t,i)=>head(t,i)+`<div class="card">Belum ada data.</div>`;
const totTxt=()=>{const t=tot();return `Total bobot: ${f(t,2)}% `+(Math.abs(t-100)<1e-9?`<span class="ok">(sesuai)</span>`:`<span class="bad">(harus 100%, selisih ${f(t-100,2)}%)</span>`)};
const gt=(fn,foot)=>`<div class="w"><table><thead><tr><th rowspan="2">No</th><th rowspan="2">Kode</th><th rowspan="2" class="l">Nama alternatif</th><th colspan="${S.C.length}">Kriteria</th></tr><tr>${S.C.map(c=>`<th>${esc(c.n)}</th>`).join("")}</tr></thead><tbody>${S.A.map((a,i)=>`<tr><td>${i+1}</td><td>${code(i)}</td><td class="l">${esc(a.n)}</td>${S.C.map((c,j)=>`<td>${fn(i,j)}</td>`).join("")}</tr>`).join("")}</tbody>${foot?`<tfoot>${foot}</tfoot>`:""}</table></div>`;
function eligTbl(){
  const m=comp(),C=S.C,A=S.A;
  const act=C.map((c,j)=>hasM(c)?`C${j+1} ${esc(c.n)} ${syT(c)}`:"").filter(Boolean);
  const info=act.length?`Syarat aktif: ${act.join("; ")}.`:"Belum ada syarat minimum yang diisi, sehingga semua alternatif diikutkan.";
  const rows=A.map((a,i)=>`<tr><td>${code(i)}</td><td class="l">${esc(a.n)}</td><td class="${m.ok[i]?"ok":"bad"}">${m.ok[i]?"Lolos":"Tidak lolos"}</td><td class="l">${m.ok[i]?"Memenuhi semua syarat":m.why[i].map(j=>`C${j+1} ${esc(C[j].n)}: ${fv(C[j],A[i].v[j])} (syarat ${syT(C[j])})`).join("; ")}</td></tr>`).join("");
  return `<p class="mut">${info}</p><div class="w"><table><thead><tr><th>Kode</th><th class="l">Nama alternatif</th><th>Status</th><th class="l">Keterangan</th></tr></thead><tbody>${rows}</tbody></table></div><div class="nt">Lolos syarat minimum: <b>${m.E.length} dari ${A.length}</b> alternatif. Hanya yang lolos yang dinormalisasi dan diranking.</div>`;
}
const noEl=(t,i)=>head(t,i)+`<div class="card"><h2>Seleksi Syarat Minimum</h2><div id="elig">${eligTbl()}</div></div><div class="card bad">Tidak ada alternatif yang memenuhi syarat minimum, sehingga belum ada yang bisa dinormalisasi dan diranking. Ubah syarat di Data Kriteria atau nilai di Data Penilaian.</div>`;
const stat=(c,i,l,v)=>`<div class="sc ${c}">${ic(i,40)}<small>${l}</small>${v}</div>`;
const ipt=(c,h)=>c.cur?`<span class="ip"><b>Rp</b>${h}</span>`:h;
const skalaTbl=k=>`<table class="mini"><thead><tr><th>Skor</th><th class="l">Definisi</th></tr></thead><tbody>${k.map(x=>`<tr><td><b>${x[0]}</b></td><td class="l">${esc(x[1])}${x[2]?` <span class="mut2">– ${esc(x[2])}</span>`:""}</td></tr>`).join("")}</tbody></table>`;
const tagc=c=>`<em class="tg ${c.t=="benefit"?"b":"c"}">${c.t}</em>`;
function ketCards(){
  const cards=S.C.map((c,j)=>{
    const body=c.d?`<p><b>Definisi:</b> ${esc(c.d)}</p><p><b>Arah (${c.t}):</b> ${esc(c.a)}</p><p><b>Sumber data:</b> ${esc(c.s)}</p><p><b>${c.t=="benefit"?"Syarat minimum":"Syarat maksimum"}:</b> ${hasM(c)?`nilai harus ${syT(c)}`:"tidak ada"}</p>`+(c.k?`<p><b>Cara memberi skor:</b></p>${skalaTbl(c.k)}<p class="mut" style="margin:8px 0 0">${esc(c.u||"")}</p>`:`<p><b>Cara mengisi:</b> ${esc(c.i)}</p>`):`<p class="mut">Kriteria tambahan atau yang namanya diubah. Jelaskan arti, arah, sumber data, dan skalanya di laporan.</p>`;
    return `<div class="kc"><div class="kh"><span class="rkb">C${j+1}</span><b>${esc(c.n)}</b>${tagc(c)}<span class="wt">${num(c.w)}%</span></div>${body}</div>`}).join("");
  return `<div class="card"><h2>Keterangan kriteria dan skor</h2><p class="mut">Definisi tiap kriteria, alasan arah benefit atau cost, sumber data, dan cara mengisinya.</p><div class="kg">${cards}</div></div><div class="card"><h2>Mengapa ada kriteria berskor dan ada yang tidak?</h2><div class="nt" style="margin-top:0"><b>Angka asli</b> (IPK, penghasilan, tanggungan, jarak): datanya sudah berupa bilangan yang bermakna, jadi dipakai langsung. Rumus SAW membagi dengan nilai terbesar (benefit) atau terkecil (cost), sehingga satuan yang berbeda (rupiah, km, orang) menjadi setara pada skala 0–1. Contoh tanggungan: nilai 3 dari maksimum 5 menjadi r = 3 ÷ 5 = 0,6, tanpa perlu skor.<br><b>Skor</b> (prestasi dan status kuliah): datanya berupa kategori seperti “tingkat provinsi” atau “cukup aktif” yang tidak punya angka alami, jadi diubah menjadi skor berurutan; skor lebih tinggi berarti lebih baik.<br><b>Aturan skor:</b> harus berurutan dari rendah ke tinggi dan didefinisikan jelas agar siapa pun yang menilai memberi skor yang sama. Pemilihan kode memengaruhi hasil: jika satu tingkat prestasi diberi skor lebih besar, nilai r prestasi semua alternatif ikut berubah.</div></div>`;
}
function skorLegend(){
  const sk=S.C.map((c,j)=>c.k?`<div class="kc"><div class="kh"><span class="rkb">C${j+1}</span><b>${esc(c.n)}</b></div>${skalaTbl(c.k)}</div>`:"").join("");
  const raw=S.C.map((c,j)=>c.d&&!c.k?`C${j+1} ${esc(c.n)}`:"").filter(Boolean);
  return `<div class="card"><h2>Panduan pengisian nilai</h2><p class="mut">Kriteria berskor diisi dengan skor sesuai tabel.${raw.length?` Kriteria berikut diisi dengan angka asli: ${raw.join("; ")}.`:""} Penjelasan lengkap ada di menu Data Kriteria.</p><div class="kg">${sk}</div></div>`;
}
const PAGES={
dashboard(){
  const al=`<div class="al" id="al"><span>Selamat datang <b>ADMIN</b>! Kelola data kriteria, alternatif, dan penilaian lewat menu, lalu lihat ranking SAW di Data Hasil Akhir.</span><button data-x aria-label="Tutup">${ic("x",16)}</button></div>`;
  if(empty())return head("Dashboard","home")+al+`<div class="card">Belum ada data.</div>`;
  if(noElig())return head("Dashboard","home")+al+`<div class="card bad">Tidak ada alternatif yang memenuhi syarat minimum. Buka Data Kriteria atau Data Penilaian untuk menyesuaikan.</div>`;
  const m=comp(),A=S.A,C=S.C,b=m.ord[0],mxv=Math.max(...m.V)||1;
  const st=`<div class="st">${stat("c1","users","Alternatif",`<strong data-count="${A.length}">0</strong>`)}${stat("c2","box","Kriteria",`<strong data-count="${C.length}">0</strong>`)}${stat("c3","calc","Total bobot",`<strong data-count="${tot()}" data-sfx="%">0</strong>`)}${stat("c4","trophy","Peringkat 1",`<strong class="sm">${esc(A[b].n)}</strong>`)}</div>`;
  const bars=m.ord.map((i,k)=>`<div class="bar${k==0?" f":""}"><span title="${esc(A[i].n)}">${esc(A[i].n)}</span><div class="tr"><i style="--w:${m.V[i]/mxv*100}%"></i></div><b>${f(m.V[i],3)}</b></div>`).join("");
  const seg=C.map((c,j)=>`<i style="--w:${c.w/(tot()||1)*100}%;background:${PAL[j%8]}" title="${esc(c.n)}"></i>`).join("");
  const lg=C.map((c,j)=>`<span><i style="background:${PAL[j%8]}"></i>${esc(c.n)} ${num(c.w)}% (${c.t})</span>`).join("");
  const mi=[["kriteria","Data Kriteria",C.length+" kriteria","#14b8a6","box"],["alternatif","Data Alternatif",A.length+" mahasiswa","#6366f1","users"],["penilaian","Data Penilaian","Matriks keputusan","#10b981","edit"],["perhitungan","Data Perhitungan","Normalisasi dan nilai V","#f59e0b","calc"],["hasil","Data Hasil Akhir","Ranking dan rekomendasi","#ef4444","chart"],["validasi","Data Validasi","Cocokkan dengan sumber","#8b5cf6","shield"]].map(x=>`<a class="mi" href="${x[0]}.html" style="--k:${x[3]}"><div><b>${x[1]}</b><small>${x[2]}</small></div>${ic(x[4],34)}</a>`).join("");
  return head("Dashboard","home")+al+st+`<div class="g2"><div class="card"><h2>Ranking nilai preferensi (V)</h2><p class="mut">Semakin panjang batang, semakin layak. Lolos syarat minimum: ${m.E.length} dari ${A.length} alternatif.</p>${bars}</div><div class="card"><h2>Komposisi bobot kriteria</h2><p class="mut">Total ${f(tot(),0)}%</p><div class="stk">${seg}</div><div class="lg">${lg}</div></div></div><div class="mc">${mi}</div>`;
},
kriteria(){return head("Data Kriteria","box")+`<div class="card"><h2>Kriteria dan bobot</h2><p class="mut">Benefit: semakin besar semakin baik. Cost: semakin kecil semakin baik. Perubahan tersimpan otomatis.</p><div class="nt" style="margin:0 0 14px"><b>Syarat:</b> alternatif yang tidak memenuhi salah satu syarat dinyatakan <b>tidak lolos</b> dan tidak diikutkan dalam normalisasi maupun ranking. Kriteria <b>benefit</b> memakai <b>syarat minimum</b> (nilai harus ≥ batas, contoh IPK minimal 2,5). Kriteria <b>cost</b> memakai <b>syarat maksimum</b> (nilai harus ≤ batas). Kosongkan kolom jika kriteria itu tanpa syarat.</div><div class="w"><table><thead><tr><th>Kode</th><th class="l">Nama kriteria</th><th>Bobot (%)</th><th>Jenis</th><th>Syarat Minimum / Maksimum</th><th>Aksi</th></tr></thead><tbody>${S.C.map((c,j)=>`<tr><td>C${j+1}</td><td class="l"><input type="text" value="${esc(c.n)}" data-c="${j}" data-k="n"></td><td><input type="number" min="0" max="100" step="any" value="${c.w}" data-c="${j}" data-k="w"></td><td><select data-c="${j}" data-k="t"><option value="benefit"${c.t=="benefit"?" selected":""}>Benefit</option><option value="cost"${c.t=="cost"?" selected":""}>Cost</option></select></td><td><span class="sy" id="sy${j}">${syLbl(c)}</span> ${ipt(c,`<input type="number" step="any" placeholder="tanpa syarat" value="${hasM(c)?c.m:""}" data-c="${j}" data-k="m">`)}</td><td><button class="db" data-dc="${j}">Hapus</button></td></tr>`).join("")}</tbody></table></div><div class="nt" id="tot">${totTxt()}</div><div class="acts"><button class="pb" id="addc">Tambah kriteria</button><button class="gb" id="normw">Samakan total ke 100%</button><button class="gb" id="reset">Kembalikan data awal</button></div></div>`+ketCards()},
alternatif(){return head("Data Alternatif","users")+`<div class="card"><h2>Mahasiswa calon penerima</h2><p class="mut">Minimal 5 alternatif. Perubahan tersimpan otomatis.</p><div class="w"><table><thead><tr><th>No</th><th>Kode</th><th class="l">Nama alternatif</th><th>Aksi</th></tr></thead><tbody>${S.A.map((a,i)=>`<tr><td>${i+1}</td><td>${code(i)}</td><td class="l"><input type="text" value="${esc(a.n)}" data-a="${i}" data-k="n"></td><td><button class="db" data-del="${i}">Hapus</button></td></tr>`).join("")}</tbody></table></div><div class="acts"><button class="pb" id="add">Tambah alternatif</button><button class="gb" id="reset">Kembalikan data awal</button></div></div>`},
penilaian(){if(empty())return none("Data Penilaian","edit");return head("Data Penilaian","edit")+`<div class="card"><h2>Matriks keputusan</h2><p class="mut">Ubah angka langsung di tabel. Sel berwarna merah tidak memenuhi syarat minimum/maksimum; status seleksi ada di Data Perhitungan. Hasil dihitung ulang di Data Perhitungan.</p>${gt((i,j)=>`${ipt(S.C[j],`<input type="number" step="any" value="${S.A[i].v[j]}" data-a="${i}" data-j="${j}"${pass(S.C[j],+S.A[i].v[j]||0)?"":` class="fl"`}>`)}`)}</div>`+skorLegend()},
perhitungan(){
  if(empty())return none("Data Perhitungan","calc");
  const m=comp(),C=S.C,A=S.A;
  if(!m.ord.length)return noEl("Data Perhitungan","calc");
  const f1=`<tr><td colspan="3" class="l">Bobot (%)</td>${C.map(c=>`<td>${num(c.w)}</td>`).join("")}</tr><tr><td colspan="3" class="l">Jenis</td>${C.map(c=>`<td>${c.t}</td>`).join("")}</tr>`;
  const f2=`<tr><td colspan="3" class="l">Pembagi (dari yang lolos)</td>${C.map((c,j)=>`<td>${c.t=="benefit"?"max "+fv(c,m.mx[j]):"min "+fv(c,m.mn[j])}</td>`).join("")}</tr>`;
  const pv=`<div class="w"><table><thead><tr><th>Kode</th><th class="l">Nama alternatif</th><th>Nilai V</th><th>Peringkat</th></tr></thead><tbody>${A.map((a,i)=>`<tr><td>${code(i)}</td><td class="l">${esc(a.n)}</td><td>${m.ok[i]?f(m.V[i]):"–"}</td><td>${m.ok[i]?m.rk[i]:"Tidak lolos"}</td></tr>`).join("")}</tbody></table></div>`;
  const acc=m.ord.map((i,k)=>{
    const ln=C.map((c,j)=>{const x=+A[i].v[j]||0,b=c.t=="benefit";return `<div class="ln"><span class="cr">C${j+1} · ${esc(c.n)}<em class="tg ${b?"b":"c"}">${c.t}</em></span><span><i>r</i> = ${b?`<i>x</i> ÷ <i>max</i> = ${fv(c,x)} ÷ ${fv(c,m.mx[j])}`:`<i>min</i> ÷ <i>x</i> = ${fv(c,m.mn[j])} ÷ ${fv(c,x)}`} = <b>${f(m.R[i][j])}</b></span></div>`}).join("");
    const t1=C.map((c,j)=>`(${f(c.w/100,2)} × ${f(m.R[i][j])})`).join(" + "),t2=C.map((c,j)=>f(c.w/100*m.R[i][j])).join(" + ");
    return `<details class="acc"${k==0?" open":""}><summary><span class="rkb">${k+1}</span><span>${esc(A[i].n)} (${code(i)})</span><b class="v">V = ${f(m.V[i])}</b></summary><div class="bd"><div class="stp"><span class="chip">Langkah 1</span>Normalisasi nilai (r)</div><div class="fx">${ln}</div><div class="stp"><span class="chip">Langkah 2</span>Nilai preferensi (V)</div><div class="fx"><div><i>V</i> = Σ ( bobot × <i>r</i> )</div><div><i>V</i> = ${t1}</div><div><i>V</i> = ${t2}</div><div class="res"><i>V</i> = ${f(m.V[i])}</div></div></div></details>`}).join("");
  return head("Data Perhitungan","calc")+`<div class="card"><h3 style="margin-top:0">Seleksi Syarat Minimum</h3>${eligTbl()}<h3>Nilai awal alternatif</h3>${gt((i,j)=>fv(C[j],A[i].v[j]),f1)}<h3>Nilai normalisasi (r)</h3><p class="mut">Benefit: x ÷ max. Cost: min ÷ x. Nilai max dan min hanya dihitung dari alternatif yang lolos syarat minimum.</p>${gt((i,j)=>m.ok[i]?f(m.R[i][j]):"–",f2)}<h3>Nilai preferensi (V)</h3><p class="mut">V = jumlah (bobot × r).</p>${pv}</div><div class="card"><div class="rowh"><div><h2>Perhitungan manual semua peringkat</h2><p class="mut">Rumus dan hitungan tiap alternatif, diurutkan dari peringkat 1. Klik baris untuk membuka atau menutup.</p><div class="nt" style="margin:0 0 14px"><b>Catatan pembulatan:</b> angka ditampilkan dengan 4 desimal, sedangkan perhitungan memakai presisi penuh. Contoh: 0,20 × 0,153846… = 0,030769… ditampilkan 0,0308, dan 0,20 × 0,1538 di kalkulator = 0,03076 yang juga dibulatkan menjadi 0,0308. Hitungan ulang dengan angka yang sudah dibulatkan bisa berbeda di desimal ke-5.</div></div><div class="acts"><button class="gb" data-all="1">Buka semua</button><button class="gb" data-all="0">Tutup semua</button></div></div>${acc}</div>`;
},
hasil(){
  if(empty())return none("Data Hasil Akhir","chart");
  if(noElig())return noEl("Data Hasil Akhir","chart");
  const m=comp(),A=S.A,C=S.C,b=m.ord[0],mxv=Math.max(...m.V)||1,sc=scenarios(),stab=sc.filter(s=>s.m.ord[0]==b).length,s2=m.ord[1];
  const rec=`<div class="card rec"><h2>Rekomendasi: ${esc(A[b].n)} (${code(b)})</h2><p>Memperoleh nilai preferensi tertinggi, V = <b>${f(m.V[b],3)}</b>${s2!=null?`, unggul ${f(m.V[b]-m.V[s2],3)} dari peringkat 2 (${esc(A[s2].n)})`:""}. Peringkat 1 ini tidak berubah pada <b>${stab} dari ${sc.length}</b> skenario bobot (lihat Data Validasi).${m.E.length<A.length?` Alternatif yang tidak lolos syarat minimum (${A.length-m.E.length} dari ${A.length}) tidak ikut diranking.`:""}</p><div class="acts"><button class="xb" data-xl>${ic("down")}<span>Export Excel dengan rumus dan validasi</span></button></div></div>`;
  const pod=`<div class="pod">${m.ord.slice(0,3).map((i,r)=>`<div class="pc${r==0?" first":""}"><span class="pn">${r+1}</span><b>${esc(A[i].n)}</b><small>V = ${f(m.V[i])}</small><small>${r+1<m.ord.length?`unggul ${f(m.V[i]-m.V[m.ord[r+1]],3)} dari peringkat ${r+2}`:"peringkat terakhir"}</small></div>`).join("")}</div>`;
  const rows=m.ord.map((i,k)=>`<tr${k==0?` class="top"`:""}><td>${k+1}</td><td class="l">${esc(A[i].n)}</td><td>${f(m.V[i])}</td><td>${k==0?"–":f(m.V[m.ord[k-1]]-m.V[i],4)}</td><td style="min-width:160px"><div class="tr"><i style="--w:${m.V[i]/mxv*100}%;background:${k==0?"linear-gradient(90deg,#8b5cf6,#ec4899)":"#c4b5fd"}"></i></div></td></tr>`).join("");
  const lg=C.map((c,j)=>`<span><i style="background:${PAL[j%8]}"></i>${esc(c.n)}</span>`).join("");
  const cmp=m.ord.map(i=>`<div class="bar"><span title="${esc(A[i].n)}">${esc(A[i].n)}</span><div class="tr big"><div class="stk2" style="--w:${m.V[i]/mxv*100}%">${C.map((c,j)=>`<i style="--w:${(c.w/100*m.R[i][j])/(m.V[i]||1)*100}%;background:${PAL[j%8]}" title="${esc(c.n)}: ${f(c.w/100*m.R[i][j],3)}"></i>`).join("")}</div></div><b>${f(m.V[i],3)}</b></div>`).join("");
  const best=C.filter((c,j)=>m.R[b][j]>=0.99999).map(c=>c.n),low=C.map((c,j)=>({n:c.n,r:m.R[b][j]})).sort((p,q)=>p.r-q.r)[0];
  const ana=`<div class="nt" style="margin-top:0"><b>Keunggulan:</b> ${best.length?best.map(esc).join(", ")+" (nilai terbaik di antara semua alternatif)":"tidak ada kriteria dengan nilai terbaik mutlak"}.<br><b>Perlu diperhatikan:</b> ${esc(low.n)} adalah titik terlemah (r = ${f(low.r)}).<br><b>Stabilitas:</b> ${stab==sc.length?"peringkat 1 konsisten pada semua skenario bobot.":`peringkat 1 berubah pada ${sc.length-stab} skenario bobot, sehingga pemilihan bobot perlu dijelaskan dan disepakati.`}</div>`;
  return head("Data Hasil Akhir","chart")+rec+`<div class="card"><h2>Tiga teratas</h2><p class="mut">Calon penerima beasiswa berdasarkan nilai V.</p>${pod}</div><div class="card"><h2>Ranking akhir</h2><div class="w"><table><thead><tr><th>Peringkat</th><th class="l">Nama alternatif</th><th>Nilai V</th><th>Selisih ke peringkat di atasnya</th><th class="l">Skor</th></tr></thead><tbody>${rows}</tbody></table></div></div><div class="card"><h2>Dari mana skor berasal</h2><p class="mut">Panjang batang mengikuti nilai V, warna menunjukkan sumbangan tiap kriteria (arahkan kursor untuk nilainya).</p>${cmp}<div class="lg" style="margin-top:12px">${lg}</div></div><div class="card"><h2>Analisis peringkat 1</h2>${ana}</div>`+(m.E.length<A.length?`<div class="card"><h2>Tidak Lolos Syarat Minimum</h2><p class="mut">Alternatif berikut tidak diranking karena ada syarat yang tidak terpenuhi.</p>${eligTbl()}</div>`:"");
},
validasi(){
  if(empty())return none("Data Validasi","shield");
  const C=S.C,A=S.A,m=comp(),nv=naive(C,A),sc=scenarios(),stab=sc.filter(s=>s.m.ord[0]==m.ord[0]).length;
  const st=(g,t)=>`<td class="${g?"ok":"bad"}">${t}</td>`;
  if(!m.ord.length)return noEl("Data Validasi","shield");
  const chk=[["Jumlah alternatif minimal 5",A.length>=5,A.length+" alternatif"],["Jumlah kriteria minimal 4",C.length>=4,C.length+" kriteria"],["Total bobot 100%",Math.abs(tot()-100)<1e-9,f(tot(),2)+"%"],["Ada kriteria benefit dan cost",C.some(c=>c.t=="benefit")&&C.some(c=>c.t=="cost"),C.filter(c=>c.t=="benefit").length+" benefit, "+C.filter(c=>c.t=="cost").length+" cost"],["Ada alternatif yang lolos syarat minimum",m.E.length>=1,m.E.length+" dari "+A.length+" lolos"]];
  const tA=`<div class="w"><table><thead><tr><th class="l">Nama</th><th>V prototype</th><th>V hitungan terpisah</th><th>Selisih</th><th>Status</th></tr></thead><tbody>${A.map((a,i)=>{if(nv[i]===null)return `<tr><td class="l">${esc(a.n)}</td><td>–</td><td>–</td><td>–</td><td class="bad">Tidak lolos</td></tr>`;const d=m.V[i]-nv[i],g=Math.abs(d)<1e-9;return `<tr><td class="l">${esc(a.n)}</td><td>${f(m.V[i],5)}</td><td>${f(nv[i],5)}</td><td>${f(d,5)}</td>${st(g,g?"Cocok":"Selisih")}</tr>`}).join("")}</tbody></table></div>`;
  const R=m.E.flatMap(i=>m.R[i]),Ve=m.E.map(i=>m.V[i]),rmin=Math.min(...R),rmax=Math.max(...R),colMax=C.every((c,j)=>Math.abs(Math.max(...m.E.map(i=>m.R[i][j]))-1)<1e-9);
  const props=[["Semua nilai normalisasi r berada di 0–1",rmin>=0&&rmax<=1+1e-9,`${f(rmin)} s/d ${f(rmax)}`],["Setiap kriteria punya alternatif dengan r = 1",colMax,colMax?"ya":"tidak"],["Nilai V berada di 0–1",Math.min(...Ve)>=0&&Math.max(...Ve)<=1+1e-9,`${f(Math.min(...Ve))} s/d ${f(Math.max(...Ve))}`],["Tidak ada peringkat kembar",new Set(m.E.map(i=>m.rk[i])).size==m.E.length,new Set(m.E.map(i=>m.rk[i])).size+" dari "+m.E.length],["Urutan peringkat sesuai urutan nilai V",m.ord.every((i,r)=>r==0||m.V[m.ord[r-1]]>=m.V[i]-1e-12),"konsisten"]];
  const tE=`<div class="w"><table><thead><tr><th class="l">Skenario bobot</th>${m.ord.map((a,r)=>`<th>Peringkat ${r+1}</th>`).join("")}</tr></thead><tbody>${sc.map(s=>`<tr><td class="l">${s.label}</td>${s.m.ord.map((i,r)=>`<td${r==0?` class="ok"`:""}>${esc(A[i].n)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  return head("Data Validasi","shield")+
  `<div class="card"><h2>A. Cek syarat tugas dan syarat minimum</h2><div class="w"><table><thead><tr><th class="l">Syarat</th><th>Nilai</th><th>Status</th></tr></thead><tbody>${chk.map(x=>`<tr><td class="l">${x[0]}</td><td>${x[2]}</td>${st(x[1],x[1]?"Terpenuhi":"Belum")}</tr>`).join("")}</tbody></table></div><h3>Seleksi Syarat Minimum</h3>${eligTbl()}</div>`+
  `<div class="card"><h2>B. Konsistensi kode</h2><p class="mut">Nilai V prototype dibandingkan dengan fungsi hitung terpisah. Uji ini memeriksa konsistensi kode; validasi independen ada pada bagian D dan F.</p>${tA}</div>`+
  `<div class="card"><h2>C. Uji sifat metode SAW</h2><p class="mut">Sifat yang harus selalu terpenuhi oleh hasil SAW yang benar.</p><div class="w"><table><thead><tr><th class="l">Uji</th><th>Nilai</th><th>Status</th></tr></thead><tbody>${props.map(x=>`<tr><td class="l">${x[0]}</td><td>${x[2]}</td>${st(x[1],x[1]?"Terpenuhi":"Belum")}</tr>`).join("")}</tbody></table></div></div>`+
  `<div class="card"><h2>D. Validasi hitungan manual kelompok</h2><p class="mut">Hitung V satu alternatif dengan tangan atau kalkulator, lalu masukkan hasilnya. Selisih kurang dari 0,0005 dianggap cocok (menoleransi pembulatan desimal).</p><div class="mv"><select id="mv-sel">${m.E.map(i=>`<option value="${i}">${code(i)} – ${esc(A[i].n)}</option>`).join("")}</select><input type="text" id="mv-val" inputmode="decimal" placeholder="mis. 0,8308"></div><div class="nt" id="mv-out">Ketik V hasil hitungan manual Anda untuk dibandingkan dengan prototype.</div></div>`+
  `<div class="card"><h2>E. Uji sensitivitas bobot</h2><p class="mut">Apakah peringkat berubah bila bobot digeser? Peringkat 1 pada tiap skenario ditandai hijau.</p>${tE}<div class="nt">Peringkat 1 (${esc(A[m.ord[0]].n)}) sama pada <b>${stab} dari ${sc.length}</b> skenario. ${stab==sc.length?"Rekomendasi stabil terhadap perubahan bobot.":"Rekomendasi bergantung pada pilihan bobot, jadi alasan penentuan bobot perlu dijelaskan di laporan."}</div></div>`+
  `<div class="card"><h2>F. Validasi dengan Excel</h2><p class="mut">Unduh file Excel berisi data, normalisasi, nilai V, rumus dan hitungan tiap alternatif, serta sheet Validasi. Semua memakai rumus aktif: ubah sel kuning di sheet Data dan seluruh hitungan ikut berubah.</p><div class="acts" style="margin-top:0"><button class="xb" data-xl>${ic("down")}<span>Export Excel dengan rumus dan validasi</span></button></div></div>`;
},
profil(){
  const C=S.C,m=comp(),nb=C.filter(c=>c.t=="benefit").length,nc=C.length-nb;
  const lc1=t=>/^[A-Z]{2,}/.test(t)?t:t.charAt(0).toLowerCase()+t.slice(1);
  const sy=C.filter(hasM).map(c=>`${esc(lc1(c.n.replace(/\s*\(.*\)\s*$/,"")))} ${syT(c)}`);
  const row=(l,v)=>`<div class="pr"><b>${l}</b><span>${v}</span></div>`;
  const sum=[
    row("Tema","Seleksi penerima beasiswa."),
    row("Metode","Simple Additive Weighting (SAW)."),
    row("Alasan memilih SAW","Data bersifat numerik, bobot kriteria jelas, serta perhitungannya transparan dan mudah divalidasi secara manual."),
    row("Alternatif",`${S.A.length} mahasiswa, ${m.E.length} di antaranya lolos syarat minimum dan masuk ranking.`),
    row("Kriteria",`${C.length} kriteria (${nb} benefit dan ${nc} cost).`),
    row("Syarat seleksi",sy.length?sy[0].charAt(0).toUpperCase()+sy.join("; ").slice(1)+".":"Tidak ada syarat minimum."),
    row("Data","Data simulasi kelompok, bukan data mahasiswa sebenarnya."),
    row("Referensi","Kriteria dan skala skor merujuk pada "+esc(DATA.referensi)+".")
  ].join("");
  return head("Data Profile","user")+`<div class="card"><h2>Nama kelompok</h2><p class="mut">Anggota kelompok proyek SPK seleksi penerima beasiswa.</p><div class="mem">${DATA.kelompok.map((n,i)=>`<div class="mc2"><span class="av2">${esc(n.split(" ").map(w=>w[0]).slice(0,2).join(""))}</span><div><b>${esc(n)}</b><small>Anggota ${i+1}</small></div></div>`).join("")}</div></div><div class="card"><h2>Ringkasan proyek</h2><p class="mut">Bahan untuk bagian identifikasi masalah dan pemilihan metode di laporan.</p><div class="ps">${sum}</div><h3>Kriteria</h3><div class="w"><table><thead><tr><th>Kode</th><th class="l">Kriteria</th><th>Bobot</th><th>Jenis</th><th>Syarat</th></tr></thead><tbody>${C.map((c,j)=>`<tr><td>C${j+1}</td><td class="l">${esc(c.n)}</td><td>${num(c.w)}%</td><td>${c.t}</td><td>${syT(c)}</td></tr>`).join("")}</tbody></table></div></div>`}
};
function rerender(){$("view").innerHTML=PAGES[document.body.dataset.page]();stagger();countUp()}
function mvCheck(){
  const o=$("mv-out"),i=+$("mv-sel").value,raw=$("mv-val").value.trim().replace(",","."),y=parseFloat(raw);
  if(raw===""||isNaN(y)){o.innerHTML="Ketik V hasil hitungan manual Anda untuk dibandingkan dengan prototype.";return}
  const v=comp().V[i],d=Math.abs(v-y),g=d<0.0005;
  o.innerHTML=`V prototype = <b>${f(v)}</b><br>V manual = <b>${f(y)}</b><br>Selisih = ${f(d,5)} → <span class="${g?"ok":"bad"}">${g?"Cocok":"Selisih, periksa kembali hitungan Anda"}</span>`;
}
document.addEventListener("input",e=>{
  const t=e.target,k=t.dataset.k;
  if(t.id=="mv-sel"||t.id=="mv-val"){mvCheck();return}
  if(t.dataset.c!=null){const c=S.C[+t.dataset.c];if(k=="w"){c.w=+t.value||0;$("tot").innerHTML=totTxt()}else if(k=="m")c.m=t.value===""?null:+t.value;else if(k=="t"){c.t=t.value;const y=$("sy"+t.dataset.c);if(y)y.textContent=syLbl(c)}else c.n=t.value}
  else if(t.dataset.a!=null){const a=S.A[+t.dataset.a];if(k=="n")a.n=t.value;else{const j=+t.dataset.j;a.v[j]=t.value===""?0:+t.value;t.classList.toggle("fl",!pass(S.C[j],+a.v[j]||0));const e=$("elig");if(e)e.innerHTML=eligTbl()}}
  else return;
  saveS();toast("Perubahan tersimpan");
});
document.addEventListener("click",e=>{
  const t=e.target.closest("button");if(!t)return;
  if(t.dataset.x!=null){const a=$("al");if(a){a.style.transition="opacity .3s,transform .3s";a.style.opacity=0;a.style.transform="translateY(-8px)";setTimeout(()=>a.remove(),300)}}
  else if(t.dataset.del!=null){S.A.splice(+t.dataset.del,1);saveS();rerender()}
  else if(t.dataset.dc!=null){if(S.C.length<2)return;const j=+t.dataset.dc;S.C.splice(j,1);S.A.forEach(a=>a.v.splice(j,1));saveS();rerender()}
  else if(t.id=="add"){S.A.push({n:"Mahasiswa "+(S.A.length+1),v:S.C.map(()=>0)});saveS();rerender()}
  else if(t.id=="addc"){S.C.push({n:"Kriteria "+(S.C.length+1),w:0,t:"benefit",m:null});S.A.forEach(a=>a.v.push(0));saveS();rerender()}
  else if(t.id=="normw"){const s=tot();if(s>0){S.C.forEach(c=>c.w=Math.round(c.w/s*10000)/100);saveS();rerender()}}
  else if(t.id=="reset"){if(confirm("Kembalikan semua data ke data awal?")){resetS();rerender();toast("Data dikembalikan")}}
  else if(t.dataset.all!=null){document.querySelectorAll("details.acc").forEach(d=>d.open=t.dataset.all=="1")}
  else if(t.id=="xl"||t.dataset.xl!=null){exportXlsx()}
});
loadS();shell();rerender();
