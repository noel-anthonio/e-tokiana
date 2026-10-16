/* ==========================================================================
   E-tokiana — fluid.js
   À charger APRÈS le script de la barre latérale du catalogue (celui qui crée
   #catalogue-filter-sidebar). Complète fluid.css sans le modifier.

   - Tactile : un appui sur une carte produit affiche ses détails
   - Filtres : sections repliables (Catégories, Disponibilité, Prix, Marque),
     prix en Ar (curseur, champs, raccourcis), pied « Effacer tout / Voir N articles »
   - Filtres actifs affichés en puces sous la barre (téléphone), avec ×
   - Fermeture de la feuille en la faisant glisser vers le bas
   - La section Marque disparaît quand aucun produit n'a de marque
   ========================================================================== */
(() => {
  'use strict';

  const toolbar = document.querySelector('.catalogue-toolbar');
  const sidebar = document.querySelector('#catalogue-filter-sidebar');
  const grid = document.querySelector('#product-grid');
  if (!toolbar || !sidebar || !grid) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const searchInput = () => $('#search-input');
  const rate = () => (typeof currencyRate === 'number' ? currencyRate : 4900);
  const fmtAr = value => `${Math.round(value).toLocaleString('fr-FR')} Ar`;

  /* ---------------------------------------------------------------- */
  /* Tactile : appui sur une carte = détails du produit                 */
  /* ---------------------------------------------------------------- */
  const touch = window.matchMedia('(hover: none)');
  const closePeeks = except => $$('.is-peek', grid).forEach(card => { if (card !== except) card.classList.remove('is-peek'); });
  grid.addEventListener('click', event => {
    if (!touch.matches) return;
    const card = event.target.closest('.product-card');
    if (!card || event.target.closest('button, a, input, select')) return;
    const wasOpen = card.classList.contains('is-peek');
    closePeeks(card);
    card.classList.toggle('is-peek', !wasOpen);
  });
  document.addEventListener('click', event => { if (touch.matches && !event.target.closest('.product-card')) closePeeks(); });

  /* ---------------------------------------------------------------- */
  /* Prix en Ar (les valeurs internes restent en unité de prix du site)  */
  /* ---------------------------------------------------------------- */
  function priceControls() {
    return { range: $('[data-price-range]', sidebar), min: $('[data-price-min]', sidebar), max: $('[data-price-max]', sidebar) };
  }

  function priceIsActive() {
    const { range, min, max } = priceControls();
    return Boolean(range && (Number(min.value) > 0 || Number(max.value) < Number(range.max)));
  }

  function resetPrice() {
    const { range, min, max } = priceControls();
    if (!range) return;
    min.value = 0;
    max.value = range.max;
    max.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function buildPriceUI(node) {
    const { range: nativeRange, min: nativeMin, max: nativeMax } = priceControls();
    if (!nativeRange || node.querySelector('.fs-price')) return;
    const MAX = Math.round(Number(nativeRange.max) * rate());
    const toAr = value => Math.round(Number(value) * rate());
    const step = MAX > 1000000 ? 10000 : 1000;

    [nativeRange, node.querySelector('.catalogue-price-inputs')].forEach(element => element?.classList.add('fs-native'));

    const ui = document.createElement('div');
    ui.className = 'fs-price';
    ui.innerHTML = `<div class="fs-price-out"><span>Budget</span><strong data-out></strong></div>
      <input class="fs-range" type="range" min="0" max="${MAX}" step="${step}" aria-label="Prix maximum en Ariary" />
      <div class="fs-price-fields">
        <label><span>Min</span><input type="number" inputmode="numeric" min="0" max="${MAX}" step="${step}" data-ar-min aria-label="Prix minimum en Ariary" /><em>Ar</em></label>
        <label><span>Max</span><input type="number" inputmode="numeric" min="0" max="${MAX}" step="${step}" data-ar-max aria-label="Prix maximum en Ariary" /><em>Ar</em></label>
      </div>
      <div class="fs-presets">
        <button type="button" class="fs-preset" data-preset="0,50000">Moins de 50 000 Ar</button>
        <button type="button" class="fs-preset" data-preset="50000,150000">50 000 – 150 000 Ar</button>
        <button type="button" class="fs-preset" data-preset="150000,${MAX}">Plus de 150 000 Ar</button>
      </div>`;
    node.append(ui);

    const slider = $('.fs-range', ui), fieldMin = $('[data-ar-min]', ui), fieldMax = $('[data-ar-max]', ui), out = $('[data-out]', ui);
    const current = () => ({ min: toAr(nativeMin.value), max: Math.min(MAX, toAr(nativeMax.value)) });

    function show(min, max) {
      slider.value = max;
      fieldMin.value = min;
      fieldMax.value = max;
      out.textContent = min <= 0 && max >= MAX ? 'Tous les prix' : `${fmtAr(min)} – ${fmtAr(max)}`;
      $$('.fs-preset', ui).forEach(button => { const [a, b] = button.dataset.preset.split(',').map(Number); button.classList.toggle('is-active', a === min && b === max); });
    }

    function apply(min, max) {
      min = Math.max(0, Math.min(MAX, Number(min) || 0));
      max = Math.max(0, Math.min(MAX, Number(max) || 0));
      if (max < min) max = min;
      nativeMin.value = min / rate();
      nativeMax.value = max / rate();
      nativeMax.dispatchEvent(new Event('change', { bubbles: true }));   // la logique d'origine filtre et repagine
      const now = current();
      show(now.min, now.max);
    }

    slider.addEventListener('input', () => { const min = Number(fieldMin.value) || 0; out.textContent = `${fmtAr(Math.min(min, slider.value))} – ${fmtAr(slider.value)}`; });
    slider.addEventListener('change', () => apply(fieldMin.value, slider.value));
    fieldMin.addEventListener('change', () => apply(fieldMin.value, fieldMax.value));
    fieldMax.addEventListener('change', () => apply(fieldMin.value, fieldMax.value));
    $$('.fs-preset', ui).forEach(button => button.addEventListener('click', () => {
      const [a, b] = button.dataset.preset.split(',').map(Number);
      priceIsActive() && current().min === a && current().max === b ? resetPrice() : apply(a, b);
      const now = current();
      show(now.min, now.max);
    }));

    const now = current();
    show(now.min, now.max);
  }

  /* ---------------------------------------------------------------- */
  /* Remise à zéro de tous les filtres                                   */
  /* ---------------------------------------------------------------- */
  function clearAll() {
    resetPrice();
    $$('[data-stock-filter]:checked', sidebar).forEach(input => input.click());
    $$('[data-brand-filter]:checked', sidebar).forEach(input => input.click());
    const search = searchInput();
    if (search?.value) { search.value = ''; search.dispatchEvent(new Event('input', { bubbles: true })); }
    $('.catalogue-filter-all', sidebar)?.click();   // en dernier : redessine la barre latérale
  }

  /* ---------------------------------------------------------------- */
  /* Sections repliables                                                 */
  /* ---------------------------------------------------------------- */
  const openSections = new Set(['cat']);

  function summaries() {
    const category = $('.catalogue-filter-list .catalogue-filter-option.is-active .catalogue-filter-label', sidebar)?.textContent;
    const stock = $$('[data-stock-filter]:checked', sidebar).length;
    const brands = $$('[data-brand-filter]:checked', sidebar).length;
    const { min, max } = priceControls();
    const text = {
      cat: category || '',
      stock: stock ? `${stock} choix` : '',
      price: priceIsActive() ? `${fmtAr(Number(min.value) * rate()).replace(' Ar', '')} – ${fmtAr(Number(max.value) * rate())}` : '',
      brand: brands ? `${brands} choix` : ''
    };
    $$('.fs-acc', sidebar).forEach(box => { const sum = $('.fs-acc-sum', box); if (sum) sum.textContent = text[box.dataset.sec] || ''; });
  }

  function section(key, title, nodes) {
    const box = document.createElement('section');
    box.className = `fs-acc${openSections.has(key) ? ' is-open' : ''}`;
    box.dataset.sec = key;
    const head = document.createElement('button');
    head.type = 'button';
    head.className = 'fs-acc-head';
    head.setAttribute('aria-expanded', String(openSections.has(key)));
    head.innerHTML = `<span>${title}</span><em class="fs-acc-sum"></em><i class="bi bi-chevron-down" aria-hidden="true"></i>`;
    const body = document.createElement('div');
    body.className = 'fs-acc-body';
    nodes.forEach(node => body.append(node));
    head.addEventListener('click', () => {
      const open = !box.classList.contains('is-open');
      box.classList.toggle('is-open', open);
      head.setAttribute('aria-expanded', String(open));
      if (open) openSections.add(key); else openSections.delete(key);
    });
    box.append(head, body);
    return box;
  }

  function enhanceSheet() {
    if (!sidebar.children.length || $('.fs-acc', sidebar)) return;
    const all = $('.catalogue-filter-all', sidebar);
    const list = $('.catalogue-filter-list', sidebar);
    const availability = $('.catalogue-availability-filter', sidebar);
    const price = $('.catalogue-price-filter', sidebar);
    const brand = $('.catalogue-brand-filter', sidebar);
    const bar = $('.mobile-apply-bar', sidebar);
    if (!all || !list || !bar) return;

    if (price) buildPriceUI(price);
    const hasBrands = brand && $('[data-brand-filter]', brand);
    if (brand && !hasBrands) brand.remove();       // aucun produit n'a de marque : section inutile

    const sections = [section('cat', 'Catégories', [all, list])];
    if (availability) sections.push(section('stock', 'Disponibilité', [availability]));
    if (price) sections.push(section('price', 'Prix', [price]));
    if (hasBrands) sections.push(section('brand', 'Marque', [brand]));
    bar.before(...sections);

    if (!$('.mobile-clear', bar)) {
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'mobile-clear';
      clear.textContent = 'Effacer tout';
      clear.addEventListener('click', clearAll);
      bar.prepend(clear);
    }
    summaries();
  }

  /* ---------------------------------------------------------------- */
  /* Filtres actifs en puces (sous la barre, téléphone)                   */
  /* ---------------------------------------------------------------- */
  const chipsRow = document.createElement('div');
  chipsRow.className = 'catalogue-active-chips';
  chipsRow.setAttribute('role', 'group');
  chipsRow.setAttribute('aria-label', 'Filtres actifs');
  toolbar.append(chipsRow);

  function renderActive() {
    const chips = [];
    const term = searchInput()?.value.trim();
    if (term) chips.push([`« ${term} »`, () => { const input = searchInput(); input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); }]);
    $$('[data-stock-filter]:checked', sidebar).forEach(input => {
      const key = input.dataset.stockFilter;
      chips.push([input.closest('label')?.textContent.trim() || key, () => $(`[data-stock-filter="${key}"]`, sidebar)?.click()]);
    });
    $$('[data-brand-filter]:checked', sidebar).forEach(input => {
      const value = input.value;
      chips.push([value, () => $$('[data-brand-filter]', sidebar).find(item => item.value === value)?.click()]);
    });
    if (priceIsActive()) {
      const { min, max } = priceControls();
      chips.push([`${fmtAr(Number(min.value) * rate()).replace(' Ar', '')} – ${fmtAr(Number(max.value) * rate())}`, resetPrice]);
    }
    chipsRow.replaceChildren(...chips.map(([label, remove]) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'active-chip';
      chip.innerHTML = '<span></span><i class="bi bi-x-lg" aria-hidden="true"></i>';
      chip.firstElementChild.textContent = label;
      chip.setAttribute('aria-label', `Retirer le filtre ${label}`);
      chip.addEventListener('click', () => { remove(); requestAnimationFrame(renderActive); });
      return chip;
    }));
    if (chips.length > 1) {
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'active-chip clear';
      clear.textContent = 'Tout effacer';
      clear.addEventListener('click', () => { clearAll(); requestAnimationFrame(renderActive); });
      chipsRow.append(clear);
    }
  }

  /* ---------------------------------------------------------------- */
  /* Glisser la feuille vers le bas pour la fermer                       */
  /* ---------------------------------------------------------------- */
  let startY = null;
  sidebar.addEventListener('touchstart', event => { startY = event.target.closest('.catalogue-filter-heading') ? event.touches[0].clientY : null; }, { passive: true });
  sidebar.addEventListener('touchend', event => {
    if (startY === null) return;
    const distance = event.changedTouches[0].clientY - startY;
    startY = null;
    if (distance > 70) $('.mobile-sheet-close', sidebar)?.click();
  }, { passive: true });

  /* ---------------------------------------------------------------- */
  /* Synchronisation                                                     */
  /* ---------------------------------------------------------------- */
  const refresh = () => { enhanceSheet(); summaries(); renderActive(); };
  new MutationObserver(refresh).observe(sidebar, { childList: true });
  sidebar.addEventListener('change', () => requestAnimationFrame(() => { summaries(); renderActive(); }));
  searchInput()?.addEventListener('input', () => requestAnimationFrame(renderActive));
  refresh();
})();
