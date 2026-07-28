/* wa-float balonunu tüm HTML sayfalarından kaldırır (işlevi Gri Asistan'a taşındı).
   Tek seferlik; generator shell'leri ayrıca elle düzeltildi. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const RE = /\s*<a class="wa-float"[\s\S]*?<\/a>\n?/g;
let toplam = 0;
for (const f of fs.readdirSync(ROOT).filter(x => x.endsWith('.html'))) {
  const fp = path.join(ROOT, f);
  const h = fs.readFileSync(fp, 'utf8');
  const n = (h.match(RE) || []).length;
  if (!n) continue;
  fs.writeFileSync(fp, h.replace(RE, '\n'), 'utf8');
  toplam += n;
  console.log(f.padEnd(55) + n + ' kaldırıldı');
}
console.log('TOPLAM: ' + toplam);
