<?php
declare(strict_types=1);
/**
 * Gri Akademi — form alıcı (cPanel/PHP)
 * Sitedeki tüm formlar buraya POST eder, JSON döner.
 * Not: PHP çalışmayan ortamda (GitHub Pages) istek 404 olur ve
 *      istemci tarafı WhatsApp'a düşer — asla sahte "alındı" gösterilmez.
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$ALICI        = 'info@griarts.com.tr';
$GONDEREN     = 'site@griarts.com.tr';   // bu posta kutusu cPanel'de OLUŞTURULMALI (SPF)
$KAYIT_DIR    = __DIR__ . '/_talepler';
$MIN_SANIYE   = 3;                        // form açılışı ile gönderim arası
$LIMIT_ADET   = 5;                        // aynı IP / pencere
$LIMIT_SANIYE = 600;

function cik(bool $ok, string $mesaj = '', int $kod = 200): void {
    http_response_code($kod);
    echo json_encode(['ok' => $ok, 'mesaj' => $mesaj], JSON_UNESCAPED_UNICODE);
    exit;
}

/** Başlık enjeksiyonunu ve kontrol karakterlerini temizler */
function temiz(string $v, int $max = 500): string {
    $v = str_replace(["\r", "\n", "\0"], ' ', $v);
    $v = trim(preg_replace('/\s+/u', ' ', $v) ?? '');
    return mb_substr($v, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    cik(false, 'Geçersiz istek.', 405);
}

/* ---------- bot tuzakları ---------- */
// 1) honeypot: insan doldurmaz
if (temiz((string)($_POST['website'] ?? '')) !== '') {
    cik(true, 'Teşekkürler.');            // bota başarı de, sessizce yut
}
// 2) zaman tuzağı
$acilis = (int)($_POST['ts'] ?? 0);
if ($acilis > 0 && (time() - intdiv($acilis, 1000)) < $MIN_SANIYE) {
    cik(false, 'Form çok hızlı gönderildi, lütfen tekrar deneyin.', 429);
}

/* ---------- hız sınırı ---------- */
$ip  = (string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
$tmp = sys_get_temp_dir() . '/gri_' . md5($ip) . '.txt';
$gecmis = is_readable($tmp) ? array_filter(array_map('intval', explode(',', (string)file_get_contents($tmp)))) : [];
$gecmis = array_values(array_filter($gecmis, fn($t) => $t > time() - $LIMIT_SANIYE));
if (count($gecmis) >= $LIMIT_ADET) {
    cik(false, 'Çok fazla deneme yapıldı. Lütfen biraz sonra tekrar deneyin ya da WhatsApp’tan yazın.', 429);
}

/* ---------- doğrulama ---------- */
$ad     = temiz((string)($_POST['ad'] ?? ''), 120);
$tel    = temiz((string)($_POST['tel'] ?? ''), 40);
$eposta = temiz((string)($_POST['eposta'] ?? ''), 160);
$riza   = isset($_POST['kvkk']) && $_POST['kvkk'] !== '';

if ($ad === '' || mb_strlen($ad) < 2)          cik(false, 'Lütfen adınızı yazın.', 422);
if (preg_match_all('/\d/u', $tel) < 10)        cik(false, 'Lütfen geçerli bir telefon numarası yazın.', 422);
if ($eposta !== '' && !filter_var($eposta, FILTER_VALIDATE_EMAIL)) cik(false, 'E-posta adresi geçersiz görünüyor.', 422);
if (!$riza)                                    cik(false, 'Devam edebilmek için aydınlatma metnini onaylamanız gerekiyor.', 422);

/* ---------- serbest alanlar ---------- */
$bilinen = ['ad','tel','eposta','kvkk','website','ts','sayfa','kaynak_url','utm'];
$ekstra  = [];
foreach ($_POST as $k => $v) {
    if (in_array($k, $bilinen, true) || !is_string($v)) continue;
    $v = temiz($v, 1500);
    if ($v !== '') $ekstra[temiz((string)$k, 40)] = $v;
}

$sayfa   = temiz((string)($_POST['sayfa'] ?? ''), 120);
$kaynak  = temiz((string)($_POST['kaynak_url'] ?? ''), 300);
$utm     = temiz((string)($_POST['utm'] ?? ''), 300);
$zaman   = date('d.m.Y H:i');

/* ---------- kalıcı kayıt (mail düşse bile lead kaybolmasın) ---------- */
if (!is_dir($KAYIT_DIR)) { @mkdir($KAYIT_DIR, 0750, true); }
if (is_dir($KAYIT_DIR)) {
    $ht = $KAYIT_DIR . '/.htaccess';
    if (!file_exists($ht)) @file_put_contents($ht, "Require all denied\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n");
    $csv = $KAYIT_DIR . '/talepler.csv';
    $yeni = !file_exists($csv);
    if ($fh = @fopen($csv, 'a')) {
        if ($yeni) { fwrite($fh, "\xEF\xBB\xBF"); fputcsv($fh, ['Tarih','Ad','Telefon','E-posta','Sayfa','Kaynak','UTM','Detay','IP']); }
        fputcsv($fh, [$zaman, $ad, $tel, $eposta, $sayfa, $kaynak, $utm, json_encode($ekstra, JSON_UNESCAPED_UNICODE), $ip]);
        fclose($fh);
    }
}

/* ---------- e-posta ---------- */
$satirlar = [
    "Yeni talep — griarts.com.tr",
    str_repeat('-', 40),
    "Tarih   : $zaman",
    "Ad      : $ad",
    "Telefon : $tel",
    "E-posta : " . ($eposta !== '' ? $eposta : '-'),
    "Sayfa   : " . ($sayfa !== '' ? $sayfa : '-'),
];
foreach ($ekstra as $k => $v) $satirlar[] = str_pad(mb_substr($k, 0, 8), 8) . ": $v";
if ($kaynak !== '') $satirlar[] = "Geldiği : $kaynak";
if ($utm !== '')    $satirlar[] = "UTM     : $utm";
$satirlar[] = str_repeat('-', 40);
$satirlar[] = "KVKK aydınlatma metni onaylandı.";

$govde   = implode("\n", $satirlar);
$konu    = '=?UTF-8?B?' . base64_encode('Yeni talep: ' . $ad . ($sayfa !== '' ? " ($sayfa)" : '')) . '?=';
$basliks = [
    'From: Gri Akademi Web <' . $GONDEREN . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];
if ($eposta !== '') $basliks[] = 'Reply-To: ' . $eposta;

$gonderildi = @mail($ALICI, $konu, $govde, implode("\r\n", $basliks));

$gecmis[] = time();
@file_put_contents($tmp, implode(',', $gecmis));

if (!$gonderildi) {
    // Kayıt alındı ama e-posta çıkmadı: kullanıcıyı yanıltma.
    cik(false, 'Talebiniz kaydedildi ancak bildirim gönderilemedi. Kesin dönüş için WhatsApp’tan yazabilirsiniz.', 502);
}

cik(true, 'Talebiniz alındı.');
