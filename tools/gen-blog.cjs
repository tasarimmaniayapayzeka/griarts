/* Gri Akademi — Blog statik üreteci (v2 — dergi düzeni: liste + kenar çubuğu)
   Kullanım: node tools/gen-blog.cjs
   Veri: data/blog-posts.json
         {slug,kategori,title,seoDesc,excerpt,readMinutes,bodyHtml,kapak,kapakAlt,etiketler[],tarih}
   Düzen: Lessart tarzı — solda yatay kartlar (metin+kapak), sağda kenar çubuğu
          (Ara, Kategoriler, Son Gönderiler, Hizmetlerimiz, Etiketler). Arama ve
          kategori filtresi istemci tarafında çalışır (statik site, dürüst çözüm). */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const DOMAIN = 'https://www.griarts.com.tr';
const POSTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'blog-posts.json'), 'utf8'));

const AYLAR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
function tarihTR(iso) { const [y,m,d] = iso.split('-').map(Number); return `${d} ${AYLAR[m-1]} ${y}`; }

const HIZMETLER = [
  ['gsf-hazirlik.html', 'GSF Hazırlık'],
  ['gsl-hazirlik.html', 'GSL Hazırlık'],
  ['hobi-resim.html', 'Hobi Resim'],
  ['hobi-seramik.html', 'Hobi Seramik'],
  ['seramik-heykel.html', 'Seramik & Heykel'],
  ['mozaik.html', 'Mozaik'],
  ['vitray.html', 'Vitray'],
  ['workshoplar.html', 'Workshoplar'],
  ['yurt-ici-portfolyo.html', 'Yurt İçi Portfolyo'],
  ['yurt-disi-portfolyo.html', 'Yurt Dışı Portfolyo'],
];

const svgArrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
const svgBack = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';
const svgClock = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';
const svgCal = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
const svgSearch = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

function shell(o) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.className+=" js";</script>
<title>${o.title}</title>
<meta name="description" content="${o.desc}">
<link rel="canonical" href="${DOMAIN}/${o.slug === 'index' ? '' : o.slug}">
<meta property="og:type" content="${o.ogType || 'website'}">
<meta property="og:title" content="${o.title}">
<meta property="og:description" content="${o.desc}">
<meta property="og:url" content="${DOMAIN}/${o.slug === 'index' ? '' : o.slug}">
<meta property="og:image" content="${DOMAIN}/${o.ogImage || 'assets/img/og-cover.png'}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="assets/img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/style.css">
${o.schema || ''}
</head>
<body>
<div class="topbar"><div class="container topbar__inner">
  <div class="topbar__left">
    <a class="topbar__item" href="tel:+902129657077"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.86.68 2.75a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.32 1.81.55 2.75.68A2 2 0 0 1 22 16.92z"/></svg> 0212 965 70 77</a>
    <span class="topbar__item topbar__item--meb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> MEB Onaylı Kurum</span>
  </div>
  <div class="topbar__social">
    <a href="https://instagram.com/grisanatart" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
    <a href="https://www.youtube.com/@GriAKADEM%C4%B0" target="_blank" rel="noopener" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 12s0-3.5-.45-5.17a2.9 2.9 0 0 0-2.04-2.05C18.83 4.33 12 4.33 12 4.33s-6.83 0-8.5.45A2.9 2.9 0 0 0 1.44 6.83C1 8.5 1 12 1 12s0 3.5.44 5.17a2.9 2.9 0 0 0 2.05 2.05c1.68.45 8.5.45 8.5.45s6.83 0 8.5-.45a2.9 2.9 0 0 0 2.05-2.05C23 15.5 23 12 23 12zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg></a>
  </div>
