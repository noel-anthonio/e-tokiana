/* ==========================================================================
   E-tokiana — panels.js   (à charger APRÈS chat.js)
   Complète panels.css pour les panneaux Notifications / Panier / Messagerie :
   - pastille d'icône dans chaque en-tête
   - notifications : bouton « Tout marquer comme lu » + libellé d'action
     (« Suivre la commande », « Répondre », « Gérer le stock »)
   - panier : « N articles » dans l'en-tête
   Identique pour tous les profils (visiteur, client, vendeur, admin).
   ========================================================================== */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const notifModal = $('#notification-modal');
  const chatModal = $('#chat-modal');
  const cartDrawer = $('#cart-drawer');

  const decorateHeader = (header, iconName) => {
    if (!header || header.dataset.panelIcon) return;
    header.dataset.panelIcon = '1';
    header.classList.add('panel-head');
    const icon = document.createElement('span');
    icon.className = 'panel-ico';
    icon.innerHTML = `<i class="bi ${iconName}" aria-hidden="true"></i>`;
    header.prepend(icon);
  };

  const isStaff = () => typeof currentUser !== 'undefined' && ['owner', 'admin', 'seller'].includes(currentUser?.role);

  /* ---------------- Notifications ---------------- */
  function markAllRead() {
    try {
      const key = userNotificationKey();
      notifications.forEach(item => { if (item.recipient === key) item.read = true; });
      localStorage.setItem('etokiana-notifications', JSON.stringify(notifications));
      renderNotifications();
    } catch (error) { console.warn('Notifications :', error); }
  }

  function enhanceNotifications() {
    if (!notifModal) return;
    decorateHeader($('.notification-panel > .modal-header', notifModal), 'bi-bell');

    const toolbar = $('.notif-toolbar', notifModal);
    if (toolbar && !$('.notif-actions', toolbar)) {
      const actions = document.createElement('div');
      actions.className = 'notif-actions';
      const readAll = document.createElement('button');
      readAll.type = 'button';
      readAll.className = 'notif-readall';
      readAll.innerHTML = '<i class="bi bi-check2-all" aria-hidden="true"></i>Tout marquer comme lu';
      readAll.addEventListener('click', markAllRead);
      const clear = $('[data-notif-clear]', toolbar);
      actions.append(readAll);
      if (clear) actions.append(clear);
      toolbar.append(actions);
    }
    const readAll = $('.notif-readall', notifModal);
    if (readAll) readAll.hidden = !$('.notif.is-new', notifModal);

    notifModal.querySelectorAll('.notif').forEach(item => {
      const body = $('.notif-body', item);
      if (!body || $('.notif-cta', body)) return;
      const label = item.classList.contains('k-order') ? 'Suivre la commande'
        : item.classList.contains('k-message') ? 'Répondre'
        : item.classList.contains('k-alert') && isStaff() ? 'Gérer le stock' : '';
      if (!label) return;
      const cta = document.createElement('span');
      cta.className = 'notif-cta';
      cta.innerHTML = `${label} <i class="bi bi-arrow-right" aria-hidden="true"></i>`;
      body.append(cta);
    });
  }

  /* ---------------- Panier ---------------- */
  function enhanceCart() {
    if (!cartDrawer) return;
    decorateHeader($('.drawer-header', cartDrawer), 'bi-bag');
    const count = Number($('.drawer-header .cart-count', cartDrawer)?.textContent) || 0;
    const eyebrow = $('.drawer-header .eyebrow', cartDrawer);
    const text = count ? `${count} article${count > 1 ? 's' : ''} dans votre sélection` : 'Votre sélection';
    if (eyebrow && eyebrow.textContent !== text) eyebrow.textContent = text;
  }

  /* ---------------- Messagerie ---------------- */
  const enhanceChat = () => decorateHeader($('.chat-panel > .modal-header', chatModal), 'bi-chat-dots');

  const run = () => { enhanceNotifications(); enhanceCart(); enhanceChat(); };
  const observer = new MutationObserver(run);
  if (notifModal) observer.observe(notifModal, { childList: true, subtree: true });
  if (cartDrawer) observer.observe(cartDrawer, { childList: true, subtree: true, characterData: true });
  if (chatModal) observer.observe(chatModal, { childList: true });
  run();
})();
