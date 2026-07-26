/* Gri Akademi — teknik hijyen üreticisi
   Çalıştır: node tools/gen-teknik.cjs
   Yaptıkları:
     1) canonical  -> tek DOMAIN değişkeninden, mutlak
     2) og:image / og:url -> mutlak URL
     3) form.js'i her sayfaya bağlar
     4) formlara KVKK açık rıza kutusu ekler (ön-işaretli DEĞİL)
     5) sitemap.xml + robots.txt üretir
   Tekrar çalıştırılabilir (idempotent). */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
// Sitenin yayınlandığı tek kanonik adres. Değişirse SADECE burayı değiştir.
// NOT: griarts.com ESKİ site (başka sunucuda, hâlâ canlı). Yeni site .com.tr'de.
const DOMAIN = 'https://www.griarts.com.tr';
// URL'lerde geçen eski alan adını düzelt (e-postalara DOKUNMA: info@griarts.com)
const ESKI_URL = /(https?:\/\/)(www\.)?griarts\.com(?!\.tr)/g;

const HARIC = new Set(['ogrenci-panel.html', 'ogrenci-giris.html']); // noindex, portal
const rapor = [];

const sayfalar = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

for (const dosya of sayfalar) {
  const fp = path.join(ROOT, dosya);
  let h = fs.readFileSync(fp, 'utf8');
  const once = h;
  const url = DOMAIN + '/' + (dosya === 'index.html' ? '' : dosya);
  const degisiklikler = [];

  /* 0) URL'lerdeki eski alan adı -> yeni (JSON-LD, sameAs, og dahil).
        mailto: / info@griarts.com etkilenmez, çünkü http ile başlamıyor. */
  if (ESKI_URL.test(h)) {
    h = h.replace(ESKI_URL, DOMAIN.replace(/^https?:\/\//, 'https://'));
    degisiklikler.push('alan-adı');
  }

  /* 1) canonical — mutlak ve tek kaynaktan */
  if (/<link rel="canonical"/.test(h)) {
    h = h.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
    degisiklikler.push('canonical');
  } else if (!HARIC.has(dosya) && /<\/head>/.test(h)) {
    h = h.replace('</head>', `<link rel="canonical" href="${url}">\n</head>`);
    degisiklikler.push('canonical+');
  }

  /* 2) og:image / og:url mutlak */
  if (/property="og:image" content="(?!https?:)/.test(h)) {
    h = h.replace(/(property="og:image" content=")([^"]*)(")/, (m, a, v, z) =>
      a + DOMAIN + '/' + v.replace(/^\.?\//, '') + z);
    degisiklikler.push('og:image');
  }
  if (/property="og:image"/.test(h) && !/property="og:url"/.test(h)) {
    h = h.replace(/(<meta property="og:image"[^>]*>)/, `<meta property="og:url" content="${url}">\n$1`);
    degisiklikler.push('og:url+');
  }
  // twitter kartı (link önizlemesi için)
  if (/property="og:image"/.test(h) && !/name="twitter:card"/.test(h)) {
    h = h.replace(/(<meta property="og:image"[^>]*>)/, `$1\n<meta name="twitter:card" content="summary_large_image">`);
    degisiklikler.push('twitter');
  }

  /* 3) form.js bağla (main.js'ten sonra) */
  if (/assets\/js\/main\.js/.test(h) && !/assets\/js\/form\.js/.test(h)) {
    h = h.replace(/(<script src="assets\/js\/main\.js"><\/script>)/,
      `$1\n<script src="assets/js/form.js"></script>`);
    degisiklikler.push('form.js');
  }

  /* 4) KVKK açık rıza kutusu — her <form> içine, gönder butonundan önce */
  if (!HARIC.has(dosya)) {
    const rizaHtml = (id) =>
      `<label class="consent"><input type="checkbox" name="kvkk" id="kvkk-${id}" value="1" required>` +
      `<span><a href="kvkk-aydinlatma.html" target="_blank" rel="noopener">Aydınlatma metnini</a> okudum; ` +
      `bilgilerimin benimle iletişim kurulması amacıyla işlenmesini onaylıyorum.</span></label>`;

    let sayac = 0;
    h = h.replace(/<form\b[^>]*>[\s\S]*?<\/form>/g, (formHtml) => {
      sayac++;
      if (/name="kvkk"/.test(formHtml)) return formHtml;          // zaten var
      if (!/type="submit"|<button/.test(formHtml)) return formHtml; // gönder butonu yoksa atla
      const eklendi = formHtml.replace(/(\s*<button[^>]*(?:type="submit")?[^>]*>)/,
        `\n            ${rizaHtml(sayac)}$1`);
      if (eklendi !== formHtml) degisiklikler.push('kvkk');
      return eklendi;
    });
  }

  if (h !== once) {
    fs.writeFileSync(fp, h, 'utf8');
    rapor.push(`${dosya.padEnd(30)} ${[...new Set(degisiklikler)].join(', ')}`);
  }
}

/* 5) sitemap.xml */
const bugun = '2026-07-26';
const oncelik = (f) => f === 'index.html' ? '1.0'
  : /hazirlik|portfolyo|hobi|seramik|mozaik|vitray|workshoplar/.test(f) ? '0.9'
  : /cikmis|yetenek/.test(f) ? '0.8' : '0.6';

const indeksli = sayfalar.filter(f => !HARIC.has(f)).sort();
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  indeksli.map(f => {
    const u = DOMAIN + '/' + (f === 'index.html' ? '' : f);
    return `  <url>\n    <loc>${u}</loc>\n    <lastmod>${bugun}</lastmod>\n    <priority>${oncelik(f)}</priority>\n  </url>`;
  }).join('\n') + `\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');

/* robots.txt */
fs.writeFileSync(path.join(ROOT, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /ogrenci-panel.html\nDisallow: /ogrenci-giris.html\nDisallow: /_talepler/\n\nSitemap: ${DOMAIN}/sitemap.xml\n`, 'utf8');

console.log(rapor.join('\n'));
console.log(`\nsitemap.xml: ${indeksli.length} URL · robots.txt yazıldı · DOMAIN=${DOMAIN}`);