</div></div>
<header class="header" id="header"><div class="container nav">
  <a class="brand" href="index.html" aria-label="Gri Akademi ana sayfa"><img class="brand__badge" src="assets/img/logo-badge.png" alt="Gri Akademi logosu"><span class="brand__text"><span class="brand__name">Gri Akademi</span><span class="brand__sub">Sanat Kursu</span></span></a>
  <nav aria-label="Ana menü"><ul class="nav__menu">
    <li><a href="index.html#hakkimizda">Kurumsal <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a><div class="dropdown"><a href="index.html#hakkimizda">Hakkımızda</a><a href="vizyonumuz.html">Vizyonumuz</a><a href="neden-biz.html">Neden Biz</a></div></li>
    <li><a href="index.html#hizmetler">Sanat Kursları <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a><div class="dropdown"><a href="gsf-hazirlik.html">GSF Hazırlık</a><a href="gsl-hazirlik.html">GSL Hazırlık</a><a href="hobi-resim.html">Hobi Resim</a></div></li>
    <li><a href="workshoplar.html">Workshoplar <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a><div class="dropdown"><a href="hobi-seramik.html">Hobi Seramik</a><a href="seramik-heykel.html">Seramik & Heykel</a><a href="mozaik.html">Mozaik</a><a href="vitray.html">Vitray</a></div></li>
    <li><a href="yurt-disi-portfolyo.html">Portfolyo <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg></a><div class="dropdown"><a href="yurt-ici-portfolyo.html">Yurt İçi Portfolyo</a><a href="yurt-disi-portfolyo.html">Yurt Dışı Portfolyo</a></div></li>
    <li><a href="cikmis-sorular.html">Çıkmış Sorular</a></li>
    <li><a href="blog.html" class="${o.active === 'blog' ? 'is-active' : ''}">Blog</a></li>
    <li><a href="index.html#iletisim">İletişim</a></li>
  </ul></nav>
  <div class="nav__actions"><a href="yetenek-testi.html" class="btn btn--primary nav__cta desktop-only">Yetenek Testi</a><button class="nav__toggle" id="navToggle" aria-label="Menüyü aç" aria-expanded="false"><span></span></button></div>
</div></header>
<div class="scrim" id="scrim"></div>
<aside class="mobile-nav" id="mobileNav" aria-label="Mobil menü">
  <div class="mobile-nav__head"><span class="brand__name">Gri Akademi</span><button class="nav__toggle" id="navClose" aria-label="Menüyü kapat" style="display:inline-flex"><span></span></button></div>
  <ul>
    <li><a href="index.html#hakkimizda">Hakkımızda</a></li><li><a href="vizyonumuz.html">Vizyonumuz</a></li><li><a href="neden-biz.html">Neden Biz</a></li><li><a href="gsf-hazirlik.html">GSF Hazırlık</a></li><li><a href="workshoplar.html">Workshoplar</a></li><li><a href="yurt-disi-portfolyo.html">Portfolyo</a></li><li><a href="cikmis-sorular.html">Çıkmış Sorular</a></li><li><a href="blog.html">Blog</a></li><li><a href="yetenek-testi.html">Yetenek Testi</a></li><li><a href="index.html#iletisim">İletişim</a></li>
  </ul>
  <a href="yetenek-testi.html" class="btn btn--primary">Yetenek Testi'ni Çöz</a>
  <div class="mobile-nav__contact">Hemen ara: <a href="tel:+905425983374">0542 598 33 74</a></div>
</aside>
<main>
${o.main}
</main>
<footer class="footer"><div class="container">
  <div class="footer__grid">
    <div><div class="footer__brand"><img src="assets/img/logo-badge.png" alt="Gri Akademi"><span class="brand__text"><span class="brand__name">Gri Akademi</span><span class="brand__sub">Sanat Kursu</span></span></div><p>2008'den beri Bakırköy'de güzel sanatlara hazırlık ve sanat eğitimi. Bakmayı değil görmeyi öğreten, yaşayan bir atölye.</p></div>
    <div><h4>Programlar</h4><ul><li><a href="gsf-hazirlik.html">GSF Hazırlık</a></li><li><a href="gsl-hazirlik.html">GSL Hazırlık</a></li><li><a href="hobi-resim.html">Hobi Resim</a></li><li><a href="seramik-heykel.html">Seramik & Heykel</a></li><li><a href="vitray.html">Vitray</a></li></ul></div>
    <div><h4>Kurumsal</h4><ul><li><a href="index.html#hakkimizda">Hakkımızda</a></li><li><a href="vizyonumuz.html">Vizyonumuz</a></li><li><a href="neden-biz.html">Neden Biz</a></li><li><a href="blog.html">Blog</a></li><li><a href="cikmis-sorular.html">Çıkmış Sorular</a></li><li><a href="yetenek-testi.html">Yetenek Testi</a></li><li><a href="kvkk-aydinlatma.html">KVKK Aydınlatma</a></li><li><a href="index.html#iletisim">İletişim</a></li></ul></div>
    <div><h4>İletişim</h4><ul class="footer__contact">
      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Zeytinlik Mah. Pancar Sok. No:19, Bakırköy</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.86.68 2.75a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.32 1.81.55 2.75.68A2 2 0 0 1 22 16.92z"/></svg> <a href="tel:+902129657077">0212 965 70 77</a></li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg> <a href="mailto:info@griarts.com.tr">info@griarts.com.tr</a></li>
    </ul></div>
  </div>
  <div class="footer__bottom"><span>© 2026 Gri Akademi Sanat Kursu · Tüm hakları saklıdır.</span><span>T.C. M.E.B. Onaylı Kurum</span></div>
