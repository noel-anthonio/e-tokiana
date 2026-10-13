/* ==========================================================================
   E-tokiana — admin-revenue.js   (à charger EN DERNIER, après order-rules.js)
   Chiffre d'affaires de l'administrateur :
     • produit vendu par un vendeur  → l'admin reçoit la commission (10 %)
       ex. le vendeur a vendu 150 000 Ar → l'admin reçoit 15 000 Ar
     • produit appartenant à l'admin (boutique officielle) → 100 % de la vente
   Le taux est celui de « commissionRate » (déjà utilisé par l'onglet Vendeurs).

   Affiché pour l'admin uniquement :
   - tableau de bord : « Chiffre d'affaires » = commissions + ventes propres
     (détail sous le chiffre)
   - onglet Commandes : même chiffre, et « Votre revenu » sur chaque commande
   - onglet Vendeurs : la commission perçue sur chaque vendeur
   Les frais de livraison ne sont pas comptés dans les commissions.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const me = () => (typeof currentUser !== 'undefined' ? currentUser : null);
  const isAdmin = user => ['owner', 'admin'].includes(user?.role);
  const orderList = () => (typeof orders !== 'undefined' && Array.isArray(orders) ? orders : []);
  const findOrder = id => orderList().find(order => String(order.id) === String(id));
  const rate = () => { try { return Number(commissionRate) || 0.1; } catch { return 0.1; } };
  const money = value => { try { return euro(value); } catch { return String(Math.round(value)); } };
  const ownerOf = item => item.sellerId || 'owner';
  const lineAmount = item => (Number(item.salePrice) || Number(item.price) || 0) * (Number(item.quantity) || 0);

  // Part de l'admin sur une commande : ventes propres + commissions
  function share(order) {
    let own = 0, commission = 0;
    (order.items || []).forEach(item => {
      const amount = lineAmount(item);
      if (ownerOf(item) === 'owner') own += amount; else commission += amount * rate();
    });
    return { own, commission, total: own + commission };
  }

  function totals() {
    return orderList().reduce((sum, order) => {
      const part = share(order);
      sum.own += part.own;
      sum.commission += part.commission;
      sum.total += part.total;
      return sum;
    }, { own: 0, commission: 0, total: 0 });
  }

  // Identifiant d'un vendeur d'après son e-mail (liste « Vendeurs »)
  function sellerIdByEmail(email) {
    if (email === 'vendeur@etokiana.fr') return 'demo-seller';
    try { return (JSON.parse(localStorage.getItem('etokiana-users') || '[]')).find(user => user.role === 'seller' && user.email === email)?.id; } catch { return undefined; }
  }

  const setText = (element, text) => { if (element && element.textContent !== text) element.textContent = text; };

  function decorate() {
    if (!isAdmin(me())) return;
    const sum = totals();
    const percent = `${Math.round(rate() * 100)} %`;
    const detail = `Commissions ${percent} : ${money(sum.commission)} · Ventes propres : ${money(sum.own)}`;

    // 1. Tableau de bord
    $$('[data-dashboard-stat="revenue"]').forEach(value => {
      setText(value, money(sum.total));
      const box = value.parentElement;
      let note = $('.rev-break', box);
      if (!note) { note = document.createElement('small'); note.className = 'rev-break'; box.append(note); }
      setText(note, detail);
      box.title = detail;
    });

    // 2. Onglet Commandes : indicateur + part de l'admin sur chaque commande
    $$('.ord-kpis > div').forEach(box => {
      if (!/chiffre d/i.test($('span', box)?.textContent || '')) return;
      setText($('strong', box), money(sum.total));
      box.title = detail;
    });
    $$('.ord').forEach(card => {
      const order = findOrder($('header strong', card)?.textContent.replace('#', '').trim());
      const box = $('.ord-total', card);
      if (!order || !box) return;
      const part = share(order);
      setText($('small', box), 'Votre revenu');
      setText($('strong', box), money(part.total));
      let gross = $('.ord-gross', box);
      if (!gross) { gross = document.createElement('small'); gross.className = 'ord-gross'; box.append(gross); }
      setText(gross, `Total client : ${money(Number(order.total) || 0)}`);
      box.title = part.commission && part.own
        ? `Ventes propres ${money(part.own)} + commission ${money(part.commission)}`
        : part.commission ? `Commission ${percent} : ${money(part.commission)}` : `Vente propre : ${money(part.own)}`;
    });

    // 3. Onglet Vendeurs : commission perçue sur chaque vendeur partenaire
    $$('.sel').forEach(card => {
      const dl = $('dl', card);
      const email = $('[data-open-chat]', card)?.dataset.openChat;
      if (!dl || !email) return;   // la boutique officielle n'a pas de commission
      const id = sellerIdByEmail(email);
      const sales = id ? orderList().reduce((s, order) => s + (order.items || []).filter(item => ownerOf(item) === id).reduce((n, item) => n + lineAmount(item), 0), 0) : 0;
      let cell = $('.sel-comm', dl);
      if (!cell) {
        cell = document.createElement('div');
        cell.className = 'sel-comm';
        cell.innerHTML = '<dt></dt><dd></dd>';
        dl.append(cell);
      }
      setText($('dt', cell), `Votre commission (${percent})`);
      setText($('dd', cell), money(sales * rate()));
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    .rev-break { color: var(--muted); display: block; font-family: var(--mono); font-size: 9px; line-height: 1.5; margin-top: 8px; }
    .ord-gross { margin-top: 2px; }
    .sel-comm dd { color: var(--green); }`;
  document.head.append(style);

  const target = $('#admin-modal');
  if (target) new MutationObserver(decorate).observe(target, { childList: true, subtree: true });
  decorate();
})();
