/* index + workshoplar: gallery__grid ızgarasını gcar carousel markup'ına çevirir (tek seferlik) */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const OK_SVG_GERI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';
const OK_SVG_ILERI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>';

for (const dosya of ['index.html', 'workshoplar.html']) {
  const fp = path.join(ROOT, dosya);
  let h = fs.readFileSync(fp, 'utf8');

  const blokRe = /<div class="gallery__grid" id="galleryGrid">([\s\S]*?)\n    <\/div>/;
  const m = h.match(blokRe);
  if (!m) { console.log(dosya + ': gallery__grid BULUNAMADI'); continue; }

  // ızgaradaki görsel+alt çiftlerini topla
  const imgler = [...m[1].matchAll(/<img src="([^"]+)" alt="([^"]*)"/g)].map(x => ({ src: x[1], alt: x[2] }));
  if (!imgler.length) { console.log(dosya + ': gorsel bulunamadi'); continue; }

  const kartlar = imgler.map(g =>
    `      <div class="gcar__card"><img src="${g.src}" alt="${g.alt}" loading="lazy"></div>`).join('\n');

  const yeni =
`<div class="gcar reveal" id="galleryGrid">
      <div class="gcar__stage">
${kartlar}
      </div>
      <button type="button" class="gcar__btn gcar__btn--prev" data-prev aria-label="Önceki görsel">${OK_SVG_GERI}</button>
      <button type="button" class="gcar__btn gcar__btn--next" data-next aria-label="Sonraki görsel">${OK_SVG_ILERI}</button>
      <div class="gcar__foot">
        <div class="gcar__count"><b data-no>1</b> / <span data-top>${imgler.length}</span></div>
        <div class="gcar__dots" data-dots></div>
      </div>
    </div>`;

  h = h.replace(blokRe, yeni);
  fs.writeFileSync(fp, h, 'utf8');
  console.log(dosya + ': ' + imgler.length + ' gorsel carousel oldu');
}
