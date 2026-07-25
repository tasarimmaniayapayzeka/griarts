/* Gri Akademi — Öğrenci Portalı (DEMO) etkileşimleri */
(function () {
  'use strict';

  /* ---------- rol kapısı ---------- */
  var role;
  try { role = localStorage.getItem('griarts_demo_role'); } catch (e) { role = null; }
  // demo kolaylığı: ?rol=ogrenci|veli ile doğrudan giriş (deep-link)
  try {
    var q = new URLSearchParams(location.search).get('rol');
    if (q === 'ogrenci' || q === 'veli') { role = q; localStorage.setItem('griarts_demo_role', q); }
  } catch (e) {}
  if (role !== 'ogrenci' && role !== 'veli') {
    window.location.replace('ogrenci-giris.html');
    return;
  }

  /* ---------- persona ---------- */
  var PERSONA = {
    ogrenci: { name: 'Elif Demir', initials: 'ED', chipRole: 'Öğrenci · GSF Hazırlık',
      greet: 'Merhaba Elif, tekrar hoş geldin 👋', profRole: 'Öğrenci · GSF Hazırlık Programı',
      labelGelisim: 'Gelişim Defterim', labelProgram: 'Ders Programım' },
    veli: { name: 'Ayşe Demir', initials: 'AD', chipRole: 'Veli · Elif Demir',
      greet: 'Merhaba Ayşe Hanım, hoş geldiniz 👋', profRole: 'Veli · Elif Demir (GSF Hazırlık)',
      labelGelisim: 'Çocuğumun Gelişimi', labelProgram: 'Program & Devamsızlık' }
  };
  var P = PERSONA[role];
  var body = document.body;

  var set = function (sel, txt) { var el = document.querySelector(sel); if (el) el.textContent = txt; };
  set('#chipName', P.name); set('#chipRole', P.chipRole); set('#chipAvatar', P.initials);
  set('#profName', P.name); set('#profRole', P.profRole); set('#profAvatar', P.initials);
  var lg = document.querySelector('[data-label-gelisim]'); if (lg) lg.textContent = P.labelGelisim;
  var lp = document.querySelector('[data-label-program]'); if (lp) lp.textContent = P.labelProgram;

  /* ---------- role-özel blok görünürlüğü ---------- */
  document.querySelectorAll('.only-ogrenci').forEach(function (el) { el.style.display = (role === 'ogrenci') ? '' : 'none'; });
  document.querySelectorAll('.only-veli').forEach(function (el) { el.style.display = (role === 'veli') ? '' : 'none'; });

  /* ---------- nav rol filtresi ---------- */
  document.querySelectorAll('.pnav a[data-role]').forEach(function (a) {
    var r = a.getAttribute('data-role');
    var show = (r === 'both' || r === role);
    var li = a.closest('li'); if (li) li.style.display = show ? '' : 'none';
  });

  /* ---------- görünüm başlıkları ---------- */
  var TITLES = {
    ozet:    { t: 'Genel Bakış', s: P.greet },
    gelisim: { t: P.labelGelisim, s: 'Her dersteki çalışman ve eğitmen notların' },
    program: { t: P.labelProgram, s: 'Haftalık program, telafi ve devam durumu' },
    sinav:   { t: 'Hedef & Deneme Sınavı', s: 'Gelişim grafiği, yol haritası ve portfolyo' },
    kaynak:  { t: 'Kaynak Kütüphanesi', s: 'Föyler, notlar ve video ders tekrarları' },
    belge:   { t: 'Belgelerim', s: 'Öğrenci belgesi, sözleşme ve sertifika' },
    odeme:   { t: 'Ödeme & Aidat', s: 'Taksit planı ve bilgilendirme' },
    mesaj:   { t: 'Eğitmenle Mesajlaşma', s: 'Selin Hoca ile birebir iletişim' },
    profil:  { t: 'Profilim', s: 'Hesap ve program bilgilerin' }
  };
  var ALLOWED = {
    ozet: 1, gelisim: 1, program: 1, profil: 1,
    sinav: (role === 'ogrenci'), kaynak: (role === 'ogrenci'), belge: (role === 'ogrenci'),
    odeme: (role === 'veli'), mesaj: (role === 'veli')
  };

  var views = Array.prototype.slice.call(document.querySelectorAll('.pview'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.pnav a[data-view]'));

  function showView(v) {
    if (!ALLOWED[v]) v = 'ozet';
    views.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-view') === v); });
    navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-view') === v); });
    var meta = TITLES[v] || TITLES.ozet;
    set('#viewTitle', meta.t); set('#viewSub', meta.s);
    if (history.replaceState) history.replaceState(null, '', '#' + v);
    var c = document.querySelector('.pcontent'); if (c) c.scrollTop = 0;
    window.scrollTo(0, 0);
    closeSidebar();
  }

  navLinks.forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); showView(a.getAttribute('data-view')); });
  });
  document.querySelectorAll('[data-jump]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); showView(b.getAttribute('data-jump')); });
  });

  var startView = (location.hash || '').replace('#', '') || 'ozet';
  showView(startView);

  /* ---------- mobil sidebar ---------- */
  function openSidebar() { body.classList.add('psidebar-open'); }
  function closeSidebar() { body.classList.remove('psidebar-open'); }
  var burger = document.getElementById('burger');
  var scrim = document.getElementById('pscrim');
  if (burger) burger.addEventListener('click', function () { body.classList.contains('psidebar-open') ? closeSidebar() : openSidebar(); });
  if (scrim) scrim.addEventListener('click', closeSidebar);

  /* ---------- çıkış ---------- */
  var logout = document.getElementById('logout');
  if (logout) logout.addEventListener('click', function (e) {
    e.preventDefault();
    try { localStorage.removeItem('griarts_demo_role'); } catch (er) {}
    window.location.href = 'ogrenci-giris.html';
  });

  /* ---------- portfolyo seçici ---------- */
  var pfGrid = document.getElementById('pfGrid');
  var pfCount = document.getElementById('pfCount');
  function updatePf() { if (pfCount && pfGrid) pfCount.textContent = pfGrid.querySelectorAll('.pfitem.sel').length; }
  if (pfGrid) {
    pfGrid.querySelectorAll('.pfitem').forEach(function (it) {
      it.addEventListener('click', function () { it.classList.toggle('sel'); updatePf(); });
    });
    updatePf();
  }

  /* ---------- mesajlaşma (demo) ---------- */
  var chatbar = document.getElementById('chatbar');
  var chat = document.getElementById('chat');
  if (chatbar && chat) {
    chatbar.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = chatbar.querySelector('input');
      var val = inp.value.trim(); if (!val) return;
      var b = document.createElement('div');
      b.className = 'bubble me';
      b.textContent = val;
      var t = document.createElement('small'); t.textContent = 'Şimdi'; b.appendChild(t);
      chat.appendChild(b); chat.scrollTop = chat.scrollHeight; inp.value = '';
    });
  }

  /* ---------- lightbox (gelişim çalışmaları) ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbClose = document.getElementById('lbClose');
  function openLb(src) { if (!src || !lb) return; lbImg.src = src; lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); }
  function closeLb() { if (!lb) return; lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ''; }
  document.querySelectorAll('.zoom').forEach(function (el) {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', function () {
      var src = el.getAttribute('data-full') || (el.tagName === 'IMG' ? el.getAttribute('src') : (el.querySelector('img') && el.querySelector('img').getAttribute('src')));
      openLb(src);
    });
  });
  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lb) lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });

})();
