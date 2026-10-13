/* ==========================================================================
   E-tokiana — order-rules.js   (à charger EN DERNIER, après editor.js)
   Règle de gestion des commandes :
   - le suivi d'une commande (Validée → En préparation → Expédiée → Livrée)
     est fait uniquement par le vendeur PROPRIÉTAIRE des produits commandés ;
   - l'administrateur voit toutes les commandes mais ne peut pas les faire
     avancer, sauf pour les produits dont il est lui-même propriétaire
     (produits de la boutique officielle : sellerId « owner ») ;
   - une commande contenant des produits de plusieurs propriétaires peut être
     suivie par chacun d'eux.

   Ne modifie ni app.js ni features.js : le script bloque le clic sur
   « [data-order-status] » quand l'utilisateur n'est pas propriétaire, et
   remplace le bouton par une pastille « Suivi par … » (lecture seule).
   ========================================================================== */
(() => {
  'use strict';

  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const toast = message => { if (typeof showToast === 'function') showToast(message); };
  const me = () => (typeof currentUser !== 'undefined' ? currentUser : null);
  const isAdmin = user => ['owner', 'admin'].includes(user?.role);
  const ownerOf = item => item.sellerId || 'owner';
  const findOrder = id => (typeof orders !== 'undefined' && Array.isArray(orders) ? orders : []).find(order => String(order.id) === String(id));

  // Propriétaires des produits d'une commande
  const ownersOf = order => [...new Set((order.items || []).map(ownerOf))];

  function canManage(user, order) {
    if (!user || !order) return false;
    const owners = ownersOf(order);
    if (user.role === 'seller') return owners.includes(user.id);
    if (isAdmin(user)) return !owners.length || owners.includes('owner');
    return false;
  }

  // Produits de la commande dont l'utilisateur n'est pas propriétaire (pour nommer le vendeur)
  function otherOwners(user, order) {
    const mine = user?.role === 'seller' ? user.id : 'owner';
    const items = (order.items || []).filter(item => ownerOf(item) !== mine);
    const names = [...new Set(items.map(item => (typeof sellerLabel === 'function' ? sellerLabel(item) : 'le vendeur')))];
    const emails = [...new Set(items.map(item => { try { return typeof sellerEmail === 'function' ? sellerEmail(ownerOf(item)) : ''; } catch { return ''; } }).filter(Boolean))];
    return { names, emails };
  }

  const reason = (user, order) => {
    if (!isAdmin(user)) return 'Seul le vendeur propriétaire du produit peut faire avancer cette commande.';
    const { names } = otherOwners(user, order);
    return `Cette commande est suivie par ${names.join(', ') || 'le vendeur propriétaire'}. Vous avez la visibilité uniquement.`;
  };

  // 1. Blocage du clic (avant app.js)
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-order-status]');
    if (!button) return;
    const order = findOrder(button.dataset.orderStatus);
    const user = me();
    if (!order || canManage(user, order)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    toast(reason(user, order));
  }, true);

  // 2. Bouton remplacé par une pastille en lecture seule
  function decorate() {
    const user = me();
    $$('[data-order-status]').forEach(button => {
      const order = findOrder(button.dataset.orderStatus);
      if (!order || canManage(user, order)) return;
      const { names, emails } = otherOwners(user, order);
      const tag = document.createElement('span');
      tag.className = 'ord-readonly';
      tag.title = reason(user, order);
      tag.innerHTML = '<i class="bi bi-lock" aria-hidden="true"></i><span></span>';
      tag.querySelector('span').textContent = isAdmin(user) ? `Suivi par ${names.join(', ') || 'le vendeur'}` : 'Suivi par le vendeur';
      if (isAdmin(user) && emails.length === 1) {
        const write = document.createElement('button');
        write.type = 'button';
        write.className = 'ord-readonly-chat';
        write.dataset.openChat = emails[0];     // ouvre la messagerie avec ce vendeur (géré par features.js)
        write.innerHTML = '<i class="bi bi-chat-dots" aria-hidden="true"></i>Écrire';
        tag.append(write);
      }
      button.replaceWith(tag);
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    .ord-readonly { align-items: center; background: #f4f1ea; border: 1px dashed #c9c1b7; border-radius: 999px; color: var(--muted); display: inline-flex; font-size: 12px; font-weight: 500; gap: 8px; padding: 7px 8px 7px 12px; }
    .ord-readonly > i { color: var(--green); }
    .ord-readonly-chat { align-items: center; background: var(--white); border: 1px solid var(--line); border-radius: 999px; color: var(--ink); display: inline-flex; font-size: 12px; font-weight: 600; gap: 5px; padding: 3px 10px; }
    .ord-readonly-chat:hover { border-color: var(--green); color: var(--green); }`;
  document.head.append(style);

  const target = document.querySelector('#admin-modal');
  if (target) new MutationObserver(decorate).observe(target, { childList: true, subtree: true });
  decorate();
})();
