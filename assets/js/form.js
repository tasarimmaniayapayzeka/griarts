/* Gri Akademi — form gönderimi
   Kural: gönderim SUNUCUDAN onaylanmadan asla "alındı" denmez.
   PHP yoksa (ör. GitHub Pages) veya hata olursa WhatsApp'a düşülür. */
(function () {
  'use strict';

  var WA_NO = '905425983374';
  var ENDPOINT = 'gonder.php';

  /* ---------- reklam atfı: ilk girişte yakala, sakla ---------- */
  var UTM_ANAHTAR = 'griarts_utm';
  function utmYakala() {
    try {
      var p = new URLSearchParams(location.search);
      var alanlar = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
      var bulunan = [];
      alanlar.forEach(function (a) { var v = p.get(a); if (v) bulunan.push(a + '=' + v); });
      if (bulunan.length) sessionStorage.setItem(UTM_ANAHTAR, bulunan.join('&'));
    } catch (e) {}
  }
  function utmOku() { try { return sessionStorage.getItem(UTM_ANAHTAR) || ''; } catch (e) { return ''; } }
  utmYakala();

  var sayfaAdi = (document.title || '').split('|')[0].trim() || location.pathname;

  /* ---------- yardımcılar ---------- */
  function gizliAlan(form, ad, deger) {
    var i = form.querySelector('input[name="' + ad + '"]');
    if (!i) { i = document.createElement('input'); i.type = 'hidden'; i.name = ad; form.appendChild(i); }
    i.value = deger;
  }

  function waLinki(veri) {
    var s = 'Merhaba, ' + sayfaAdi + ' hakkında bilgi almak istiyorum.';
    if (veri.ad) s += '\nAd: ' + veri.ad;
    if (veri.tel) s += '\nTelefon: ' + veri.tel;
    if (veri.eposta) s += '\nE-posta: ' + veri.eposta;
    return 'https://wa.me/' + WA_NO + '?text=' + encodeURIComponent(s);
  }

  function kutu(form, tip, baslik, metin, wa) {
    var eski = form.querySelector('.form-durum');
    if (eski) eski.remove();
    var d = document.createElement('div');
    d.className = 'form-durum form-durum--' + tip;
    d.setAttribute('role', tip === 'hata' ? 'alert' : 'status');
    var h = '<b>' + baslik + '</b>';
    if (metin) h += '<span>' + metin + '</span>';
    if (wa) h += '<a class="btn btn--primary" href="' + wa + '" target="_blank" rel="noopener">WhatsApp\'tan Devam Et</a>';
    d.innerHTML = h;
    form.insertBefore(d, form.firstChild);
    d.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return d;
  }

  /* ---------- kurulum ---------- */
  var formlar = document.querySelectorAll('.form, .miniwidget form');
  Array.prototype.forEach.call(formlar, function (form) {
    if (form.dataset.griBagli) return;
    form.dataset.griBagli = '1';

    // honeypot (ekran okuyuculardan ve gözden gizli)
    if (!form.querySelector('input[name="website"]')) {
      var hp = document.createElement('div');
      hp.setAttribute('aria-hidden', 'true');
      hp.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden';
      hp.innerHTML = '<label>Web siteniz<input type="text" name="website" tabindex="-1" autocomplete="off"></label>';
      form.appendChild(hp);
    }
    gizliAlan(form, 'ts', String(Date.now()));
    gizliAlan(form, 'sayfa', sayfaAdi);
    gizliAlan(form, 'kaynak_url', location.href.slice(0, 300));
    gizliAlan(form, 'utm', utmOku());

    // eski statik "Talebiniz alındı" kutusunu etkisizleştir (asla kendiliğinden görünmesin)
    var eskiOk = form.querySelector('.form__ok');
    if (eskiOk) eskiOk.remove();

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var fd = new FormData(form);
      var veri = { ad: (fd.get('ad') || '').toString().trim(), tel: (fd.get('tel') || '').toString().trim(), eposta: (fd.get('eposta') || '').toString().trim() };

      // istemci doğrulaması
      var eksik = null;
      if (veri.ad.length < 2) eksik = form.querySelector('[name="ad"]');
      else if ((veri.tel.match(/\d/g) || []).length < 10) eksik = form.querySelector('[name="tel"]');
      else if (veri.eposta && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(veri.eposta)) eksik = form.querySelector('[name="eposta"]');
      if (eksik) {
        kutu(form, 'hata', 'Eksik bilgi', 'Lütfen adınızı ve geçerli bir telefon numarası yazın.', null);
        eksik.focus();
        return;
      }
      var onay = form.querySelector('[name="kvkk"]');
      if (onay && !onay.checked) {
        kutu(form, 'hata', 'Onay gerekli', 'Devam edebilmek için aydınlatma metnini onaylayın.', null);
        onay.focus();
        return;
      }

      var btn = form.querySelector('button[type="submit"], button:not([type])');
      var eskiMetin = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = 'Gönderiliyor…'; }

      var bitir = function () { if (btn) { btn.disabled = false; btn.innerHTML = eskiMetin; } };

      fetch(ENDPOINT, { method: 'POST', body: fd })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (c) {
          if (c.ok && c.j && c.j.ok) {
            form.innerHTML = '';
            kutu(form, 'ok', 'Talebiniz bize ulaştı.', 'En kısa sürede size dönüş yapacağız. Acele ise WhatsApp’tan da yazabilirsiniz.', waLinki(veri));
          } else {
            bitir();
            kutu(form, 'uyari', 'Gönderilemedi', (c.j && c.j.mesaj) || 'Bir sorun oluştu.', waLinki(veri));
          }
        })
        .catch(function () {
          // PHP yok / ağ hatası — yanıltma, WhatsApp'a yönlendir
          bitir();
          kutu(form, 'uyari', 'Form şu anda gönderilemiyor',
            'Bilgilerinizi WhatsApp üzerinden iletebilirsiniz — mesaj sizin için hazırlandı.', waLinki(veri));
        });
    });
  });
})();