</div></footer>
<script src="assets/js/main.js"></script>
<script src="assets/js/form.js"></script>
<script src="assets/js/chat.js"></script>
${o.extraJs || ''}
</body>
</html>`;
}

/* ================= KENAR ÇUBUĞU ================= */
function kategoriler() {
  const m = {};
  POSTS.forEach(p => { m[p.kategori] = (m[p.kategori] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}
function tumEtiketler() {
  const s = new Set();
  POSTS.forEach(p => (p.etiketler || []).forEach(e => s.add(e)));
  return [...s];
}

function sidebar(opts) {
  const araW = opts.ara ? `
      <div class="bwidget reveal">
        <h3 class="bwidget__title">Ara</h3>
        <div class="bsearch">${svgSearch}<input id="bSearch" type="search" placeholder="Yazılarda ara…" aria-label="Blog yazılarında ara"></div>
      </div>` : '';
  const katW = `
      <div class="bwidget reveal">
        <h3 class="bwidget__title">Kategoriler</h3>
        <ul class="bcats">${kategoriler().map(([k, n]) => `
          <li><a href="blog.html#k=${encodeURIComponent(k)}"${opts.ara ? ` data-cat="${k}"` : ''}>${k} <span>${n}</span></a></li>`).join('')}
        </ul>
      </div>`;
  const sonW = `
      <div class="bwidget reveal">
        <h3 class="bwidget__title">Son Gönderiler</h3>
        <ul class="brecent">${POSTS.slice(0, 4).map(p => `
          <li><a href="blog-${p.slug}.html">${p.title}</a><small>${svgCal} ${tarihTR(p.tarih)}</small></li>`).join('')}
        </ul>
      </div>`;
  const hizW = `
      <div class="bwidget reveal">
        <h3 class="bwidget__title">Hizmetlerimiz</h3>
        <ul class="bservices">${HIZMETLER.map(([u, a]) => `
          <li><a href="${u}">${a} ${svgArrow}</a></li>`).join('')}
        </ul>
      </div>`;
  const etkW = `
      <div class="bwidget reveal">
        <h3 class="bwidget__title">Etiketler</h3>
        <div class="btags">${tumEtiketler().map(e => `<a class="btag" href="blog.html#e=${encodeURIComponent(e)}"${opts.ara ? ` data-tag="${e}"` : ''}>${e}</a>`).join('')}</div>
      </div>`;
  const ctaW = `
      <div class="bwidget bwidget--cta reveal">
        <h3>Hangi program sana göre?</h3>
        <p>2 dakikalık Yetenek Testi ile öğren.</p>
        <a href="yetenek-testi.html" class="btn btn--primary">Testi Çöz ${svgArrow}</a>
      </div>`;
  return `<aside class="bside">${araW}${katW}${sonW}${hizW}${etkW}${ctaW}</aside>`;
}

/* ================= INDEX ================= */
function buildIndex() {
  const cards = POSTS.map(p => {
    const filtre = [p.title, p.excerpt, p.kategori, ...(p.etiketler || [])].join(' ').toLowerCase();
    return `
      <article class="bcard reveal" data-cat="${p.kategori}" data-f="${filtre.replace(/"/g, '')}">
        <div class="bcard__body">
          <div class="bcard__cats"><a class="bchip" href="#k=${encodeURIComponent(p.kategori)}" data-cat="${p.kategori}">${p.kategori}</a></div>
          <h2 class="bcard__title"><a href="blog-${p.slug}.html">${p.title}</a></h2>
          <p class="bcard__excerpt">${p.excerpt}</p>
          <div class="bcard__meta"><span>${svgCal} ${tarihTR(p.tarih)}</span><span>${svgClock} ${p.readMinutes} dk okuma</span></div>
          <a class="bcard__more" href="blog-${p.slug}.html">Devamını oku ${svgArrow}</a>
        </div>
        <a class="bcard__media" href="blog-${p.slug}.html" tabindex="-1" aria-hidden="true"><img src="${p.kapak}" alt="${p.kapakAlt}" loading="lazy"></a>
      </article>`;
  }).join('');

  const filtreJs = `
