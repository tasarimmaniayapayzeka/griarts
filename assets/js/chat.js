/* Gri Akademi — AI Asistan ön yüzü
   Kendi DOM'unu kurar; chatbot.php'ye konuşur. PHP yoksa/anahtar yoksa
   dürüst "çevrimdışı" moduna düşer ve WhatsApp'a yönlendirir. */
(function () {
  'use strict';

  var WA = 'https://wa.me/905425983374?text=' + encodeURIComponent('Merhaba, bilgi almak istiyorum.');
  var DEPO = 'griarts_chat_v1';
  var ILK = 'Merhaba! 👋 Ben Gri Asistan. Programlarımız, deneme dersi ya da atölyemiz hakkında ne merak ediyorsun?';
  var CIPLER = ['Hangi programlar var?', 'Deneme dersi nasıl alınır?', 'Adres ve ulaşım', 'Ücretler nasıl?'];

  /* ---------- DOM ---------- */
  var kok = document.createElement('div');
  kok.id = 'gchat';
  kok.innerHTML =
    '<button type="button" class="gchat__launch" id="gcLaunch" aria-label="Sohbet asistanını aç">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
      '<span class="gchat__pulse"></span>' +
    '</button>' +
    '<div class="gchat__panel" id="gcPanel" hidden>' +
      '<div class="gchat__head">' +
        '<img src="assets/img/logo-badge.png" alt="">' +
        '<div><b>Gri Asistan</b><small id="gcDurum">yapay zekâ destekli</small></div>' +
        '<button type="button" class="gchat__close" id="gcClose" aria-label="Kapat">✕</button>' +
      '</div>' +
      '<div class="gchat__msgs" id="gcMsgs"></div>' +
      '<div class="gchat__chips" id="gcChips"></div>' +
      '<form class="gchat__bar" id="gcForm">' +
        '<input type="text" id="gcInput" placeholder="Mesajını yaz…" maxlength="500" autocomplete="off" aria-label="Mesaj">' +
        '<button type="submit" aria-label="Gönder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>' +
      '</form>' +
      '<div class="gchat__foot"><a href="' + WA + '" target="_blank" rel="noopener">WhatsApp’a geç</a><span>· kişisel veri paylaşma</span></div>' +
    '</div>';
  document.body.appendChild(kok);

  var panel = document.getElementById('gcPanel');
  var msgs  = document.getElementById('gcMsgs');
  var chips = document.getElementById('gcChips');
  var form  = document.getElementById('gcForm');
  var input = document.getElementById('gcInput');
  var durum = document.getElementById('gcDurum');

  /* ---------- geçmiş ---------- */
  var tarih = [];
  try { tarih = JSON.parse(sessionStorage.getItem(DEPO) || '[]'); } catch (e) {}
  function kaydet() { try { sessionStorage.setItem(DEPO, JSON.stringify(tarih.slice(-12))); } catch (e) {} }

  /* ---------- yardımcılar ---------- */
  var IC_SAYFA = /\b([a-z0-9-]+\.html)\b/g;
  function linkle(t) {
    t = t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // markdown [metin](hedef) — önce yer tutucuya al; yoksa .html regex'i href'i ikinci kez sarar
    var linkler = [];
    t = t.replace(/\[([^\]]+)\]\(([^()\s]+)\)/g, function (m, metin, hedef) {
      var dis = /^https?:\/\//.test(hedef);
      linkler.push('<a href="' + hedef + '"' + (dis ? ' target="_blank" rel="noopener"' : '') + '>' + metin + '</a>');
      return '\u0001' + (linkler.length - 1) + '\u0002';
    });
    t = t
      .replace(/(https?:\/\/[^\s<]+)/g, function (m, url) {
        // tam URL de yer tutucuya girer; yoksa icindeki .html'i alttaki regex tekrar sarar
        linkler.push('<a href="' + url + '" target="_blank" rel="noopener">' + url + '</a>');
        return '\u0001' + (linkler.length - 1) + '\u0002';
      })
      .replace(IC_SAYFA, '<a href="$1">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\n/g, '<br>');
    return t.replace(/\u0001(\d+)\u0002/g, function (m, i) { return linkler[+i]; });
  }
  function balon(rol, html) {
    var d = document.createElement('div');
    d.className = 'gchat__msg gchat__msg--' + rol;
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }
  function yaziyor(ac) {
    var v = document.getElementById('gcTyping');
    if (v) v.remove();
    if (ac) {
      var d = balon('bot', '<span class="gchat__dots"><i></i><i></i><i></i></span>');
      d.id = 'gcTyping';
    }
  }
  function cevrimdisi() {
    durum.textContent = 'şu an çevrimdışı';
    balon('bot', 'Şu an çevrimdışıyım 😴 Ama ekip WhatsApp’ta: <a href="' + WA + '" target="_blank" rel="noopener">0542 598 33 74</a> — genellikle aynı gün dönüş yapıyorlar.');
  }

  function ciz() {
    msgs.innerHTML = '';
    balon('bot', linkle(ILK));
    tarih.forEach(function (m) { balon(m.role === 'assistant' ? 'bot' : 'me', linkle(m.content)); });
    chips.style.display = tarih.length ? 'none' : '';
  }

  /* ---------- gönderim ---------- */
  var mesgul = false;
  function gonder(metin) {
    metin = (metin || '').trim();
    if (!metin || mesgul) return;
    mesgul = true;
    chips.style.display = 'none';
    balon('me', linkle(metin));
    tarih.push({ role: 'user', content: metin });
    kaydet();
    input.value = '';
    yaziyor(true);

    fetch('chatbot.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: tarih.slice(-10) })
    })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        yaziyor(false);
        if (j && j.ok && j.reply) {
          tarih.push({ role: 'assistant', content: j.reply });
          kaydet();
          balon('bot', linkle(j.reply));
        } else if (j && j.offline) {
          cevrimdisi();
        } else {
          balon('bot', linkle((j && j.hata) || 'Bir sorun oluştu; tekrar dener misin?'));
        }
      })
      .catch(function () { yaziyor(false); cevrimdisi(); })
      .finally(function () { mesgul = false; input.focus(); });
  }

  /* ---------- olaylar ---------- */
  document.getElementById('gcLaunch').addEventListener('click', function () {
    var acik = !panel.hidden;
    panel.hidden = acik;
    if (!acik) { ciz(); setTimeout(function () { input.focus(); }, 60); }
  });
  document.getElementById('gcClose').addEventListener('click', function () { panel.hidden = true; });
  form.addEventListener('submit', function (e) { e.preventDefault(); gonder(input.value); });

  CIPLER.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = c;
    b.addEventListener('click', function () { gonder(c); });
    chips.appendChild(b);
  });
})();
