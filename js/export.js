// Export ke Excel (.xlsx) dengan rumus aktif dan sheet Validasi. Memakai ExcelJS dari CDN.
const loadLib=()=>new Promise((ok,no)=>{if(window.ExcelJS)return ok();const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js";s.onload=ok;s.onerror=no;document.head.appendChild(s)});
const L=i=>{let s="";while(i>0){const r=(i-1)%26;s=String.fromCharCode(65+r)+s;i=Math.floor((i-1)/26)}return s};
async function exportXlsx(){
  try{await loadLib()}catch(e){alert("Library ExcelJS gagal dimuat. Pastikan internet aktif lalu coba lagi.");return}
  try{
    toast("Menyiapkan file Excel...");
    const C=S.C,A=S.A,n=C.length,k=A.length,m=comp();
    const F=5,La=F+k-1,BW=La+1,JN=La+2,SY=La+3,TB=La+4,DV=La+5,lc=3+n,lcL=L(lc),ec=lc+1,eL=L(ec),LOL="Lolos",TL="Tidak lolos";
    const PUR="FF6D28D9",SOFT="FFF3EEFF",LINE="FFD9D4EA",YEL="FFFFF2CC";
    const fill=c=>({type:"pattern",pattern:"solid",fgColor:{argb:c}});
    const line={style:"thin",color:{argb:LINE}},bd={top:line,left:line,bottom:line,right:line};
    const wb=new ExcelJS.Workbook();wb.creator="SPK SAW Beasiswa";wb.created=new Date();
    const title=(ws,t,sub,cols)=>{ws.mergeCells(1,1,1,cols);const a=ws.getCell(1,1);a.value=t;a.font={bold:true,size:15,color:{argb:PUR}};ws.getRow(1).height=26;ws.mergeCells(2,1,2,cols);const b=ws.getCell(2,1);b.value=sub;b.font={italic:true,color:{argb:"FF6F6A85"}}};
    const head=(ws,r,vals)=>{vals.forEach((v,i)=>{const c=ws.getCell(r,i+1);c.value=v;c.font={bold:true,color:{argb:"FFFFFFFF"}};c.fill=fill(PUR);c.alignment={horizontal:"center",vertical:"middle",wrapText:true};c.border=bd});ws.getRow(r).height=32};
    const box=(ws,r1,c1,r2,c2,fmt,left)=>{for(let r=r1;r<=r2;r++)for(let c=c1;c<=c2;c++){const x=ws.getCell(r,c);x.border=bd;x.alignment={horizontal:c<=(left||3)?"left":"center",vertical:"middle"};if(fmt&&c>=4)x.numFmt=fmt}};
    const sec=(ws,r,t,cols)=>{ws.mergeCells(r,1,r,cols);const c=ws.getCell(r,1);c.value=t;c.font={bold:true,size:12,color:{argb:PUR}};c.fill=fill(SOFT)};
    const widths=(ws,a)=>a.forEach((w,i)=>ws.getColumn(i+1).width=w);
    const cols=[...Array(n)].map(()=>18);
    // Sheet 1: Data
    const d=wb.addWorksheet("Data",{views:[{state:"frozen",xSplit:3,ySplit:4}]});
    title(d,"Data Penilaian dan Bobot Kriteria – Seleksi Penerima Beasiswa (SAW)","Data simulasi kelompok. Referensi: "+DATA.referensi+". Diekspor: "+new Date().toLocaleString("id-ID"),ec);
    head(d,4,["No","Kode","Nama alternatif",...C.map(c=>c.n),"Lolos syarat minimum?"]);
    A.forEach((a,i)=>{const r=F+i;d.getCell(r,1).value=i+1;d.getCell(r,2).value=code(i);d.getCell(r,3).value=a.n;d.getCell(r,3).fill=fill(YEL);a.v.forEach((v,j)=>{const c=d.getCell(r,4+j);c.value=+v||0;c.fill=fill(YEL)})});
    const colFmt=C.map((c,j)=>c.cur?'"Rp" #,##0':(A.every(a=>Number.isInteger(+a.v[j]))?"#,##0":"#,##0.00"));
    box(d,F,1,La,lc);A.forEach((a,i)=>C.forEach((c,j)=>{d.getCell(F+i,4+j).numFmt=colFmt[j]}));
    // Status syarat minimum per alternatif: benefit harus >= batas, cost harus <= batas, batas kosong = tanpa syarat
    A.forEach((a,i)=>{const r=F+i;
      const parts=C.map((c,j)=>{const col=L(4+j);return `OR(${col}$${SY}="",IF(${col}$${JN}="benefit",${col}${r}>=${col}$${SY},${col}${r}<=${col}$${SY}))`}).join(",");
      const x=d.getCell(r,ec);x.value={formula:`IF(AND(${parts}),"${LOL}","${TL}")`,result:m.ok[i]?LOL:TL};x.border=bd;x.alignment={horizontal:"center",vertical:"middle"};x.font={bold:true}});
    d.addConditionalFormatting({ref:`${eL}${F}:${eL}${La}`,rules:[{type:"cellIs",operator:"equal",formulae:[`"${TL}"`],style:{font:{bold:true,color:{argb:"FFB91C1C"}},fill:{type:"pattern",pattern:"solid",bgColor:{argb:"FFFEE2E2"}}}}]});
    d.getCell(BW,1).value="Bobot (desimal)";d.getCell(JN,1).value="Jenis (benefit/cost)";d.getCell(SY,1).value="Syarat (benefit: minimal, nilai ≥ batas; cost: maksimal, nilai ≤ batas; kosong = tanpa syarat)";d.getCell(TB,1).value="Total bobot";d.getCell(DV,1).value="Pembagi (max benefit / min cost, hanya dari yang lolos)";
    C.forEach((c,j)=>{d.getCell(BW,4+j).value=c.w/100;d.getCell(BW,4+j).numFmt="0.00%";d.getCell(JN,4+j).value=c.t;
      if(hasM(c))d.getCell(SY,4+j).value=+c.m;d.getCell(SY,4+j).numFmt=c.cur?'"Rp" #,##0':"General";
      const col=L(4+j),el=`${eL}$${F}:${eL}$${La}`,rg=`${col}$${F}:${col}$${La}`;
      d.getCell(DV,4+j).value={formula:`IF(${col}$${JN}="benefit",SUMPRODUCT(MAX((${el}="${LOL}")*${rg})),SUMPRODUCT(MIN(${rg}+(${el}<>"${LOL}")*1E+99)))`,result:c.t=="benefit"?m.mx[j]:m.mn[j]};d.getCell(DV,4+j).numFmt=colFmt[j]});
    d.getCell(TB,4).value={formula:`SUM(D${BW}:${lcL}${BW})`,result:tot()/100};d.getCell(TB,4).numFmt="0.00%";
    [BW,JN,SY,TB,DV].forEach(r=>{d.mergeCells(r,1,r,3);box(d,r,1,r,lc);d.getCell(r,1).font={bold:true};for(let c=1;c<=lc;c++)d.getCell(r,c).fill=fill(SOFT)});
    [BW,JN,SY].forEach(r=>{for(let c=4;c<=lc;c++)d.getCell(r,c).fill=fill(YEL)});d.getRow(SY).height=44;d.getCell(SY,1).alignment={wrapText:true,vertical:"middle"};d.getCell(DV,1).alignment={wrapText:true,vertical:"middle"};d.getRow(DV).height=32;
    d.mergeCells(3,1,3,ec);d.getCell(3,1).value="Sel berwarna kuning dapat diedit (nama, nilai, bobot, jenis, syarat minimum). Alternatif yang tidak lolos syarat minimum tidak ikut dinormalisasi dan diranking. Semua sheet (Normalisasi, Ranking, Perhitungan, Validasi) menghitung ulang otomatis. Menambah baris alternatif baru memerlukan perluasan rentang rumus.";d.getCell(3,1).font={italic:true,color:{argb:"FF9A3412"}};d.getCell(3,1).alignment={wrapText:true,vertical:"top"};d.getRow(3).height=34;
    widths(d,[6,8,26,...cols,20]);
    // Sheet 2: Normalisasi
    const z=wb.addWorksheet("Normalisasi",{views:[{state:"frozen",xSplit:3,ySplit:4}]});
    title(z,"Matriks Normalisasi (r)","Benefit: x ÷ max kolom. Cost: min kolom ÷ x. Max dan min hanya dari alternatif yang lolos syarat minimum (baris Pembagi di sheet Data); yang tidak lolos tampil –.",lc);
    head(z,4,["No","Kode","Nama alternatif",...C.map(c=>c.n)]);
    A.forEach((a,i)=>{const r=F+i;z.getCell(r,1).value=i+1;z.getCell(r,2).value=code(i);z.getCell(r,3).value=a.n;
      C.forEach((c,j)=>{const col=L(4+j),rg=`Data!${col}$${F}:${col}$${La}`;z.getCell(r,4+j).value={formula:`IF(Data!$${eL}${r}<>"${LOL}","–",IF(Data!${col}$${JN}="benefit",Data!${col}${r}/Data!${col}$${DV},Data!${col}$${DV}/Data!${col}${r}))`,result:m.ok[i]?m.R[i][j]:"–"}})});
    box(z,F,1,La,lc,"0.0000");widths(z,[6,8,26,...cols]);
    // Sheet 3: Ranking
    const k3=wb.addWorksheet("Ranking");
    title(k3,"Nilai Preferensi (V) dan Ranking","V = SUMPRODUCT(nilai normalisasi, bobot). Peringkat memakai RANK. Alternatif yang tidak lolos syarat minimum tidak dihitung. Baris peringkat 1 disorot otomatis.",6);
    head(k3,4,["No","Kode","Nama alternatif","Nilai V","Peringkat","Keterangan"]);
    A.forEach((a,i)=>{const r=F+i;k3.getCell(r,1).value=i+1;k3.getCell(r,2).value=code(i);k3.getCell(r,3).value=a.n;
      k3.getCell(r,4).value={formula:`IF(Data!$${eL}${r}<>"${LOL}","${TL}",SUMPRODUCT(Normalisasi!D${r}:${lcL}${r},Data!$D$${BW}:$${lcL}$${BW}))`,result:m.ok[i]?m.V[i]:TL};
      k3.getCell(r,5).value={formula:`IF(ISNUMBER(D${r}),RANK(D${r},$D$${F}:$D$${La},0),"${TL}")`,result:m.ok[i]?m.rk[i]:TL};
      k3.getCell(r,6).value={formula:`IF(E${r}=1,"Direkomendasikan",IF(E${r}="${TL}","Tidak lolos syarat minimum",""))`,result:!m.ok[i]?"Tidak lolos syarat minimum":(m.rk[i]==1?"Direkomendasikan":"")}});
    box(k3,F,1,La,6);for(let r=F;r<=La;r++)k3.getCell(r,4).numFmt="0.0000";
    k3.addConditionalFormatting({ref:`A${F}:F${La}`,rules:[{type:"expression",formulae:[`$E${F}=1`],style:{fill:{type:"pattern",pattern:"solid",bgColor:{argb:"FFE6DAFF"}},font:{bold:true}}}]});
    k3.getCell(4,8).value="Urutan hasil akhir";k3.mergeCells(3,8,3,10);k3.getCell(3,8).value="Urutan hasil akhir (otomatis)";k3.getCell(3,8).font={bold:true,color:{argb:PUR}};
    head(k3,4,["No","Kode","Nama alternatif","Nilai V","Peringkat","Keterangan","","Peringkat","Nama","Nilai V"]);
    k3.getCell(4,7).fill={type:"pattern",pattern:"none"};k3.getCell(4,7).border={};
    A.forEach((a,i)=>{const r=F+i,o=m.ord[i];k3.getCell(r,8).value=i+1;
      k3.getCell(r,9).value={formula:`IFERROR(INDEX($C$${F}:$C$${La},MATCH(H${r},$E$${F}:$E$${La},0)),"-")`,result:o===undefined?"-":A[o].n};
      k3.getCell(r,10).value={formula:`IFERROR(INDEX($D$${F}:$D$${La},MATCH(H${r},$E$${F}:$E$${La},0)),"-")`,result:o===undefined?"-":m.V[o]};k3.getCell(r,10).numFmt="0.0000"});
    box(k3,F,8,La,10,null,9);for(let r=F;r<=La;r++)k3.getCell(r,10).numFmt="0.0000";
    widths(k3,[6,8,26,14,12,20,3,12,26,12]);
    // Sheet 4: Perhitungan (rumus dan hitungan tiap alternatif, semua rumus aktif)
    const h=wb.addWorksheet("Perhitungan");
    title(h,"Rumus dan Hitungan SAW per Alternatif","Setiap blok memakai rumus aktif yang mengacu ke sheet Data. Ubah sel kuning di sheet Data, seluruh hitungan di sini ikut berubah.",8);
    h.mergeCells(3,1,3,8);h.getCell(3,1).value="Benefit: r = x ÷ max kolom. Cost: r = min kolom ÷ x (max dan min hanya dari alternatif yang lolos syarat minimum). Nilai preferensi: V = Σ (bobot × r). Tampilan dibulatkan 4 desimal; Excel menghitung dengan presisi penuh.";h.getCell(3,1).font={italic:true,color:{argb:"FF6F6A85"}};
    let q=5;
    A.forEach((a,i)=>{
      const dr=F+i;
      h.mergeCells(q,1,q,8);const hc=h.getCell(q,1);
      hc.value={formula:`"Alternatif "&Data!B${dr}&" – "&Data!C${dr}&"   |   Peringkat: "&Ranking!E${dr}`,result:`Alternatif ${code(i)} – ${a.n}   |   Peringkat: ${m.rk[i]}`};
      hc.font={bold:true,size:12,color:{argb:"FFFFFFFF"}};hc.fill=fill(PUR);h.getRow(q).height=24;q++;
      head(h,q,["Kriteria","Jenis","Nilai x","Pembagi (max/min)","Rumus normalisasi","r","Bobot","Bobot × r"]);q++;
      const r1=q;
      C.forEach((c,j)=>{
        const dc=L(4+j),x=+A[i].v[j]||0,dv=c.t=="benefit"?m.mx[j]:m.mn[j],ok=m.ok[i],NL="Tidak lolos syarat minimum";
        h.getCell(q,1).value={formula:`Data!${dc}$4`,result:c.n};
        h.getCell(q,2).value={formula:`Data!${dc}$${JN}`,result:c.t};
        h.getCell(q,3).value={formula:`Data!${dc}${dr}`,result:x};
        h.getCell(q,4).value={formula:`Data!${dc}$${DV}`,result:dv};
        h.getCell(q,5).value={formula:`IF(Data!$${eL}$${dr}<>"${LOL}","${NL}",IF(B${q}="benefit","r = x ÷ max = "&C${q}&" ÷ "&D${q},"r = min ÷ x = "&D${q}&" ÷ "&C${q})&" = "&FIXED(F${q},4,TRUE))`,result:ok?(c.t=="benefit"?`r = x ÷ max = ${x} ÷ ${dv}`:`r = min ÷ x = ${dv} ÷ ${x}`)+` = ${f(m.R[i][j])}`:NL};
        h.getCell(q,6).value={formula:`Normalisasi!${dc}${dr}`,result:ok?m.R[i][j]:"–"};
        h.getCell(q,7).value={formula:`Data!${dc}$${BW}`,result:c.w/100};
        h.getCell(q,8).value={formula:`IF(ISNUMBER(F${q}),G${q}*F${q},0)`,result:ok?c.w/100*m.R[i][j]:0};
        q++;
      });
      const r2=q-1;
      box(h,r1,1,r2,8,null,2);
      for(let t=r1;t<=r2;t++){h.getCell(t,3).numFmt=colFmt[t-r1];h.getCell(t,4).numFmt=colFmt[t-r1];h.getCell(t,6).numFmt="0.0000";h.getCell(t,7).numFmt="0.00%";h.getCell(t,8).numFmt="0.0000";h.getCell(t,5).alignment={horizontal:"left",vertical:"middle"}}
      h.mergeCells(q,1,q,7);h.getCell(q,1).value="Nilai preferensi V = Σ (bobot × r)";
      h.getCell(q,8).value={formula:`IF(Data!$${eL}$${dr}<>"${LOL}","–",SUM(H${r1}:H${r2}))`,result:m.ok[i]?m.V[i]:"–"};h.getCell(q,8).numFmt="0.0000";
      for(let c=1;c<=8;c++){const x=h.getCell(q,c);x.fill=fill(SOFT);x.font={bold:true,color:{argb:PUR}};x.border=bd}
      const vr=q;q++;
      const parts=[...Array(n)].map((_,j)=>`"("&FIXED(G${r1+j},2,TRUE)&" × "&FIXED(F${r1+j},4,TRUE)&")"`).join('&" + "&');
      const sums=[...Array(n)].map((_,j)=>`FIXED(H${r1+j},4,TRUE)`).join('&" + "&');
      h.mergeCells(q,1,q,8);h.getCell(q,1).value={formula:`IF(Data!$${eL}$${dr}<>"${LOL}","Tidak lolos syarat minimum, tidak dihitung.","V = "&${parts})`,result:m.ok[i]?"V = "+C.map((c,j)=>`(${f(c.w/100,2)} × ${f(m.R[i][j])})`).join(" + "):"Tidak lolos syarat minimum, tidak dihitung."};q++;
      h.mergeCells(q,1,q,8);h.getCell(q,1).value={formula:`IF(Data!$${eL}$${dr}<>"${LOL}","","V = "&${sums}&" = "&FIXED(H${vr},4,TRUE))`,result:m.ok[i]?"V = "+C.map((c,j)=>f(c.w/100*m.R[i][j])).join(" + ")+" = "+f(m.V[i]):""};
      h.getCell(q,1).font={bold:true,color:{argb:PUR}};q+=2;
    });
    widths(h,[32,10,14,18,44,10,10,12]);
    // Sheet 5: Validasi
    const v=wb.addWorksheet("Validasi");
    title(v,"Validasi Metode SAW","Rumus aktif. Bagian C bisa diisi sendiri (sel kuning). Jika data di sheet Data diedit, V Excel ikut berubah sedangkan V Web tetap nilai saat export.",8);
    let r=4;sec(v,r,"A. Cek syarat tugas",8);r++;
    head(v,r,["Syarat","","","Nilai","Status"]);v.mergeCells(r,1,r,3);r++;
    const rb=`COUNTIF(Data!D${JN}:${lcL}${JN},"benefit")`,rc=`COUNTIF(Data!D${JN}:${lcL}${JN},"cost")`;
    const chk=[["Jumlah alternatif minimal 5",`COUNTA(Data!C${F}:C${La})`,k,`IF(D@>=5,"Terpenuhi","Belum")`,"0"],
      ["Jumlah kriteria minimal 4",`COUNTA(Data!D4:${lcL}4)`,n,`IF(D@>=4,"Terpenuhi","Belum")`,"0"],
      ["Total bobot 100%",`SUM(Data!D${BW}:${lcL}${BW})`,tot()/100,`IF(ABS(D@-1)<0.000001,"Terpenuhi","Belum")`,"0.00%"],
      ["Ada kriteria benefit dan cost",`${rb}&" benefit, "&${rc}&" cost"`,C.filter(c=>c.t=="benefit").length+" benefit, "+C.filter(c=>c.t=="cost").length+" cost",`IF(AND(${rb}>0,${rc}>0),"Terpenuhi","Belum")`,"@"],
      ["Ada alternatif yang lolos syarat minimum",`COUNTIF(Data!${eL}${F}:${eL}${La},"${LOL}")&" dari "&COUNTA(Data!C${F}:C${La})&" lolos"`,m.E.length+" dari "+k+" lolos",`IF(COUNTIF(Data!${eL}${F}:${eL}${La},"${LOL}")>=1,"Terpenuhi","Belum")`,"@"]];
    const a1=r;
    chk.forEach(x=>{v.mergeCells(r,1,r,3);v.getCell(r,1).value=x[0];v.getCell(r,4).value={formula:x[1],result:x[2]};v.getCell(r,4).numFmt=x[4];v.getCell(r,5).value={formula:x[3].replace("@",r),result:"Terpenuhi"};r++});
    box(v,a1,1,r-1,5,null,3);
    r++;sec(v,r,"B. Prototype web vs perhitungan Excel",8);r++;
    head(v,r,["Nama","V Web (saat export)","V Excel","Selisih","Status V","Peringkat Web","Peringkat Excel","Status peringkat"]);r++;
    const b1=r;
    A.forEach((a,i)=>{v.getCell(r,1).value=a.n;v.getCell(r,2).value=m.ok[i]?m.V[i]:TL;v.getCell(r,3).value={formula:`Ranking!D${F+i}`,result:m.ok[i]?m.V[i]:TL};v.getCell(r,4).value={formula:`IF(AND(ISNUMBER(B${r}),ISNUMBER(C${r})),ABS(B${r}-C${r}),IF(B${r}=C${r},0,1))`,result:0};
      v.getCell(r,5).value={formula:`IF(D${r}<0.0001,"Cocok","Selisih")`,result:"Cocok"};v.getCell(r,6).value=m.ok[i]?m.rk[i]:TL;v.getCell(r,7).value={formula:`Ranking!E${F+i}`,result:m.ok[i]?m.rk[i]:TL};v.getCell(r,8).value={formula:`IF(F${r}=G${r},"Cocok","Berbeda")`,result:"Cocok"};r++});
    box(v,b1,1,r-1,8,"0.0000",1);for(let t=b1;t<r;t++){v.getCell(t,6).numFmt="0";v.getCell(t,7).numFmt="0"}
    const b2=r-1;v.mergeCells(r,1,r,8);
    v.getCell(r,1).value={formula:`"Hasil: "&COUNTIF(E${b1}:E${b2},"Cocok")&" dari ${k} nilai V cocok dan "&COUNTIF(H${b1}:H${b2},"Cocok")&" dari ${k} peringkat sama dengan Excel."`,result:`Hasil: ${k} dari ${k} nilai V cocok dan ${k} dari ${k} peringkat sama dengan Excel.`};v.getCell(r,1).font={bold:true};
    r+=2;sec(v,r,"C. Validasi hitungan manual kelompok (isi sel kuning dengan V hasil hitungan tangan atau kalkulator)",8);r++;
    head(v,r,["Nama","V Excel","V manual (isi)","Selisih","Status"]);r++;
    const c1=r;
    A.forEach((a,i)=>{v.getCell(r,1).value=a.n;v.getCell(r,2).value={formula:`Ranking!D${F+i}`,result:m.ok[i]?m.V[i]:TL};v.getCell(r,3).fill=fill(YEL);
      v.getCell(r,4).value={formula:`IF(C${r}="","",IF(ISNUMBER(B${r}),ABS(B${r}-C${r}),""))`,result:""};
      v.getCell(r,5).value={formula:`IF(C${r}="","Isi V manual",IF(NOT(ISNUMBER(B${r})),"${TL}",IF(D${r}<0.0005,"Cocok","Selisih")))`,result:"Isi V manual"};r++});
    box(v,c1,1,r-1,5,"0.0000",1);for(let t=c1;t<r;t++){v.getCell(t,2).numFmt="0.0000";v.getCell(t,3).numFmt="0.0000"}
    r++;sec(v,r,"D. Uji sifat metode SAW",8);r++;
    head(v,r,["Uji","","","Nilai","Status"]);v.mergeCells(r,1,r,3);r++;
    const nr=`Normalisasi!D${F}:${lcL}${La}`,vr=`Ranking!D${F}:D${La}`,kr=`Ranking!E${F}:E${La}`,allR=m.E.flatMap(i=>m.R[i]),Ve=m.E.map(i=>m.V[i]);
    const props=[["Semua nilai normalisasi r berada di 0–1",`FIXED(MIN(${nr}),4,TRUE)&" s/d "&FIXED(MAX(${nr}),4,TRUE)`,`${f(Math.min(...allR))} s/d ${f(Math.max(...allR))}`,`IF(AND(MIN(${nr})>=0,MAX(${nr})<=1.0000001),"Terpenuhi","Belum")`],
      ["Nilai V berada di 0–1",`FIXED(MIN(${vr}),4,TRUE)&" s/d "&FIXED(MAX(${vr}),4,TRUE)`,`${f(Math.min(...Ve))} s/d ${f(Math.max(...Ve))}`,`IF(AND(MIN(${vr})>=0,MAX(${vr})<=1.0000001),"Terpenuhi","Belum")`],
      ["Tidak ada peringkat kembar",`ROUND(SUMPRODUCT(ISNUMBER(${kr})/COUNTIF(${kr},${kr})),0)&" dari "&COUNT(${kr})`,`${m.E.length} dari ${m.E.length}`,`IF(ROUND(SUMPRODUCT(ISNUMBER(${kr})/COUNTIF(${kr},${kr})),6)=COUNT(${kr}),"Terpenuhi","Ada nilai kembar")`]];
    const d1=r;
    props.forEach(x=>{v.mergeCells(r,1,r,3);v.getCell(r,1).value=x[0];v.getCell(r,4).value={formula:x[1],result:x[2]};v.getCell(r,5).value={formula:x[3],result:"Terpenuhi"};r++});
    box(v,d1,1,r-1,5,null,3);
    r++;sec(v,r,"E. Kesimpulan",8);r++;v.mergeCells(r,1,r,8);
    v.getCell(r,1).value=`Alternatif terbaik: ${m.ord.length?A[m.ord[0]].n+" dengan V = "+f(m.V[m.ord[0]]):"belum ada (tidak ada alternatif yang lolos syarat minimum)"}. Alternatif yang lolos syarat minimum: ${m.E.length} dari ${k} (status per alternatif ada di sheet Data). Prototype web konsisten dengan perhitungan Excel (bagian B), dan hasil dapat diperiksa ulang lewat hitungan manual kelompok (bagian C) serta uji sifat metode (bagian D).`;
    v.getCell(r,1).alignment={wrapText:true,vertical:"top"};v.getRow(r).height=36;
    widths(v,[34,18,18,22,20,16,26,18]);
    [d,z,k3,h,v].forEach(ws=>{ws.pageSetup={orientation:"landscape",paperSize:9,fitToPage:true,fitToWidth:1,fitToHeight:0}});
    wb.calcProperties={fullCalcOnLoad:true};
    const buf=await wb.xlsx.writeBuffer();
    const blob=new Blob([buf],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
    const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="SPK-SAW-Beasiswa.xlsx";document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),4000);toast("File Excel diunduh");
  }catch(e){console.error(e);alert("Export gagal: "+e.message)}
}