<script>
(function(){
  'use strict';
  var input=document.getElementById('bSearch');
  var cards=[].slice.call(document.querySelectorAll('.bcard'));
  var note=document.getElementById('bNote'), noteTxt=document.getElementById('bNoteTxt'), clearBtn=document.getElementById('bClear');
  var aktifKat='';
  function uygula(){
    var q=(input.value||'').toLowerCase().trim(), n=0;
    cards.forEach(function(c){
      var ok=(!aktifKat||c.getAttribute('data-cat')===aktifKat)&&(!q||c.getAttribute('data-f').indexOf(q)>-1);
      c.style.display=ok?'':'none'; if(ok)n++;
    });
    var aktif=aktifKat||q;
    note.hidden=!aktif;
    if(aktif) noteTxt.textContent=n+' yazı bulundu'+(aktifKat?' — kategori: '+aktifKat:'');
    document.querySelectorAll('[data-cat]').forEach(function(a){
      if(a.classList.contains('bcard'))return;
      a.classList.toggle('is-on',a.getAttribute('data-cat')===aktifKat);
    });
  }
  input&&input.addEventListener('input',uygula);
  document.querySelectorAll('a[data-cat],a[data-tag]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var t=a.getAttribute('data-tag');
      if(t!==null){aktifKat='';input.value=t;}
      else{var k=a.getAttribute('data-cat');aktifKat=(aktifKat===k)?'':k;}
      uygula();
      document.querySelector('.blog-main').scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
  clearBtn&&clearBtn.addEventListener('click',function(){aktifKat='';input.value='';uygula();});
  // derin bağlantı: blog.html#k=Kategori / #e=etiket
  var h=decodeURIComponent(location.hash||'');
  if(h.indexOf('#k=')===0){aktifKat=h.slice(3);uygula();}
  else if(h.indexOf('#e=')===0){input.value=h.slice(3);uygula();}
})();
</script>`;

  const main = `
<section class="page-hero"><div class="container">
  <div class="breadcrumb"><a href="index.html">Ana Sayfa</a> / <span>Blog</span></div>
  <span class="kicker">Rehberler &amp; İpuçları</span>
  <h1>Gri Akademi <em>Blog</em></h1>
  <p class="page-hero__lead">Yetenek sınavı hazırlığı, portfolyo, teknik ipuçları ve atölye rehberleri — 2008'den beri biriktirdiğimiz tecrübeden.</p>
</div></section>
<section class="section" style="padding-top:clamp(30px,4vw,50px)"><div class="container">
  <div class="blog-layout">
    <div class="blog-main">
      <div class="bnote" id="bNote" hidden><span id="bNoteTxt"></span><button type="button" id="bClear">Filtreyi temizle ✕</button></div>
      ${cards}
    </div>
    ${sidebar({ ara: true })}
  </div>
</div></section>`;

  const schema = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Blog","name":"Gri Akademi Blog","url":"${DOMAIN}/blog.html","publisher":{"@type":"EducationalOrganization","name":"Gri Akademi Sanat Kursu","url":"${DOMAIN}/"}}</script>`;
  return shell({
    title: 'Blog — Sanat Eğitimi Rehberleri & İpuçları | Gri Akademi',
    desc: 'Güzel sanatlar yetenek sınavı hazırlığı, portfolyo, karakalem ve atölye rehberleri. Gri Akademi\'nin 18 yıllık tecrübesinden faydalı içerikler.',
    slug: 'blog.html', active: 'blog', main, schema, extraJs: filtreJs,
  });
}

