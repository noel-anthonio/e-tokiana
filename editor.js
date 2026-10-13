/* ==========================================================================
   E-tokiana — editor.js   (à charger en DERNIER, après tous les autres scripts)
   1. Nouveau profil « Rédacteur » : écrit les descriptions des produits
        - compte de démonstration : redacteur@etokiana.fr / redac123
        - l'admin peut en créer d'autres (Admin > Personnel > Inviter > Rédacteur)
        - espace dédié : liste « À rédiger / Rédigées / Tout », rédaction avec aperçu
   2. Modification des produits enregistrés (admin : tous ; vendeur : les siens)
        - bouton « Modifier » dans Admin > Produits et dans la fiche produit
        - nom, prix, remise, stock, image, description
   3. La description rédigée s'affiche dans la fiche produit
   Les modifications sont conservées dans localStorage (« etokiana-product-edits »)
   et ré-appliquées à chaque chargement, y compris pour les produits de démo.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const parse = value => { try { return value == null ? null : JSON.parse(value); } catch { return null; } };
  const toast = message => { if (typeof showToast === 'function') showToast(message); };
  const openM = element => { if (typeof openModal === 'function') openModal(element); else element.classList.add('open'); };
  const closeM = element => { if (typeof closeModal === 'function') closeModal(element); else element.classList.remove('open'); };
  const onOpen = (selector, callback) => {
    const element = $(selector);
    if (element) new MutationObserver(() => { if (element.classList.contains('open')) callback(); }).observe(element, { attributes: true, attributeFilter: ['class'] });
  };

  const EDIT_KEY = 'etokiana-product-edits';
  const STOCK_KEY = 'etokiana-stock';
  const FIELDS = ['name', 'price', 'discount', 'image', 'description'];
  const DESC_MAX = 600;
  const DEMO_EDITOR = { id: 'editor-demo', name: 'Rédacteur E-tokiana', email: 'redacteur@etokiana.fr', password: 'redac123', role: 'editor', phone: '', address: '' };

  /* ---------------------------------------------------------------- */
  /* Données                                                           */
  /* ---------------------------------------------------------------- */
  const readUsers = () => parse(localStorage.getItem('etokiana-users')) || [];
  const writeUsers = list => localStorage.setItem('etokiana-users', JSON.stringify(list));
  const readEdits = () => parse(localStorage.getItem(EDIT_KEY)) || {};

  const isEditor = user => user?.role === 'editor';
  const isAdminRole = user => ['owner', 'admin'].includes(user?.role);
  const canEditProduct = (user, product) => isAdminRole(user) || (user?.role === 'seller' && product.sellerId === user.id);
  const canWriteDescription = user => isEditor(user);   // description : réservée au rédacteur
  const canOpenProductEdit = (user, product) => isEditor(user) || canEditProduct(user, product);
  const LOCK_NOTE = 'Seul le rédacteur peut rédiger ou modifier la description.';
  const me = () => (typeof currentUser !== 'undefined' ? currentUser : null);

  const descOf = product => String(product.description || '').trim();
  const hasDesc = product => descOf(product).length > 0;
  const pathOf = product => (product.categoryPath || [product.category]).filter(Boolean).slice(-2).join(' · ');
  const priceOf = product => (typeof effectivePrice === 'function' ? effectivePrice(product) : Number(product.price) || 0);
  const money = value => (typeof euro === 'function' ? euro(value) : `${Number(value).toFixed(2)} €`);
  const initialsOf = name => {
    const parts = String(name || 'U').trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts.at(-1)[0] : (parts[0] || 'U').slice(0, 2)).toLocaleUpperCase('fr-FR');
  };
  const timeAgo = iso => {
    const seconds = (Date.now() - new Date(iso)) / 1000;
    if (!Number.isFinite(seconds)) return '';
    if (seconds < 60) return 'à l’instant';
    if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)} h`;
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  // Stock : même règle que features.js (les services sont illimités)
  const unlimited = product => (product.categoryPath?.[0] || product.category) === 'Services';
  const currentStock = product => {
    const saved = (parse(localStorage.getItem(STOCK_KEY)) || {})[product.id];
    if (saved !== undefined) return Number(saved);
    const match = String(product.material || '').match(/(\d+)\s*unités?/i);
    return match ? Number(match[1]) : 20;
  };
  const setStockQty = (id, quantity) => {
    const map = parse(localStorage.getItem(STOCK_KEY)) || {};
    map[id] = Math.max(0, Math.floor(Number(quantity) || 0));
    localStorage.setItem(STOCK_KEY, JSON.stringify(map));
  };

  /* Enregistre une modification : produit en mémoire + copie durable + catalogue */
  function persist(product, patch, meta = {}) {
    Object.assign(product, patch);
    if ('salePrice' in product) product.salePrice = priceOf(product);
    const edits = readEdits();
    edits[product.id] = { ...(edits[product.id] || {}), ...patch, ...meta };
    localStorage.setItem(EDIT_KEY, JSON.stringify(edits));
    // Si le catalogue enregistré contient ce produit, on le met aussi à jour (sans jamais le dupliquer)
    const stored = parse(localStorage.getItem('etokiana-products'));
    if (Array.isArray(stored)) {
      let changed = false;
      stored.forEach(item => {
        if (String(item.id) !== String(product.id)) return;
        Object.assign(item, patch);
        if ('salePrice' in item) item.salePrice = product.salePrice;
        changed = true;
      });
      if (changed) { try { localStorage.setItem('etokiana-products', JSON.stringify(stored)); } catch { /* quota */ } }
    }
    if (typeof renderProducts === 'function') renderProducts();
  }

  function applyEdits() {
    if (typeof products === 'undefined') return;
    const edits = readEdits();
    let changed = false;
    products.forEach(product => {
      const edit = edits[product.id];
      if (!edit) return;
      FIELDS.forEach(key => { if (edit[key] !== undefined && product[key] !== edit[key]) { product[key] = edit[key]; changed = true; } });
      if ('salePrice' in product) product.salePrice = priceOf(product);
    });
    if (changed && typeof renderProducts === 'function') renderProducts();
  }

  function notifyDescription(product, updated) {
    try {
      const user = me();
      const actor = { email: user.email, name: user.name, role: 'client' };
      const text = `Rédaction : description ${updated ? 'mise à jour' : 'ajoutée'} — ${product.name} (par ${user.name})`;
      addNotification(adminIdentity.email, text, actor);
      if (product.sellerId !== 'owner') { const email = sellerEmail(product.sellerId); if (email) addNotification(email, text, actor); }
      renderNotifications();
    } catch { /* notifications indisponibles */ }
  }

  /* ---------------------------------------------------------------- */
  /* Comptes rédacteur : démo, connexion, création par l'admin          */
  /* ---------------------------------------------------------------- */
  function seedEditor() {
    const users = readUsers();
    if (!users.some(user => user.email === DEMO_EDITOR.email)) { users.push(DEMO_EDITOR); writeUsers(users); }
  }

  const demo = $('.demo-credentials');
  if (demo && !$('.editor-demo-line', demo)) {
    const line = document.createElement('span');
    line.className = 'editor-demo-line';
    line.textContent = `Rédacteur : ${DEMO_EDITOR.email} / ${DEMO_EDITOR.password}`;
    demo.append(line);
  }

  function manualLogin(account) {
    try {
      const user = { id: account.id, name: account.name, email: account.email, role: 'editor', phone: account.phone || '', address: account.address || '' };
      currentUser = user;
      localStorage.setItem('etokiana-user', JSON.stringify(user));
      if (typeof updateProfileButton === 'function') updateProfileButton();
      const error = $('#login-error');
      if (error) error.textContent = '';
      closeM($('#login-modal'));
      toast(`Bienvenue, ${user.name}`);
      openEditorSpace();
    } catch (error) { console.warn('Connexion rédacteur :', error); }
  }

  // Connexion : app.js gère d'abord ; si elle refuse ce compte, on prend le relais
  $('#login-form')?.addEventListener('submit', () => {
    const email = $('#login-email').value.trim().toLowerCase();
    const password = $('#login-password').value;
    const account = readUsers().find(user => user.role === 'editor' && String(user.email).toLowerCase() === email && user.password === password);
    if (!account) return;
    setTimeout(() => { if (me()?.email !== account.email) manualLogin(account); }, 0);
  }, true);

  // Un rédacteur connecté ouvre son espace, pas l'espace client
  onOpen('#account-modal', () => {
    if (!isEditor(me())) return;
    closeM($('#account-modal'));
    openEditorSpace();
  });

  // Admin > Personnel > Inviter : nouveau rôle « Rédacteur »
  const staffRole = $('#new-staff-role');
  if (staffRole && ![...staffRole.options].some(option => option.value === 'Rédacteur')) staffRole.add(new Option('Rédacteur (descriptions produits)', 'Rédacteur'));
  const genPassword = () => Array.from({ length: 8 }, () => 'abcdefghjkmnpqrstuvwxyz23456789'[Math.floor(Math.random() * 31)]).join('');

  $('#staff-form')?.addEventListener('submit', event => {
    if ($('#new-staff-role').value !== 'Rédacteur') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const name = $('#new-staff-name').value.trim();
    const email = $('#new-staff-email').value.trim().toLowerCase();
    const users = readUsers();
    if (users.some(user => String(user.email).toLowerCase() === email)) { toast('Cette adresse e-mail a déjà un compte.'); return; }
    const password = genPassword();
    users.push({ id: `editor-${Date.now().toString(36)}`, name, email, password, role: 'editor', phone: '', address: '' });
    writeUsers(users);
    $('.ed-created')?.remove();
    const box = document.createElement('div');
    box.className = 'ed-created';
    box.innerHTML = `<strong><i class="bi bi-check-circle" aria-hidden="true"></i> Compte rédacteur créé</strong><span>${esc(email)}</span><code>${esc(password)}</code><button type="button" class="space-mini" data-ed-copy="${esc(email)} / ${esc(password)}"><i class="bi bi-clipboard" aria-hidden="true"></i>Copier les identifiants</button><small>Transmettez-les au rédacteur : il pourra se connecter avec « Se connecter ».</small>`;
    $('#staff-form .modal-submit').before(box);
    renderTeam();
  }, true);
  onOpen('#staff-form-modal', () => $('.ed-created')?.remove());

  document.addEventListener('click', event => {
    const copy = event.target.closest('[data-ed-copy]');
    if (copy) { navigator.clipboard?.writeText(copy.dataset.edCopy).then(() => toast('Identifiants copiés'), () => toast('Copie impossible')); return; }
    const remove = event.target.closest('[data-ed-remove]');
    if (remove) {
      const account = readUsers().find(user => user.id === remove.dataset.edRemove);
      if (!account || !window.confirm(`Retirer le compte de ${account.name} ?`)) return;
      writeUsers(readUsers().filter(user => user.id !== account.id));
      renderTeam();
      toast('Compte rédacteur retiré');
    }
  });

  // Liste des rédacteurs dans Admin > Personnel
  function renderTeam() {
    const panel = $('[data-admin-panel="staff"]');
    if (!panel) return;
    let team = $('.ed-team', panel);
    if (!team) { team = document.createElement('div'); team.className = 'ed-team'; panel.append(team); }
    const editors = readUsers().filter(user => user.role === 'editor');
    team.innerHTML = `<div class="ed-team-head"><p class="eyebrow">Rédaction</p><h4>Rédacteurs de descriptions</h4></div>${editors.length
      ? editors.map(user => `<div class="ed-team-row"><span class="space-avatar mini editor">${esc(initialsOf(user.name))}</span><div><strong>${esc(user.name)}</strong><small>${esc(user.email)}</small></div><span class="space-role editor">Rédacteur</span><button type="button" class="space-mini danger" data-ed-remove="${esc(user.id)}">Retirer</button></div>`).join('')
      : '<p class="modal-muted">Aucun rédacteur. Invitez-en un avec le rôle « Rédacteur ».</p>'}`;
  }

  /* ---------------------------------------------------------------- */
  /* Espace Rédacteur                                                   */
  /* ---------------------------------------------------------------- */
  const state = { filter: 'todo', q: '', current: null };
  let editorModal = null;

  function buildEditorModal() {
    if (editorModal) return;
    editorModal = document.createElement('section');
    editorModal.className = 'modal editor-modal';
    editorModal.id = 'editor-modal';
    editorModal.setAttribute('aria-hidden', 'true');
    editorModal.setAttribute('aria-labelledby', 'editor-title');
    editorModal.innerHTML = `<div class="modal-panel space-panel account-space editor-space">
      <div class="modal-header"><div><p class="eyebrow">Espace rédaction</p><h2 id="editor-title">Descriptions produits</h2></div><button type="button" class="close-button" data-ed-close aria-label="Fermer mon espace">×</button></div>
      <aside class="space-sidebar">
        <div class="space-user-slot"></div>
        <nav class="space-tabs" aria-label="Filtrer les produits">
          <button type="button" class="account-tab" data-ed-tab="todo"><i class="bi bi-pencil-square" aria-hidden="true"></i><span>À rédiger</span><b class="space-count">0</b></button>
          <button type="button" class="account-tab" data-ed-tab="done"><i class="bi bi-check2-circle" aria-hidden="true"></i><span>Rédigées</span><b class="space-count">0</b></button>
          <button type="button" class="account-tab" data-ed-tab="all"><i class="bi bi-grid-3x3-gap" aria-hidden="true"></i><span>Tout le catalogue</span><b class="space-count">0</b></button>
        </nav>
        <div class="space-links">
          <button type="button" class="space-link" data-ed-shop><i class="bi bi-shop" aria-hidden="true"></i><span>Voir la boutique</span></button>
          <button type="button" class="space-link danger" data-ed-logout><i class="bi bi-box-arrow-right" aria-hidden="true"></i><span>Se déconnecter</span></button>
        </div>
      </aside>
      <div class="space-main">
        <div class="ed-list-view">
          <div class="space-kpis ed-kpis"></div>
          <div class="hist-tools ed-tools"><div class="msgr-search hist-search"><i class="bi bi-search" aria-hidden="true"></i><input type="search" id="ed-search" placeholder="Rechercher un produit" autocomplete="off" /></div></div>
          <div class="ed-list"></div>
        </div>
        <div class="ed-form-view" hidden>
          <button type="button" class="ed-back" data-ed-back><i class="bi bi-arrow-left" aria-hidden="true"></i>Retour à la liste</button>
          <div class="ed-grid">
            <form id="ed-form" novalidate>
              <p class="eyebrow">Rédaction</p>
              <h3 id="ed-name"></h3>
              <p class="ed-path" id="ed-path"></p>
              <label for="ed-text">Description du produit</label>
              <textarea id="ed-text" rows="9" maxlength="${DESC_MAX}" placeholder="Matière, usage, dimensions, entretien… en 2 à 4 phrases."></textarea>
              <div class="ed-counter"><span id="ed-count">0 / ${DESC_MAX}</span><span id="ed-hint"></span></div>
              <ul class="ed-tips">
                <li>Commencez par l’essentiel : ce que c’est et à quoi ça sert.</li>
                <li>Précisez la matière, les dimensions ou le format.</li>
                <li>Terminez par un conseil d’usage ou d’entretien.</li>
              </ul>
              <div class="ed-actions">
                <button type="submit" class="button button-dark">Enregistrer <i class="bi bi-check2" aria-hidden="true"></i></button>
                <button type="button" class="space-mini" data-ed-next><i class="bi bi-skip-forward" aria-hidden="true"></i>Enregistrer et passer au suivant</button>
              </div>
            </form>
            <aside class="ed-preview" aria-label="Aperçu dans la fiche produit">
              <p class="eyebrow">Aperçu client</p>
              <img id="ed-prev-img" alt="" />
              <strong id="ed-prev-name"></strong>
              <span id="ed-prev-price"></span>
              <p id="ed-prev-desc"></p>
            </aside>
          </div>
        </div>
      </div></div>`;
    document.body.append(editorModal);

    editorModal.addEventListener('click', event => {
      if (event.target === editorModal || event.target.closest('[data-ed-close]')) { closeM(editorModal); return; }
      const tab = event.target.closest('[data-ed-tab]');
      if (tab) { state.filter = tab.dataset.edTab; showList(); return; }
      const write = event.target.closest('[data-ed-write]');
      if (write) { openForm(write.dataset.edWrite); return; }
      if (event.target.closest('[data-ed-back]')) { showList(); return; }
      if (event.target.closest('[data-ed-next]')) { saveDescription(true); return; }
      if (event.target.closest('[data-ed-shop]')) { closeM(editorModal); $('#catalogue')?.scrollIntoView({ behavior: 'smooth' }); return; }
      if (event.target.closest('[data-ed-logout]')) {
        closeM(editorModal);
        const logout = $('.identity-logout');
        if (logout) logout.click(); else { localStorage.removeItem('etokiana-user'); location.reload(); }
      }
    });
    $('#ed-search', editorModal).addEventListener('input', event => { state.q = event.target.value; renderEditor(); });
    $('#ed-form', editorModal).addEventListener('submit', event => { event.preventDefault(); saveDescription(false); });
    $('#ed-text', editorModal).addEventListener('input', updateForm);
  }

  function openEditorSpace() {
    const user = me();
    if (!canWriteDescription(user)) { toast('Espace réservé au rédacteur.'); return; }
    buildEditorModal();
    $('.space-user-slot', editorModal).innerHTML = `<div class="space-user"><span class="space-avatar editor">${esc(initialsOf(user.name))}</span><div><strong>${esc(user.name)}</strong><small>${esc(user.email)}</small><span class="space-role editor"><i class="bi bi-pencil-square" aria-hidden="true"></i>Rédacteur</span></div></div>`;
    showList();
    openM(editorModal);
  }

  function showList() {
    $('.ed-list-view', editorModal).hidden = false;
    $('.ed-form-view', editorModal).hidden = true;
    state.current = null;
    renderEditor();
  }

  function renderEditor() {
    if (!editorModal) return;
    const all = products.slice().sort((a, b) => b.id - a.id);
    const todo = all.filter(product => !hasDesc(product));
    const done = all.length - todo.length;
    const mine = Object.values(readEdits()).filter(edit => edit.descBy === me()?.email).length;

    $$('[data-ed-tab]', editorModal).forEach(tab => {
      tab.classList.toggle('active', tab.dataset.edTab === state.filter);
      $('.space-count', tab).textContent = { todo: todo.length, done, all: all.length }[tab.dataset.edTab];
    });
    const kpi = (icon, value, label) => `<div><i class="bi ${icon}" aria-hidden="true"></i><strong>${value}</strong><span>${label}</span></div>`;
    $('.ed-kpis', editorModal).innerHTML = kpi('bi-box-seam', all.length, 'Produits') + kpi('bi-pencil-square', todo.length, 'À rédiger') + kpi('bi-check2-circle', done, 'Rédigées') + kpi('bi-person-check', mine, 'Mes rédactions');

    const query = state.q.trim().toLowerCase();
    const list = all.filter(product => (state.filter === 'all' || (state.filter === 'todo') === !hasDesc(product))
      && (!query || `${product.name} ${pathOf(product)}`.toLowerCase().includes(query)));
    const edits = readEdits();
    const target = $('.ed-list', editorModal);
    if (!list.length) {
      target.innerHTML = `<div class="space-empty"><i class="bi bi-${state.filter === 'todo' ? 'emoji-smile' : 'search'}" aria-hidden="true"></i><strong>${state.filter === 'todo' && !query ? 'Tout est rédigé !' : 'Aucun produit'}</strong><p>${state.filter === 'todo' && !query ? 'Chaque produit du catalogue a une description. Bravo.' : 'Essayez un autre filtre ou une autre recherche.'}</p></div>`;
      return;
    }
    target.innerHTML = list.map(product => {
      const written = hasDesc(product);
      const edit = edits[product.id] || {};
      const author = written && edit.descByName ? `par ${esc(edit.descByName)} · ${timeAgo(edit.descAt)}` : '';
      return `<article class="ed-row">
        <img src="${esc(product.image)}" alt="" loading="lazy" />
        <div class="ed-main"><strong>${esc(product.name)}</strong><small>${esc(pathOf(product))} · ${money(priceOf(product))}</small><p class="ed-excerpt">${written ? esc(descOf(product)) : '<em>Aucune description pour le moment.</em>'}</p></div>
        <div class="ed-side"><span class="ed-status ${written ? 'done' : 'todo'}">${written ? 'Rédigée' : 'À rédiger'}</span>${author ? `<small>${author}</small>` : ''}<button type="button" class="space-mini ${written ? '' : 'primary'}" data-ed-write="${esc(product.id)}"><i class="bi ${written ? 'bi-pencil' : 'bi-feather'}" aria-hidden="true"></i>${written ? 'Modifier' : 'Rédiger'}</button></div>
      </article>`;
    }).join('');
  }

  function openForm(id) {
    const product = products.find(item => String(item.id) === String(id));
    if (!product) return;
    state.current = product;
    $('.ed-list-view', editorModal).hidden = true;
    $('.ed-form-view', editorModal).hidden = false;
    $('#ed-name', editorModal).textContent = product.name;
    $('#ed-path', editorModal).textContent = `${pathOf(product)} · ${money(priceOf(product))}`;
    $('#ed-text', editorModal).value = descOf(product);
    const image = $('#ed-prev-img', editorModal);
    image.src = product.image;
    $('#ed-prev-name', editorModal).textContent = product.name;
    $('#ed-prev-price', editorModal).textContent = money(priceOf(product));
    updateForm();
    $('#ed-text', editorModal).focus();
    $('.space-main', editorModal).scrollTop = 0;
  }

  function updateForm() {
    const text = $('#ed-text', editorModal).value;
    const length = text.trim().length;
    $('#ed-count', editorModal).textContent = `${length} / ${DESC_MAX}`;
    const hint = $('#ed-hint', editorModal);
    hint.className = '';
    if (!length) hint.textContent = 'Écrivez 2 à 4 phrases.';
    else if (length < 40) { hint.textContent = 'Un peu court : ajoutez matière, usage ou dimensions.'; hint.className = 'warn'; }
    else if (length <= 400) { hint.textContent = 'Longueur idéale ✓'; hint.className = 'ok'; }
    else { hint.textContent = 'Pensez à rester concis.'; hint.className = 'warn'; }
    const preview = $('#ed-prev-desc', editorModal);
    preview.textContent = text.trim() || 'Votre description apparaîtra ici.';
    preview.classList.toggle('is-empty', !text.trim());
  }

  function saveDescription(goNext) {
    const product = state.current;
    if (!product) return;
    if (!canWriteDescription(me())) { toast(LOCK_NOTE); return; }
    const text = $('#ed-text', editorModal).value.trim().slice(0, DESC_MAX);
    const before = descOf(product);
    if (text !== before) {
      const user = me();
      persist(product, { description: text }, { descBy: user.email, descByName: user.name, descAt: new Date().toISOString() });
      notifyDescription(product, Boolean(before));
      toast(text ? 'Description enregistrée' : 'Description supprimée');
    } else toast('Aucun changement à enregistrer.');
    if (goNext) {
      const next = products.slice().sort((a, b) => b.id - a.id).find(item => !hasDesc(item) && item.id !== product.id);
      if (next) { openForm(next.id); return; }
      toast('Toutes les descriptions sont rédigées 🎉');
    }
    showList();
  }

  /* ---------------------------------------------------------------- */
  /* Modifier un produit (admin / vendeur)                              */
  /* ---------------------------------------------------------------- */
  let editModal = null;
  let editing = null;

  function buildEditModal() {
    if (editModal) return;
    editModal = document.createElement('section');
    editModal.className = 'modal';
    editModal.id = 'product-edit-modal';
    editModal.setAttribute('aria-hidden', 'true');
    editModal.setAttribute('aria-labelledby', 'pe-title');
    editModal.innerHTML = `<div class="modal-panel form-panel pe-panel">
      <div class="modal-header"><div><p class="eyebrow">Catalogue</p><h2 id="pe-title">Modifier le produit</h2></div><button type="button" class="close-button" data-pe-close aria-label="Fermer">×</button></div>
      <form id="pe-form" novalidate>
        <div class="pe-top"><img id="pe-img" alt="" /><div><strong id="pe-meta"></strong><small id="pe-path"></small></div></div>
        <div class="form-grid">
          <label>Nom du produit<input id="pe-name" type="text" required /></label>
          <label>Prix (€)<input id="pe-price" type="number" min="0" step="0.01" required /></label>
        </div>
        <div class="form-grid">
          <label>Remise (%)<input id="pe-discount" type="number" min="0" max="90" step="1" placeholder="0" /></label>
          <label id="pe-stock-label">Stock<input id="pe-stock" type="number" min="0" step="1" /></label>
        </div>
        <label>URL de l’image<input id="pe-image" type="url" placeholder="https://…" /></label>
        <label>Description<textarea id="pe-desc" rows="4" maxlength="${DESC_MAX}"></textarea></label>
        <p class="pe-final" id="pe-final"></p>
        <p class="login-error" id="pe-error" aria-live="polite"></p>
        <button type="submit" class="button button-dark modal-submit">Enregistrer les modifications <i class="bi bi-check2" aria-hidden="true"></i></button>
      </form></div>`;
    document.body.append(editModal);
    editModal.addEventListener('click', event => { if (event.target === editModal || event.target.closest('[data-pe-close]')) closeM(editModal); });
    $('#pe-form', editModal).addEventListener('submit', saveProduct);
    ['#pe-price', '#pe-discount'].forEach(selector => $(selector, editModal).addEventListener('input', updateFinal));
    $('#pe-image', editModal).addEventListener('input', event => { const img = $('#pe-img', editModal); img.hidden = false; img.src = event.target.value.trim() || editing?.image || ''; });
    $('#pe-img', editModal).addEventListener('error', event => { event.target.hidden = true; });
  }

  function updateFinal() {
    const price = Number($('#pe-price', editModal).value) || 0;
    const discount = Math.min(90, Math.max(0, Number($('#pe-discount', editModal).value) || 0));
    const final = priceOf({ ...editing, price, discount });
    $('#pe-final', editModal).innerHTML = discount ? `Prix affiché : <del>${money(priceOf({ ...editing, price, discount: 0 }))}</del> <strong>${money(final)}</strong>` : `Prix affiché : <strong>${money(final)}</strong>`;
  }

  function openProductEdit(id) {
    const product = products.find(item => String(item.id) === String(id));
    const user = me();
    if (!product || !user || !canEditProduct(user, product)) { toast('Vous ne pouvez pas modifier ce produit.'); return; }
    buildEditModal();
    editing = product;
    $('#pe-meta', editModal).textContent = `${product.name}`;
    $('#pe-path', editModal).textContent = pathOf(product);
    const image = $('#pe-img', editModal);
    image.hidden = false;
    image.src = product.image;
    $('#pe-name', editModal).value = product.name;
    $('#pe-price', editModal).value = product.price;
    $('#pe-discount', editModal).value = product.discount || '';
    $('#pe-image', editModal).value = product.image || '';
    $('#pe-desc', editModal).value = descOf(product);
    lockDescription($('#pe-desc', editModal));
    const stock = $('#pe-stock', editModal);
    $('#pe-stock-label', editModal).hidden = unlimited(product);
    stock.value = unlimited(product) ? '' : currentStock(product);
    $('#pe-error', editModal).textContent = '';
    updateFinal();
    openM(editModal);
  }

  function saveProduct(event) {
    event.preventDefault();
    const product = editing;
    if (!product) return;
    const error = $('#pe-error', editModal);
    const name = $('#pe-name', editModal).value.trim();
    const price = Number($('#pe-price', editModal).value);
    const discount = Math.round(Number($('#pe-discount', editModal).value) || 0);
    if (!name) { error.textContent = 'Le nom du produit est obligatoire.'; return; }
    if (!Number.isFinite(price) || price < 0 || $('#pe-price', editModal).value === '') { error.textContent = 'Indiquez un prix valide.'; return; }
    if (discount < 0 || discount > 90) { error.textContent = 'La remise doit être comprise entre 0 et 90 %.'; return; }

    const patch = {
      name, price, discount,
      image: $('#pe-image', editModal).value.trim() || product.image
    };
    persist(product, patch);   // la description n'est jamais modifiée ici
    if (!unlimited(product) && $('#pe-stock', editModal).value !== '') setStockQty(product.id, $('#pe-stock', editModal).value);
    if (typeof renderProducts === 'function') renderProducts();
    patchAdminRow(product);
    closeM(editModal);
    toast('Produit modifié');
  }

  // Met à jour la ligne de la liste « Produits » sans recharger tout le panneau
  function patchAdminRow(product) {
    const row = $(`[data-admin-panel="products"] .space-row[data-pid="${product.id}"]`);
    if (!row) return;
    const name = $('.space-row-main strong', row);
    if (name) name.textContent = product.name;
    const img = $('img', row);
    if (img) img.src = product.image;
    const price = $('.space-row-price', row);
    if (price) price.innerHTML = `<strong>${money(priceOf(product))}</strong>${product.discount ? `<em>-${product.discount}%</em>` : ''}`;
  }

  // Bouton « Modifier » dans Admin > Produits
  function decorateAdminRows() {
    const panel = $('[data-admin-panel="products"]');
    const user = me();
    if (!panel || !user || typeof products === 'undefined') return;
    const rows = $$('.space-row', panel);
    if (rows.some(row => !row.dataset.pid)) {
      // même liste et même ordre que l'affichage d'origine
      const list = user.role === 'seller' ? products.filter(product => product.sellerId === user.id) : products.slice().sort((a, b) => b.id - a.id);
      if (list.length === rows.length) rows.forEach((row, index) => { if (!row.dataset.pid) row.dataset.pid = String(list[index].id); });
    }
    rows.forEach(row => {
      const product = products.find(item => String(item.id) === row.dataset.pid);
      const actions = $('.space-row-actions', row);
      if (!product || !actions || $('.pe-edit', actions) || !canEditProduct(user, product)) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'space-mini pe-edit';
      button.dataset.peEdit = product.id;
      button.innerHTML = '<i class="bi bi-pencil" aria-hidden="true"></i>Modifier';
      const before = $('.danger, .space-tag', actions);
      if (before) before.before(button); else actions.append(button);
    });
  }
  const productsPanel = $('[data-admin-panel="products"]');
  if (productsPanel) new MutationObserver(decorateAdminRows).observe(productsPanel, { childList: true, subtree: true });
  onOpen('#admin-modal', () => { decorateAdminRows(); renderTeam(); });

  document.addEventListener('click', event => {
    const edit = event.target.closest('[data-pe-edit]');
    if (edit) { openProductEdit(edit.dataset.peEdit); return; }
    const link = event.target.closest('.pm-edit');
    if (link && typeof selectedProduct !== 'undefined' && selectedProduct) {
      const product = selectedProduct;
      closeM($('#product-modal'));
      if (isEditor(me())) { openEditorSpace(); openForm(product.id); } else openProductEdit(product.id);
    }
  });

  /* ---------------------------------------------------------------- */
  /* Fiche produit : description rédigée + lien « Modifier »            */
  /* ---------------------------------------------------------------- */
  let defaultDescription = null;
  function decorateProductModal() {
    const product = typeof selectedProduct !== 'undefined' ? selectedProduct : null;
    const text = $('.product-modal-description');
    if (!product || !text) return;
    if (defaultDescription === null) defaultDescription = text.textContent.trim();
    text.textContent = descOf(product) || defaultDescription;

    const actions = $('.product-modal-actions');
    let link = $('.pm-edit');
    if (!link && actions) {
      link = document.createElement('button');
      link.type = 'button';
      link.className = 'text-link pm-edit';
      actions.after(link);
    }
    if (!link) return;
    const user = me();
    const allowed = Boolean(user) && canOpenProductEdit(user, product);
    link.hidden = !allowed;
    if (allowed) link.innerHTML = isEditor(user)
      ? `${hasDesc(product) ? 'Modifier la description' : 'Rédiger la description'} <i class="bi bi-feather" aria-hidden="true"></i>`
      : 'Modifier ce produit <i class="bi bi-pencil" aria-hidden="true"></i>';
  }
  onOpen('#product-modal', decorateProductModal);

  /* ---------------------------------------------------------------- */
  /* Pastille de rôle dans la barre de navigation                       */
  /* ---------------------------------------------------------------- */
  const nav = $('.nav-actions');
  if (nav) new MutationObserver(() => {
    if (!isEditor(me())) return;
    $$('.identity-role-icon', nav).forEach(icon => {
      if (icon.classList.contains('editor')) return;
      icon.className = 'identity-role-icon editor';
      icon.innerHTML = '<i class="bi bi-pencil-square" aria-hidden="true"></i>';
    });
  }).observe(nav, { childList: true, subtree: true });

  /* ---------------------------------------------------------------- */
  /* Description verrouillée pour tous sauf le rédacteur                 */
  /* ---------------------------------------------------------------- */
  function lockDescription(field, placeholder) {
    if (!field) return;
    field.disabled = true;
    field.required = false;
    field.classList.add('ed-locked');
    field.title = LOCK_NOTE;
    if (placeholder) field.placeholder = placeholder;
    const label = field.closest('label');
    if (label && !$('.ed-lock-note', label)) {
      const note = document.createElement('small');
      note.className = 'ed-lock-note';
      note.innerHTML = `<i class="bi bi-lock" aria-hidden="true"></i>${LOCK_NOTE}`;
      label.append(note);
    }
  }
  const lockProductForm = () => lockDescription($('#new-product-description'), 'Rédigée par le rédacteur après la publication');
  onOpen('#product-form-modal', lockProductForm);

  /* ---------------------------------------------------------------- */
  /* Initialisation                                                     */
  /* ---------------------------------------------------------------- */
  lockProductForm();
  seedEditor();
  applyEdits();
  renderTeam();
  decorateAdminRows();
})();
