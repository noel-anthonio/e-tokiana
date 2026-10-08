/* ==========================================================================
   E-tokiana — spaces.js   (à charger APRÈS app.js)
   Couche d'amélioration : n'écrase rien dans app.js, réutilise ses fonctions.
   - Espace Client : menu latéral, tableau de bord, commandes avec progression,
     favoris riches, profil modifiable
   - Espace Vendeur / Admin : menu à icônes, produits réels (suppression),
     clients réels + export CSV, raccourcis notifications / messages
   - Site : menu mobile, lien actif au scroll, récapitulatif de paiement,
     jauge de livraison offerte, afficher/masquer le mot de passe, Échap
   ========================================================================== */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const STEPS = ['Nouvelle commande', 'Validée', 'En préparation', 'Expédiée', 'Livrée'];
  const FREE_SHIPPING_FROM = 80;

  const isStaff = user => ['owner', 'admin'].includes(user?.role);
  const nameOf = user => isStaff(user) ? adminIdentity.name : (user?.name || 'Utilisateur');
  const roleOf = user => isStaff(user)
    ? { label: 'Administrateur', icon: 'bi-shield-check', cls: 'owner' }
    : user?.role === 'seller'
      ? { label: 'Vendeur', icon: 'bi-shop', cls: 'seller' }
      : { label: 'Client', icon: 'bi-person-fill', cls: 'client' };
  const initialsOf = name => {
    const parts = String(name || 'U').trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts.at(-1)[0] : (parts[0] || 'U').slice(0, 2)).toLocaleUpperCase('fr-FR');
  };

  const userCardHTML = user => {
    const role = roleOf(user);
    return `<div class="space-user"><span class="space-avatar ${role.cls}">${esc(initialsOf(nameOf(user)))}</span><div><strong>${esc(nameOf(user))}</strong><small>${esc(user.email || '')}</small><span class="space-role ${role.cls}"><i class="bi ${role.icon}" aria-hidden="true"></i>${role.label}</span></div></div>`;
  };

  const linksHTML = () => `<div class="space-links">
    <button type="button" class="space-link" data-space-go="notifications"><i class="bi bi-bell" aria-hidden="true"></i><span>Notifications</span><b class="space-badge" data-space-badge="notifications" hidden></b></button>
    <button type="button" class="space-link" data-space-go="messages"><i class="bi bi-chat-dots" aria-hidden="true"></i><span>Messages</span><b class="space-badge" data-space-badge="messages" hidden></b></button>
    <button type="button" class="space-link" data-space-go="shop"><i class="bi bi-shop" aria-hidden="true"></i><span>Voir la boutique</span></button>
    <button type="button" class="space-link danger" data-space-go="logout"><i class="bi bi-box-arrow-right" aria-hidden="true"></i><span>Se déconnecter</span></button>
  </div>`;

  const decorate = (element, icon, label, count) => {
    if (!element) return;
    element.innerHTML = `<i class="bi ${icon}" aria-hidden="true"></i><span>${label}</span>${count ? `<b class="space-count">${count}</b>` : ''}`;
  };

  const emptyHTML = (icon, title, text) => `<div class="space-empty"><i class="bi ${icon}" aria-hidden="true"></i><strong>${title}</strong><p>${text}</p><button type="button" class="space-mini primary" data-space-go="shop"><i class="bi bi-shop" aria-hidden="true"></i>Découvrir la marketplace</button></div>`;

  function refreshBadges() {
    const unreadNotifications = notifications.filter(item => item.recipient === userNotificationKey() && !item.read).length;
    const unreadMessages = unreadChatCount();
    [['notifications', unreadNotifications], ['messages', unreadMessages]].forEach(([key, count]) => {
      $$(`[data-space-badge="${key}"]`).forEach(badge => { badge.textContent = count; badge.hidden = count === 0; });
    });
  }

  const closeAllModals = () => $$('.modal.open').forEach(closeModal);
  const goToShop = () => { closeAllModals(); $('#catalogue')?.scrollIntoView({ behavior: 'smooth' }); };

  /* ------------------------------------------------------------------ */
  /* Espace Client                                                        */
  /* ------------------------------------------------------------------ */
  function showAccountView(name) {
    $$('.account-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.accountView === name));
    $$('#account-modal .account-view').forEach(view => view.classList.toggle('active', view.dataset.view === name));
  }

  const profileFormHTML = () => `<form class="space-form" id="space-profile-form">
    <h3>Mes informations</h3>
    <label>Nom complet<input id="sp-name" type="text" autocomplete="name" required /></label>
    <label>Téléphone<input id="sp-phone" type="tel" autocomplete="tel" placeholder="+261 34 00 000 00" /></label>
    <label>E-mail<input id="sp-email" type="email" readonly /></label>
    <label>Adresse de livraison<input id="sp-address" type="text" autocomplete="street-address" placeholder="Quartier, ville" /></label>
    <button class="button button-dark" type="submit">Enregistrer <i class="bi bi-check2" aria-hidden="true"></i></button>
  </form>`;

  function saveProfile(event) {
    event.preventDefault();
    const name = $('#sp-name').value.trim();
    if (!name) return;
    currentUser.name = name;
    currentUser.phone = $('#sp-phone').value.trim();
    currentUser.address = $('#sp-address').value.trim();
    localStorage.setItem('etokiana-user', JSON.stringify(currentUser));
    const users = JSON.parse(localStorage.getItem('etokiana-users') || '[]');
    const index = users.findIndex(user => user.email === currentUser.email);
    if (index > -1) {
      users[index] = { ...users[index], name: currentUser.name, phone: currentUser.phone, address: currentUser.address };
      localStorage.setItem('etokiana-users', JSON.stringify(users));
    }
    updateProfileButton();
    refreshAccount();
    showToast('Profil enregistré.');
  }

  function renderSaved() {
    const view = $('#account-modal [data-view="saved"]');
    if (!view) return;
    const list = products.filter(product => favorites.includes(product.id));
    view.innerHTML = list.length
      ? `<div class="space-fav-grid">${list.map(product => `<article class="space-fav"><img src="${esc(product.image)}" alt="" loading="lazy" /><div><strong>${esc(product.name)}</strong><small>${esc(product.material)}</small><span>${euro(effectivePrice(product))}</span></div><div class="space-fav-actions"><button type="button" class="space-mini" data-details="${product.id}">Voir</button><button type="button" class="space-mini primary" data-space-add="${product.id}">Ajouter</button><button type="button" class="space-mini ghost" data-space-unfav="${product.id}" aria-label="Retirer ${esc(product.name)} des favoris"><i class="bi bi-heart-fill" aria-hidden="true"></i></button></div></article>`).join('')}</div>`
      : emptyHTML('bi-heart', 'Aucun favori pour l’instant', 'Touchez le cœur sur un produit pour le retrouver ici.');
  }

  function refreshAccount() {
    const panel = $('#account-modal .modal-panel');
    const myOrders = orders.filter(order => order.buyerId === currentUser.email);
    const saved = products.filter(product => favorites.includes(product.id));

    $('.space-user-slot', panel).innerHTML = userCardHTML(currentUser);
    decorate($('[data-account-view="overview"]', panel), 'bi-grid-1x2', 'Vue d’ensemble');
    decorate($('[data-account-view="orders"]', panel), 'bi-receipt', 'Mes commandes', myOrders.length);
    decorate($('[data-account-view="saved"]', panel), 'bi-heart', 'Mes favoris', saved.length);
    decorate($('[data-account-view="profile"]', panel), 'bi-person-gear', 'Mon profil');

    // Tableau de bord
    const overview = $('[data-view="overview"]', panel);
    $('.space-overview-top', overview)?.remove();
    const inProgress = myOrders.filter(order => order.status !== 'Livrée').length;
    const spent = myOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const kpi = (icon, value, label) => `<div><i class="bi ${icon}" aria-hidden="true"></i><strong>${value}</strong><span>${label}</span></div>`;
    overview.insertAdjacentHTML('afterbegin', `<div class="space-overview-top"><div class="space-kpis">${kpi('bi-receipt', myOrders.length, 'Commandes')}${kpi('bi-truck', inProgress, 'En cours')}${kpi('bi-wallet2', euro(spent), 'Total dépensé')}${kpi('bi-heart', saved.length, 'Favoris')}</div><div class="space-actions"><button type="button" class="space-mini primary" data-space-go="shop"><i class="bi bi-shop" aria-hidden="true"></i>Explorer la marketplace</button><button type="button" class="space-mini" data-space-tab="orders"><i class="bi bi-receipt" aria-hidden="true"></i>Mes commandes</button><button type="button" class="space-mini" data-space-tab="profile"><i class="bi bi-person-gear" aria-hidden="true"></i>Modifier mon profil</button></div></div>`);

    // Commandes : barre de progression
    const ordersView = $('[data-view="orders"]', panel);
    const rows = $$('.order-row', ordersView);
    if (!rows.length) {
      ordersView.innerHTML = emptyHTML('bi-bag', 'Aucune commande pour l’instant', 'Vos achats et leur suivi de livraison apparaîtront ici.');
    } else {
      rows.forEach(row => {
        if ($('.order-progress-wrap', row)) return;
        const index = Math.max(0, STEPS.indexOf(row.children[1]?.textContent.trim()));
        row.classList.toggle('is-done', index === STEPS.length - 1);
        row.insertAdjacentHTML('beforeend', `<div class="order-progress-wrap"><div class="order-progress"><i style="width:${Math.max(8, index / (STEPS.length - 1) * 100)}%"></i></div><small>Étape ${index + 1} sur ${STEPS.length} · ${STEPS[index]}</small></div>`);
      });
    }

    renderSaved();

    // Profil
    $('#sp-name').value = currentUser.name || '';
    $('#sp-phone').value = currentUser.phone || '';
    $('#sp-email').value = currentUser.email || '';
    $('#sp-address').value = currentUser.address || '';
    refreshBadges();
  }

  function enhanceAccount() {
    if (!currentUser) return;
    const panel = $('#account-modal .modal-panel');
    if (!panel.dataset.spaceReady) {
      panel.dataset.spaceReady = '1';
      panel.classList.add('space-panel', 'account-space');
      const header = $('.modal-header', panel);
      const tabs = $('.account-tabs', panel);
      const views = $$('.account-view', panel);

      tabs.classList.add('space-tabs');
      const profileTab = document.createElement('button');
      profileTab.type = 'button';
      profileTab.className = 'account-tab';
      profileTab.dataset.accountView = 'profile';
      profileTab.addEventListener('click', () => showAccountView('profile'));
      tabs.append(profileTab);

      const sidebar = document.createElement('aside');
      sidebar.className = 'space-sidebar';
      sidebar.innerHTML = '<div class="space-user-slot"></div>';
      sidebar.append(tabs);
      sidebar.insertAdjacentHTML('beforeend', linksHTML());

      const main = document.createElement('div');
      main.className = 'space-main';
      views.forEach(view => main.append(view));
      const profileView = document.createElement('div');
      profileView.className = 'account-view';
      profileView.dataset.view = 'profile';
      profileView.innerHTML = profileFormHTML();
      main.append(profileView);

      $(':scope > .modal-submit', panel)?.remove();
      header.after(sidebar, main);
      $('#space-profile-form').addEventListener('submit', saveProfile);
    }
    refreshAccount();
  }

  /* ------------------------------------------------------------------ */
  /* Espace Vendeur / Admin                                               */
  /* ------------------------------------------------------------------ */
  function visibleOrders() {
    return currentUser.role === 'seller' ? orders.filter(order => order.items?.some(item => item.sellerId === currentUser.id)) : orders;
  }

  function renderAdminProducts() {
    const panel = $('[data-admin-panel="products"]');
    if (!panel) return;
    $('.stock-alert', panel)?.remove();
    let table = $('.admin-table', panel);
    if (!table) { table = document.createElement('div'); table.className = 'admin-table'; panel.append(table); }
    table.classList.add('space-products');
    const seller = currentUser.role === 'seller';
    const list = seller ? products.filter(product => product.sellerId === currentUser.id) : products.slice().sort((a, b) => b.id - a.id);
    table.innerHTML = list.length ? list.map(product => {
      const path = (product.categoryPath || [product.category]).slice(1).join(' · ') || product.category;
      const deletable = product.id > 1000;
      return `<div class="space-row"><img src="${esc(product.image)}" alt="" loading="lazy" /><div class="space-row-main"><strong>${esc(product.name)}</strong><small>${esc(path)}${seller ? '' : ' · ' + esc(sellerLabel(product))}</small></div><div class="space-row-price"><strong>${euro(effectivePrice(product))}</strong>${product.discount ? `<em>-${product.discount}%</em>` : ''}</div><div class="space-row-actions">${deletable ? `<button type="button" class="space-mini danger" data-space-del="${product.id}"><i class="bi bi-trash3" aria-hidden="true"></i>Supprimer</button>` : '<span class="space-tag">Produit démo</span>'}</div></div>`;
    }).join('') : emptyHTML('bi-box-seam', 'Aucun produit publié', 'Ajoutez votre premier produit avec le bouton « Ajouter un produit ».').replace(/<button.*<\/button>/, '');
  }

  function customerRows() {
    const map = new Map();
    JSON.parse(localStorage.getItem('etokiana-users') || '[]')
      .filter(user => (user.role || 'client') === 'client')
      .forEach(user => map.set(user.email, { name: user.name, email: user.email, phone: user.phone || '', address: user.address || '', orders: 0, spent: 0 }));
    orders.forEach(order => {
      if (!order.buyerId || order.buyerId === 'guest') return;
      const customer = map.get(order.buyerId) || { name: order.buyerName, email: order.buyerId, phone: '', address: '', orders: 0, spent: 0 };
      customer.orders += 1;
      customer.spent += Number(order.total) || 0;
      map.set(order.buyerId, customer);
    });
    return [...map.values()];
  }

  function renderAdminCustomers() {
    const table = $('[data-admin-panel="customers"] .admin-table');
    if (!table) return;
    const rows = customerRows();
    table.innerHTML = `<div class="admin-table-head"><span>Client</span><span>Commandes</span><span>Dépenses</span><span>Statut</span></div>` + (rows.length
      ? rows.map(customer => `<div class="admin-table-row"><span><strong>${esc(customer.name || 'Client')}</strong><small>${esc([customer.email, customer.phone, customer.address].filter(Boolean).join(' · '))}</small></span><span>${customer.orders}</span><span>${euro(customer.spent)}</span><em class="status-pill ${customer.orders ? '' : 'muted'}">${customer.orders ? 'Actif' : 'Nouveau'}</em></div>`).join('')
      : '<p class="modal-muted">Aucun client pour le moment. Les comptes créés et les acheteurs apparaîtront ici.</p>');
  }

  function exportCustomers() {
    const quote = value => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const lines = [['Nom', 'E-mail', 'Téléphone', 'Adresse', 'Commandes', 'Dépenses (Ar)'].map(quote).join(';')]
      .concat(customerRows().map(c => [c.name, c.email, c.phone, c.address, c.orders, Math.round(c.spent * currencyRate)].map(quote).join(';')));
    const url = URL.createObjectURL(new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }));
    const link = Object.assign(document.createElement('a'), { href: url, download: 'clients-e-tokiana.csv' });
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function enhanceAdmin() {
    if (!currentUser) return;
    const panel = $('#admin-modal .modal-panel');
    const nav = $('.admin-nav', panel);
    const seller = currentUser.role === 'seller';
    if (!panel.dataset.spaceReady) {
      panel.dataset.spaceReady = '1';
      panel.classList.add('space-panel', 'admin-space');
      nav.insertAdjacentHTML('afterbegin', '<div class="space-user-slot"></div>');
      nav.insertAdjacentHTML('beforeend', linksHTML());
      $('#admin-logout')?.remove();
    }
    $('.space-user-slot', nav).innerHTML = userCardHTML(currentUser);

    const pending = visibleOrders().filter(order => order.status !== 'Livrée').length;
    const labels = {
      dashboard: ['bi-speedometer2', 'Vue d’ensemble'],
      products: ['bi-box-seam', seller ? 'Mes produits' : 'Produits'],
      customers: ['bi-people', 'Clients'],
      staff: ['bi-person-badge', 'Personnel'],
      'seller-sales': ['bi-cash-coin', seller ? 'Ventes & gains' : 'Vendeurs & commandes']
    };
    $$('.admin-nav-item', nav).forEach(item => {
      const [icon, label] = labels[item.dataset.adminView] || ['bi-dot', item.textContent];
      decorate(item, icon, label, item.dataset.adminView === 'seller-sales' ? pending : 0);
    });
    const salesTab = $('[data-admin-view="seller-sales"]', nav);
    const staffTab = $('[data-admin-view="staff"]', nav);
    if (salesTab && staffTab) staffTab.before(salesTab);

    renderAdminProducts();
    if (!seller) renderAdminCustomers();
    refreshBadges();
  }

  /* ------------------------------------------------------------------ */
  /* Paiement & panier                                                    */
  /* ------------------------------------------------------------------ */
  function renderCheckoutSummary() {
    const panel = $('#payment-modal .modal-panel');
    let box = $('.checkout-summary', panel);
    if (!box) { box = document.createElement('div'); box.className = 'checkout-summary'; $('.modal-header', panel).after(box); }
    const subtotal = cartSubtotal();
    const delivery = shippingFee();
    box.innerHTML = `<h3>Récapitulatif</h3><ul>${cart.map(item => `<li><img src="${esc(item.image)}" alt="" /><span>${esc(item.name)} <small>× ${item.quantity}</small></span><strong>${euro(effectivePrice(item) * item.quantity)}</strong></li>`).join('')}</ul><div class="checkout-line"><span>Sous-total</span><strong>${euro(subtotal)}</strong></div><div class="checkout-line"><span>Livraison</span><strong>${delivery ? euro(delivery) : 'Offerte'}</strong></div><div class="checkout-line total"><span>Total</span><strong>${euro(subtotal + delivery)}</strong></div>`;
  }

  function renderFreeShipping() {
    let banner = $('#free-shipping');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'free-shipping';
      banner.className = 'free-shipping';
      $('#cart-items').after(banner);
    }
    const subtotal = cartSubtotal();
    banner.hidden = subtotal === 0;
    const remaining = FREE_SHIPPING_FROM - subtotal;
    banner.classList.toggle('done', remaining <= 0);
    banner.innerHTML = remaining <= 0
      ? '<i class="bi bi-check-circle" aria-hidden="true"></i> Livraison offerte pour cette commande'
      : `Plus que <strong>${euro(remaining)}</strong> pour la livraison offerte<div class="bar"><i style="width:${Math.min(100, subtotal / FREE_SHIPPING_FROM * 100)}%"></i></div>`;
  }

  /* ------------------------------------------------------------------ */
  /* Navigation du site                                                   */
  /* ------------------------------------------------------------------ */
  function initNavigation() {
    const header = $('.site-header');
    window.addEventListener('scroll', () => header.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });

    // Menu mobile
    const burger = document.createElement('button');
    burger.type = 'button';
    burger.className = 'burger-button';
    burger.setAttribute('aria-label', 'Ouvrir le menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<i class="bi bi-list" aria-hidden="true"></i>';
    $('.nav-shell').prepend(burger);

    const menu = document.createElement('nav');
    menu.className = 'mobile-menu';
    menu.hidden = true;
    menu.setAttribute('aria-label', 'Menu mobile');
    const icons = { '#catalogue': 'bi-shop', '#univers': 'bi-stars', '#journal': 'bi-journal-text', '#a-propos': 'bi-info-circle' };
    menu.innerHTML = $$('.nav-links a').map(link => `<a href="${link.getAttribute('href')}"><i class="bi ${icons[link.getAttribute('href')] || 'bi-dot'}" aria-hidden="true"></i>${link.textContent}</a>`).join('')
      + '<button type="button" class="mm-account" data-space-go="account"><i class="bi bi-person-circle" aria-hidden="true"></i><span></span></button>';
    header.append(menu);

    const setMenu = open => {
      if (open) $('.mm-account span', menu).textContent = currentUser ? 'Mon espace' : 'Se connecter';
      menu.hidden = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      burger.innerHTML = `<i class="bi ${open ? 'bi-x-lg' : 'bi-list'}" aria-hidden="true"></i>`;
    };
    burger.addEventListener('click', () => setMenu(menu.hidden));
    menu.addEventListener('click', event => { if (event.target.closest('a, button')) setMenu(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 800) setMenu(false); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

    // Lien actif selon la section visible
    const links = $$('.nav-links a');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['catalogue', 'univers', 'journal', 'a-propos'].forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section); });
  }

  function initPasswordToggles() {
    ['#login-password', '#signup-password'].forEach(selector => {
      const input = $(selector);
      const label = input?.closest('label');
      if (!label) return;
      label.classList.add('has-toggle');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pw-toggle';
      button.setAttribute('aria-label', 'Afficher le mot de passe');
      button.innerHTML = '<i class="bi bi-eye" aria-hidden="true"></i>';
      label.append(button);
      button.addEventListener('click', () => {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        button.innerHTML = `<i class="bi ${show ? 'bi-eye-slash' : 'bi-eye'}" aria-hidden="true"></i>`;
        button.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Événements globaux                                                   */
  /* ------------------------------------------------------------------ */
  document.addEventListener('click', event => {
    const go = event.target.closest('[data-space-go]')?.dataset.spaceGo;
    if (go === 'notifications') notificationButton.click();
    else if (go === 'messages') chatButton.click();
    else if (go === 'shop') goToShop();
    else if (go === 'logout') $('.identity-logout', identityModal).click();
    else if (go === 'account') { if (currentUser) openUserSpace(); else openModal(loginModal); }

    const tab = event.target.closest('[data-space-tab]');
    if (tab) showAccountView(tab.dataset.spaceTab);

    const add = event.target.closest('[data-space-add]');
    if (add) {
      const product = products.find(item => item.id === Number(add.dataset.spaceAdd));
      if (product) { addToCart(product); showToast(`${product.name} a rejoint votre panier`); }
    }

    const unfav = event.target.closest('[data-space-unfav]');
    if (unfav) {
      const id = Number(unfav.dataset.spaceUnfav);
      favorites = favorites.filter(favorite => favorite !== id);
      saveFavorites();
      renderProducts();
      refreshAccount();
      showToast('Retiré de vos favoris');
    }

    const del = event.target.closest('[data-space-del]');
    if (del) {
      const id = Number(del.dataset.spaceDel);
      const product = products.find(item => item.id === id);
      if (!product || id <= 1000) return;
      const allowed = isStaff(currentUser) || (currentUser?.role === 'seller' && product.sellerId === currentUser.id);
      if (!allowed || !window.confirm(`Supprimer « ${product.name} » du catalogue ?`)) return;
      products = products.filter(item => item.id !== id);
      localStorage.setItem('etokiana-products', JSON.stringify(products));
      cart = cart.filter(item => item.id !== id);
      saveCart();
      favorites = favorites.filter(favorite => favorite !== id);
      saveFavorites();
      renderProducts();
      renderAdminProducts();
      renderAdminDashboard();
      showToast('Produit supprimé');
    }
  });

  // Échap : ferme la fenêtre ouverte, sinon le panier
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const open = $$('.modal.open');
    if (open.length) closeModal(open.at(-1));
    else if ($('#cart-drawer').classList.contains('open')) closeCart();
  });

  // Les espaces sont rendus par app.js puis ouverts : on s'accroche à l'ouverture
  const onOpen = (selector, callback) => {
    const element = $(selector);
    if (!element) return;
    new MutationObserver(() => { if (element.classList.contains('open')) callback(); }).observe(element, { attributes: true, attributeFilter: ['class'] });
  };
  onOpen('#account-modal', enhanceAccount);
  onOpen('#admin-modal', enhanceAdmin);
  onOpen('#payment-modal', renderCheckoutSummary);

  new MutationObserver(renderFreeShipping).observe($('#cart-items'), { childList: true });
  renderFreeShipping();

  $('[data-admin-panel="customers"] .admin-view-heading .admin-action')?.addEventListener('click', exportCustomers);

  initNavigation();
  initPasswordToggles();
})();