/* ================= TEKİL YAZI ================= */
function buildPost(p, i) {
  const others = POSTS.filter((_, j) => j !== i).slice(0, 2);
  const schema = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":${JSON.stringify(p.title)},"description":${JSON.stringify(p.seoDesc)},"image":"${DOMAIN}/${p.kapak}","datePublished":"${p.tarih}","dateModified":"${p.tarih}","mainEntityOfPage":"${DOMAIN}/blog-${p.slug}.html","author":{"@type":"Organization","name":"Gri Akademi Sanat Kursu"},"publisher":{"@type":"Organization","name":"Gri Akademi Sanat Kursu","logo":{"@type":"ImageObject","url":"${DOMAIN}/assets/img/logo-badge.png"}}}</script>`;
  const ilgili = others.map(o => `<a class="post-card reveal" href="blog-${o.slug}.html"><span class="post-card__cat">${o.kategori}</span><h3 class="post-card__title">${o.title}</h3><p class="post-card__excerpt">${o.excerpt}</p><span class="post-card__more">Yazıyı Oku ${svgArrow}</span></a>`).join('');
  const etiketler = (p.etiketler || []).map(e => `<a class="btag" href="blog.html#e=${encodeURIComponent(e)}">${e}</a>`).join('');

  const main = `
<section class="page-hero page-hero--post"><div class="container">
  <div class="breadcrumb"><a href="index.html">Ana Sayfa</a> / <a href="blog.html">Blog</a> / <span>${p.kategori}</span></div>
  <div class="article__meta"><a class="bchip" href="blog.html#k=${encodeURIComponent(p.kategori)}">${p.kategori}</a><span>${svgCal} ${tarihTR(p.tarih)}</span><span>${svgClock} ${p.readMinutes} dk okuma</span></div>
  <h1 style="font-size:clamp(1.9rem,4.2vw,2.9rem);max-width:860px">${p.title}</h1>
</div></section>
<section class="section" style="padding-top:clamp(26px,4vw,42px)"><div class="container">
  <div class="blog-layout">
    <div class="blog-main">
      <figure class="article__cover reveal"><img src="${p.kapak}" alt="${p.kapakAlt}"></figure>
      <article class="article"><div class="article__body">
${p.bodyHtml}
      </div></article>
      <div class="article__tags">${etiketler}</div>
      <div class="article__foot"><a class="back" href="blog.html">${svgBack} Tüm yazılar</a><a href="index.html#iletisim" class="btn btn--primary">Ücretsiz Deneme Dersi</a></div>
    </div>
    ${sidebar({ ara: false })}
  </div>
  <div class="block-head reveal" style="margin-top:clamp(40px,6vw,64px)"><span class="kicker">Devamı</span><h2 class="section-title">İlgili yazılar</h2></div>
  <div class="blog-grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${ilgili}</div>
</div></section>`;

  return shell({
    title: `${p.title} | Gri Akademi Blog`,
    desc: p.seoDesc, slug: `blog-${p.slug}.html`, ogType: 'article', ogImage: p.kapak,
    active: 'blog', main, schema,
  });
}

/* ================= ÇALIŞTIR ================= */
fs.writeFileSync(path.join(ROOT, 'blog.html'), buildIndex(), 'utf8');
console.log(`yazıldı: blog.html (index, ${POSTS.length} yazı, ${kategoriler().length} kategori, ${tumEtiketler().length} etiket)`);
POSTS.forEach((p, i) => {
  fs.writeFileSync(path.join(ROOT, `blog-${p.slug}.html`), buildPost(p, i), 'utf8');
  console.log('yazıldı: blog-' + p.slug + '.html');
});
console.log('TAMAM.');
