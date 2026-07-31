/* Gri Akademi — etkileşimler */
(function () {
  'use strict';

  /* ---------- scroll ilerleme çubuğu ---------- */
  var progress = document.createElement('div');
  progress.id = 'scrollbar-progress';
  document.body.appendChild(progress);
  var updateProgress = function () {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- header stuck ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (header) header.classList.toggle('is-stuck', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobil menü ---------- */
  const body = document.body;
  const toggle = document.getElementById('navToggle');
  const close = document.getElementById('navClose');
  const scrim = document.getElementById('scrim');
  const openMenu = () => { body.classList.add('menu-open'); toggle && toggle.setAttribute('aria-expanded', 'true'); };
  const closeMenu = () => { body.classList.remove('menu-open'); toggle && toggle.setAttribute('aria-expanded', 'false'); };
  toggle && toggle.addEventListener('click', () => body.classList.contains('menu-open') ? closeMenu() : openMenu());
  close && close.addEventListener('click', closeMenu);
  scrim && scrim.addEventListener('click', closeMenu);
  document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- scroll reveal ----------
     getBoundingClientRect tabanlı manuel kontrol: IntersectionObserver'a
     bağımlı değil, her ortamda çalışır. Öğe viewport'un alt %88'ine
     girdiğinde görünür olur. Güvenlik ağı: 'load' + 2sn'lik fallback. */
  const reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  let revealPending = reveals.length;
  const revealCheck = () => {
    if (!revealPending) return;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    for (let i = 0; i < reveals.length; i++) {
      const el = reveals[i];
      if (el.classList.contains('is-in')) continue;
      const top = el.getBoundingClientRect().top;
      if (top < vh * 0.88) { el.classList.add('is-in'); revealPending--; }
    }
  };
  window.addEventListener('scroll', revealCheck, { passive: true });
  window.addEventListener('resize', revealCheck, { passive: true });
  window.addEventListener('load', revealCheck);
  // ilk turda viewport'takileri hemen aç
  revealCheck();
  requestAnimationFrame(revealCheck);
  // son güvenlik ağı: 2.2sn sonra hâlâ gizli kalan olursa hepsini göster
  setTimeout(() => { reveals.forEach(el => el.classList.add('is-in')); }, 2200);

  /* ---------- aktif menü (scroll spy) ---------- */
  const sections = ['anasayfa', 'hakkimizda', 'hizmetler', 'galeri', 'iletisim'];
  const navLinks = document.querySelectorAll('.nav__menu a');
  const spy = () => {
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 140) current = id;
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      a.classList.toggle('is-active', href === '#' + current);
    });
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ---------- SSS akordeon ---------- */
  document.querySelectorAll('.faq__item').forEach(item => {
    const q = item.querySelector('.faq__q');
    const a = item.querySelector('.faq__a');
    q && q.addEventListener('click', () => {
      const open = item.classList.contains('is-open');
      // aynı anda tek açık
      document.querySelectorAll('.faq__item.is-open').forEach(o => {
        o.classList.remove('is-open');
        const oa = o.querySelector('.faq__a'); if (oa) oa.style.maxHeight = null;
      });
      if (!open) { item.classList.add('is-open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---------- galeri lightbox ---------- */
  const items = Array.from(document.querySelectorAll('.gallery__item, .proc-item, .flow-step'));
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  let idx = 0;
  const show = i => {
    if (!items.length) return;
    idx = (i + items.length) % items.length;
    const src = items[idx].getAttribute('data-full') || items[idx].querySelector('img').src;
    lbImg.src = src;
  };
  const openLb = i => { show(i); lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); };
  const closeLb = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); lbImg.src = ''; };
  items.forEach((it, i) => it.addEventListener('click', e => { e.preventDefault(); openLb(i); }));
  document.getElementById('lbClose') && document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev') && document.getElementById('lbPrev').addEventListener('click', () => show(idx - 1));
  document.getElementById('lbNext') && document.getElementById('lbNext').addEventListener('click', () => show(idx + 1));
  lb && lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb || !lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  /* ---------- formlar ----------
     Gönderim assets/js/form.js içinde: gerçek POST -> gonder.php.
     Buradaki eski handler'lar KALDIRILDI — hiçbir şey gönderilmeden
     "Talebiniz alındı" göstermek yanıltıcı beyandı. */

  /* ---------- yumuşak kaydırma (header ofset) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 92;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();

/* ---------- Galeri carousel (kimlik-kart) ---------- */
(function () {
  'use strict';
  document.querySelectorAll('.gcar').forEach(function (kok, kacinci) {
    var stage = kok.querySelector('.gcar__stage');
    var kartlar = Array.prototype.slice.call(stage.querySelectorAll('.gcar__card'));
    if (kartlar.length < 2) return;
    var dots = kok.querySelector('[data-dots]');
    var no = kok.querySelector('[data-no]');
    var top = kok.querySelector('[data-top]');
    if (top) top.textContent = kartlar.length;
    var aktif = 0, n = kartlar.length;

    kartlar.forEach(function (k, i) {
      if (dots) {
        var b = document.createElement('button');
        b.type = 'button'; b.setAttribute('aria-label', (i + 1) + '. görsel');
        b.addEventListener('click', function () { git(i); });
        dots.appendChild(b);
      }
      k.addEventListener('click', function () { if (i !== aktif) git(i); });
    });

    function siniflandir() {
      kartlar.forEach(function (k, i) {
        var fark = (i - aktif + n) % n;
        k.className = 'gcar__card ' + (
          fark === 0 ? 'is-active' :
          fark === 1 ? 'is-next' :
          fark === n - 1 ? 'is-prev' :
          fark <= n / 2 ? 'is-off-r' : 'is-off-l');
      });
      if (no) no.textContent = aktif + 1;
      if (dots) Array.prototype.forEach.call(dots.children, function (b, i) { b.className = i === aktif ? 'on' : ''; });
    }
    function git(i) { aktif = ((i % n) + n) % n; siniflandir(); }

    var ileri = kok.querySelector('[data-next]');
    var geri = kok.querySelector('[data-prev]');
    if (ileri) ileri.addEventListener('click', function () { git(aktif + 1); });
    if (geri) geri.addEventListener('click', function () { git(aktif - 1); });

    if (kacinci === 0) document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') git(aktif + 1);
      if (e.key === 'ArrowLeft') git(aktif - 1);
    });

    var bx = null;
    stage.addEventListener('touchstart', function (e) { bx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', function (e) {
      if (bx === null) return;
      var f = e.changedTouches[0].clientX - bx;
      if (Math.abs(f) > 42) git(aktif + (f < 0 ? 1 : -1));
      bx = null;
    }, { passive: true });

    siniflandir();
  });
})();
