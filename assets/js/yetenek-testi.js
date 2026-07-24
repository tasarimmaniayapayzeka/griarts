/* Gri Akademi — Yetenek Testi (program bulucu) */
(function () {
  'use strict';
  var app = document.getElementById('quiz-app');
  if (!app) return;

  var WA = '905425983374';

  /* ---- ikonlar ---- */
  var I = {
    pencil:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    cap:'<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    palette:'<circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2v-1c0-1.1.9-2 2-2h1a4 4 0 0 0 4-4 10 10 0 0 0-9-11z"/>',
    vase:'<path d="M8 2h8M9 2c0 3-3 4-3 8a6 6 0 0 0 12 0c0-4-3-5-3-8"/><path d="M6 14a10 4 0 0 0 12 0"/>',
    cube:'<path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    window:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18M15 3l3 6"/>',
    tools:'<path d="m14.7 6.3-1 1a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l1-1a6 6 0 0 1-7.9 7.9l-6.3 6.3a2.1 2.1 0 0 1-3-3l6.3-6.3a6 6 0 0 1 7.9-7.9z"/>',
    folder:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    user:'<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    heart:'<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/>',
    clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    check:'<polyline points="20 6 9 17 4 12"/>',
    arrow:'<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    back:'<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>'
  };
  function svg(p, sw) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }

  /* ---- sorular ---- */
  var Q = [
    { key:'hedef', q:'Seni en çok ne tanımlıyor?', opts:[
      { v:'gsf', t:'Güzel Sanatlar Fakültesi (üniversite) sınavına hazırlanıyorum', ic:I.cap },
      { v:'gsl', t:'Güzel Sanatlar Lisesine hazırlanıyorum', ic:I.pencil },
      { v:'hobi', t:'Hobi olarak sanat yapmak ve keyif almak istiyorum', ic:I.heart },
      { v:'portfolyo', t:'Üniversiteye başvuru için portfolyo hazırlamak istiyorum', ic:I.folder },
      { v:'craft', t:'El sanatı atölyesi (seramik, mozaik, vitray) denemek istiyorum', ic:I.tools }
    ]},
    { key:'yas', q:'Yaş grubun hangisi?', opts:[
      { v:'12-14', t:'12 – 14 yaş (ortaokul)', ic:I.user },
      { v:'15-18', t:'15 – 18 yaş (lise)', ic:I.user },
      { v:'18+', t:'18 yaş ve üzeri', ic:I.user }
    ]},
    { key:'deneyim', q:'Sanat ve çizim deneyimin ne düzeyde?', opts:[
      { v:'sifir', t:'Sıfırdan başlıyorum, neredeyse hiç çizmedim', ic:I.pencil },
      { v:'az', t:'Ara sıra çiziyorum, temel biliyorum', ic:I.pencil },
      { v:'duzenli', t:'Düzenli çiziyorum veya daha önce hazırlık gördüm', ic:I.pencil }
    ]},
    { key:'ilgi', q:'Seni en çok hangisi heyecanlandırıyor?', opts:[
      { v:'karakalem', t:'Karakalem, desen ve portre', ic:I.pencil },
      { v:'renk', t:'Renk ve boya (akrilik, suluboya)', ic:I.palette },
      { v:'uc-boyut', t:'Üç boyut, çamur ve heykel', ic:I.cube },
      { v:'cam-mozaik', t:'Cam, mozaik ve el sanatları', ic:I.grid },
      { v:'tasarim', t:'Tasarım, portfolyo ve yaratıcı projeler', ic:I.folder }
    ]},
    { key:'aciliyet', q:'Hedefin için zamanın ne kadar?', opts:[
      { v:'bu-yil', t:'Bu yıl sınavım / başvurum var', ic:I.clock },
      { v:'1-2-yil', t:'Önümüzdeki 1 – 2 yıl içinde', ic:I.clock },
      { v:'keyif', t:'Acelem yok, keyif için öğrenmek istiyorum', ic:I.heart }
    ]}
  ];

  /* ---- programlar ---- */
  var P = {
    'gsf': { title:'Güzel Sanatlar Fakültesi Hazırlık', page:'gsf-hazirlik.html', chip:'Sınav Hazırlık', ic:I.cap,
      d:'Desen, imgesel çizim ve gerçek çıkmış soru pratiğiyle MSGSÜ ve Marmara yetenek sınavlarına hazırlanacağın program tam sana göre.' },
    'gsl': { title:'Güzel Sanatlar Lisesi Hazırlık', page:'gsl-hazirlik.html', chip:'Sınav Hazırlık', ic:I.pencil,
      d:'7–8. sınıf yaş grubuna özel; desen ve imgesel odaklı bu lise hazırlık programı senin için biçilmiş kaftan.' },
    'hobi-resim': { title:'Hobi Resim', page:'hobi-resim.html', chip:'Hobi', ic:I.palette,
      d:'Karakalem, akrilik ve suluboyayla baskısız, ilham verici bir resim atölyesi tam istediğin yer.' },
    'hobi-seramik': { title:'Hobi Seramik', page:'hobi-seramik.html', chip:'Atölye', ic:I.vase,
      d:'Çamura dokunmak, tornada çalışmak ve kendi seramiklerini üretmek sana çok iyi gelecek.' },
    'seramik-heykel': { title:'Seramik ve Heykel', page:'seramik-heykel.html', chip:'Atölye', ic:I.cube,
      d:'Hem seramik hem heykelle üç boyutlu düşünmeyi seven biri için ideal bir atölye seni bekliyor.' },
    'mozaik': { title:'Mozaik', page:'mozaik.html', chip:'Atölye', ic:I.grid,
      d:'Cam ve taşı sabırla sanata dönüştürmeyi seveceksin; mozaik atölyesi tam sana uygun.' },
    'vitray': { title:'Vitray', page:'vitray.html', chip:'Atölye', ic:I.window,
      d:'Işığı renge dönüştüren Tiffany tekniğiyle cam sanatı ilgini fazlasıyla çekecek.' },
    'workshoplar': { title:'Workshoplar', page:'workshoplar.html', chip:'Atölye', ic:I.tools,
      d:'Farklı atölyeleri (seramik, mozaik, vitray) deneyip sevdiğini seçebileceğin workshoplar sana göre.' },
    'yurt-ici': { title:'Yurt İçi Portfolyo Hazırlığı', page:'yurt-ici-portfolyo.html', chip:'Danışmanlık', ic:I.folder,
      d:'Türkiye’deki tasarım bölümlerine güçlü bir portfolyo için birebir danışmanlık tam sana uygun.' },
    'yurt-disi': { title:'Yurt Dışı Portfolyo Hazırlığı', page:'yurt-disi-portfolyo.html', chip:'Danışmanlık', ic:I.globe,
      d:'RISD, Parsons, Central Saint Martins gibi okullara uluslararası standartta portfolyo danışmanlığı sana göre.' }
  };

  /* ---- eşleştirme ---- */
  function recommend(a) {
    if (a.hedef === 'gsf') return a.yas === '12-14' ? 'gsl' : 'gsf';
    if (a.hedef === 'gsl') return 'gsl';
    if (a.hedef === 'portfolyo') return a.yas === '18+' ? 'yurt-disi' : 'yurt-ici';
    if (a.hedef === 'craft') {
      if (a.ilgi === 'uc-boyut') return 'seramik-heykel';
      if (a.ilgi === 'cam-mozaik') return 'mozaik';
      if (a.ilgi === 'karakalem' || a.ilgi === 'renk') return 'hobi-resim';
      return 'workshoplar';
    }
    if (a.hedef === 'hobi') {
      if (a.ilgi === 'uc-boyut') return 'hobi-seramik';
      if (a.ilgi === 'cam-mozaik') return 'mozaik';
      if (a.ilgi === 'tasarim') return 'yurt-ici';
      return 'hobi-resim';
    }
    return 'hobi-resim';
  }
  function personalNote(a) {
    var exp = a.deneyim === 'sifir'
      ? 'Sıfırdan başlıyor olman hiç sorun değil; öğrencilerimizin çoğu tam da böyle başlıyor.'
      : a.deneyim === 'az'
      ? 'Elindeki temeli doğru yöntemle hızla bir üst seviyeye taşıyabiliriz.'
      : 'Mevcut seviyeni ileri çalışmalarla bir adım öteye götürürüz.';
    var urg = a.aciliyet === 'bu-yil'
      ? 'Bu yıl hedefin olduğu için programlı ve yoğun bir tempo kuralım.'
      : a.aciliyet === '1-2-yil'
      ? 'Önünde zaman olması en büyük avantajın; sağlam bir temelle ilerleriz.'
      : 'Acele etmeden, keyif alarak öğrenebileceğin bir tempo sana göre.';
    return exp + ' ' + urg;
  }

  /* ---- durum ---- */
  var step = 0;            // 0..Q.length-1
  var answers = {};

  function render() {
    var cur = Q[step];
    var pct = Math.round((step / Q.length) * 100);
    var html = '';
    html += '<div class="quiz__top"><span>Soru ' + (step + 1) + ' / ' + Q.length + '</span><span class="quiz__hint">Kayıt gerektirmez</span></div>';
    html += '<div class="quiz__bar"><i style="width:' + pct + '%"></i></div>';
    html += '<h2 class="quiz__q">' + cur.q + '</h2>';
    html += '<div class="quiz__options">';
    cur.opts.forEach(function (o) {
      var sel = answers[cur.key] === o.v ? ' sel' : '';
      html += '<button type="button" class="quiz__opt' + sel + '" data-v="' + o.v + '">'
        + '<span class="ic">' + svg(o.ic, 1.7) + '</span>'
        + '<span>' + o.t + '</span>'
        + '<span class="tk">' + svg(I.check, 3) + '</span>'
        + '</button>';
    });
    html += '</div>';
    html += '<div class="quiz__nav">';
    html += step > 0 ? '<button type="button" class="quiz__back" id="qBack">' + svg(I.back) + ' Geri</button>' : '<span></span>';
    html += '<span class="quiz__hint">Bir seçenek seç →</span>';
    html += '</div>';
    app.innerHTML = html;

    app.querySelectorAll('.quiz__opt').forEach(function (b) {
      b.addEventListener('click', function () {
        answers[cur.key] = b.getAttribute('data-v');
        // kısa görsel geri bildirim, sonra ilerle
        app.querySelectorAll('.quiz__opt').forEach(function (x) { x.classList.remove('sel'); });
        b.classList.add('sel');
        setTimeout(function () {
          if (step < Q.length - 1) { step++; render(); window.scrollTo({ top: app.offsetTop - 90, behavior: 'smooth' }); }
          else { renderResult(); window.scrollTo({ top: app.offsetTop - 90, behavior: 'smooth' }); }
        }, 220);
      });
    });
    var back = document.getElementById('qBack');
    if (back) back.addEventListener('click', function () { step--; render(); });
  }

  function renderResult() {
    var key = recommend(answers);
    var prog = P[key];
    var note = personalNote(answers);
    var waMsg = encodeURIComponent('Merhaba! Yetenek Testi’nde bana "' + prog.title + '" programı önerildi. Ücretsiz deneme dersi ve bilgi için yazıyorum.');
    var html = '';
    html += '<div class="quiz__result">';
    html += '<div class="quiz__rbadge">' + svg(prog.ic, 1.7) + '</div>';
    html += '<div class="quiz__rlabel">Sana En Uygun Program</div>';
    html += '<h2 class="quiz__rtitle">' + prog.title + '</h2>';
    html += '<div class="quiz__rchip">' + prog.chip + '</div>';
    html += '<p class="quiz__rdesc">' + prog.d + ' ' + note + '</p>';
    html += '<div class="quiz__rcta">'
      + '<a href="' + prog.page + '" class="btn btn--primary">Programı İncele ' + svg(I.arrow) + '</a>'
      + '<a href="https://wa.me/' + WA + '?text=' + waMsg + '" target="_blank" rel="noopener" class="btn btn--ghost">WhatsApp’tan Sor</a>'
      + '</div>';

    // lead formu
    html += '<div class="quiz__lead" id="quizLead">';
    html += '<h3>Sonucunu ve ücretsiz deneme dersini al</h3>';
    html += '<p>Bilgilerini bırak, sana özel yol haritası için genellikle aynı gün dönüş yapalım.</p>';
    html += '<form id="quizForm" novalidate>';
    html += '<div class="field"><label for="qad">Adın Soyadın</label><input type="text" id="qad" placeholder="Adın" required></div>';
    html += '<div class="field"><label for="qtel">Telefon</label><input type="tel" id="qtel" placeholder="05xx xxx xx xx" required></div>';
    html += '<div class="field"><label for="qeposta">E-posta</label><input type="email" id="qeposta" placeholder="ornek@eposta.com"></div>';
    html += '<label class="quiz__kvkk"><input type="checkbox" id="qkvkk" required> Bilgilerimin yalnızca benimle iletişim için kullanılacağını kabul ediyorum.</label>';
    html += '<button type="submit" class="btn btn--primary" style="width:100%;margin-top:12px">Ücretsiz Deneme Dersi Talep Et</button>';
    html += '</form>';
    html += '</div>';

    html += '<div class="quiz__restart"><button type="button" id="qRestart">↺ Testi baştan çöz</button></div>';
    html += '</div>';
    app.innerHTML = html;

    document.getElementById('qRestart').addEventListener('click', function () { step = 0; answers = {}; render(); window.scrollTo({ top: app.offsetTop - 90, behavior: 'smooth' }); });

    var form = document.getElementById('quizForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ad = document.getElementById('qad'), tel = document.getElementById('qtel'), kv = document.getElementById('qkvkk'), eposta = document.getElementById('qeposta');
      if (!ad.value.trim()) { ad.focus(); return; }
      if (!tel.value.trim()) { tel.focus(); return; }
      if (!kv.checked) { kv.focus(); return; }
      var mailPart = eposta && eposta.value.trim() ? ' E-posta: ' + eposta.value.trim() + '.' : '';
      var msg = encodeURIComponent('Merhaba! Ben ' + ad.value.trim() + '. Yetenek Testi’nde bana "' + prog.title + '" önerildi. Ücretsiz deneme dersi için bilgi almak istiyorum. Tel: ' + tel.value.trim() + '.' + mailPart);
      var lead = document.getElementById('quizLead');
      lead.innerHTML = '<div class="quiz__ok">' + svg(I.check, 2) + '<h3>Teşekkürler, ' + ad.value.trim().split(' ')[0] + '!</h3>'
        + '<p>Talebini aldık, en kısa sürede sana döneceğiz. Dilersen hemen WhatsApp’tan da yazabilirsin:</p>'
        + '<a href="https://wa.me/' + WA + '?text=' + msg + '" target="_blank" rel="noopener" class="btn btn--primary" style="width:100%">WhatsApp’tan Devam Et</a></div>';
    });
  }

  /* ---- başlat butonu ---- */
  var startBtn = document.getElementById('quizStart');
  var intro = document.getElementById('quizIntro');
  if (startBtn) startBtn.addEventListener('click', function () {
    if (intro) intro.style.display = 'none';
    app.style.display = 'block';
    render();
    window.scrollTo({ top: app.offsetTop - 100, behavior: 'smooth' });
  });
})();
