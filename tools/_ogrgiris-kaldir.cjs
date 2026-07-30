/* "Öğrenci Girişi" görünür linklerini kaldırır — portal dosyaları (altyapı) DURUR.
   Kapsam: topbar linki (+ ardındaki ayraç), header ghost butonu, mobil menü li'si ve butonu.
   İdempotent; ogrenci-giris.html ve ogrenci-panel.html'e DOKUNMAZ. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const DESENLER = [
  // topbar linki + hemen ardından gelen dikey ayraç span'i
  [/[ \t]*<a href="ogrenci-giris\.html"[^>]*aria-label="Öğrenci Girişi">[\s\S]*?<\/a>\n([ \t]*<span style="width:1px;[^"]*"><\/span>\n)?/g, 'topbar'],
  // header masaüstü ghost butonu
  [/[ \t]*<a href="ogrenci-giris\.html" class="btn btn--ghost nav__cta desktop-only"[^>]*>Öğrenci Girişi<\/a>\n?/g, 'header-btn'],
  // mobil menü listesi (satır içi)
  [/<li><a href="ogrenci-giris\.html">Öğrenci Girişi<\/a><\/li>/g, 'mobilnav-li'],
  // mobil menü ghost butonu
  [/[ \t]*<a href="ogrenci-giris\.html" class="btn btn--ghost"[^>]*>Öğrenci Girişi<\/a>\n?/g, 'mobilnav-btn'],
];

const HEDEFLER = [
  ...fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'ogrenci-giris.html' && f !== 'ogrenci-panel.html'),
  'tools/gen-blog.cjs', 'tools/gen-cikmis.cjs',
];

let toplam = 0;
for (const f of HEDEFLER) {
  const fp = path.join(ROOT, f);
  if (!fs.existsSync(fp)) continue;
  let h = fs.readFileSync(fp, 'utf8');
  const rapor = [];
  for (const [re, ad] of DESENLER) {
    const n = (h.match(re) || []).length;
    if (n) { h = h.replace(re, ''); rapor.push(ad + '×' + n); toplam += n; }
  }
  if (rapor.length) { fs.writeFileSync(fp, h, 'utf8'); console.log(f.padEnd(58) + rapor.join(' ')); }
}
console.log('TOPLAM kaldırılan: ' + toplam);
