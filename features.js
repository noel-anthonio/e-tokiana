/* ==========================================================================
   E-tokiana — features.js   (à charger APRÈS app.js et spaces.js)
   1. Stock : badges « Épuisé / Plus que N », blocage des quantités, décompte
      à la commande, alertes vendeur/admin, édition du stock
   2. Admin / Vendeur : onglets séparés « Commandes » et « Vendeurs »
   3. Notifications : centre groupé par jour, filtres, icônes, suppression
   4. Messages : messagerie 2 colonnes (contacts + conversation)
   5. Historique des actions de chaque utilisateur (supervision pour l'admin)
   ========================================================================== */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const parse = value => { try { return value == null ? null : JSON.parse(value); } catch { return null; } };
  const STEPS = ['Nouvelle commande', 'Validée', 'En préparation', 'Expédiée', 'Livrée'];

  const isStaff = user => ['owner', 'admin'].includes(user?.role);
  const nameOf = user => isStaff(user) ? adminIdentity.name : (user?.name || user?.email || 'Utilisateur');
  const roleClass = role => ['owner', 'admin'].includes(role) ? 'owner' : role === 'seller' ? 'seller' : 'client';
  const roleLabel = role => ({ owner: 'Admin', admin: 'Admin', seller: 'Vendeur' }[role] || 'Client');
  const initialsOf = name => {
    const parts = String(name || 'U').trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts.at(-1)[0] : (parts[0] || 'U').slice(0, 2)).toLocaleUpperCase('fr-FR');
  };
  const fmtTime = iso => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const fmtDateTime = iso => new Date(iso).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const dayLabel = iso => {
    const date = new Date(iso), today = new Date(), yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Aujourd’hui';
    if (date.toDateString() === yesterday.toDateString()) return 'Hier';
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  const timeAgo = iso => {
    const seconds = (Date.now() - new Date(iso)) / 1000;
    if (seconds < 60) return 'À l’instant';
    if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)} h`;
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };
  const groupByDay = (list, dateOf) => {
    const groups = [];
    list.forEach(item => {
      const key = new Date(dateOf(item)).toDateString();
      const last = groups.at(-1);
      if (last && last.key === key) last.items.push(item);
      else groups.push({ key, label: dayLabel(dateOf(item)), items: [item] });
    });
    return groups;
  };
  const onOpen = (selector, callback) => {
    const element = $(selector);
    if (element) new MutationObserver(() => { if (element.classList.contains('open')) callback(); }).observe(element, { attributes: true, attributeFilter: ['class'] });
  };

  /* ====================================================================== */
  /* 5. HISTORIQUE DES ACTIONS (journal alimenté en observant le stockage)   */
  /* ====================================================================== */
  const LOG_KEY = 'etokiana-activity';
  const readLog = () => parse(localStorage.getItem(LOG_KEY)) || [];
  const nativeSet = Storage.prototype.setItem;
  const nativeRemove = Storage.prototype.removeItem;
  const TRACKED = new Set(['etokiana-cart', 'etokiana-favorites', 'etokiana-orders', 'etokiana-messages', 'etokiana-products', 'etokiana-user', 'etokiana-users']);
  let skipCartLog = false;

  function logAction(type, text, actor = currentUser) {
    const list = readLog();
    list.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      date: new Date().toISOString(), type, text,
      email: actor?.email || 'guest', name: actor ? nameOf(actor) : 'Visiteur', role: actor?.role || 'guest'
    });
    nativeSet.call(localStorage, LOG_KEY, JSON.stringify(list.slice(-600)));
  }

  const byId = list => new Map((list || []).map(item => [String(item.id), item]));
  const productName = id => products.find(product => String(product.id) === String(id))?.name || `Produit #${id}`;
  const contactName = email => (typeof chatUsers === 'function' ? chatUsers().find(user => user.email === email)?.name : null) || email;

  function audit(key, old, next) {
    if (key === 'etokiana-cart') {
      if (skipCartLog) { skipCartLog = false; return; }
      const before = byId(old), after = byId(next);
      after.forEach((item, id) => {
        const previous = before.get(id);
        if (!previous) logAction('cart', `Ajout au panier : ${item.name} × ${item.quantity}`);
        else if (item.quantity !== previous.quantity) logAction('cart', `Quantité modifiée : ${item.name} (${previous.quantity} → ${item.quantity})`);
      });
      before.forEach((item, id) => { if (!after.has(id)) logAction('cart', `Retiré du panier : ${item.name}`); });
    } else if (key === 'etokiana-favorites') {
      const before = new Set((old || []).map(String)), after = new Set((next || []).map(String));
      after.forEach(id => { if (!before.has(id)) logAction('favorite', `Ajouté aux favoris : ${productName(id)}`); });
      before.forEach(id => { if (!after.has(id)) logAction('favorite', `Retiré des favoris : ${productName(id)}`); });
    } else if (key === 'etokiana-orders') {
      const before = byId(old);
      (next || []).forEach(order => {
        const previous = before.get(String(order.id));
        if (!previous) { logAction('order', `Commande #${order.id} passée · ${euro(order.total)}`); skipCartLog = true; }
        else if (previous.status !== order.status) logAction('order', `Commande #${order.id} : ${previous.status} → ${order.status}`);
      });
    } else if (key === 'etokiana-messages') {
      const before = byId(old);
      (next || []).forEach(message => { if (!before.has(String(message.id))) logAction('message', `Message envoyé à ${contactName(message.to)}`); });
    } else if (key === 'etokiana-products') {
      const before = byId(old), after = byId(next);
      after.forEach((product, id) => { if (!before.has(id)) logAction('catalog', `Produit ajouté : ${product.name}`); });
      before.forEach((product, id) => { if (!after.has(id)) logAction('catalog', `Produit supprimé : ${product.name}`); });
    } else if (key === 'etokiana-users') {
      const before = byId(old);
      (next || []).forEach(user => { if (!before.has(String(user.id))) logAction('auth', 'Compte créé', user); });
    } else if (key === 'etokiana-user') {
      if (!old && next) logAction('auth', 'Connexion', next);
      else if (old && !next) logAction('auth', 'Déconnexion', old);
      else if (old && next && old.email !== next.email) logAction('auth', 'Connexion', next);
      else if (old && next && ['name', 'phone', 'address'].some(field => old[field] !== next[field])) logAction('profile', 'Profil mis à jour', next);
    }
  }

  Storage.prototype.setItem = function (key, value) {
    const track = this === window.localStorage && TRACKED.has(key);
    const old = track ? parse(this.getItem(key)) : null;
    nativeSet.call(this, key, value);
    if (track) { try { audit(key, old, parse(value)); } catch (error) { console.warn('Historique :', error); } }
  };
  Storage.prototype.removeItem = function (key) {
    const track = this === window.localStorage && key === 'etokiana-user';
    const old = track ? parse(this.getItem(key)) : null;
    nativeRemove.call(this, key);
    if (track) { try { audit(key, old, null); } catch (error) { console.warn('Historique :', error); } }
  };

  const TYPE_ICON = { auth: 'bi-box-arrow-in-right', cart: 'bi-bag-plus', favorite: 'bi-heart', order: 'bi-receipt', message: 'bi-chat-dots', catalog: 'bi-box-seam', profile: 'bi-person-gear' };
  const GROUPS = [['all', 'Tout', null], ['shop', 'Achats', ['cart', 'favorite', 'order']], ['message', 'Messages', ['message']], ['account', 'Compte', ['auth', 'profile']], ['catalog', 'Catalogue', ['catalog']]];
  const histState = {};

  function buildHistory(root, mode) {
    root.dataset.mode = mode;
    root.dataset.built = '1';
    root.innerHTML = `<div class="hist-heading"><div><p class="eyebrow">${mode === 'all' ? 'Supervision' : 'Mon activité'}</p><h3>Historique des actions</h3></div><button type="button" class="space-mini danger" data-hist-clear><i class="bi bi-trash3" aria-hidden="true"></i>${mode === 'all' ? 'Tout effacer' : 'Effacer mon historique'}</button></div>
      <div class="hist-tools"><div class="notif-chips hist-chips"></div>${mode === 'all' ? '<select class="hist-user" aria-label="Filtrer par utilisateur"></select>' : ''}<div class="msgr-search hist-search"><i class="bi bi-search" aria-hidden="true"></i><input type="search" class="hist-q" placeholder="Rechercher une action" autocomplete="off" /></div></div>
      <div class="hist-list"></div>`;
    if (root.dataset.bound) return;
    root.dataset.bound = '1';
    root.addEventListener('click', event => {
      const mode = root.dataset.mode;
      const chip = event.target.closest('[data-hist-filter]');
      if (chip) { histState[mode].filter = chip.dataset.histFilter; renderHistory(root); }
      if (event.target.closest('[data-hist-clear]')) {
        if (!window.confirm(mode === 'all' ? 'Effacer tout l’historique de la plateforme ?' : 'Effacer votre historique ?')) return;
        const keep = mode === 'all' ? [] : readLog().filter(entry => entry.email !== currentUser.email);
        nativeSet.call(localStorage, LOG_KEY, JSON.stringify(keep));
        renderHistory(root);
      }
    });
    root.addEventListener('input', event => { if (event.target.matches('.hist-q')) { histState[root.dataset.mode].q = event.target.value; renderHistory(root); } });
    root.addEventListener('change', event => { if (event.target.matches('.hist-user')) { histState[root.dataset.mode].user = event.target.value; renderHistory(root); } });
  }

  function renderHistory(root) {
    const mode = root.dataset.mode;
    const state = histState[mode] ||= { filter: 'all', q: '', user: '' };
    let base = readLog().slice().reverse();
    if (mode === 'self') base = base.filter(entry => entry.email === currentUser.email);
    const scoped = state.user ? base.filter(entry => entry.email === state.user) : base;

    $('.hist-chips', root).innerHTML = GROUPS.map(([key, label, types]) => {
      const count = types ? scoped.filter(entry => types.includes(entry.type)).length : scoped.length;
      return `<button type="button" class="notif-chip ${state.filter === key ? 'active' : ''}" data-hist-filter="${key}">${label}<b>${count}</b></button>`;
    }).join('');

    const select = $('.hist-user', root);
    if (select) {
      const users = [...new Map(base.map(entry => [entry.email, entry])).values()];
      select.innerHTML = `<option value="">Tous les utilisateurs (${users.length})</option>` + users.map(entry => `<option value="${esc(entry.email)}">${esc(entry.name)} · ${roleLabel(entry.role)}</option>`).join('');
      select.value = state.user;
    }

    const group = GROUPS.find(item => item[0] === state.filter);
    let list = scoped;
    if (group[2]) list = list.filter(entry => group[2].includes(entry.type));
    const query = state.q.trim().toLowerCase();
    if (query) list = list.filter(entry => `${entry.text} ${entry.name}`.toLowerCase().includes(query));

    const target = $('.hist-list', root);
    if (!list.length) {
      target.innerHTML = '<div class="space-empty"><i class="bi bi-clock-history" aria-hidden="true"></i><strong>Aucune action enregistrée</strong><p>Connexions, achats, favoris et messages apparaîtront ici au fil de l’utilisation.</p></div>';
      return;
    }
    target.innerHTML = groupByDay(list.slice(0, 150), entry => entry.date).map(day => `<section class="hist-day"><h4>${day.label}</h4>${day.items.map(entry => `<div class="hist-item t-${entry.type}"><span class="hist-ico"><i class="bi ${TYPE_ICON[entry.type] || 'bi-dot'}" aria-hidden="true"></i></span><div><p>${esc(entry.text)}</p><small>${fmtTime(entry.date)}${mode === 'all' ? ` · ${esc(entry.name)} <span class="space-role ${roleClass(entry.role)}">${roleLabel(entry.role)}</span>` : ''}</small></div></div>`).join('')}</section>`).join('');
  }

  const showAccountView = name => {
    $$('.account-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.accountView === name));
    $$('#account-modal .account-view').forEach(view => view.classList.toggle('active', view.dataset.view === name));
  };

  function enhanceAccountHistory() {
    if (!currentUser) return;
    const panel = $('#account-modal .modal-panel');
    const tabs = $('.space-tabs', panel), main = $('.space-main', panel);
    if (!tabs || !main) return;
    let view = $('[data-view="history"]', main);
    if (!view) {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'account-tab';
      tab.dataset.accountView = 'history';
      tab.innerHTML = '<i class="bi bi-clock-history" aria-hidden="true"></i><span>Historique</span>';
      tabs.append(tab);
      view = document.createElement('div');
      view.className = 'account-view';
      view.dataset.view = 'history';
      main.append(view);
      tab.addEventListener('click', () => { showAccountView('history'); renderHistory(view); });
    }
    if (!view.dataset.built) buildHistory(view, 'self');
    renderHistory(view);
  }

  /* ====================================================================== */
  /* 1. STOCK                                                                */
  /* ====================================================================== */
  const STOCK_KEY = 'etokiana-stock';
  const LOW = 5, DEFAULT_STOCK = 20;
  const SYSTEM = { email: 'systeme@etokiana.fr', name: 'Système', role: 'client' };
  const unlimited = product => (product.categoryPath?.[0] || product.category) === 'Services';
  const readStock = () => parse(localStorage.getItem(STOCK_KEY)) || {};
  const stockOf = product => {
    if (unlimited(product)) return Infinity;
    const saved = readStock()[product.id];
    if (saved !== undefined) return Number(saved);
    const match = String(product.material || '').match(/(\d+)\s*unités?/i);
    return match ? Number(match[1]) : DEFAULT_STOCK;
  };
  const setStock = (id, quantity) => {
    const map = readStock();
    map[id] = Math.max(0, Math.floor(Number(quantity) || 0));
    nativeSet.call(localStorage, STOCK_KEY, JSON.stringify(map));
  };
  const stockState = product => {
    const n = stockOf(product);
    if (n === Infinity) return { key: 'ok', label: '' };
    if (n <= 0) return { key: 'out', label: 'Épuisé' };
    if (n <= LOW) return { key: 'low', label: `Plus que ${n}` };
    return { key: 'ok', label: '' };
  };
  const cartQty = id => cart.find(item => item.id === id)?.quantity || 0;

  function canAdd(product, quantity) {
    const n = stockOf(product);
    if (n - cartQty(product.id) >= quantity) return true;
    showToast(n <= 0 ? `${product.name} est épuisé.` : `Stock insuffisant : ${n} disponible${n > 1 ? 's' : ''} pour ${product.name}.`);
    return false;
  }

  function decorateGrid() {
    $$('#product-grid .product-card').forEach(card => {
      const addButton = $('[data-add]', card);
      const product = products.find(item => item.id === Number(addButton?.dataset.add));
      if (!product) return;
      const state = stockState(product);
      card.classList.toggle('is-soldout', state.key === 'out');
      card.classList.toggle('has-tag', Boolean($('.product-tag', card)));
      $('.stock-badge', card)?.remove();
      if (state.key !== 'ok') $('.product-image-wrap', card).insertAdjacentHTML('beforeend', `<span class="stock-badge ${state.key}">${state.label}</span>`);
      addButton.disabled = state.key === 'out';
      const label = $('span', addButton);
      if (label) label.textContent = state.key === 'out' ? 'Épuisé' : 'Ajouter';
      const detail = $('.product-image-detail', card);
      if (detail) detail.textContent = detail.textContent.replace(/Nouveau produit · \d+ unités?/i, 'Nouveau produit');
    });
  }
  new MutationObserver(decorateGrid).observe($('#product-grid'), { childList: true });
  decorateGrid();

  function decorateProductModal() {
    const product = selectedProduct;
    if (!product) return;
    const n = stockOf(product);
    const state = stockState(product);
    const available = n - cartQty(product.id);
    let line = $('#product-modal .stock-line');
    if (!line) { line = document.createElement('p'); $('#product-modal-price').after(line); }
    line.className = `stock-line ${state.key}`;
    line.innerHTML = state.key === 'out' ? '<i class="bi bi-x-circle" aria-hidden="true"></i> Épuisé — indisponible pour le moment'
      : state.key === 'low' ? `<i class="bi bi-exclamation-triangle" aria-hidden="true"></i> Bientôt épuisé — plus que ${n} en stock`
      : '<i class="bi bi-check-circle" aria-hidden="true"></i> Disponible';
    const select = $('#product-modal-quantity');
    [...select.options].forEach(option => { option.disabled = Number(option.value) > available; });
    if (Number(select.value) > available) select.value = String(Math.max(1, Math.min(available, 4)));
    const add = $('#product-modal-add');
    add.dataset.orig ||= add.innerHTML;
    add.disabled = available <= 0;
    add.innerHTML = available > 0 ? add.dataset.orig : (n <= 0 ? 'Épuisé' : 'Quantité max. dans le panier');
    const material = $('#product-modal-material');
    material.textContent = material.textContent.replace(/Nouveau produit · \d+ unités?/i, 'Nouveau produit');
  }
  onOpen('#product-modal', decorateProductModal);

  // Blocage des quantités supérieures au stock (phase de capture : avant app.js)
  document.addEventListener('click', event => {
    const gridAdd = event.target.closest('[data-add], [data-space-add]');
    if (gridAdd) {
      const product = products.find(item => item.id === Number(gridAdd.dataset.add ?? gridAdd.dataset.spaceAdd));
      if (product && !canAdd(product, 1)) { event.stopPropagation(); event.preventDefault(); }
      return;
    }
    if (event.target.closest('#product-modal-add')) {
      if (selectedProduct && !canAdd(selectedProduct, Number($('#product-modal-quantity').value) || 1)) { event.stopPropagation(); event.preventDefault(); }
      return;
    }
    const increase = event.target.closest('[data-increase]');
    if (increase) {
      const product = products.find(item => item.id === Number(increase.dataset.increase));
      if (product && !canAdd(product, 1)) { event.stopPropagation(); event.preventDefault(); }
    }
  }, true);

  const paymentModalElement = $('#payment-modal');
  let ordersBefore = orders.length;
  paymentModalElement.addEventListener('submit', event => {
    const problem = cart.find(item => { const product = products.find(entry => entry.id === item.id); return product && item.quantity > stockOf(product); });
    if (problem) { event.preventDefault(); event.stopPropagation(); showToast(`Stock insuffisant pour ${problem.name}. Ajustez votre panier.`); return; }
    ordersBefore = orders.length;
  }, true);
  paymentModalElement.addEventListener('submit', () => {
    if (orders.length <= ordersBefore) return;
    const order = orders.at(-1);
    (order.items || []).forEach(item => {
      const product = products.find(entry => entry.id === item.id);
      if (!product || unlimited(product)) return;
      const before = stockOf(product);
      const after = Math.max(0, before - item.quantity);
      setStock(product.id, after);
      if (after === 0 || (after <= LOW && before > LOW)) {
        const message = after === 0 ? `Stock épuisé : ${product.name}` : `Stock faible : ${product.name} (plus que ${after})`;
        addNotification(adminIdentity.email, message, SYSTEM);
        if (product.sellerId !== 'owner') { const email = sellerEmail(product.sellerId); if (email) addNotification(email, message, SYSTEM); }
      }
    });
    ordersBefore = orders.length;
    renderNotifications();
    renderProducts();
  });

  // Édition du stock dans la liste « Produits »
  function decorateStockRows() {
    const panel = $('[data-admin-panel="products"]');
    if (!panel) return;
    let low = 0, out = 0;
    $$('.space-row[data-pid]', panel).forEach(row => {
      const product = products.find(item => String(item.id) === row.dataset.pid);
      if (!product) return;
      const state = stockState(product), n = stockOf(product);
      if (state.key === 'out') out++; else if (state.key === 'low') low++;
      if ($('.stock-ctl', row)) return;
      const box = document.createElement('div');
      box.className = 'stock-ctl';
      box.innerHTML = unlimited(product)
        ? '<span class="stock-pill ok">Service · illimité</span>'
        : `<span class="stock-pill ${state.key}">${state.key === 'out' ? 'Épuisé' : state.key === 'low' ? 'Bientôt épuisé' : 'En stock'}</span><div class="stock-step"><button type="button" data-stock-delta="-1" aria-label="Retirer 1 au stock">−</button><input type="number" min="0" value="${n}" data-stock-input aria-label="Stock de ${esc(product.name)}" /><button type="button" data-stock-delta="1" aria-label="Ajouter 1 au stock">＋</button></div>`;
      $('.space-row-actions', row).prepend(box);
    });
    let banner = $('.stock-summary', panel);
    if (!banner) {
      banner = document.createElement('div');
      banner.className = 'stock-summary';
      banner.dataset.sig = '';
      const table = $('.space-products', panel);
      if (table) table.before(banner); else panel.append(banner);
    }
    const signature = `${out}|${low}`;
    if (banner.dataset.sig !== signature) {
      banner.dataset.sig = signature;
      banner.hidden = !(out || low);
      banner.innerHTML = `<i class="bi bi-exclamation-triangle" aria-hidden="true"></i><span>${out ? `<strong>${out}</strong> produit${out > 1 ? 's' : ''} épuisé${out > 1 ? 's' : ''}` : ''}${out && low ? ' · ' : ''}${low ? `<strong>${low}</strong> bientôt épuisé${low > 1 ? 's' : ''} (≤ ${LOW})` : ''}</span>`;
    }
  }
  const productsPanel = $('[data-admin-panel="products"]');
  if (productsPanel) new MutationObserver(decorateStockRows).observe(productsPanel, { childList: true, subtree: true });

  function changeStock(row, quantity) {
    const product = products.find(item => String(item.id) === row?.dataset.pid);
    if (!product) return;
    const before = stockOf(product);
    setStock(product.id, quantity);
    const after = stockOf(product);
    if (before !== after) logAction('catalog', `Stock de ${product.name} : ${before} → ${after}`);
    $('.stock-ctl', row)?.remove();
    decorateStockRows();
    renderProducts();
  }
  document.addEventListener('click', event => {
    const step = event.target.closest('[data-stock-delta]');
    if (!step) return;
    const row = step.closest('.space-row');
    changeStock(row, Number($('[data-stock-input]', row).value) + Number(step.dataset.stockDelta));
  });
  document.addEventListener('change', event => {
    if (event.target.matches?.('[data-stock-input]')) changeStock(event.target.closest('.space-row'), event.target.value);
  });

  /* ====================================================================== */
  /* 2. ADMIN / VENDEUR : onglets Commandes + Vendeurs + Historique          */
  /* ====================================================================== */
  const kpi = (icon, value, label) => `<div><i class="bi ${icon}" aria-hidden="true"></i><strong>${value}</strong><span>${label}</span></div>`;
  const isSeller = () => currentUser?.role === 'seller';
  const ownItems = order => isSeller() ? (order.items || []).filter(item => item.sellerId === currentUser.id) : (order.items || []);
  const lineAmount = item => (Number(item.salePrice) || Number(item.price) || 0) * item.quantity;
  const netGain = order => ownItems(order).reduce((sum, item) => sum + lineAmount(item) * 0.9, 0);
  const myOrders = () => (isSeller() ? orders.filter(order => order.items?.some(item => item.sellerId === currentUser.id)) : orders)
    .slice().sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  function ensurePanel(name) {
    const content = $('.admin-content');
    let panel = $(`[data-admin-panel="${name}"]`, content);
    if (!panel) { panel = document.createElement('div'); panel.className = 'admin-view'; panel.dataset.adminPanel = name; content.append(panel); }
    return panel;
  }

  const ordState = { filter: 'all', q: '' };

  function drawOrderList() {
    const panel = ensurePanel('orders');
    const query = ordState.q.trim().toLowerCase();
    const list = myOrders().filter(order => (ordState.filter === 'all' || order.status === ordState.filter)
      && (!query || `${order.id} ${order.buyerName || ''} ${order.buyerId || ''}`.toLowerCase().includes(query)));
    const target = $('.ord-list', panel);
    if (!list.length) { target.innerHTML = '<div class="space-empty"><i class="bi bi-bag" aria-hidden="true"></i><strong>Aucune commande</strong><p>Les commandes correspondant à ce filtre apparaîtront ici.</p></div>'; return; }
    target.innerHTML = list.map(order => {
      const index = Math.max(0, STEPS.indexOf(order.status));
      const items = ownItems(order);
      return `<article class="ord">
        <header><div><strong>#${esc(order.id)}</strong><time>${order.date ? fmtDateTime(order.date) : ''}</time></div><span class="ord-status s${index}">${esc(order.status || 'Statut inconnu')}</span></header>
        <ul class="ord-items">${items.map(item => `<li><img src="${esc(item.image)}" alt="" loading="lazy" /><span>${esc(item.name)} <small>× ${item.quantity}${isSeller() ? '' : ' · ' + esc(sellerLabel(item))}</small></span><b>${euro(lineAmount(item))}</b></li>`).join('')}</ul>
        <div class="ord-steps" aria-label="Étape ${index + 1} sur ${STEPS.length}">${STEPS.map((step, i) => `<span class="${i <= index ? 'on' : ''}" title="${step}"></span>`).join('')}</div>
        <footer><div class="ord-client"><i class="bi bi-person-circle" aria-hidden="true"></i><span>${esc(order.buyerName || 'Client invité')}<small>${esc(order.buyerId || 'E-mail non renseigné')}</small></span></div><div class="ord-total"><small>${isSeller() ? 'Gain net' : 'Total'}</small><strong>${euro(isSeller() ? netGain(order) : Number(order.total) || 0)}</strong></div>${order.status === 'Livrée' ? '<span class="space-tag">Terminée</span>' : `<button type="button" class="stock-action order-status-action" data-order-status="${esc(order.id)}">${nextOrderStatus(order.status)}</button>`}</footer>
      </article>`;
    }).join('');
  }

  function renderOrders() {
    const panel = ensurePanel('orders');
    const all = myOrders();
    const pending = all.filter(order => order.status !== 'Livrée').length;
    const delivered = all.length - pending;
    if (!panel.dataset.built) {
      panel.dataset.built = '1';
      panel.innerHTML = '<div class="hist-heading"><div><p class="eyebrow"></p><h3></h3></div></div><div class="space-kpis ord-kpis"></div><div class="hist-tools"><div class="notif-chips ord-chips"></div><div class="msgr-search hist-search"><i class="bi bi-search" aria-hidden="true"></i><input type="search" id="ord-search" placeholder="N° de commande ou client" autocomplete="off" /></div></div><div class="ord-list"></div>';
      panel.addEventListener('click', event => { const chip = event.target.closest('[data-ord-filter]'); if (chip) { ordState.filter = chip.dataset.ordFilter; renderOrders(); } });
      $('#ord-search', panel).addEventListener('input', event => { ordState.q = event.target.value; drawOrderList(); });
    }
    $('.eyebrow', panel).textContent = isSeller() ? 'Ma boutique' : 'Suivi des ventes';
    $('h3', panel).textContent = isSeller() ? 'Commandes reçues' : 'Commandes';
    const money = isSeller() ? all.reduce((sum, order) => sum + netGain(order), 0) : all.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    $('.ord-kpis', panel).innerHTML = kpi('bi-receipt', all.length, 'Commandes') + kpi('bi-hourglass-split', pending, isSeller() ? 'À préparer' : 'À traiter') + kpi('bi-check2-circle', delivered, 'Livrées') + kpi('bi-cash-coin', euro(money), isSeller() ? 'Gains nets' : 'Chiffre d’affaires');
    $('.ord-chips', panel).innerHTML = [['all', 'Toutes', all.length], ...STEPS.map(step => [step, step, all.filter(order => order.status === step).length])]
      .map(([key, label, count]) => `<button type="button" class="notif-chip ${ordState.filter === key ? 'active' : ''}" data-ord-filter="${esc(key)}">${esc(label)}<b>${count}</b></button>`).join('');
    drawOrderList();
  }

  function renderSellers() {
    const panel = ensurePanel('sellers');
    const registered = (parse(localStorage.getItem('etokiana-users')) || []).filter(user => user.role === 'seller');
    const sellers = [{ id: 'owner', name: 'E-tokiana · boutique officielle', email: adminIdentity.email, own: true }, { id: 'demo-seller', name: 'Atelier Nomade', email: 'vendeur@etokiana.fr' }, ...registered];
    const stats = sellers.map(seller => {
      const sellerOrders = orders.filter(order => order.items?.some(item => item.sellerId === seller.id));
      const sales = sellerOrders.reduce((sum, order) => sum + order.items.filter(item => item.sellerId === seller.id).reduce((s, item) => s + lineAmount(item), 0), 0);
      return { ...seller, products: products.filter(product => product.sellerId === seller.id).length, orders: sellerOrders.length, pending: sellerOrders.filter(order => order.status !== 'Livrée').length, sales };
    });
    const partners = stats.filter(seller => !seller.own);
    const thirdParty = partners.reduce((sum, seller) => sum + seller.sales, 0);
    panel.innerHTML = `<div class="hist-heading"><div><p class="eyebrow">Marketplace</p><h3>Vendeurs</h3></div></div>
      <div class="space-kpis">${kpi('bi-shop-window', partners.length, 'Vendeurs partenaires')}${kpi('bi-box-seam', partners.reduce((s, x) => s + x.products, 0), 'Produits partenaires')}${kpi('bi-graph-up', euro(thirdParty), 'Ventes tierces')}${kpi('bi-percent', euro(thirdParty * commissionRate), `Commissions (${commissionRate * 100} %)`)}</div>
      <div class="sel-list">${stats.map(seller => `<article class="sel"><span class="space-avatar mini ${seller.own ? 'owner' : 'seller'}">${esc(initialsOf(seller.name))}</span><div class="sel-main"><strong>${esc(seller.name)}</strong><small>${esc(seller.email)}</small></div><dl><div><dt>Produits</dt><dd>${seller.products}</dd></div><div><dt>Commandes</dt><dd>${seller.orders}${seller.pending ? ` <em>${seller.pending} en cours</em>` : ''}</dd></div><div><dt>Ventes</dt><dd>${euro(seller.sales)}</dd></div>${seller.own ? '' : `<div><dt>Net vendeur</dt><dd>${euro(seller.sales * (1 - commissionRate))}</dd></div>`}</dl>${seller.own ? '' : `<button type="button" class="space-mini" data-open-chat="${esc(seller.email)}"><i class="bi bi-chat-dots" aria-hidden="true"></i>Écrire</button>`}</article>`).join('')}</div>`;
  }

  function ensureTab(nav, name, icon, label) {
    let tab = $(`[data-admin-view="${name}"]`, nav);
    if (!tab) {
      tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'admin-nav-item';
      tab.dataset.adminView = name;
      tab.dataset.keep = '1';
      tab.addEventListener('click', () => { activateAdminView(name); refreshAdminPanel(name); });
      nav.append(tab);
    }
    return tab;
  }

  function refreshAdminPanel(name) {
    if (name === 'orders') renderOrders();
    else if (name === 'sellers') renderSellers();
    else if (name === 'history') renderHistory(ensurePanel('history'));
  }

  function enhanceAdmin2() {
    if (!currentUser) return;
    const panel = $('#admin-modal .modal-panel');
    const nav = $('.admin-nav', panel);
    const links = $('.space-links', nav);
    if (!links) return;
    const seller = isSeller();
    const ordersTab = ensureTab(nav, 'orders'), sellersTab = ensureTab(nav, 'sellers'), historyTab = ensureTab(nav, 'history');
    const pending = myOrders().filter(order => order.status !== 'Livrée').length;
    const decorateTab = (tab, icon, label, count) => { tab.innerHTML = `<i class="bi ${icon}" aria-hidden="true"></i><span>${label}</span>${count ? `<b class="space-count">${count}</b>` : ''}`; };
    decorateTab(ordersTab, 'bi-bag-check', seller ? 'Commandes reçues' : 'Commandes', pending);
    decorateTab(sellersTab, 'bi-shop-window', 'Vendeurs');
    decorateTab(historyTab, 'bi-clock-history', seller ? 'Mon historique' : 'Historique');
    sellersTab.hidden = seller;
    const legacy = $('[data-admin-view="seller-sales"]', nav);
    if (legacy) legacy.hidden = true;
    const order = ['dashboard', 'products', 'orders', 'sellers', 'customers', 'staff', 'history'];
    links.before(...order.map(name => $(`[data-admin-view="${name}"]`, nav)).filter(Boolean));

    const historyPanel = ensurePanel('history');
    const wantedMode = seller ? 'self' : 'all';
    if (!historyPanel.dataset.built || historyPanel.dataset.mode !== wantedMode) buildHistory(historyPanel, wantedMode);

    const active = $('.admin-nav-item.active', nav);
    if (!active || active.hidden || active.dataset.adminView === 'seller-sales') activateAdminView('dashboard');
    renderOrders();
    if (!seller) renderSellers();
    renderHistory(historyPanel);
    decorateStockRows();
  }
  onOpen('#admin-modal', enhanceAdmin2);

  // Mise à jour des listes après un changement de statut (clic traité par app.js d'abord)
  $('.admin-content').addEventListener('click', event => {
    if (!event.target.closest('[data-order-status]')) return;
    renderOrders();
    if (!isSeller()) renderSellers();
    const tab = $('[data-admin-view="orders"] .space-count');
    if (tab) tab.textContent = myOrders().filter(order => order.status !== 'Livrée').length || '';
  });

  /* ====================================================================== */
  /* 3. NOTIFICATIONS                                                        */
  /* ====================================================================== */
  const notifModal = $('#notification-modal');
  const notifPanel = $('.notification-panel', notifModal);
  const newIds = new Set();
  let notifFilter = 'all';
  const NOTIF_ICON = { message: 'bi-chat-dots', alert: 'bi-exclamation-triangle', order: 'bi-bag-check', info: 'bi-bell' };
  const kindOf = notification => /Nouveau message/.test(notification.message) ? 'message' : /stock/i.test(notification.message) ? 'alert' : /commande/i.test(notification.message) ? 'order' : 'info';
  const myNotifications = () => notifications.filter(item => item.recipient === userNotificationKey()).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  const isNew = notification => !notification.read || newIds.has(String(notification.id));
  const markNew = () => myNotifications().forEach(item => { if (!item.read) newIds.add(String(item.id)); });
  const saveNotifications = () => nativeSet.call(localStorage, 'etokiana-notifications', JSON.stringify(notifications));

  function ensureNotifUI() {
    if (notifPanel.dataset.ready) return;
    notifPanel.dataset.ready = '1';
    notifPanel.classList.add('notif-panel');
    const center = document.createElement('div');
    center.className = 'notif-center';
    center.innerHTML = '<div class="notif-toolbar"><div class="notif-chips"></div><button type="button" class="notif-clear" data-notif-clear><i class="bi bi-trash3" aria-hidden="true"></i>Tout effacer</button></div><div class="notif-items"></div>';
    $('.notification-list', notifPanel).before(center);
  }

  function renderNotifCenter() {
    ensureNotifUI();
    const all = myNotifications();
    const FILTERS = [['all', 'Toutes'], ['new', 'Non lues'], ['order', 'Commandes'], ['message', 'Messages'], ['alert', 'Alertes']];
    const count = key => key === 'all' ? all.length : key === 'new' ? all.filter(isNew).length : all.filter(item => kindOf(item) === key).length;
    $('.notif-chips', notifPanel).innerHTML = FILTERS.map(([key, label]) => `<button type="button" class="notif-chip ${notifFilter === key ? 'active' : ''}" data-notif-filter="${key}">${label}<b>${count(key)}</b></button>`).join('');
    $('[data-notif-clear]', notifPanel).hidden = all.length === 0;
    const list = all.filter(item => notifFilter === 'all' || (notifFilter === 'new' ? isNew(item) : kindOf(item) === notifFilter));
    const target = $('.notif-items', notifPanel);
    if (!list.length) {
      target.innerHTML = `<div class="space-empty"><i class="bi bi-bell-slash" aria-hidden="true"></i><strong>${all.length ? 'Rien dans cette catégorie' : 'Aucune notification'}</strong><p>${all.length ? 'Changez de filtre pour voir le reste.' : 'Commandes, messages et alertes de stock apparaîtront ici.'}</p></div>`;
      return;
    }
    target.innerHTML = groupByDay(list, item => item.date).map(day => `<section class="notif-day"><h4>${day.label}</h4>${day.items.map(item => {
      const kind = kindOf(item);
      const split = item.message.indexOf(' : ');
      const author = split > 0 ? item.message.slice(0, split) : '';
      let text = split > 0 ? item.message.slice(split + 3) : item.message;
      text = text.replace(/^Nouveau message : /, '');
      const orderId = item.message.match(/#([A-Za-z0-9-]+)/)?.[1];
      const title = kind === 'message' ? `Message de ${author || 'un contact'}` : kind === 'alert' ? 'Alerte stock' : kind === 'order' ? `Commande${orderId ? ' #' + orderId : ''}` : (author || 'Notification');
      return `<article class="notif k-${kind} ${isNew(item) ? 'is-new' : ''}" data-notif="${item.id}" tabindex="0" role="button"><span class="notif-ico"><i class="bi ${NOTIF_ICON[kind]}" aria-hidden="true"></i></span><div class="notif-body"><div class="notif-top"><strong>${esc(title)}</strong><time>${timeAgo(item.date)}</time></div><p>${esc(text)}</p></div><button type="button" class="notif-del" data-notif-del="${item.id}" aria-label="Supprimer cette notification"><i class="bi bi-x-lg" aria-hidden="true"></i></button></article>`;
    }).join('')}</section>`).join('');
  }

  notifPanel.addEventListener('click', event => {
    const chip = event.target.closest('[data-notif-filter]');
    if (chip) { notifFilter = chip.dataset.notifFilter; renderNotifCenter(); return; }
    if (event.target.closest('[data-notif-clear]')) {
      if (!window.confirm('Supprimer toutes vos notifications ?')) return;
      const key = userNotificationKey();
      notifications = notifications.filter(item => item.recipient !== key);
      saveNotifications(); newIds.clear(); renderNotifications(); renderNotifCenter();
      return;
    }
    const del = event.target.closest('[data-notif-del]');
    if (del) {
      notifications = notifications.filter(item => String(item.id) !== del.dataset.notifDel);
      saveNotifications(); renderNotifications(); renderNotifCenter();
      return;
    }
    const card = event.target.closest('[data-notif]');
    if (!card) return;
    const notification = notifications.find(item => String(item.id) === card.dataset.notif);
    if (!notification) return;
    notification.read = true;
    saveNotifications(); renderNotifications();
    const orderId = notification.message.match(/#([A-Za-z0-9-]+)/)?.[1];
    const order = orderId && orders.find(entry => entry.id === orderId);
    if (order) { closeModal(notifModal); return openOrderTracking(order); }
    if (kindOf(notification) === 'message' && notification.actor) { closeModal(notifModal); return openChatWith(notification.actor); }
    if (kindOf(notification) === 'alert' && ['owner', 'admin', 'seller'].includes(currentUser?.role)) {
      closeModal(notifModal); openUserSpace(); activateAdminView('products'); return;
    }
    renderNotifCenter();
  });
  notifPanel.addEventListener('keydown', event => { if (event.key === 'Enter' && event.target.matches('[data-notif]')) event.target.click(); });
  document.addEventListener('click', event => { if (event.target.closest('.notification-button')) markNew(); }, true);
  new MutationObserver(renderNotifCenter).observe($('.notification-list', notifPanel), { childList: true });
  new MutationObserver(() => { if (!notifModal.classList.contains('open')) { newIds.clear(); notifFilter = 'all'; } else renderNotifCenter(); }).observe(notifModal, { attributes: true, attributeFilter: ['class'] });
  markNew();

  /* ====================================================================== */
  /* 4. MESSAGERIE                                                           */
  /* ====================================================================== */
  const chatModalElement = $('#chat-modal');
  const chatPanel = $('.chat-panel', chatModalElement);
  let chatQuery = '';
  let pendingChat = null;

  function ensureChatUI() {
    if (chatPanel.dataset.ready) return;
    chatPanel.dataset.ready = '1';
    chatPanel.classList.add('msgr');
    const layout = document.createElement('div');
    layout.className = 'msgr-layout';
    layout.innerHTML = '<aside class="msgr-contacts"><div class="msgr-search"><i class="bi bi-search" aria-hidden="true"></i><input type="search" id="msgr-search" placeholder="Rechercher un contact" autocomplete="off" /></div><div class="msgr-list" id="msgr-list"></div></aside><section class="msgr-conv"><header class="msgr-conv-head"></header></section>';
    $('.msgr-conv', layout).append($('#chat-thread'), $('#chat-form'));
    $('.chat-recipient-label', chatPanel).after(layout);
    $('#chat-message').placeholder = 'Écrire un message…';
    $('#msgr-search').addEventListener('input', event => { chatQuery = event.target.value.toLowerCase(); renderContacts(); });
    $('#msgr-list').addEventListener('click', event => {
      const contact = event.target.closest('[data-msgr-contact]');
      if (!contact) return;
      $('#chat-recipient').value = contact.dataset.msgrContact;
      renderChatThread();
      chatPanel.classList.add('show-thread');
      renderContacts(); renderConvHead();
      $('#chat-message').focus();
    });
    $('.msgr-conv-head', layout).addEventListener('click', event => { if (event.target.closest('.msgr-back')) chatPanel.classList.remove('show-thread'); });
    new MutationObserver(() => {
      const thread = $('#chat-thread');
      thread.scrollTop = thread.scrollHeight;
      renderContacts(); renderConvHead();
    }).observe($('#chat-thread'), { childList: true });
  }

  function renderContacts() {
    const list = $('#msgr-list');
    if (!list || !currentUser) return;
    const me = currentUser.email, active = $('#chat-recipient').value;
    const rows = chatUsers().map(user => {
      const thread = messages.filter(m => (m.from === me && m.to === user.email) || (m.to === me && m.from === user.email));
      return { user, last: thread.at(-1), unread: thread.filter(m => m.to === me && !m.read).length };
    }).filter(row => !chatQuery || `${row.user.name || ''} ${row.user.email}`.toLowerCase().includes(chatQuery))
      .sort((a, b) => new Date(b.last?.date || 0) - new Date(a.last?.date || 0));
    list.innerHTML = rows.length ? rows.map(({ user, last, unread }) => `<button type="button" class="msgr-contact ${user.email === active ? 'active' : ''}" data-msgr-contact="${esc(user.email)}"><span class="space-avatar mini ${roleClass(user.role)}">${esc(initialsOf(user.name || user.email))}</span><span class="mc-main"><strong>${esc(user.name || user.email)}</strong><small>${last ? (last.from === me ? 'Vous : ' : '') + esc(String(last.text).slice(0, 42)) : roleLabel(user.role)}</small></span><span class="mc-meta">${last ? `<time>${timeAgo(last.date)}</time>` : ''}${unread ? `<b>${unread}</b>` : ''}</span></button>`).join('')
      : '<p class="modal-muted msgr-none">Aucun contact trouvé.</p>';
  }

  function renderConvHead() {
    const head = $('.msgr-conv-head');
    if (!head) return;
    const email = $('#chat-recipient').value;
    const user = chatUsers().find(item => item.email === email);
    head.innerHTML = user
      ? `<button type="button" class="msgr-back" aria-label="Retour aux contacts"><i class="bi bi-arrow-left" aria-hidden="true"></i></button><span class="space-avatar mini ${roleClass(user.role)}">${esc(initialsOf(user.name || user.email))}</span><div><strong>${esc(user.name || user.email)}</strong><small>${roleLabel(user.role)} · clic droit sur un message pour réagir</small></div>`
      : '<button type="button" class="msgr-back" aria-label="Retour aux contacts"><i class="bi bi-arrow-left" aria-hidden="true"></i></button><div><strong>Aucune conversation</strong><small>Choisissez un contact</small></div>';
  }

  function openChatWith(email) {
    pendingChat = email;
    renderChatRecipients();
    const select = $('#chat-recipient');
    if ([...select.options].some(option => option.value === email)) select.value = email;
    renderChatThread();
    openModal(chatModal);
  }

  onOpen('#chat-modal', () => {
    ensureChatUI();
    chatPanel.classList.toggle('show-thread', Boolean(pendingChat));
    pendingChat = null;
    renderContacts(); renderConvHead();
    requestAnimationFrame(() => { const thread = $('#chat-thread'); thread.scrollTop = thread.scrollHeight; });
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-open-chat]');
    if (button) openChatWith(button.dataset.openChat);
  });

  /* ---------- Initialisation ---------- */
  onOpen('#account-modal', enhanceAccountHistory);
})();
