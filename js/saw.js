// Inti perhitungan SAW, penyimpanan data, dan fungsi bantu
const KEY="spk-saw-v2";
let S={C:[],A:[]};
const $=i=>document.getElementById(i);
const f=(x,d=4)=>(+x).toFixed(d).replace(".",",");
const num=x=>(+x).toLocaleString("id-ID",{maximumFractionDigits:4});
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");
const code=i=>"A"+String(i+1).padStart(2,"0");
const defState=()=>({ver:3,C:DATA.C.map(c=>Object.assign({n:c[0],w:c[1],t:c[2]},c[3])),A:DATA.names.map((n,i)=>({n,v:DATA.V[i].slice()}))});
// Migrasi data lama di browser: ganti nama lama, lengkapi keterangan kriteria, rapikan teks skala, siapkan syarat minimum
function migrate(){
  S.A.forEach(a=>{if(a.n=="Muhammad Nur")a.n="Monika Gulo"});
  S.C.forEach(c=>{
    if(c.d===undefined){const m=DATA.C.find(x=>x[0]==c.n);if(m)Object.assign(c,m[3])}
    if(c.m===undefined){const m=DATA.C.find(x=>x[0]==c.n);c.m=m&&m[3].m!==undefined?m[3].m:null}
    if(c.cur===undefined){const m=DATA.C.find(x=>x[0]==c.n);if(m&&m[3].cur)c.cur=1}
    if(c.k)c.k.forEach(x=>{if(x[2]=="usulan; r = 0")x.length=2});
  });
}
// Versi 3: calon tetap 5 orang (hapus Alexander Laia dan Siti Rahma) dan syarat penghasilan dikosongkan
function migrate3(){
  if((S.ver||0)>=3)return;
  S.A=S.A.filter(a=>a.n!="Alexander Laia"&&a.n!="Siti Rahma");
  S.C.forEach(c=>{if(c.cur)c.m=null});
  S.ver=3;
}
function loadS(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.C&&s.A){S=s;migrate();migrate3();saveS();return}}catch(e){}S=defState()}
function saveS(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function resetS(){S=defState();saveS()}
// Syarat minimum per kriteria (c.m). Benefit: nilai harus >= m. Cost: nilai harus <= m (batas maksimum). Kosong = tanpa syarat.
const hasM=c=>c.m!==null&&c.m!==undefined&&c.m!==""&&!isNaN(+c.m);
const pass=(c,x)=>!hasM(c)||(c.t=="benefit"?x>=+c.m-1e-12:x<=+c.m+1e-12);
// Langkah SAW: (0) seleksi syarat minimum, (1) normalisasi hanya di antara yang lolos (benefit: x/max, cost: min/x), (2) V = jumlah(bobot x r)
function engine(C,A){
  const val=(a,j)=>+a.v[j]||0;
  const ok=A.map(a=>C.every((c,j)=>pass(c,val(a,j))));
  const why=A.map(a=>C.map((c,j)=>j).filter(j=>!pass(C[j],val(a,j))));
  const E=A.map((a,i)=>i).filter(i=>ok[i]);
  const mx=[],mn=[];
  C.forEach((c,j)=>{const col=E.map(i=>val(A[i],j));mx[j]=col.length?Math.max(...col):0;mn[j]=col.length?Math.min(...col):0});
  const R=A.map((a,i)=>C.map((c,j)=>{if(!ok[i])return 0;const x=val(a,j);return c.t=="benefit"?(mx[j]>0?x/mx[j]:0):(x>0?mn[j]/x:0)}));
  const V=R.map(r=>r.reduce((s,v,j)=>s+C[j].w/100*v,0));
  const rk=A.map((a,i)=>ok[i]?1+E.filter(k=>V[k]>V[i]+1e-12).length:0);
  const ord=E.slice().sort((p,q)=>V[q]-V[p]);
  return{ok,why,E,mx,mn,R,V,rk,ord};
}
const comp=()=>engine(S.C,S.A);
const tot=()=>S.C.reduce((s,c)=>s+(+c.w||0),0);
const empty=()=>!S.A.length||!S.C.length;
const noElig=()=>comp().ord.length==0;
// Format nilai: kriteria rupiah diberi awalan Rp
const fv=(c,x)=>(c.cur?"Rp ":"")+num(x);
// Teks syarat: benefit "minimal ...", cost "maksimal ..."
const syT=(c)=>hasM(c)?(c.t=="benefit"?"minimal ":"maksimal ")+fv(c,c.m):"–";
const syLbl=c=>c.t=="benefit"?"≥":"≤";
// Hitungan terpisah (kode berbeda) untuk uji konsistensi. Mengembalikan null untuk alternatif yang tidak lolos syarat.
function naive(C,A){
  const el=A.map(a=>{for(let j=0;j<C.length;j++){const c=C[j],x=+a.v[j]||0;if(c.m===null||c.m===undefined||c.m===""||isNaN(+c.m))continue;if(c.t=="benefit"?x<+c.m-1e-12:x>+c.m+1e-12)return false}return true});
  return A.map((a,i)=>{if(!el[i])return null;let v=0;for(let j=0;j<C.length;j++){const col=A.filter((b,k)=>el[k]).map(b=>+b.v[j]||0),x=+a.v[j]||0;const r=C[j].t=="benefit"?x/Math.max(...col):(x>0?Math.min(...col)/x:0);v+=C[j].w*r/100}return v});
}
// Skenario bobot untuk uji sensitivitas (bobot dinormalkan kembali ke 100%; syarat minimum tetap berlaku)
function scenarios(){
  const C=S.C,A=S.A;
  const mk=(label,fn)=>{const w=C.map(fn),s=w.reduce((a,b)=>a+b,0)||1;return{label,m:engine(C.map((c,j)=>({n:c.n,t:c.t,m:c.m,cur:c.cur,w:w[j]/s*100})),A)}};
  return[mk("Bobot aktif",c=>+c.w||0),mk("Bobot sama rata",()=>1),mk("Kriteria cost ditekankan (×1,5)",c=>(+c.w||0)*(c.t=="cost"?1.5:1)),mk("Kriteria benefit ditekankan (×1,5)",c=>(+c.w||0)*(c.t=="benefit"?1.5:1))];
}
