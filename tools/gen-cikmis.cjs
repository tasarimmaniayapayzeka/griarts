/* Gri Akademi — Çıkmış Sorular statik üreteci
   Kullanım: node tools/gen-cikmis.cjs
   Yeni yıl/üniversite eklemek için aşağıdaki VERI dizisini güncelle, scripti çalıştır. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

/* ============ VERİ ============ */
const VERI = {
  donem: '2024–2025',
  examlar: [
    {
      slug: 'mimar-sinan-cikmis-sorular',
      uni: 'Mimar Sinan GSF (MSGSÜ)',
      kisa: 'Mimar Sinan',
      bolumler: 'Resim · Heykel · Seramik · Sahne · Moda · Geleneksel ve Grafik–Animasyon bölümleri için',
      seoBaslik: 'Mimar Sinan (MSGSÜ) Çıkmış Sorular 2024-2025 — Yetenek Sınavı',
      seoAcik: 'Mimar Sinan Güzel Sanatlar Fakültesi (MSGSÜ) 2024-2025 yetenek sınavı çıkmış soruları ve çözüm ipuçları. Resim, heykel, seramik, grafik bölümleri — Gri Akademi arşivi.',
      sorular: [
        ['Orman yangınından hayvan kurtaran bir figür ve söndüren itfaiyeci.', 'İki figür arası anlatı; itfaiyeci–hayvan ilişkisi, hareket ve aciliyet; duman/ışık atmosferi.'],
        ['Resim atölyesinde model ve ressam.', 'Mekân perspektifi; iki figürün bakış ve poz ilişkisi; şövale ve atölye objeleriyle kompozisyon.'],
        ['Taşınan bir eskici dükkânında; koli taşıyan adam, yerde kırılmış porselen bebek ve bir kadın.', 'Üç öğe arası dramatik ilişki; kırık bebek anlatının odağı; hikâye anı yakalanmalı.'],
        ['Geleneksel atölyesinde hoca ve öğrenci.', 'Usta–çırak ilişkisi; atölye objeleriyle mekân; yakın etkileşim ve el hareketleri.'],
        ['Kâğıt veriliyor; buruşturup kendi elleriyle birlikte bir kompozisyon isteniyor.', 'Verilen gerçek nesne + kendi elin; doku ve gölge doğruluğu; yaratıcı kurgu.'],
        ['Terminalde otobüsten bavul indiren kadın ve çocuk; çocuk kucakta olacak.', 'Ağırlık ve denge; çocuğun kucaktaki oranı; hareket anı ve bavulun hacmi.'],
        ['Sandalye indiren nakliyeci, kadın ve çocuk.', 'Objenin ağırlığı ve figür duruşu; üç öğe arasında kompozisyon dengesi.'],
        ['Terzihanede makasla kumaş kesen bir figür ve yardımcısı; asma kattan bakılacak şekilde, boşluk–doluluk kavramına göre çizilecek.', 'Üstten bakış açısı; boşluk–doluluk dengesi kavramı; kumaş dokusu.'],
        ['Voleybol hakeminin gözünden, yukarıdan bakacak şekilde voleybol oynayan iki kişi; ritm kavramına göre çizilecek.', 'Kuş bakışı perspektif; ritm kavramı; hareketin tekrarı ve akışı.'],
        ['Üstünde objeler olan bir el arabasını sokakta süren eskici ve objelere bakan figür.', 'Objelerle dolu araba; iki figürün bakış ilişkisi; sokak zemini ve perspektif.'],
        ['Bulut, kitap, dalga, balık, gemi dümeni ve hasır şapkanın olduğu yaz temalı bir vitrinin mekân ve giysi düzenlemesini yapan bir erkek ve bir kadın figürü: biri portatif merdivene çıkıp tavana bir nesne asarken diğeri vitrin zeminiyle uğraşıyor.', 'Çok öğeli vitrin düzeni; iki figürün farklı eylemi; mekân derinliği ve denge.'],
        ['Elinde 40×30×20 cm ölçülerinde bir koli ile üç basamaklı merdiveni çıkmakta olan bir figür çiziniz. Soruda belirtilen dışında bir şey çizmeyiniz.', 'SADECE istenen çizilmeli; ölçü-oran doğruluğu; merdiven perspektifi ve ağırlık hissi.'],
        ['Elinde tuttuğu cam tabakları bulaşık makinesine yerleştiren figür; makinede seramik tabak-çanak olacak şekilde ve kendi elinizi kullanarak kompoze ediniz.', 'Verilen sahne + kendi elin; nesne dönüşümü (cam→seramik); iç mekân perspektifi.']
      ]
    },
    {
      slug: 'marmara-cikmis-sorular',
      uni: 'Marmara GSF',
      kisa: 'Marmara',
      bolumler: 'Resim · Heykel · Tekstil · Geleneksel · Seramik ve Grafik bölümleri için',
      seoBaslik: 'Marmara GSF Çıkmış Sorular 2024-2025 — Yetenek Sınavı',
      seoAcik: 'Marmara Üniversitesi Güzel Sanatlar Fakültesi 2024-2025 yetenek sınavı çıkmış soruları ve çözüm ipuçları. Kompozisyon ve illüstrasyon soruları — Gri Akademi arşivi.',
      sorular: [
        ['"Teknoloji, ekoloji ve insan" gelecek bağlamında / "Mitoloji, doğa ve beden" gelecek bağlamında / "Kent, iletişim ve kültür" gündelik yaşamda / "Göç, hareket ve hız" kültürel bağlamda çizilecek. (4 oturum baraj)', 'Kavramsal illüstrasyon; verilen temayı özgün bir kurguya çevir; 4 oturum boyunca baraj.'],
        ['Ahşap, metal ve cam objeler ile kültürel nesne çizimi.', 'Farklı malzeme dokuları; ışık ve yansıma farkları; nesne kompozisyonu.'],
        ['Orhan Veli şiirinden kesit verilip illüstrasyonu istendi.', 'Şiirin duygusunu görsele çevir; özgün ve okunur bir yorum kur.'],
        ['Bir hayvan, yansıma ve merdiven ile düş ortamında tasarım istendi.', 'Sürreal/düş atmosferi; verilen üç öğeyi bütünsel bir sahnede birleştir.'],
        ['Arkeoloji müzesinde en az 2 figür + 1 kedi / Kuaförde 2 figür + 1 köpek / Hastanede 2 figür + 1 martı / Spor salonunda 2 figür + 1 maymun / Çiftlikte 2 figür + 1 inek / Çocuk parkında 2 figür + 1 keçi / Deniz kenarında 2 figür + 1 domuz / Tren garında 2 figür + 1 boğa / Sanat atölyesinde 2 figür + 1 at. (9 oturum baraj)', 'Verilen mekâna uygun figür–hayvan kurgusu; her oturum farklı sahne; baraj sistemi.'],
        ['Teknoloji, gelecek ve iletişim kavramlarıyla birlikte en az iki figürlü kompozisyon kurunuz.', 'Soyut kavramları figürlerle anlat; kompozisyon bütünlüğü ve okunurluk.'],
        ['Dönem filmi çekilen bir sette en az iki figürlü kompozisyon kurunuz.', 'Set atmosferi ve dönem detayları; iki figür arası ilişki.'],
        ['Terzi ve yamağı bir kıyafet provasında.', 'Kıyafet provası anı; iki figür etkileşimi; kumaş ve iğne detayı.'],
        ['Bir mitolojik karakter ve mitolojik canlı seçip, onların yolculuğunu anlatan hayalî–fantastik film afişi tasarlayınız.', 'Afiş tasarımı; tipografi–görsel dengesi; anlatı ve atmosfer.'],
        ['Bir alt geçitte en az 3 müzisyen, 3 farklı çalgı çalıyor.', 'Üç figür–üç çalgı; mekânın akustik hissi; ritm ve hareket.'],
        ['Dağınık odayı toplayan kadın bavulunu toplarken, adam ona ayakkabı getirir.', 'Anlatı anı; oda dağınıklığının dokusu; iki figür arası ilişki.'],
        ['Sokak hayvanlarını besleyen en az 2 figürlü kompozisyon çiziniz.', 'Şefkat anı; figür–hayvan ilişkisi; sokak atmosferi.'],
        ['Otobüse binmeye çalışan yaşlı yolcu; şoför yolcuya bakıyor, durağın yanındaki reklam panosunda spor ayakkabı ve marka ibaresi yer alıyor.', 'Anlatı + reklam panosu (tipografi); şoför–yolcu bakış ilişkisi.'],
        ['Sandalye konuluyor; ayakkabı gösterilip hayalî olarak kompoze edilmesi isteniyor.', 'Verilen nesne + hayalî kurgu; oran ve perspektif tutarlılığı.'],
        ['Fotokopiden figür isteniyor.', 'Verilen figürü doğru oran, açık-koyu ve ışıkla aktar.'],
        ['Sınav çıkışı mutlu bir kız babasına koşuyor, mutsuz bir erkek annesine gidiyor.', 'Zıt duygular; iki ayrı anlatı; ifade ve beden dili.']
      ]
    }
  ]
};

