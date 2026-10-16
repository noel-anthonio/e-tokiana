/* Barre latérale du catalogue E-tokiana : catégories et compteurs dynamiques.
   À charger après app.js dans le HTML. */
(() => {
  const familySelect = document.querySelector('#category-family-filter');
  const subcategorySelect = document.querySelector('#subcategory-filter');
  const toolbar = document.querySelector('.catalogue-toolbar');
  const controls = toolbar?.querySelector('.catalogue-controls');
  if (!familySelect || !subcategorySelect || !toolbar || !controls) return;

  // Les menus déroulants de catégorie restent dans le DOM pour préserver
  // toute la logique existante, mais leur interface est remplacée par la barre latérale.
  controls.querySelectorAll('.catalogue-field').forEach((field) => {
    if (field.querySelector('#category-family-filter, #subcategory-filter')) {
      field.hidden = true;
    }
  });

  let sidebar = toolbar.querySelector('#catalogue-filter-sidebar');
  if (!sidebar) {
    sidebar = document.createElement('div');
    sidebar.id = 'catalogue-filter-sidebar';
    sidebar.className = 'catalogue-filter-sidebar rounded-2xl border border-stone-200 bg-white p-4 shadow-sm';
    controls.prepend(sidebar);
  }

  const normalize = (value) => String(value || '').trim().toLocaleLowerCase('fr-FR');
  const pathKey = (path) => JSON.stringify(path);
  const startsWithPath = (candidate, path) =>
    path.every((part, index) => candidate[index] === part);

  function matchingSearchProducts() {
    const term = normalize(typeof searchTerm === 'undefined' ? '' : searchTerm);
    return products.filter((product) => {
      if (!term) return true;
      const path = product.categoryPath || [product.category];
      return normalize(`${product.name} ${path.join(' ')} ${product.material}`).includes(term);
    });
  }

  function countForPath(path, searchableProducts) {
    if (path.length === 2 && path[1] === 'Nouveautés & Promos') {
      return searchableProducts.filter((product) =>
        product.category === categoryNames.fashion &&
        (product.tag === 'Nouveau' || Number(product.discount) > 0)
      ).length;
    }
    return searchableProducts.filter((product) =>
      startsWithPath(product.categoryPath || [product.category], path)
    ).length;
  }

  function allVisiblePaths() {
    const seen = new Map();
    const add = (path) => seen.set(pathKey(path), path);
    (catalogRootPaths || []).forEach(add);
    (categoryFamilyPaths || []).forEach(add);
    (catalogCategoryPaths || []).forEach(add);
    products.forEach((product) => {
      const path = product.categoryPath || [product.category];
      // Inclure les anciens chemins de produits seulement s'ils correspondent
      // à une famille ou à une catégorie réellement sélectionnable.
      if (path.length === 1 || (catalogCategoryPaths || []).some((known) => pathKey(known) === pathKey(path))) add(path);
    });
    return [...seen.values()];
  }

  function selectPath(path) {
    if (path.length === 1) {
      familySelect.value = '';
      familySelect.dispatchEvent(new Event('change', { bubbles: true }));
      const rootOption = [...subcategorySelect.options].find(
        (option) => option.value === pathKey(path),
      );
      if (rootOption) {
        subcategorySelect.value = rootOption.value;
        subcategorySelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }

    // Si le chemin existe comme famille, il devient le filtre actif.
    const familyOption = [...familySelect.options].find(
      (option) => option.value === pathKey(path),
    );
    if (familyOption) {
      familySelect.value = familyOption.value;
      familySelect.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }

    // Sinon, sélectionner le parent comme famille puis le chemin comme sous-catégorie.
    const parentPath = path.slice(0, -1);
    const parentOption = [...familySelect.options].find(
      (option) => option.value === pathKey(parentPath),
    );
    if (parentOption) {
      familySelect.value = parentOption.value;
      familySelect.dispatchEvent(new Event('change', { bubbles: true }));
      const childOption = [...subcategorySelect.options].find(
        (option) => option.value === pathKey(path),
      );
      if (childOption) {
        subcategorySelect.value = childOption.value;
        subcategorySelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return;
    }

    // Repli pour les catégories simples qui ne figurent pas dans le select des familles.
    familySelect.value = '';
    familySelect.dispatchEvent(new Event('change', { bubbles: true }));
    const option = [...subcategorySelect.options].find(
      (item) => item.value === pathKey(path),
    );
    if (option) {
      subcategorySelect.value = option.value;
      subcategorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function renderSidebar() {
    if (!sidebar.isConnected) return;
    const searchableProducts = matchingSearchProducts();
    const paths = allVisiblePaths();
    const currentPath = Array.isArray(activeSubcategory) && activeSubcategory.length
      ? activeSubcategory
      : (Array.isArray(activeFamilyPath) ? activeFamilyPath : []);

    sidebar.replaceChildren();
    const heading = document.createElement('div');
    heading.className = 'catalogue-filter-heading flex items-center justify-between gap-3';

    const headingTitle = document.createElement('div');
    headingTitle.className = 'catalogue-filter-title flex items-center gap-2';
    headingTitle.innerHTML = '<span class="catalogue-filter-icon" aria-hidden="true"><i class="bi bi-sliders2"></i></span><span>Filtrer</span>';
    heading.append(headingTitle);

    const reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'catalogue-filter-reset inline-flex items-center justify-center gap-1.5';
    reset.innerHTML = '<i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i><span>Effacer</span>';
    reset.setAttribute('aria-label', 'Effacer tous les filtres');
    reset.title = 'Effacer les filtres';
    reset.addEventListener('click', () => {
      familySelect.value = '';
      familySelect.dispatchEvent(new Event('change', { bubbles: true }));
      subcategorySelect.value = '';
      subcategorySelect.dispatchEvent(new Event('change', { bubbles: true }));
      const searchInput = document.querySelector('#search-input');
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    heading.append(reset);
    sidebar.append(heading);

    const allButton = document.createElement('button');
    allButton.type = 'button';
    allButton.className = `catalogue-filter-option catalogue-filter-all flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition${currentPath.length ? '' : ' is-active'}`;
    allButton.innerHTML = '<span>Tous les articles</span>';
    const allCount = document.createElement('span');
    allCount.className = 'catalogue-option-count';
    allCount.textContent = searchableProducts.length;
    allButton.append(allCount);
    allButton.addEventListener('click', () => {
      familySelect.value = '';
      familySelect.dispatchEvent(new Event('change', { bubbles: true }));
      subcategorySelect.value = '';
      subcategorySelect.dispatchEvent(new Event('change', { bubbles: true }));
    });
    sidebar.append(allButton);

    const list = document.createElement('div');
    list.className = 'catalogue-filter-list flex flex-col gap-2';

    // Afficher uniquement les catégories principales : aucune sous-catégorie
    // n'est ajoutée à la liste, ce qui garde le panneau court et lisible.
    const categoryMap = new Map();
    paths.forEach((path) => {
      if (path.length) {
        const categoryPath = [path[0]];
        categoryMap.set(pathKey(categoryPath), categoryPath);
      }
    });
    const categories = [...categoryMap.values()];
    categories.forEach((category) => {
      list.append(makeOption(category, 0, searchableProducts, currentPath));
    });
    sidebar.append(list);

    // Sections complémentaires de filtre, inspirées de la maquette fournie.
    const extra = document.createElement('div');
    extra.className = 'catalogue-extra-filter catalogue-availability-filter';
    extra.innerHTML = '<h4>Disponibilité</h4>' +
      [['In stock','En stock'],['Low stock','Stock faible'],['Out of stock','Rupture de stock']].map(([key,label]) =>
        `<label class="catalogue-extra-choice"><input type="checkbox" data-stock-filter="${key}"><span>${label}</span></label>`).join('');
    sidebar.append(extra);

    const prices = searchableProducts.map(p => Number(p.price)).filter(n => Number.isFinite(n) && n >= 0);
    const maxPrice = Math.max(250, ...prices);
    const priceFilter = document.createElement('div');
    priceFilter.className = 'catalogue-extra-filter catalogue-price-filter';
    priceFilter.innerHTML = `<h4>Prix</h4><input aria-label="Prix maximum" type="range" min="0" max="${maxPrice}" value="${maxPrice}" data-price-range><div class="catalogue-price-inputs"><label>$ <input type="number" min="0" value="0" data-price-min></label><label>$ <input type="number" min="0" value="${maxPrice}" data-price-max></label></div>`;
    sidebar.append(priceFilter);

    const brandValues = [...new Set(searchableProducts.map(p => p.brand || p.brandName).filter(Boolean))].sort((a,b) => String(a).localeCompare(String(b),'fr'));
    const brandFilter = document.createElement('div');
    brandFilter.className = 'catalogue-extra-filter catalogue-brand-filter';
    brandFilter.innerHTML = '<h4>Marque</h4><input type="search" class="catalogue-brand-search" placeholder="⌕  Rechercher une marque" aria-label="Rechercher une marque"><div class="catalogue-brand-options"></div><button type="button" class="catalogue-brand-more">Afficher plus</button>';
    const brandOptions = brandFilter.querySelector('.catalogue-brand-options');
    const renderBrands = (term = '', showAll = false) => {
      brandOptions.replaceChildren();
      const filtered = brandValues.filter(b => normalize(b).includes(normalize(term)));
      (showAll ? filtered : filtered.slice(0, 4)).forEach(brand => {
        const label = document.createElement('label'); label.className = 'catalogue-extra-choice';
        const input = document.createElement('input'); input.type = 'checkbox'; input.value = brand; input.dataset.brandFilter = 'true';
        const text = document.createElement('span'); text.textContent = brand;
        label.append(input, text); brandOptions.append(label);
      });
      brandFilter.querySelector('.catalogue-brand-more').hidden = filtered.length <= 4 || showAll;
    };
    renderBrands();
    brandFilter.querySelector('.catalogue-brand-search').addEventListener('input', e => renderBrands(e.target.value, true));
    brandFilter.querySelector('.catalogue-brand-more').addEventListener('click', () => renderBrands(brandFilter.querySelector('.catalogue-brand-search').value, true));
    sidebar.append(brandFilter);
  }

  function makeOption(path, depth, searchableProducts, currentPath) {
    const button = document.createElement('button');
    button.type = 'button';
    const active = pathKey(path) === pathKey(currentPath) || (path.length === 1 && currentPath[0] === path[0]);
    button.className = `catalogue-filter-option flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition${active ? ' is-active' : ''}${depth === 0 ? ' catalogue-filter-root' : ''}`;
    button.style.setProperty('--filter-depth', Math.min(depth, 3));
    const label = path[path.length - 1];
    const count = countForPath(path, searchableProducts);
    button.innerHTML = '<span class="catalogue-filter-label"></span>';
    button.querySelector('.catalogue-filter-label').textContent = label;
    const badge = document.createElement('span');
    badge.className = 'catalogue-option-count';
    badge.textContent = count;
    button.append(badge);
    button.setAttribute('aria-label', `${label}, ${count} article${count > 1 ? 's' : ''}`);
    button.addEventListener('click', () => selectPath(path));
    return button;
  }

  // Pagination : 12 produits par page. Le nombre reste fixe pour que le
  // responsive ne modifie que le nombre de colonnes, jamais la taille d'une carte.
  const PRODUCTS_PER_PAGE = 12;
  let currentPage = 1;

  function getProductCards() {
    const grid = document.querySelector('#product-grid');
    if (!grid) return [];
    return [...grid.children].filter((element) =>
      element.classList.contains('product-card') || element.classList.contains('product-item')
    );
  }

  function renderPagination() {
    const grid = document.querySelector('#product-grid');
    if (!grid) return;

    let pagination = document.querySelector('#catalogue-pagination');
    if (!pagination) {
      pagination = document.createElement('nav');
      pagination.id = 'catalogue-pagination';
      pagination.className = 'catalogue-pagination';
      pagination.setAttribute('aria-label', 'Pagination du catalogue');
      grid.insertAdjacentElement('afterend', pagination);
    }

    const cards = getProductCards();
    const totalPages = Math.max(1, Math.ceil(cards.length / PRODUCTS_PER_PAGE));
    currentPage = Math.min(currentPage, totalPages);

    cards.forEach((card, index) => {
      const visible = index >= (currentPage - 1) * PRODUCTS_PER_PAGE && index < currentPage * PRODUCTS_PER_PAGE;
      card.hidden = !visible;
    });

    pagination.replaceChildren();
    if (cards.length <= PRODUCTS_PER_PAGE) {
      pagination.hidden = true;
      return;
    }
    pagination.hidden = false;

    const previous = document.createElement('button');
    previous.type = 'button';
    previous.innerHTML = '<i class="bi bi-chevron-left" aria-hidden="true"></i>';
    previous.setAttribute('aria-label', 'Page précédente');
    previous.disabled = currentPage === 1;
    previous.addEventListener('click', () => {
      currentPage -= 1;
      renderPagination();
      document.querySelector('#product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    pagination.append(previous);

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let page = start; page <= end; page += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = page;
      button.className = page === currentPage ? 'is-active' : '';
      button.setAttribute('aria-label', `Page ${page}`);
      button.setAttribute('aria-current', page === currentPage ? 'page' : 'false');
      button.addEventListener('click', () => {
        currentPage = page;
        renderPagination();
        document.querySelector('#product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      pagination.append(button);
    }

    const info = document.createElement('span');
    info.className = 'catalogue-pagination-info';
    info.textContent = `Page ${currentPage} / ${totalPages}`;
    pagination.append(info);

    const next = document.createElement('button');
    next.type = 'button';
    next.innerHTML = '<i class="bi bi-chevron-right" aria-hidden="true"></i>';
    next.setAttribute('aria-label', 'Page suivante');
    next.disabled = currentPage === totalPages;
    next.addEventListener('click', () => {
      currentPage += 1;
      renderPagination();
      document.querySelector('#product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    pagination.append(next);
  }

  // Actualise les compteurs et la pagination dès que le catalogue est redessiné.
  const originalRenderProducts = renderProducts;
  renderProducts = function (...args) {
    currentPage = 1;
    const result = originalRenderProducts.apply(this, args);
    renderSidebar();
    renderPagination();
    return result;
  };

  document.querySelector('#search-input')?.addEventListener('input', () => {
    currentPage = 1;
    renderSidebar();
    requestAnimationFrame(renderPagination);
  });

  renderSidebar();
  requestAnimationFrame(renderPagination);
})();
