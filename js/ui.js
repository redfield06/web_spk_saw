// Kerangka halaman (sidebar, topbar), ikon, animasi
const IC={home:"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",box:"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",edit:"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z",calc:"M5 2h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M8 6h8 M8 11h.01 M12 11h.01 M16 11h.01 M8 15h.01 M12 15h.01 M16 15h.01 M8 19h8",chart:"M18 20V10 M12 20V4 M6 20v-6",shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",user:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",layers:"M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",left:"M15 18l-6-6 6-6",menu:"M3 12h18 M3 6h18 M3 18h18",x:"M18 6L6 18 M6 6l12 12",trophy:"M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0z M17 5h3v2a3 3 0 0 1-3 3 M7 5H4v2a3 3 0 0 0 3 3",down:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",moon:"M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",sun:"M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42"};
const ic=(n,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[n]}"/></svg>`;
const NAV=[["",[["dashboard","Dashboard","home"]]],["MASTER DATA",[["kriteria","Data Kriteria","box"],["alternatif","Data Alternatif","users"],["penilaian","Data Penilaian","edit"],["perhitungan","Data Perhitungan","calc"],["hasil","Data Hasil Akhir","chart"]]],["VALIDASI DAN LAPORAN",[["validasi","Data Validasi","shield"],["profil","Data Profile","user"]]]];
function toast(m){let t=$("toast");if(!t){t=document.createElement("div");t.id="toast";document.body.appendChild(t)}t.textContent=m;t.classList.remove("on");void t.offsetWidth;t.classList.add("on")}
// Mode terang/gelap: pilihan disimpan di localStorage; bila belum memilih, mengikuti pengaturan perangkat
const THEME_KEY="spk-theme";
function curTheme(){let t=null;try{t=localStorage.getItem(THEME_KEY)}catch(e){}return t=="dark"||t=="light"?t:(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}
function applyTheme(t){
  document.documentElement.setAttribute("data-theme",t);
  const b=$("th");if(!b)return;
  const l=t=="dark"?"Ganti ke mode terang":"Ganti ke mode gelap";
  b.innerHTML=ic(t=="dark"?"sun":"moon",20);b.title=l;b.setAttribute("aria-label",l);
}
applyTheme(curTheme());
function shell(){
  const p=document.body.dataset.page;let n=0;
  const nav=NAV.map(g=>(g[0]?`<div class="sec">${g[0]}</div>`:"")+g[1].map(x=>`<a href="${x[0]}.html" style="--n:${n++}" class="${x[0]==p?"on":""}" title="${x[1]}">${ic(x[2])}<span>${x[1]}</span></a>`).join("")).join("");
  $("app").innerHTML=`<aside><div class="brand"><div class="logo">${ic("layers",20)}</div><span>SPK SAW Beasiswa</span></div><nav>${nav}</nav><button class="col" id="col" aria-label="Ciutkan menu">${ic("left")}</button></aside><div class="mn"><header class="tb"><button id="burger" aria-label="Menu">${ic("menu",22)}</button><span></span><div class="u"><button class="xb" id="xl" title="Export ke Excel">${ic("down")}<span>Export Excel</span></button><button class="tbtn" id="th" type="button"></button><span>ADMIN</span><div class="av">${ic("user",20)}</div></div></header><main id="view"></main></div>`;
  try{if(localStorage.getItem("spk-mini")=="1")$("app").classList.add("mini")}catch(e){}
  $("col").onclick=()=>{const a=$("app");a.classList.toggle("mini");try{localStorage.setItem("spk-mini",a.classList.contains("mini")?"1":"0")}catch(e){}};
  $("burger").onclick=()=>$("app").classList.toggle("open");
  applyTheme(curTheme());
  $("th").onclick=()=>{const n=curTheme()=="dark"?"light":"dark";try{localStorage.setItem(THEME_KEY,n)}catch(e){}applyTheme(n)};
}
const reduce=()=>window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function countUp(){document.querySelectorAll("[data-count]").forEach(el=>{
  const to=+el.dataset.count,d=+el.dataset.dec||0,s=el.dataset.sfx||"",fmt=x=>x.toFixed(d).replace(".",",")+s;
  if(reduce()){el.textContent=fmt(to);return}
  const t0=performance.now(),step=t=>{const p=Math.min(1,(t-t0)/900);el.textContent=fmt(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step)})}
const stagger=()=>[...$("view").children].forEach((el,i)=>el.style.setProperty("--i",i));
