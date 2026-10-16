/* Barre latérale du catalogue E-tokiana : catégories et compteurs dynamiques,
   + pagination adaptative.

   À charger après app.js dans le HTML.

   Pagination :
   - le nombre de produits par page suit le nombre de colonnes affichées
     (≈ 24 produits, toujours des lignes complètes)
   - la page courante est conservée quand le catalogue est redessiné sans
     changement de résultats (favori, stock, édition d'une fiche…) ; elle revient
     à 1 uniquement quand la liste change (filtre, recherche, tri)
   - redimensionnement : on reste sur les mêmes produits
   - numéros avec points de suspension, compteur « 1–28 sur 312 »,
     navigation clavier, focus conservé, défilement vers le haut de la grille

   Mobile (≤ 640 px) : barre collante [Filtres][Trier] + puces de catégories ;
   « Filtres » ouvre une feuille depuis le bas (Échap, clic sur le fond, bouton ×,
   « Voir N articles »). Tablette / ordinateur : barre latérale inchangée. */

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
    sidebar.className =
      'catalogue-filter-sidebar rounded-2xl border border-stone-200 bg-white p-4 shadow-sm';

    controls.prepend(sidebar);
  }


  const normalize = (value) =>
    String(value || '').trim().toLocaleLowerCase('fr-FR');

  const pathKey = (path) => JSON.stringify(path);

  const startsWithPath = (candidate, path) =>
    path.every((part, index) => candidate[index] === part);


  /* ====================================================================== */
  /* Mobile (≤ 640 px) : barre collante + puces + feuille de filtres        */
  /* ====================================================================== */

  const mobileQuery = window.matchMedia('(max-width: 640px)');
  const mobileUI = {};


  function clearCategory() {
    familySelect.value = '';
    familySelect.dispatchEvent(new Event('change', { bubbles: true }));

    subcategorySelect.value = '';
    subcategorySelect.dispatchEvent(new Event('change', { bubbles: true }));
  }


  const resultCount = () =>
    document.querySelectorAll(
      '#product-grid > .product-card, #product-grid > .product-item'
    ).length;


  function openSheet() {
    sidebar.classList.add('is-open');
    document.body.classList.add('filters-open');

    sidebar.setAttribute('role', 'dialog');
    sidebar.setAttribute('aria-modal', 'true');
    sidebar.setAttribute('aria-label', 'Filtres');

    mobileUI.filterButton.setAttribute('aria-expanded', 'true');

    sidebar.querySelector('.mobile-sheet-close')?.focus();
  }


  function closeSheet(restoreFocus = true) {
    if (!sidebar.classList.contains('is-open')) return;

    sidebar.classList.remove('is-open');
    document.body.classList.remove('filters-open');

    sidebar.removeAttribute('role');
    sidebar.removeAttribute('aria-modal');
    sidebar.removeAttribute('aria-label');

    mobileUI.filterButton.setAttribute('aria-expanded', 'false');

    if (restoreFocus) {
      mobileUI.filterButton.focus();
    }
  }


  function ensureMobileUI() {

    if (mobileUI.ready) return;

    mobileUI.ready = true;

    const filterButton = document.createElement('button');

    filterButton.type = 'button';
    filterButton.className = 'mobile-filter-button';

    filterButton.setAttribute('aria-haspopup', 'dialog');
    filterButton.setAttribute('aria-expanded', 'false');
    filterButton.setAttribute(
      'aria-controls',
      'catalogue-filter-sidebar'
    );


    const chips = document.createElement('div');

    chips.className = 'catalogue-mobile-chips';

    chips.setAttribute('role', 'group');
    chips.setAttribute('aria-label', 'Catégories');


    const backdrop = document.createElement('div');

    backdrop.className = 'catalogue-sheet-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');


    toolbar.prepend(filterButton);
    toolbar.append(chips, backdrop);


    Object.assign(mobileUI, {
      filterButton,
      chips,
      backdrop
    });


    filterButton.addEventListener('click', openSheet);

    backdrop.addEventListener('click', () => closeSheet());


    // Échap ferme la feuille ; Tab reste à l'intérieur tant qu'elle est ouverte

    document.addEventListener(
      'keydown',
      (event) => {

        if (!sidebar.classList.contains('is-open')) return;


        if (event.key === 'Escape') {
          event.stopImmediatePropagation();
          closeSheet();
          return;
        }


        if (event.key !== 'Tab') return;


        const focusable = [
          ...sidebar.querySelectorAll(
            'button:not([disabled]), input, select, a[href]'
          )
        ].filter(
          (element) => element.offsetParent !== null
        );


        if (!focusable.length) return;


        const first = focusable[0];
        const last = focusable[focusable.length - 1];


        if (
          event.shiftKey &&
          document.activeElement === first
        ) {
          event.preventDefault();
          last.focus();

        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }

      },
      true
    );


    // Retour à l'affichage tablette / ordinateur :
    // la feuille se referme

    mobileQuery.addEventListener(
      'change',
      (event) => {
        if (!event.matches) {
          closeSheet(false);
        }
      }
    );
  }


  function renderMobileChips(
    categories,
    searchableProducts,
    currentPath
  ) {

    const {
      chips,
      filterButton
    } = mobileUI;


    if (!chips) return;


    const makeChip = (
      label,
      count,
      active,
      onClick
    ) => {

      const button = document.createElement('button');

      button.type = 'button';
      button.className =
        `mobile-chip${active ? ' is-active' : ''}`;

      button.setAttribute(
        'aria-pressed',
        String(active)
      );


      const text = document.createElement('span');
      text.textContent = label;


      const badge = document.createElement('b');
      badge.textContent = count;


      button.append(text, badge);


      button.addEventListener(
        'click',
        onClick
      );


      return button;
    };


    const items = [
      makeChip(
        'Tous',
        searchableProducts.length,
        currentPath.length === 0,
        clearCategory
      )
    ];


    categories.forEach((path) => {

      items.push(
        makeChip(
          path[0],
          countForPath(
            path,
            searchableProducts
          ),
          currentPath.length > 0 &&
            currentPath[0] === path[0],
          () => selectPath(path)
        )
      );

    });


    chips.replaceChildren(...items);


    const active =
      chips.querySelector('.is-active');


    chips.scrollTo({
      left:
        active && currentPath.length
          ? Math.max(
              0,
              active.offsetLeft -
                (
                  chips.clientWidth -
                  active.offsetWidth
                ) / 2
            )
          : 0,
      behavior: 'smooth'
    });


    // Bouton « Filtres » avec le nombre de filtres actifs

    const term = normalize(
      typeof searchTerm === 'undefined'
        ? ''
        : searchTerm
    );


    const activeCount =
      (currentPath.length ? 1 : 0) +
      (term ? 1 : 0);


    filterButton.innerHTML =
      '<i class="bi bi-sliders2" aria-hidden="true"></i>' +
      '<span>Filtres</span>';


    const badge = document.createElement('b');

    badge.className =
      'mobile-filter-badge';

    badge.textContent =
      activeCount;


    badge.hidden =
      activeCount === 0;


    filterButton.append(badge);


    filterButton.setAttribute(
      'aria-label',
      activeCount
        ? `Filtres, ${activeCount} actif${
            activeCount > 1 ? 's' : ''
          }`
        : 'Filtres'
    );
  }


  function matchingSearchProducts() {

    const term = normalize(
      typeof searchTerm === 'undefined'
        ? ''
        : searchTerm
    );


    return products.filter((product) => {

      if (!term) return true;


      const path =
        product.categoryPath ||
        [product.category];


      return normalize(
        `${product.name} ${path.join(' ')} ${product.material}`
      ).includes(term);

    });
  }


  function countForPath(
    path,
    searchableProducts
  ) {

    if (
      path.length === 2 &&
      path[1] === 'Nouveautés & Promos'
    ) {

      return searchableProducts.filter(
        (product) =>
          product.category === categoryNames.fashion &&
          (
            product.tag === 'Nouveau' ||
            Number(product.discount) > 0
          )
      ).length;
    }


    return searchableProducts.filter(
      (product) =>
        startsWithPath(
          product.categoryPath ||
          [product.category],
          path
        )
    ).length;
  }


  function allVisiblePaths() {

    const seen = new Map();


    const add = (path) =>
      seen.set(
        pathKey(path),
        path
      );


    (catalogRootPaths || []).forEach(add);
    (categoryFamilyPaths || []).forEach(add);
    (catalogCategoryPaths || []).forEach(add);


    products.forEach((product) => {

      const path =
        product.categoryPath ||
        [product.category];


      // Inclure les anciens chemins de produits seulement
      // s'ils correspondent à une famille ou à une catégorie
      // réellement sélectionnable.

      if (
        path.length === 1 ||
        (catalogCategoryPaths || []).some(
          (known) =>
            pathKey(known) === pathKey(path)
        )
      ) {
        add(path);
      }

    });


    return [...seen.values()];
  }


  function selectPath(path) {

    if (path.length === 1) {

      familySelect.value = '';

      familySelect.dispatchEvent(
        new Event('change', {
          bubbles: true
        })
      );


      const rootOption =
        [...subcategorySelect.options].find(
          (option) =>
            option.value === pathKey(path)
        );


      if (rootOption) {

        subcategorySelect.value =
          rootOption.value;

        subcategorySelect.dispatchEvent(
          new Event('change', {
            bubbles: true
          })
        );
      }


      return;
    }


    // Si le chemin existe comme famille,
    // il devient le filtre actif.

    const familyOption =
      [...familySelect.options].find(
        (option) =>
          option.value === pathKey(path)
      );


    if (familyOption) {

      familySelect.value =
        familyOption.value;

      familySelect.dispatchEvent(
        new Event('change', {
          bubbles: true
        })
      );

      return;
    }


    // Sinon, sélectionner le parent comme famille
    // puis le chemin comme sous-catégorie.

    const parentPath =
      path.slice(0, -1);


    const parentOption =
      [...familySelect.options].find(
        (option) =>
          option.value === pathKey(parentPath)
      );


    if (parentOption) {

      familySelect.value =
        parentOption.value;

      familySelect.dispatchEvent(
        new Event('change', {
          bubbles: true
        })
      );


      const childOption =
        [...subcategorySelect.options].find(
          (option) =>
            option.value === pathKey(path)
        );


      if (childOption) {

        subcategorySelect.value =
          childOption.value;

        subcategorySelect.dispatchEvent(
          new Event('change', {
            bubbles: true
          })
        );
      }


      return;
    }


    // Repli pour les catégories simples
    // qui ne figurent pas dans le select des familles.

    familySelect.value = '';

    familySelect.dispatchEvent(
      new Event('change', {
        bubbles: true
      })
    );


    const option =
      [...subcategorySelect.options].find(
        (item) =>
          item.value === pathKey(path)
      );


    if (option) {

      subcategorySelect.value =
        option.value;

      subcategorySelect.dispatchEvent(
        new Event('change', {
          bubbles: true
        })
      );
    }
  }



  /* ====================================================================== */
  /* Filtres disponibilité / prix / marque                                  */
  /* ====================================================================== */


  const extraFilters = {
    stock: new Set(),
    minPrice: 0,
    maxPrice: null,
    brands: new Set()
  };


  const getBrand = (product) =>
    product?.brand ||
    product?.brandName ||
    product?.manufacturer ||
    '';


  const getPrice = (product) => {

    const value =
      Number(product?.price);

    return Number.isFinite(value)
      ? value
      : null;
  };


  const getStockKey = (product) => {

    const raw = normalize(
      product?.availability ||
      product?.stockStatus ||
      product?.stockLabel ||
      product?.status ||
      ''
    );


    const stock =
      Number(
        product?.stock ??
        product?.inventory ??
        product?.quantity
      );


    if (
      raw.includes('out') ||
      raw.includes('rupture') ||
      raw.includes('épuis')
    ) {
      return 'Out of stock';
    }


    if (
      raw.includes('low') ||
      raw.includes('faible') ||
      raw.includes('limited')
    ) {
      return 'Low stock';
    }


    if (
      raw.includes('in stock') ||
      raw.includes('en stock') ||
      raw.includes('available') ||
      raw.includes('disponible')
    ) {
      return 'In stock';
    }


    if (Number.isFinite(stock)) {

      return stock <= 0
        ? 'Out of stock'
        : stock <= 5
          ? 'Low stock'
          : 'In stock';
    }


    return 'In stock';
  };


  const getActiveExtraFilterCount = () =>
    extraFilters.stock.size +
    extraFilters.brands.size +
    (extraFilters.minPrice > 0 ? 1 : 0) +
    (extraFilters.maxPrice !== null ? 1 : 0);


  const getCardProduct = (
    card,
    index
  ) => {

    const id =
      card.dataset.productId ||
      card.dataset.id ||
      card.querySelector(
        '[data-product-id]'
      )?.dataset.productId;


    if (
      id !== undefined &&
      id !== ''
    ) {

      const found =
        products.find(
          (p) =>
            String(
              p.id ??
              p.productId ??
              ''
            ) === String(id)
        );


      if (found) return found;
    }


    const name =
      normalize(
        card.querySelector(
          '.product-image-name, .product-name, [data-product-name]'
        )?.textContent ||
        card.dataset.productName ||
        ''
      );


    if (name) {

      const found =
        products.find(
          (p) =>
            normalize(p.name) === name
        );


      if (found) return found;
    }


    return products[index] || null;
  };


  const matchesExtraFilters = (
    product
  ) => {

    if (!product) return true;


    if (
      extraFilters.stock.size &&
      !extraFilters.stock.has(
        getStockKey(product)
      )
    ) {
      return false;
    }


    const price =
      getPrice(product);


    if (
      extraFilters.minPrice > 0 &&
      (
        price === null ||
        price < extraFilters.minPrice
      )
    ) {
      return false;
    }


    if (
      extraFilters.maxPrice !== null &&
      (
        price === null ||
        price > extraFilters.maxPrice
      )
    ) {
      return false;
    }


    if (
      extraFilters.brands.size &&
      !extraFilters.brands.has(
        String(getBrand(product))
      )
    ) {
      return false;
    }


    return true;
  };


  function applyExtraFilters() {

    const cards =
      [...grid.children]
        .filter(isCard)
        .filter(
          card =>
            card.dataset.extraFiltered !==
            'true'
        );


    cards.forEach(
      (card, index) => {

        card.dataset.extraFiltered =
          matchesExtraFilters(
            getCardProduct(card, index)
          )
            ? 'false'
            : 'true';


        if (
          card.dataset.extraFiltered ===
          'true'
        ) {
          card.hidden = true;
        }
      }
    );
  }


  function matchingExtraCount() {

    return [...grid.children]
      .filter(isCard)
      .filter(
        (card, index) =>
          matchesExtraFilters(
            getCardProduct(
              card,
              index
            )
          )
      ).length;
  }


  function refreshMobileApplyLabel() {

    const button =
      sidebar.querySelector(
        '.mobile-apply'
      );


    if (button) {

      const total =
        matchingExtraCount();


      button.textContent =
        `Voir ${total} article${
          total > 1 ? 's' : ''
        }`;
    }
  }


  function refreshMobileFilterBadge(
    currentPath = []
  ) {

    const button =
      mobileUI.filterButton;


    if (!button) return;


    const term =
      normalize(
        typeof searchTerm === 'undefined'
          ? ''
          : searchTerm
      );


    const count =
      (currentPath.length ? 1 : 0) +
      (term ? 1 : 0) +
      getActiveExtraFilterCount();


    const badge =
      button.querySelector(
        '.mobile-filter-badge'
      );


    if (badge) {

      badge.textContent =
        count;

      badge.hidden =
        count === 0;
    }


    button.setAttribute(
      'aria-label',
      count
        ? `Filtres, ${count} actif${
            count > 1 ? 's' : ''
          }`
        : 'Filtres'
    );
  }


  const asArray = (value) =>
    Array.isArray(value)
      ? value
      : (
          typeof value === 'string'
            ? value
                .split(',')
                .map(
                  v => v.trim()
                )
                .filter(Boolean)
            : []
        );


  /* ====================================================================== */
  /* Informations supplémentaires sur les produits                         */
  /* ====================================================================== */


  function decorateProductCards() {

    const cards =
      [...grid.children]
        .filter(isCard);


    cards.forEach(
      (card, index) => {

        const product =
          getCardProduct(
            card,
            index
          );


        if (!product) return;


        const colors =
          asArray(
            product.colors ??
            product.colours ??
            product.colorOptions ??
            product.availableColors
          );


        const sizes =
          asArray(
            product.sizes ??
            product.sizeOptions ??
            product.availableSizes
          );


        const rating =
          Number(
            product.rating ??
            product.note ??
            product.stars
          );


        const reviews =
          Number(
            product.reviewCount ??
            product.reviewsCount ??
            product.reviews
          );


        /* -------------------- COULEURS -------------------- */

        if (
          colors.length &&
          !card.querySelector(
            '.product-colors'
          )
        ) {

          const block =
            document.createElement(
              'div'
            );


          block.className =
            'product-colors';


          block.innerHTML =
            '<span class="product-colors-label">' +
            'Couleurs' +
            '</span>' +
            '<div class="product-color-swatches"></div>';


          const map = {
            noir: '#171717',
            blanc: '#fff',
            beige: '#d8c7aa',
            marron: '#795548',
            gris: '#9e9e9e',
            rouge: '#c84a42',
            rose: '#d98fa3',
            orange: '#e58b45',
            jaune: '#e5c84a',
            vert: '#6f936d',
            bleu: '#6689ad',
            violet: '#8d79a8'
          };


          colors
            .slice(0, 8)
            .forEach(
              (color) => {

                const sw =
                  document.createElement(
                    'span'
                  );


                sw.className =
                  'product-color-swatch';


                sw.title =
                  String(color);


                sw.setAttribute(
                  'aria-label',
                  `Couleur ${color}`
                );


                sw.style.background =
                  map[
                    normalize(color)
                  ] ||
                  String(color);


                block
                  .querySelector(
                    '.product-color-swatches'
                  )
                  .append(sw);
              }
            );


          (
            card.querySelector(
              '.product-info'
            ) || card
          ).append(block);
        }


        /* -------------------- TAILLES -------------------- */

        if (
          sizes.length &&
          !card.querySelector(
            '.product-sizes'
          )
        ) {

          const block =
            document.createElement(
              'div'
            );


          block.className =
            'product-sizes';


          block.innerHTML =
            '<span class="product-sizes-label">' +
            'Tailles' +
            '</span>' +
            '<div class="product-size-options"></div>';


          sizes
            .slice(0, 8)
            .forEach(
              (size) => {

                const item =
                  document.createElement(
                    'span'
                  );


                item.className =
                  'product-size-option';


                item.textContent =
                  String(size);


                block
                  .querySelector(
                    '.product-size-options'
                  )
                  .append(item);
              }
            );


          (
            card.querySelector(
              '.product-info'
            ) || card
          ).append(block);
        }


        /* -------------------- NOTE -------------------- */

        if (
          Number.isFinite(rating) &&
          rating > 0 &&
          !card.querySelector(
            '.product-rating'
          )
        ) {

          const block =
            document.createElement(
              'div'
            );


          block.className =
            'product-rating';


          const safe =
            Math.max(
              0,
              Math.min(
                5,
                rating
              )
            );


          const full =
            Math.floor(safe);


          const half =
            safe - full >= 0.5
              ? 1
              : 0;


          const stars =
            '★'.repeat(full) +
            (half ? '½' : '') +
            '☆'.repeat(
              Math.max(
                0,
                5 - full - half
              )
            );


          block.innerHTML =
            `<span class="product-rating-stars" aria-label="Note ${safe.toFixed(1)} sur 5">${stars}</span>`;


          if (
            Number.isFinite(reviews) &&
            reviews > 0
          ) {

            const c =
              document.createElement(
                'span'
              );


            c.className =
              'product-rating-count';


            c.textContent =
              `(${reviews})`;


            block.append(c);
          }


          (
            card.querySelector(
              '.product-info'
            ) || card
          ).append(block);
        }

      }
    );
  }



  /* ====================================================================== */
  /* Rendu de la barre latérale                                             */
  /* ====================================================================== */


  function renderSidebar() {

    if (!sidebar.isConnected) return;


    ensureMobileUI();


    const searchableProducts =
      matchingSearchProducts();


    const paths =
      allVisiblePaths();


    const currentPath =
      Array.isArray(
        activeSubcategory
      ) &&
      activeSubcategory.length
        ? activeSubcategory
        : (
            Array.isArray(
              activeFamilyPath
            )
              ? activeFamilyPath
              : []
          );


    sidebar.replaceChildren();


    const heading =
      document.createElement(
        'div'
      );


    heading.className =
      'catalogue-filter-heading flex items-center justify-between gap-3';


    const headingTitle =
      document.createElement(
        'div'
      );


    headingTitle.className =
      'catalogue-filter-title flex items-center gap-2';


    headingTitle.innerHTML =
      '<span class="catalogue-filter-icon" aria-hidden="true">' +
      '<i class="bi bi-sliders2"></i>' +
      '</span>' +
      '<span>Filtrer</span>';


    heading.append(
      headingTitle
    );


    /* -------------------- EFFACER LES FILTRES -------------------- */

    const reset =
      document.createElement(
        'button'
      );


    reset.type = 'button';


    reset.className =
      'catalogue-filter-reset inline-flex items-center justify-center gap-1.5';


    reset.innerHTML =
      '<i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i>' +
      '<span>Effacer</span>';


    reset.setAttribute(
      'aria-label',
      'Effacer tous les filtres'
    );


    reset.title =
      'Effacer les filtres';


    reset.addEventListener(
      'click',
      () => {

        familySelect.value = '';

        familySelect.dispatchEvent(
          new Event('change', {
            bubbles: true
          })
        );


        subcategorySelect.value = '';

        subcategorySelect.dispatchEvent(
          new Event('change', {
            bubbles: true
          })
        );


        const searchInput =
          document.querySelector(
            '#search-input'
          );


        if (searchInput) {

          searchInput.value = '';

          searchInput.dispatchEvent(
            new Event('input', {
              bubbles: true
            })
          );
        }

      }
    );


    heading.append(reset);


    /* -------------------- FERMER MOBILE -------------------- */

    const closeButton =
      document.createElement(
        'button'
      );


    closeButton.type = 'button';


    closeButton.className =
      'mobile-sheet-close';


    closeButton.setAttribute(
      'aria-label',
      'Fermer les filtres'
    );


    closeButton.innerHTML =
      '<i class="bi bi-x-lg" aria-hidden="true"></i>';


    closeButton.addEventListener(
      'click',
      () => closeSheet()
    );


    heading.append(
      closeButton
    );


    sidebar.append(
      heading
    );


    /* -------------------- TOUS LES ARTICLES -------------------- */

    const allButton =
      document.createElement(
        'button'
      );


    allButton.type = 'button';


    allButton.className =
      `catalogue-filter-option catalogue-filter-all flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition${
        currentPath.length
          ? ''
          : ' is-active'
      }`;


    allButton.innerHTML =
      '<span>Tous les articles</span>';


    const allCount =
      document.createElement(
        'span'
      );


    allCount.className =
      'catalogue-option-count';


    allCount.textContent =
      searchableProducts.length;


    allButton.append(
      allCount
    );


    allButton.addEventListener(
      'click',
      clearCategory
    );


    sidebar.append(
      allButton
    );


    /* -------------------- CATÉGORIES -------------------- */

    const list =
      document.createElement(
        'div'
      );


    list.className =
      'catalogue-filter-list flex flex-col gap-2';


    // Afficher uniquement les catégories principales :
    // aucune sous-catégorie n'est ajoutée à la liste.

    const categoryMap =
      new Map();


    paths.forEach(
      (path) => {

        if (path.length) {

          const categoryPath =
            [path[0]];


          categoryMap.set(
            pathKey(categoryPath),
            categoryPath
          );
        }

      }
    );


    const categories =
      [...categoryMap.values()];


    categories.forEach(
      (category) => {

        list.append(
          makeOption(
            category,
            0,
            searchableProducts,
            currentPath
          )
        );

      }
    );


    sidebar.append(
      list
    );


    /* ================================================================== */
    /* Disponibilité                                                      */
    /* ================================================================== */

    const extra =
      document.createElement(
        'div'
      );


    extra.className =
      'catalogue-extra-filter catalogue-availability-filter';


    extra.innerHTML =
      '<h4>Disponibilité</h4>' +
      [
        ['In stock', 'En stock'],
        ['Low stock', 'Stock faible'],
        ['Out of stock', 'Rupture de stock']
      ]
        .map(
          ([key, label]) =>
            `<label class="catalogue-extra-choice">
              <input
                type="checkbox"
                data-stock-filter="${key}"
                ${
                  extraFilters.stock.has(key)
                    ? 'checked'
                    : ''
                }
              >
              <span>${label}</span>
            </label>`
        )
        .join('');


    extra
      .querySelectorAll(
        '[data-stock-filter]'
      )
      .forEach(
        (input) => {

          input.addEventListener(
            'change',
            () => {

              if (input.checked) {

                extraFilters.stock.add(
                  input.dataset.stockFilter
                );

              } else {

                extraFilters.stock.delete(
                  input.dataset.stockFilter
                );
              }


              currentPage = 1;

              applyExtraFilters();

              paginate();

              refreshMobileApplyLabel();

              refreshMobileFilterBadge(
                currentPath
              );
            }
          );
        }
      );


    sidebar.append(
      extra
    );


    /* ================================================================== */
    /* Prix                                                                */
    /* ================================================================== */

    const prices =
      products
        .map(getPrice)
        .filter(
          n =>
            Number.isFinite(n) &&
            n >= 0
        );


    const maxPrice =
      Math.max(
        250,
        ...prices
      );


    if (
      extraFilters.maxPrice === null
    ) {
      extraFilters.maxPrice =
        maxPrice;
    }


    extraFilters.maxPrice =
      Math.min(
        extraFilters.maxPrice,
        maxPrice
      );


    extraFilters.minPrice =
      Math.min(
        extraFilters.minPrice,
        extraFilters.maxPrice
      );


    const priceFilter =
      document.createElement(
        'div'
      );


    priceFilter.className =
      'catalogue-extra-filter catalogue-price-filter';


    priceFilter.innerHTML =
      `<h4>Prix</h4>
       <input
         aria-label="Prix maximum"
         type="range"
         min="0"
         max="${maxPrice}"
         value="${extraFilters.maxPrice}"
         data-price-range
       >
       <div class="catalogue-price-inputs">
         <label>
           $
           <input
             type="number"
             min="0"
             max="${maxPrice}"
             value="${extraFilters.minPrice}"
             data-price-min
           >
         </label>

         <label>
           $
           <input
             type="number"
             min="0"
             max="${maxPrice}"
             value="${extraFilters.maxPrice}"
             data-price-max
           >
         </label>
       </div>`;


    const priceRange =
      priceFilter.querySelector(
        '[data-price-range]'
      );


    const priceMin =
      priceFilter.querySelector(
        '[data-price-min]'
      );


    const priceMax =
      priceFilter.querySelector(
        '[data-price-max]'
      );


    const updatePrices = () => {

      let min =
        Math.max(
          0,
          Number(priceMin.value) || 0
        );


      let max =
        Math.min(
          maxPrice,
          Number(priceMax.value) || 0
        );


      if (max < min) {
        max = min;
      }


      extraFilters.minPrice =
        min;


      extraFilters.maxPrice =
        max >= maxPrice
          ? maxPrice
          : max;


      priceMin.value =
        min;


      priceMax.value =
        max;


      priceRange.value =
        max;


      currentPage = 1;

      applyExtraFilters();

      paginate();

      refreshMobileApplyLabel();

      refreshMobileFilterBadge(
        currentPath
      );
    };


    priceRange.addEventListener(
      'input',
      () => {

        priceMax.value =
          priceRange.value;

        updatePrices();
      }
    );


    priceMin.addEventListener(
      'change',
      updatePrices
    );


    priceMax.addEventListener(
      'change',
      updatePrices
    );


    sidebar.append(
      priceFilter
    );


    /* ================================================================== */
    /* Marque                                                              */
    /* ================================================================== */

    const brandValues =
      [
        ...new Set(
          products
            .map(getBrand)
            .filter(Boolean)
        )
      ]
        .sort(
          (a, b) =>
            String(a).localeCompare(
              String(b),
              'fr'
            )
        );


    const brandFilter =
      document.createElement(
        'div'
      );


    brandFilter.className =
      'catalogue-extra-filter catalogue-brand-filter';


    brandFilter.innerHTML =
      '<h4>Marque</h4>' +
      '<input type="search" class="catalogue-brand-search" placeholder="⌕  Rechercher une marque" aria-label="Rechercher une marque">' +
      '<div class="catalogue-brand-options"></div>' +
      '<button type="button" class="catalogue-brand-more">Afficher plus</button>';


    const brandOptions =
      brandFilter.querySelector(
        '.catalogue-brand-options'
      );


    const renderBrands = (
      term = '',
      showAll = false
    ) => {

      brandOptions.replaceChildren();


      const filtered =
        brandValues.filter(
          (brand) =>
            normalize(brand)
              .includes(
                normalize(term)
              )
        );


      (
        showAll
          ? filtered
          : filtered.slice(0, 4)
      )
        .forEach(
          (brand) => {

            const label =
              document.createElement(
                'label'
              );


            label.className =
              'catalogue-extra-choice';


            const input =
              document.createElement(
                'input'
              );


            input.type =
              'checkbox';


            input.value =
              brand;


            input.dataset.brandFilter =
              'true';


            input.checked =
              extraFilters.brands.has(
                String(brand)
              );


            const text =
              document.createElement(
                'span'
              );


            text.textContent =
              brand;


            label.append(
              input,
              text
            );


            brandOptions.append(
              label
            );


            input.addEventListener(
              'change',
              () => {

                if (input.checked) {

                  extraFilters.brands.add(
                    String(brand)
                  );

                } else {

                  extraFilters.brands.delete(
                    String(brand)
                  );
                }


                currentPage = 1;

                applyExtraFilters();

                paginate();

                refreshMobileApplyLabel();

                refreshMobileFilterBadge(
                  currentPath
                );
              }
            );
          }
        );


      brandFilter.querySelector(
        '.catalogue-brand-more'
      ).hidden =
        filtered.length <= 4 ||
        showAll;
    };


    renderBrands();


    brandFilter
      .querySelector(
        '.catalogue-brand-search'
      )
      .addEventListener(
        'input',
        (event) =>
          renderBrands(
            event.target.value,
            true
          )
      );


    brandFilter
      .querySelector(
        '.catalogue-brand-more'
      )
      .addEventListener(
        'click',
        () =>
          renderBrands(
            brandFilter.querySelector(
              '.catalogue-brand-search'
            ).value,
            true
          )
      );


    sidebar.append(
      brandFilter
    );


    /* ================================================================== */
    /* Mobile                                                              */
    /* ================================================================== */

    // Puces de catégories +
    // bouton « Voir N articles »

    renderMobileChips(
      categories,
      searchableProducts,
      currentPath
    );


    const total =
      matchingExtraCount();


    const applyBar =
      document.createElement(
        'div'
      );


    applyBar.className =
      'mobile-apply-bar';


    const apply =
      document.createElement(
        'button'
      );


    apply.type =
      'button';


    apply.className =
      'mobile-apply';


    apply.textContent =
      `Voir ${total} article${
        total > 1 ? 's' : ''
      }`;


    apply.addEventListener(
      'click',
      () => closeSheet()
    );


    applyBar.append(
      apply
    );


    sidebar.append(
      applyBar
    );
  }



  /* ====================================================================== */
  /* Option de filtre                                                      */
  /* ====================================================================== */


  function makeOption(
    path,
    depth,
    searchableProducts,
    currentPath
  ) {

    const button =
      document.createElement(
        'button'
      );


    button.type =
      'button';


    const active =
      pathKey(path) ===
        pathKey(currentPath) ||
      (
        path.length === 1 &&
        currentPath[0] === path[0]
      );


    button.className =
      `catalogue-filter-option flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition${
        active
          ? ' is-active'
          : ''
      }${
        depth === 0
          ? ' catalogue-filter-root'
          : ''
      }`;


    button.style.setProperty(
      '--filter-depth',
      Math.min(depth, 3)
    );


    const label =
      path[path.length - 1];


    const count =
      countForPath(
        path,
        searchableProducts
      );


    button.innerHTML =
      '<span class="catalogue-filter-label"></span>';


    button.querySelector(
      '.catalogue-filter-label'
    ).textContent =
      label;


    const badge =
      document.createElement(
        'span'
      );


    badge.className =
      'catalogue-option-count';


    badge.textContent =
      count;


    button.append(
      badge
    );


    button.setAttribute(
      'aria-label',
      `${label}, ${count} article${
        count > 1 ? 's' : ''
      }`
    );


    button.addEventListener(
      'click',
      () => selectPath(path)
    );


    return button;
  }



  /* ====================================================================== */
  /* Pagination adaptative                                                 */
  /* ====================================================================== */

  const TARGET_PER_PAGE = 24;

  const MIN_ROWS = 2;


  const grid =
    document.querySelector(
      '#product-grid'
    );


  if (!grid) {
    renderSidebar();
    return;
  }


  let currentPage = 1;

  let perPage =
    TARGET_PER_PAGE;

  let lastSignature = null;


  const reduceMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );


  const isCard =
    (element) =>
      element.classList.contains(
        'product-card'
      ) ||
      element.classList.contains(
        'product-item'
      );


  // Nombre de colonnes réellement affichées

  function columnCount() {

    const tracks =
      getComputedStyle(
        grid
      ).gridTemplateColumns;


    const count =
      tracks &&
      tracks !== 'none'
        ? tracks
            .trim()
            .split(/\s+/)
            .length
        : 0;


    return count || 4;
  }


  // Toujours des lignes complètes :
  // 24 → 6×4, 4×6, 3×8, 2×12…

  const computePerPage = () => {

    const columns =
      columnCount();


    return (
      columns *
      Math.max(
        MIN_ROWS,
        Math.ceil(
          TARGET_PER_PAGE /
          columns
        )
      )
    );
  };


  /* ====================================================================== */
  /* Numéros de pages                                                      */
  /* ====================================================================== */

  function pageItems(
    current,
    total
  ) {

    if (total <= 7) {

      return Array.from(
        {
          length: total
        },
        (_, index) =>
          index + 1
      );
    }


    const wanted =
      new Set([
        1,
        total,
        current - 1,
        current,
        current + 1
      ]);


    if (current <= 3) {

      [2, 3, 4].forEach(
        (page) =>
          wanted.add(page)
      );
    }


    if (current >= total - 2) {

      [
        total - 1,
        total - 2,
        total - 3
      ].forEach(
        (page) =>
          wanted.add(page)
      );
    }


    const pages =
      [...wanted]
        .filter(
          (page) =>
            page >= 1 &&
            page <= total
        )
        .sort(
          (a, b) => a - b
        );


    const items = [];


    pages.forEach(
      (page, index) => {

        const gap =
          index
            ? page -
              pages[index - 1]
            : 1;


        if (gap === 2) {

          items.push(
            page - 1
          );

        } else if (gap > 2) {

          items.push('gap');
        }


        items.push(page);
      }
    );


    return items;
  }



  function navElement() {

    let nav =
      document.querySelector(
        '#catalogue-pagination'
      );


    if (!nav) {

      nav =
        document.createElement(
          'nav'
        );


      nav.id =
        'catalogue-pagination';


      nav.className =
        'catalogue-pagination';


      nav.setAttribute(
        'aria-label',
        'Pagination du catalogue'
      );


      grid.insertAdjacentElement(
        'afterend',
        nav
      );


      nav.addEventListener(
        'click',
        (event) => {

          const button =
            event.target.closest(
              'button[data-page]'
            );


          if (
            !button ||
            button.disabled
          ) {
            return;
          }


          goToPage(
            Number(
              button.dataset.page
            )
          );
        }
      );
    }


    return nav;
  }



  function makeButton({
    label,
    page,
    nav,
    current = false,
    disabled = false,
    icon,
    aria
  }) {

    const button =
      document.createElement(
        'button'
      );


    button.type =
      'button';


    button.dataset.page =
      String(page);


    if (nav) {
      button.dataset.nav =
        nav;
    }


    if (aria) {

      button.setAttribute(
        'aria-label',
        aria
      );
    }


    if (current) {

      button.classList.add(
        'is-active'
      );


      button.setAttribute(
        'aria-current',
        'page'
      );
    }


    button.disabled =
      disabled;


    if (icon === 'prev') {

      button.innerHTML =
        '<i class="bi bi-chevron-left" aria-hidden="true"></i>' +
        '<span class="pg-label">Précédent</span>';

    } else if (icon === 'next') {

      button.innerHTML =
        '<span class="pg-label">Suivant</span>' +
        '<i class="bi bi-chevron-right" aria-hidden="true"></i>';

    } else {

      button.textContent =
        label;
    }


    return button;
  }



  function renderNav(
    totalItems,
    totalPages,
    from,
    to
  ) {

    const nav =
      navElement();


    nav.replaceChildren();


    nav.hidden =
      totalPages <= 1;


    if (totalPages <= 1) {
      return;
    }


    const info =
      document.createElement(
        'p'
      );


    info.className =
      'catalogue-pagination-info';


    info.setAttribute(
      'aria-live',
      'polite'
    );


    info.innerHTML =
      `<strong>${from + 1}–${to}</strong> sur ${totalItems} article${
        totalItems > 1 ? 's' : ''
      } · page ${currentPage} / ${totalPages}`;


    const list =
      document.createElement(
        'div'
      );


    list.className =
      'catalogue-pagination-controls';


    list.append(
      makeButton({
        page: currentPage - 1,
        nav: 'prev',
        icon: 'prev',
        disabled:
          currentPage === 1,
        aria: 'Page précédente'
      })
    );


    pageItems(
      currentPage,
      totalPages
    ).forEach(
      (item) => {

        if (item === 'gap') {

          const gap =
            document.createElement(
              'span'
            );


          gap.className =
            'catalogue-pagination-gap';


          gap.setAttribute(
            'aria-hidden',
            'true'
          );


          gap.textContent =
            '…';


          list.append(gap);

        } else {

          list.append(
            makeButton({
              label:
                String(item),
              page: item,
              current:
                item === currentPage,
              aria:
                `Page ${item}`
            })
          );
        }
      }
    );


    list.append(
      makeButton({
        page:
          currentPage + 1,
        nav: 'next',
        icon: 'next',
        disabled:
          currentPage ===
          totalPages,
        aria:
          'Page suivante'
      })
    );


    nav.append(
      info,
      list
    );
  }



  /* ====================================================================== */
  /* Pagination                                                             */
  /* ====================================================================== */

  function paginate() {

    const cards =
      [...grid.children]
        .filter(isCard);


    // La page ne revient à 1 que si la liste de résultats
    // a changé (filtre, recherche, tri)

    const signature =
      cards
        .map(
          (card, index) =>
            card.querySelector(
              '[data-add]'
            )?.dataset.add ??
            card.querySelector(
              '[data-details]'
            )?.dataset.details ??
            index
        )
        .join(',');


    if (
      signature !==
      lastSignature
    ) {

      currentPage = 1;

      lastSignature =
        signature;
    }


    perPage =
      computePerPage();


    const totalPages =
      Math.max(
        1,
        Math.ceil(
          cards.length /
          perPage
        )
      );


    currentPage =
      Math.min(
        Math.max(
          1,
          currentPage
        ),
        totalPages
      );


    const from =
      (currentPage - 1) *
      perPage;


    const to =
      Math.min(
        from + perPage,
        cards.length
      );


    cards.forEach(
      (card, index) => {

        const hide =
          index < from ||
          index >= to;


        if (
          card.hidden !== hide
        ) {
          card.hidden =
            hide;
        }
      }
    );


    renderNav(
      cards.length,
      totalPages,
      from,
      to
    );
  }



  function goToPage(page) {

    currentPage =
      page;


    paginate();


    grid.scrollIntoView({
      behavior:
        reduceMotion.matches
          ? 'auto'
          : 'smooth',
      block: 'start'
    });


    // Le focus clavier reste dans la pagination,
    // sur la page courante

    document
      .querySelector(
        '#catalogue-pagination [aria-current="page"]'
      )
      ?.focus({
        preventScroll: true
      });
  }



  /* ====================================================================== */
  /* Synchronisation avec app.js                                           */
  /* ====================================================================== */


  // Toute mise à jour de la grille
  // repagine avant l'affichage

  new MutationObserver(
    () => {

      decorateProductCards();

      applyExtraFilters();

      paginate();

    }
  ).observe(
    grid,
    {
      childList: true
    }
  );


  // Redimensionnement / ouverture du panneau de notifications :
  // même produits à l'écran

  new ResizeObserver(
    () => {

      const next =
        computePerPage();


      if (
        next === perPage
      ) {
        return;
      }


      const anchor =
        (currentPage - 1) *
        perPage;


      currentPage =
        Math.floor(
          anchor / next
        ) + 1;


      paginate();

    }
  ).observe(
    grid
  );


  // La barre latérale se met à jour
  // dès que le catalogue est redessiné.

  const originalRenderProducts =
    renderProducts;


  renderProducts =
    function (...args) {

      const result =
        originalRenderProducts.apply(
          this,
          args
        );


      renderSidebar();


      return result;
    };


  document
    .querySelector(
      '#search-input'
    )
    ?.addEventListener(
      'input',
      () => {
        renderSidebar();
      }
    );


  renderSidebar();

  paginate();

})();