/* ============ İKONLAR ============ */
const svgArrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
const svgFile = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
const svgBulb = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>';

/* ============ ŞABLON (header/footer) ============ */
function shell(o) {
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.className+=" js";</script>
<title>${o.title}</title>
<meta name="description" content="${o.desc}">
<link rel="canonical" href="https://www.griarts.com/${o.slug}">
<meta property="og:type" content="article">
<meta property="og:title" content="${o.title}">
<meta property="og:description" content="${o.desc}">
<meta property="og:image" content="assets/img/og-cover.png">
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
    <li><a href="cikmis-sorular.html" class="${o.active === 'cikmis' ? 'is-active' : ''}">Çıkmış Sorular</a></li>
    <li><a href="index.html#iletisim">İletişim</a></li>
  </ul></nav>
  <div class="nav__actions"><a href="yetenek-testi.html" class="btn btn--primary nav__cta desktop-only">Yetenek Testi</a><button class="nav__toggle" id="navToggle" aria-label="Menüyü aç" aria-expanded="false"><span></span></button></div>
</div></header>
<div class="scrim" id="scrim"></div>
<aside class="mobile-nav" id="mobileNav" aria-label="Mobil menü">
  <div class="mobile-nav__head"><span class="brand__name">Gri Akademi</span><button class="nav__toggle" id="navClose" aria-label="Menüyü kapat" style="display:inline-flex"><span></span></button></div>
  <ul>
    <li><a href="index.html#hakkimizda">Hakkımızda</a></li><li><a href="vizyonumuz.html">Vizyonumuz</a></li><li><a href="neden-biz.html">Neden Biz</a></li><li><a href="gsf-hazirlik.html">GSF Hazırlık</a></li><li><a href="gsl-hazirlik.html">GSL Hazırlık</a></li><li><a href="workshoplar.html">Workshoplar</a></li><li><a href="yurt-disi-portfolyo.html">Portfolyo</a></li><li><a href="cikmis-sorular.html">Çıkmış Sorular</a></li><li><a href="yetenek-testi.html">Yetenek Testi</a></li><li><a href="index.html#iletisim">İletişim</a></li>
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
    <div><h4>Kurumsal</h4><ul><li><a href="index.html#hakkimizda">Hakkımızda</a></li><li><a href="vizyonumuz.html">Vizyonumuz</a></li><li><a href="neden-biz.html">Neden Biz</a></li><li><a href="yetenek-testi.html">Yetenek Testi</a></li><li><a href="cikmis-sorular.html">Çıkmış Sorular</a></li><li><a href="index.html#galeri">Galeri</a></li><li><a href="index.html#iletisim">İletişim</a></li></ul></div>
    <div><h4>İletişim</h4><ul class="footer__contact">
      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> Zeytinlik Mah. Pancar Sok. No:19, Bakırköy</li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.94.36 1.86.68 2.75a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.32 1.81.55 2.75.68A2 2 0 0 1 22 16.92z"/></svg> <a href="tel:+902129657077">0212 965 70 77</a></li>
      <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg> <a href="mailto:info@griarts.com">info@griarts.com</a></li>
    </ul></div>
  </div>
  <div class="footer__bottom"><span>© 2026 Gri Akademi Sanat Kursu · Tüm hakları saklıdır.</span><span>T.C. M.E.B. Onaylı Kurum</span></div>
</div></footer>
<script src="assets/js/main.js"></script>
<script src="assets/js/form.js"></script>
<script src="assets/js/chat.js"></script>
</body>
</html>`;
}

/* ============ HUB ============ */
function buildHub() {
  const cards = VERI.examlar.map(e => `
      <a class="exam-card reveal" href="${e.slug}.html">
        <div class="exam-card__uni">${e.uni}</div>
        <div class="exam-card__meta">${VERI.donem} · ${e.bolumler}</div>
        <div class="exam-card__count">${svgFile} ${e.sorular.length} çıkmış soru + çözüm ipuçları</div>
        <div class="exam-card__more">İncele ${svgArrow}</div>
      </a>`).join('');
  const main = `
<section class="page-hero"><div class="container">
  <div class="breadcrumb"><a href="index.html">Ana Sayfa</a> / <span>Çıkmış Sorular</span></div>
  <span class="kicker">${VERI.donem} Arşivi</span>
  <h1>Güzel sanatlar <em>çıkmış sınav soruları</em></h1>
  <p class="page-hero__lead">Mimar Sinan ve Marmara Güzel Sanatlar Fakültesi yetenek sınavlarında çıkan güncel soruları, çözüm ipuçlarıyla birlikte derledik. Çizip deneyebilir, yüz yüze görüşmede getirip birlikte yorumlayabilirsiniz.</p>
</div></section>
<section class="section"><div class="container">
  <div class="exam-layout">
    <div>
      <div class="block-head reveal"><span class="kicker">Üniversiteye Göre</span><h2 class="section-title">Sınav arşivini seç</h2></div>
      <div class="exam-cards">${cards}
      </div>
      <div class="exam-note reveal">Senelere ve okulların ekollerine göre sorular değişkenlik gösterse de; temelde <b>çizgi, oran-orantı, perspektif ve açık-koyu</b> gibi sanatın giriş konularından beklentiyle sorular sorulur. Bu soruları en doğru şekilde ve doğru yöntemle çözmeyi, <b>18 yıllık tecrübe ve vizyonla</b> öğrencilerimize aktarıyoruz.</div>
    </div>
    <aside>
      <div class="sidebar-cta">
        <img src="assets/img/logo-badge.png" alt="" style="width:64px;height:64px;margin:0 auto 18px">
        <h3>Bu soruları çözmeyi öğren</h3>
        <p>Bireysel programımızla çıkmış soruları adım adım çalışıyor, deneme sınavlarıyla sınav pratiği kazanıyorsun.</p>
        <a href="gsf-hazirlik.html" class="btn btn--primary" style="width:100%">GSF Hazırlık'ı İncele</a>
        <a href="yetenek-testi.html" class="btn btn--outline-light" style="width:100%;margin-top:10px">Yetenek Testi'ni Çöz</a>
      </div>
    </aside>
  </div>
</div></section>`;
  return shell({ title: `${VERI.donem} Çıkmış Sorular — Güzel Sanatlar Yetenek Sınavı | Gri Akademi`, desc: `Mimar Sinan (MSGSÜ) ve Marmara GSF ${VERI.donem} yetenek sınavı çıkmış soruları ve çözüm ipuçları. Gri Akademi arşivi, Bakırköy.`, slug: 'cikmis-sorular.html', active: 'cikmis', main });
}

/* ============ DETAY ============ */
function buildDetay(e) {
  const items = e.sorular.map((s, i) => `
        <div class="q-item"><span class="q-item__n">${String(i + 1).padStart(2, '0')}</span><div class="q-item__body"><span class="q-item__t">${s[0]}</span><span class="q-item__tip">${svgBulb} ${s[1]}</span></div></div>`).join('');
  const digerler = VERI.examlar.filter(x => x.slug !== e.slug).map(x => `<a class="btn btn--outline-light" href="${x.slug}.html" style="width:100%;margin-top:10px">${x.uni} Soruları</a>`).join('');
  const schema = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article","headline":"${e.seoBaslik}","about":"${e.uni} yetenek sınavı çıkmış soruları","author":{"@type":"Organization","name":"Gri Akademi Sanat Kursu"},"publisher":{"@type":"Organization","name":"Gri Akademi Sanat Kursu"}}</script>`;
  const main = `
<section class="page-hero"><div class="container">
  <div class="breadcrumb"><a href="index.html">Ana Sayfa</a> / <a href="cikmis-sorular.html">Çıkmış Sorular</a> / <span>${e.kisa}</span></div>
  <span class="kicker">${VERI.donem} · ${e.uni}</span>
  <h1>${e.uni} <em>çıkmış sorular</em></h1>
  <p class="page-hero__lead">${e.bolumler}. ${e.sorular.length} güncel çıkmış soru ve her biri için çözüm ipucu. Örnekleri çizip deneyebilir, atölyede birlikte yorumlayabilirsiniz.</p>
</div></section>
<section class="section"><div class="container">
  <div class="exam-layout">
    <div>
      <div class="exam-block">
        <h2 class="exam-block__title"><span class="dot"></span> ${e.uni} Soruları</h2>
        <p class="exam-block__sub">${e.bolumler}</p>
        <div class="q-list">${items}
        </div>
      </div>
      <div class="exam-note">Bu sorular temelde <b>çizgi, oran-orantı, perspektif ve açık-koyu</b> hâkimiyetini ölçer. İpuçları genel yaklaşımı gösterir; doğru yöntemi <b>18 yıllık tecrübeyle</b> birebir çalışıyoruz. Ücretsiz deneme dersinde seviyeni belirleyelim.</div>
    </div>
    <aside>
      <div class="sidebar-cta">
        <img src="assets/img/logo-badge.png" alt="" style="width:64px;height:64px;margin:0 auto 18px">
        <h3>Bu soruları çözmeyi öğren</h3>
        <p>Çıkmış soruları jüri beklentisiyle çözüyor, deneme sınavlarıyla pratik kazanıyorsun.</p>
        <a href="gsf-hazirlik.html" class="btn btn--primary" style="width:100%">GSF Hazırlık'ı İncele</a>
        ${digerler}
      </div>
    </aside>
  </div>
</div></section>`;
  return shell({ title: `${e.seoBaslik} | Gri Akademi`, desc: e.seoAcik, slug: `${e.slug}.html`, active: 'cikmis', main, schema });
}

/* ============ ÜRET ============ */
fs.writeFileSync(path.join(ROOT, 'cikmis-sorular.html'), buildHub(), 'utf8');
console.log('yazıldı: cikmis-sorular.html (hub)');
VERI.examlar.forEach(e => {
  fs.writeFileSync(path.join(ROOT, `${e.slug}.html`), buildDetay(e), 'utf8');
  console.log(`yazıldı: ${e.slug}.html (${e.sorular.length} soru)`);
});
console.log('TAMAM.');
