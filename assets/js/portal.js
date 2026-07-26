/* Gri Akademi — Öğrenci Portalı (DEMO) etkileşimleri — tek rol: öğrenci */
(function () {
  'use strict';

  var body = document.body;

  /* ---------- giriş kapısı (demo) ---------- */
  var girisli;
  try { girisli = localStorage.getItem('griarts_demo_role'); } catch (e) { girisli = null; }
  // demo kolaylığı: ?rol= parametresiyle doğrudan giriş (deep-link)
  try {
    if (new URLSearchParams(location.search).has('rol')) {
      girisli = 'ogrenci';
      localStorage.setItem('griarts_demo_role', 'ogrenci');
    }
  } catch (e) {}
  if (!girisli) {
    window.location.replace('ogrenci-giris.html');
    return;
  }

  var set = function (sel, txt) { var el = document.querySelector(sel); if (el) el.textContent = txt; };

  /* ---------- görünüm başlıkları ---------- */
  var TITLES = {
    ozet:    { t: 'Genel Bakış', s: 'Merhaba Elif, tekrar hoş geldin 👋' },
    gelisim: { t: 'Gelişim Defterim', s: 'Her dersteki çalışman ve eğitmen notların' },
    program: { t: 'Ders Programım', s: 'Haftalık program, telafi ve devam durumu' },
    sinav:   { t: 'Hedef & Deneme Sınavı', s: 'Gelişim grafiği, yol haritası ve portfolyo' },
    kaynak:  { t: 'Kaynak Kütüphanesi', s: 'Föyler, notlar ve video ders tekrarları' },
    belge:   { t: 'Belgelerim', s: 'Öğrenci belgesi, sözleşme ve sertifika' },
    mesaj:   { t: 'Eğitmenle Mesajlaşma', s: 'Selin Hoca ile birebir iletişim' },
    profil:  { t: 'Profilim', s: 'Hesap ve program bilgilerin' }
  };

  var views = Array.prototype.slice.call(document.querySelectorAll('.pview'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.pnav a[data-view]'));

  function closeSidebar() { body.classList.remove('psidebar-open'); }

  function showView(v) {
    if (!TITLES[v]) v = 'ozet';
    views.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-view') === v); });
    navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-view') === v); });
    set('#viewTitle', TITLES[v].t); set('#viewSub', TITLES[v].s);
    if (history.replaceState) history.replaceState(null, '', '#' + v);
    window.scrollTo(0, 0);
    closeSidebar();
  }

  navLinks.forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); showView(a.getAttribute('data-view')); });
  });
  document.querySelectorAll('[data-jump]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); showView(b.getAttribute('data-jump')); });
  });

  showView((location.hash || '').replace('#', '') || 'ozet');

  /* ---------- mobil sidebar ---------- */
  var burger = document.getElementById('burger');
  var scrim = document.getElementById('pscrim');
  if (burger) burger.addEventListener('click', function () {
    body.classList.toggle('psidebar-open');
  });
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
