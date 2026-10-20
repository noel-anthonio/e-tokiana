(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const read = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value == null ? fallback : value; } catch (_) { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const userNow = () => read('etokiana-user', null);
  const accountUsers = () => read('etokiana-users', []);
  const readOrders = () => { const v = read('etokiana-orders', []); return Array.isArray(v) ? v : []; };
  const readDocs = () => { const v = read('etokiana-commercial-documents', []); return Array.isArray(v) ? v : []; };
  const saveDocs = list => { write('etokiana-commercial-documents', list); window.dispatchEvent(new CustomEvent('etokiana-documents-changed')); };
  const readIssuer = () => ({name:'E-tokiana', address:'', city:'', phone:'', email:'', registration:'', nif:'', stat:'', taxRegime:'', footer:'', ...read('etokiana-doc-issuer', {})});
  const role = u => { const r = normalize(u?.role); if (['owner','admin','superadmin','administrator','administrateur'].includes(r)) return 'admin'; if (['seller','vendeur'].includes(r)) return 'seller'; if (['provider','prestataire'].includes(r)) return 'provider'; if (['staff','personnel'].includes(r) || u?.staffRoleKey) return 'staff'; if (['editor','redac','redacteur'].includes(r)) return 'editor'; return 'client'; };
  const isAdmin = u => role(u) === 'admin';
  const staffPermissions = u => Array.isArray(u?.staffPermissions) ? u.staffPermissions : (window.EtoStaffRoles?.catalog?.[u?.staffRoleKey || window.EtoStaffRoles?.resolveKey?.(u) || 'observer']?.permissions || []);
  const canIssue = u => isAdmin(u) || (['seller','provider'].includes(role(u))) || (role(u) === 'staff' && staffPermissions(u).includes('orders.manage'));
  const ownsOrder = (u, order) => isAdmin(u) || (['seller','provider'].includes(role(u)) && (order?.items||[]).some(item => String(item.sellerId ?? '') === String(u?.id ?? ''))) || (role(u)==='staff' && staffPermissions(u).includes('orders.manage'));
  const scopedOrderSnapshot = (order, u) => {
    const snap = snapshotOrder(order);
    if (!['seller','provider'].includes(role(u))) return snap;
    const ownItems = snap.items.filter(item => String(item.sellerId ?? '') === String(u?.id ?? ''));
    const subtotal = ownItems.reduce((sum,item)=>sum + item.unitPrice * item.quantity,0);
    return {...snap, items:ownItems, subtotal, shipping:0, total:subtotal, sellerId:String(u?.id ?? ''), sellerName:String(u?.name || u?.fullName || 'Vendeur')};
  };
  const money = value => `${Math.round((Number(value) || 0) * 4900).toLocaleString('fr-FR')} Ar`;
  const moneyRaw = value => Math.round(Number(value) || 0);
  const dateLabel = value => { const d = value ? new Date(value) : null; return d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString('fr-FR', {day:'2-digit',month:'short',year:'numeric'}) : 'Date non renseignée'; };
  const orderStatus = order => String(order?.status || 'Nouvelle commande');
  const statusGroup = order => { const s = normalize(orderStatus(order)); if (/annul|cancel/.test(s)) return 'cancelled'; if (/livree|livre|delivered/.test(s)) return 'delivered'; if (/expedie|shipped/.test(s)) return 'shipped'; if (/preparation|prepare/.test(s)) return 'preparing'; return 'new'; };
  const eligibleForDelivery = order => ['preparing','shipped','delivered'].includes(statusGroup(order));
  const orderKey = order => String(order?.id ?? '');
  const itemUnit = item => { const base = Number(item?.salePrice ?? item?.price ?? 0); if (Number.isFinite(base) && base >= 0) return base; return 0; };
  const itemCount = order => (order?.items || []).reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0);
  const lineSum = order => (order?.items || []).reduce((sum, item) => sum + itemUnit(item) * Math.max(0, Number(item.quantity) || 0), 0);
  const orderTotal = order => Number(order?.total ?? (Number(order?.subtotal || 0) + Number(order?.shipping || 0))) || 0;
  const docTypes = {
    bc: {label:'Bon de commande', short:'BC', prefix:'BC', icon:'bi-cart-check', explain:'Référence et récapitulatif de la commande.'},
    bl: {label:'Bon de livraison', short:'BL', prefix:'BL', icon:'bi-truck', explain:'Préparation et remise des articles.'},
    invoice: {label:'Facture', short:'FACTURE', prefix:'FACT', icon:'bi-receipt-cutoff', explain:'Facture imprimable liée à la commande.'}
  };
  const nextNumber = (type, list) => {
    const year = new Date().getFullYear();
    const prefix = `${docTypes[type].prefix}-${year}-`;
    const max = list.reduce((highest, doc) => { const n = String(doc.number || ''); if (!n.startsWith(prefix)) return highest; const parsed = Number(n.slice(prefix.length)); return Number.isFinite(parsed) ? Math.max(highest, parsed) : highest; }, 0);
    return `${prefix}${String(max + 1).padStart(5, '0')}`;
  };
  const getBuyer = order => {
    const emails = [order?.buyerId, order?.buyerEmail].filter(value => typeof value === 'string' && value.includes('@')).map(value => value.trim().toLowerCase());
    const match = accountUsers().find(user => emails.includes(String(user.email || '').trim().toLowerCase()));
    const current = userNow();
    return match || (emails.includes(String(current?.email || '').trim().toLowerCase()) ? current : null) || {};
  };
  const snapshotOrder = order => {
    const buyer = getBuyer(order);
    return {
      orderId: orderKey(order), orderDate: order?.date || new Date().toISOString(), orderStatus: orderStatus(order),
      buyerName: String((order?.buyerName && normalize(order.buyerName) !== 'client invite' ? order.buyerName : '') || buyer.name || buyer.fullName || '').trim(), buyerEmail: (String(order?.buyerId || '').includes('@') ? String(order.buyerId).trim() : String(order?.buyerEmail || buyer.email || '').trim()),
      buyerPhone: String(order?.buyerPhone || order?.phone || buyer.phone || '').trim(), buyerAddress: [order?.buyerAddress || order?.address || buyer.address || '', order?.buyerCity || order?.city || buyer.city || '', order?.buyerPostalCode || order?.postalCode || buyer.postalCode || ''].filter(Boolean).join(', '),
      items: (order?.items || []).map(item => ({name:String(item?.name || 'Article'), reference:String(item?.reference || item?.sku || ''), category:String(item?.category || ''), quantity:Math.max(0,Number(item?.quantity)||0), unitPrice:itemUnit(item), total:itemUnit(item)*Math.max(0,Number(item?.quantity)||0), sellerId:String(item?.sellerId ?? ''), sellerName:String(item?.sellerName || item?.seller || '')})),
      subtotal:Number(order?.subtotal ?? lineSum(order)) || 0, shipping:Number(order?.shipping || 0) || 0, total:orderTotal(order), currency:'Ar', paymentMethod:String(order?.paymentMethod || ''), notes:String(order?.notes || '')
    };
  };
  const makeDoc = (order, type, issuer = userNow()) => {
    if (!docTypes[type]) return null;
    const list = readDocs();
    const scopedSeller = ['seller','provider'].includes(role(issuer)) ? String(issuer?.id ?? '') : '';
    const found = list.find(doc => String(doc.orderId) === orderKey(order) && doc.type === type && !doc.cancelledAt && String(doc.sellerId || '') === scopedSeller);
    if (found) {
      if (type === 'invoice' && String(found.number || '').startsWith('PROJET-FAC-')) {
        found.number = nextNumber('invoice', list.filter(item => String(item.id) !== String(found.id)));
        found.status = 'Facture';
        found.invoiceDate = found.invoiceDate || new Date().toISOString().slice(0,10);
        saveDocs(list);
      }
      return found;
    }
    const createdAt = new Date().toISOString();
    const initialSnapshot = scopedOrderSnapshot(order, issuer);
    const doc = {id:`doc-${Date.now()}-${Math.random().toString(36).slice(2,8)}`, number:nextNumber(type,list), type, orderId:orderKey(order), ...(scopedSeller ? {sellerId:scopedSeller} : {}), createdAt, createdBy:issuer?.email || issuer?.name || 'E-tokiana', status:type==='invoice'?'Facture':type==='bl'?'Préparé':'Confirmé', snapshot:initialSnapshot, issuer:readIssuer(), ...(type==='invoice' ? {invoiceDraft:{issueDate:new Date().toISOString().slice(0,10),dueDate:'',paymentMethod:initialSnapshot.paymentMethod||'',paymentTerms:'',taxNote:'À vérifier selon le régime fiscal réel de l’entreprise.',notes:initialSnapshot.notes||'',reviewIssuer:false,reviewBuyer:false,reviewAmounts:false,reviewTax:false}} : {})};
    list.push(doc); saveDocs(list);
    try { window.EtoHistoryAudit?.log?.({type:'Document commercial',action:`${docTypes[type].label} créé`,target:`${doc.number} · Commande ${doc.orderId}`,severity:type==='invoice'?'medium':'normal',details:`Document lié à la commande ${doc.orderId}.`}); } catch (_) {}
    return doc;
  };
  const ensurePurchaseOrders = orders => {
    let list = readDocs(); let changed = false;
    orders.forEach(order => {
      if (!list.some(doc => String(doc.orderId) === orderKey(order) && doc.type === 'bc' && !doc.cancelledAt)) {
        const createdAt = new Date().toISOString();
        list.push({id:`doc-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,number:nextNumber('bc',list),type:'bc',orderId:orderKey(order),createdAt,createdBy:'E-tokiana · système',status:'Confirmé',snapshot:snapshotOrder(order),issuer:readIssuer()});
        changed = true;
      }
    });
    if (changed) saveDocs(list);
    return list;
  };
  const visibleOrders = (u, allOrders) => {
    if (!u) return [];
    const r = role(u);
    if (r === 'admin') return allOrders;
    if (r === 'seller' || r === 'provider') return allOrders.filter(order => (order.items || []).some(item => String(item.sellerId ?? '') === String(u.id ?? '')));
    if (r === 'staff') return (staffPermissions(u).includes('orders.read') || staffPermissions(u).includes('orders.manage')) ? allOrders : [];
    if (r === 'client') return allOrders.filter(order => String(order.buyerId || '').trim().toLowerCase() === String(u.email || '').trim().toLowerCase());
    return [];
  };
  const renderKpis = (orders, docs, u) => {
    const r = role(u); const allowed = docs.filter(doc => orders.some(order => orderKey(order) === String(doc.orderId)));
    const types = ['bc','bl','invoice'];
    const countType = type => allowed.filter(doc => doc.type === type && !doc.cancelledAt).length;
    const kpis = [
      ['bi-bag-check','Commandes visibles',orders.length,'Dans votre périmètre'],
      ['bi-cart-check','Bons de commande',countType('bc'),'Confirmations archivées'],
      ['bi-truck','Bons de livraison',countType('bl'),'Documents de livraison'],
      ['bi-receipt-cutoff','Factures',countType('invoice'),'Factures imprimables']
    ];
    const target = $('#commercial-docs-kpis'); if (!target) return;
    target.innerHTML = kpis.map((item,index)=>`<article class="commercial-docs-kpi"><span class="commercial-docs-kpi-icon"><i class="bi ${item[0]}" aria-hidden="true"></i></span><div class="commercial-docs-kpi-copy"><small>${item[1]}</small><strong>${item[2].toLocaleString('fr-FR')}</strong><span>${item[3]}</span></div></article>`).join('');
    const business = $('#commercial-docs-business'); if (business) business.hidden = !(r === 'admin');
    const issuer = readIssuer(); const summary = $('#commercial-docs-issuer-summary');
    if (summary) summary.innerHTML = `<span><strong>Émetteur :</strong> ${esc(issuer.name || 'E-tokiana')}</span><span><strong>Adresse :</strong> ${esc([issuer.address,issuer.city].filter(Boolean).join(', ') || 'À compléter')}</span><span><strong>Contact :</strong> ${esc([issuer.phone,issuer.email].filter(Boolean).join(' · ') || 'À compléter')}</span><span><strong>Identifiant :</strong> ${esc(issuer.registration || 'À renseigner si applicable')}</span><span><strong>NIF :</strong> ${esc(issuer.nif || 'À vérifier')}</span><span><strong>STAT :</strong> ${esc(issuer.stat || 'À vérifier')}</span><span><strong>Régime fiscal :</strong> ${esc(issuer.taxRegime || 'À confirmer')}</span>`;
    const form = $('#commercial-docs-issuer-form');
    if (form && document.activeElement?.form !== form) Object.entries(issuer).forEach(([key,value])=>{if(form.elements.namedItem(key))form.elements.namedItem(key).value=value||'';});
  };
  const sellerScoped = u => ['seller','provider'].includes(role(u));
  const docFor = (docs, order, type, u = userNow()) => {
    const sellerId = ['seller','provider'].includes(role(u)) ? String(u?.id ?? '') : '';
    return docs.find(doc => String(doc.orderId) === orderKey(order) && doc.type === type && !doc.cancelledAt && String(doc.sellerId || '') === sellerId);
  };
  const docCard = (order, docs, u) => {
    const roleName = role(u); const admin = canIssue(u); const ownSeller = sellerScoped(u);
    const docPieces = ['bc','bl','invoice'];
    const body = docPieces.map(type => {
      if (ownSeller && type === 'bc') return '';
      const meta = docTypes[type]; const doc = docFor(docs,order,type,u);
      let actionMarkup = '';
      if (doc) actionMarkup = `<button type="button" class="commercial-docs-action" data-commercial-doc-action="print" data-doc-id="${esc(doc.id)}"><i class="bi bi-printer"></i> Imprimer / PDF</button><span class="commercial-docs-chip"><i class="bi bi-check-circle"></i>${esc(doc.number)}</span>`;
      else if (admin && type === 'bl') actionMarkup = eligibleForDelivery(order) && statusGroup(order)!=='cancelled' ? `<button type="button" class="commercial-docs-action" data-commercial-doc-action="create" data-doc-type="bl" data-order-id="${esc(order.id)}"><i class="bi bi-file-earmark-plus"></i> Créer le BL</button>` : `<span class="commercial-docs-missing">Disponible après le passage en préparation.</span>`;
      else if ((admin || ownSeller) && type === 'invoice') actionMarkup = statusGroup(order)==='cancelled' ? `<span class="commercial-docs-missing">Commande annulée · facture non créée.</span>` : `<button type="button" class="commercial-docs-action" data-commercial-doc-action="create" data-doc-type="invoice" data-order-id="${esc(order.id)}"><i class="bi bi-file-earmark-plus"></i> Créer ma facture</button>`;
      else if (type==='bc' && admin) actionMarkup = `<button type="button" class="commercial-docs-action" data-commercial-doc-action="create" data-doc-type="bc" data-order-id="${esc(order.id)}"><i class="bi bi-file-earmark-plus"></i> Créer le bon</button>`;
      else actionMarkup = `<span class="commercial-docs-missing">${type==='bl'?'Pas encore disponible.':'En attente de préparation par l’administration.'}</span>`;
      const docText = doc ? `${esc(doc.status || 'Enregistré')}` : meta.explain;
      return `<article class="commercial-docs-type-card"><div class="commercial-docs-type-head"><span class="commercial-docs-type-icon"><i class="bi ${meta.icon}" aria-hidden="true"></i></span><div><strong>${meta.label}</strong><small>${docText}</small></div></div><div class="commercial-docs-type-actions">${actionMarkup}</div></article>`;
    }).join('');
    const buyerLine = ownSeller ? `${(order.items||[]).filter(item=>String(item.sellerId??'')===String(u.id??'')).length} ligne(s) liée(s) à votre boutique` : `${itemCount(order)} article(s) · ${esc(order.buyerId && order.buyerId!=='guest' ? order.buyerId : 'Client invité')}`;
    const rowDate = dateLabel(order.date);
    const total = ownSeller ? money((order.items||[]).filter(item=>String(item.sellerId??'')===String(u.id??'')).reduce((sum,item)=>sum+itemUnit(item)*(Number(item.quantity)||0),0)) : money(orderTotal(order));
    return `<article class="commercial-docs-order-card" data-doc-order-card data-order-search="${esc(`${order.id} ${order.buyerName||''} ${order.buyerId||''} ${(order.items||[]).map(i=>i.name).join(' ')}`.toLowerCase())}" data-order-status-group="${statusGroup(order)}" data-doc-types="${docPieces.filter(t=>docFor(docs,order,t)).join(' ')}"><div class="commercial-docs-order-top"><div class="commercial-docs-order-identity"><span class="commercial-docs-order-icon"><i class="bi bi-receipt-cutoff"></i></span><div><strong>Commande #${esc(order.id)}</strong><small>${esc(rowDate)} · ${esc(order.buyerName || (ownSeller ? 'Commande vendeur' : 'Client invité'))}<br>${buyerLine}</small></div></div><div class="commercial-docs-order-total"><strong>${total}</strong><span>${esc(orderStatus(order))}</span></div></div><div class="commercial-docs-type-grid">${body || '<p class="commercial-docs-missing">Aucun document disponible.</p>'}</div></article>`;
  };
  const renderList = () => {
    const box = $('#commercial-docs-order-list'); if (!box) return;
    const user = userNow(); const all = readOrders();
    let docs = ensurePurchaseOrders(all);
    const orders = visibleOrders(user,all).slice().sort((a,b)=>new Date(b.date||0)-new Date(a.date||0));
    const search = normalize($('#commercial-docs-search')?.value || '');
    const type = $('#commercial-docs-type')?.value || 'all';
    const status = $('#commercial-docs-status')?.value || 'all';
    const isSeller = sellerScoped(user);
    const shown = orders.filter(order => {
      const text = normalize(`${order.id||''} ${order.buyerName||''} ${order.buyerId||''} ${(order.items||[]).map(item=>item.name).join(' ')}`);
      if (search && !text.includes(search)) return false;
      if (status !== 'all' && statusGroup(order) !== status) return false;
      if (type === 'missing') return !docFor(docs,order,'bl',user) || !docFor(docs,order,'invoice',user);
      if (['bc','bl','invoice'].includes(type)) {
        if (isSeller && type==='bc') return false;
        const doc = docFor(docs,order,type,user);
        if (doc) return true;
        return canIssue(user) && (type==='bc' || (type==='bl'&&eligibleForDelivery(order)&&statusGroup(order)!=='cancelled') || (type==='invoice'&&statusGroup(order)!=='cancelled'&&(isAdmin(user)||ownsOrder(user,order))));
      }
      return true;
    });
    $('#commercial-docs-result-count') && ($('#commercial-docs-result-count').textContent = `${shown.length.toLocaleString('fr-FR')} commande(s)`);
    $('#commercial-docs-result-hint') && ($('#commercial-docs-result-hint').textContent = isAdminFor(user) ? 'Périmètre global · préparation gratuite des brouillons, sans émission fiscale officielle.' : isSeller ? 'Commandes liées à votre boutique · facturation gérée par l’administration.' : role(user)==='client' ? 'Uniquement les commandes associées à votre compte.' : 'Commandes visibles selon les autorisations attribuées.');
    box.innerHTML = shown.map(order=>docCard(order,docs,user)).join('');
    $('#commercial-docs-empty') && ($('#commercial-docs-empty').hidden = shown.length > 0);
    renderKpis(orders,docs,user);
    const typeSelect=$('#commercial-docs-type'); if(typeSelect) { const invoiceOption=typeSelect.querySelector('option[value="invoice"]'); if(invoiceOption) invoiceOption.hidden=false; }
  };
  const isAdminFor = u => isAdmin(u);
  const invoiceDateNow = () => new Date().toISOString().slice(0,10);
  const invoiceModalCSS = `
  #etokiana-invoice-draft-overlay{position:fixed;inset:0;z-index:1000900;display:flex;align-items:center;justify-content:center;padding:22px;background:rgba(14,28,18,.68);backdrop-filter:blur(7px);overflow:auto}
  #etokiana-invoice-draft-overlay[hidden]{display:none!important}
  #etokiana-invoice-draft-overlay .eid-dialog{width:min(900px,100%);max-height:min(92vh,920px);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(255,255,255,.72);border-radius:22px;background:#fbfcf8;box-shadow:0 30px 100px rgba(0,0,0,.34);color:#293b2e;font:13px/1.5 Inter,system-ui,-apple-system,Segoe UI,sans-serif}
  #etokiana-invoice-draft-overlay .eid-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:23px 26px;background:linear-gradient(125deg,#183e29,#315f3b);color:#fff}
  #etokiana-invoice-draft-overlay .eid-kicker{display:inline-flex;gap:7px;align-items:center;color:#e7d7ad;font-size:10px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}
  #etokiana-invoice-draft-overlay .eid-head h2{margin:7px 0 4px;font-size:24px;font-weight:900;letter-spacing:-.045em;line-height:1.2}
  #etokiana-invoice-draft-overlay .eid-head p{margin:0;max-width:630px;color:rgba(255,255,255,.75);font-size:11px;line-height:1.7}
  #etokiana-invoice-draft-overlay .eid-close{flex:0 0 38px;width:38px;height:38px;border:1px solid rgba(255,255,255,.26);border-radius:12px;background:rgba(255,255,255,.1);color:#fff;font-size:18px;cursor:pointer}
  #etokiana-invoice-draft-overlay .eid-body{padding:22px 26px;overflow:auto}
  #etokiana-invoice-draft-overlay .eid-notice{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border:1px solid #eadab1;border-radius:13px;background:#fff8e9;color:#735d31;font-size:11px;line-height:1.65}
  #etokiana-invoice-draft-overlay .eid-notice i{font-size:17px;margin-top:1px}
  #etokiana-invoice-draft-overlay .eid-order-summary{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;margin-top:13px;padding:13px 15px;border:1px solid #e1e7dc;border-radius:13px;background:#fff}
  #etokiana-invoice-draft-overlay .eid-order-summary strong{display:block;color:#304b35;font-size:12px}
  #etokiana-invoice-draft-overlay .eid-order-summary small{display:block;margin-top:4px;color:#838c7e;font-size:10px;line-height:1.5}
  #etokiana-invoice-draft-overlay .eid-order-total{font-size:16px;font-weight:900;color:#2e6540;white-space:nowrap}
  #etokiana-invoice-draft-overlay .eid-reference{margin-top:7px;color:#e9d9b0;font-size:10px;font-weight:800}
  #etokiana-invoice-draft-overlay .eid-section{margin-top:20px}
  #etokiana-invoice-draft-overlay .eid-section-title{display:flex;align-items:center;gap:9px;margin:0 0 12px;font-size:13px;font-weight:900;color:#2e4a34}
  #etokiana-invoice-draft-overlay .eid-section-title span{display:grid;place-items:center;width:27px;height:27px;border:1px solid #dce6d7;border-radius:9px;background:#eff5eb;color:#386044}
  #etokiana-invoice-draft-overlay .eid-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}
  #etokiana-invoice-draft-overlay .eid-field{display:flex;flex-direction:column;gap:6px;min-width:0;color:#626f62;font-size:10px;font-weight:800}
  #etokiana-invoice-draft-overlay .eid-field.full{grid-column:1/-1}
  #etokiana-invoice-draft-overlay .eid-field input,#etokiana-invoice-draft-overlay .eid-field select,#etokiana-invoice-draft-overlay .eid-field textarea{width:100%;min-height:42px;border:1px solid #dce2d7;border-radius:10px;background:#fff;padding:10px 12px;color:#2c3c2e;font:500 12px/1.4 Inter,system-ui,sans-serif;outline:none}
  #etokiana-invoice-draft-overlay .eid-field textarea{min-height:70px;resize:vertical}
  #etokiana-invoice-draft-overlay .eid-field input:focus,#etokiana-invoice-draft-overlay .eid-field select:focus,#etokiana-invoice-draft-overlay .eid-field textarea:focus{border-color:#477a50;box-shadow:0 0 0 3px rgba(71,122,80,.12)}
  #etokiana-invoice-draft-overlay .eid-checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  #etokiana-invoice-draft-overlay .eid-check{display:flex;align-items:flex-start;gap:9px;padding:12px;border:1px solid #e1e6dc;border-radius:12px;background:#fff;color:#536153;font-size:10px;line-height:1.5;cursor:pointer}
  #etokiana-invoice-draft-overlay .eid-check input{width:16px;height:16px;margin:1px 0 0;accent-color:#2e6640;flex:0 0 16px}
  #etokiana-invoice-draft-overlay .eid-status{display:flex;gap:8px;align-items:flex-start;margin-top:14px;padding:11px 13px;border-radius:11px;background:#eff4ec;color:#466047;font-size:11px}
  #etokiana-invoice-draft-overlay .eid-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:15px 26px;border-top:1px solid #e7e9df;background:#fff}
  #etokiana-invoice-draft-overlay .eid-foot-note{max-width:310px;color:#90988c;font-size:9px;line-height:1.6}
  #etokiana-invoice-draft-overlay .eid-actions{display:flex;gap:8px;flex-wrap:wrap}
  #etokiana-invoice-draft-overlay .eid-btn{display:inline-flex;justify-content:center;align-items:center;gap:7px;min-height:41px;padding:0 14px;border:1px solid #dce3d8;border-radius:11px;background:#fff;color:#405343;font:800 11px/1 Inter,system-ui,sans-serif;cursor:pointer}
  #etokiana-invoice-draft-overlay .eid-btn.primary{border-color:#245332;background:#245332;color:#fff;box-shadow:0 7px 14px rgba(36,83,50,.15)}
  #etokiana-invoice-draft-overlay .eid-btn:disabled{opacity:.45;cursor:not-allowed}
  @media(max-width:650px){#etokiana-invoice-draft-overlay{padding:8px;align-items:flex-start}#etokiana-invoice-draft-overlay .eid-dialog{max-height:calc(100dvh - 16px);border-radius:17px}#etokiana-invoice-draft-overlay .eid-head{padding:18px}#etokiana-invoice-draft-overlay .eid-head h2{font-size:20px}#etokiana-invoice-draft-overlay .eid-body{padding:16px}#etokiana-invoice-draft-overlay .eid-grid,#etokiana-invoice-draft-overlay .eid-checks{grid-template-columns:1fr}#etokiana-invoice-draft-overlay .eid-field.full{grid-column:auto}#etokiana-invoice-draft-overlay .eid-foot{padding:13px 16px;align-items:stretch}#etokiana-invoice-draft-overlay .eid-foot-note{max-width:none}#etokiana-invoice-draft-overlay .eid-actions{display:grid;grid-template-columns:1fr;width:100%}}
  `;
  const ensureInvoiceModal = () => {
    let overlay=$('#etokiana-invoice-draft-overlay'); if(overlay) return overlay;
    const style=document.createElement('style'); style.id='etokiana-invoice-draft-style'; style.textContent=invoiceModalCSS; document.head.appendChild(style);
    overlay=document.createElement('div'); overlay.id='etokiana-invoice-draft-overlay'; overlay.hidden=true; overlay.innerHTML=`<section class="eid-dialog" role="dialog" aria-modal="true" aria-labelledby="eid-title"><header class="eid-head"><div><span class="eid-kicker"><i class="bi bi-receipt-cutoff"></i> FACTURATION GRATUITE · E-TOKIANA</span><h2 id="eid-title">Préparer le projet de facture</h2><div class="eid-reference" id="eid-reference"></div><p>Complétez les données disponibles, contrôlez les montants et enregistrez un brouillon local. Aucune émission fiscale officielle n’est faite dans cette version.</p></div><button type="button" class="eid-close" data-invoice-close aria-label="Fermer">×</button></header><form id="eid-invoice-form"><div class="eid-body"><div class="eid-notice"><i class="bi bi-info-circle-fill"></i><div><strong>Brouillon uniquement, sans frais.</strong><br>Vous pouvez compléter les informations, enregistrer le projet et l’imprimer ou l’enregistrer en PDF. Le document restera marqué « PROJET DE FACTURE — NON OFFICIEL ».</div></div><div class="eid-order-summary" id="eid-order-summary"></div><section class="eid-section"><h3 class="eid-section-title"><span><i class="bi bi-person-vcard"></i></span> Coordonnées du client</h3><div class="eid-grid"><label class="eid-field">Nom / raison sociale du client<input name="buyerName" maxlength="160" placeholder="Nom complet ou entreprise"></label><label class="eid-field">E-mail<input name="buyerEmail" type="email" maxlength="160" placeholder="client@exemple.mg"></label><label class="eid-field">Téléphone<input name="buyerPhone" maxlength="60" placeholder="Téléphone du client"></label><label class="eid-field">Adresse de facturation<input name="buyerAddress" maxlength="240" placeholder="Adresse, ville, code postal"></label></div></section><section class="eid-section"><h3 class="eid-section-title"><span><i class="bi bi-calendar2-check"></i></span> Date et règlement</h3><div class="eid-grid"><label class="eid-field">Date du projet<input name="issueDate" type="date"></label><label class="eid-field">Échéance (facultative)<input name="dueDate" type="date"></label><label class="eid-field">Mode de paiement prévu<select name="paymentMethod"><option value="">À préciser</option><option>Espèces</option><option>Mobile Money</option><option>Virement bancaire</option><option>Carte bancaire</option><option>À convenir</option></select></label><label class="eid-field">Conditions de paiement<input name="paymentTerms" maxlength="180" placeholder="Ex. paiement à la réception"></label></div></section><section class="eid-section"><h3 class="eid-section-title"><span><i class="bi bi-clipboard2-check"></i></span> Contrôle avant aperçu</h3><div class="eid-checks"><label class="eid-check"><input type="checkbox" name="reviewIssuer"><span>J’ai vérifié l’identité commerciale et les coordonnées de l’émetteur.</span></label><label class="eid-check"><input type="checkbox" name="reviewBuyer"><span>J’ai vérifié l’identité et l’adresse du client.</span></label><label class="eid-check"><input type="checkbox" name="reviewAmounts"><span>J’ai vérifié les articles, quantités, prix et livraison.</span></label><label class="eid-check"><input type="checkbox" name="reviewTax"><span>J’ai vérifié le régime fiscal et les mentions applicables.</span></label></div><div class="eid-grid" style="margin-top:11px"><label class="eid-field full">Note fiscale / taxes (à renseigner selon votre situation)<textarea name="taxNote" maxlength="500" placeholder="Ex. régime fiscal et traitement des taxes vérifiés par l’émetteur. Ne saisissez que des informations confirmées."></textarea></label><label class="eid-field full">Note ou conditions complémentaires<textarea name="notes" maxlength="500" placeholder="Référence interne, conditions commerciales, etc."></textarea></label></div><div class="eid-status" id="eid-invoice-status" role="status" aria-live="polite"><i class="bi bi-shield-check"></i><span>Ce document reste un projet, même après contrôle.</span></div></section></div><footer class="eid-foot"><div class="eid-foot-note">Stockage gratuit dans ce navigateur (localStorage). Exportez régulièrement vos documents : ils ne sont pas encore synchronisés entre appareils.</div><div class="eid-actions"><button type="button" class="eid-btn" data-invoice-close>Fermer</button><button type="submit" class="eid-btn"><i class="bi bi-save2"></i> Enregistrer le brouillon</button><button type="button" class="eid-btn primary" data-invoice-preview><i class="bi bi-printer"></i> Enregistrer et aperçu PDF</button></div></footer></form></section>`;
    document.body.appendChild(overlay); return overlay;
  };
  const openInvoiceEditor = doc => {
    const u=userNow(); const order=readOrders().find(item=>String(item.id)===String(doc?.orderId)); if(!canIssue(u)||!order||!ownsOrder(u,order)||(['seller','provider'].includes(role(u)) && String(doc.sellerId||'')!==String(u.id??''))){window.alert('Seul le vendeur/propriétaire concerné ou l’administration peut modifier ce projet de facture.');return;}
    const overlay=ensureInvoiceModal(), form=$('#eid-invoice-form',overlay);
    const stored=doc.invoiceDraft||{}; const snap=doc.snapshot||{};
    const vals={buyerName:snap.buyerName||'',buyerEmail:snap.buyerEmail||'',buyerPhone:snap.buyerPhone||'',buyerAddress:snap.buyerAddress||'',issueDate:stored.issueDate||invoiceDateNow(),dueDate:stored.dueDate||'',paymentMethod:stored.paymentMethod||snap.paymentMethod||'',paymentTerms:stored.paymentTerms||'',taxNote:stored.taxNote||'',notes:stored.notes||snap.notes||'',reviewIssuer:!!stored.reviewIssuer,reviewBuyer:!!stored.reviewBuyer,reviewAmounts:!!stored.reviewAmounts,reviewTax:!!stored.reviewTax};
    Object.entries(vals).forEach(([key,value])=>{const field=form.elements.namedItem(key);if(field){if(field.type==='checkbox')field.checked=value;else field.value=value;}});
    overlay.dataset.docId=String(doc.id); overlay.hidden=false; document.body.style.overflow='hidden';
    const reference=$('#eid-reference',overlay);if(reference)reference.textContent=`Référence de brouillon : ${doc.number||'PROJET-FAC'} · Commande #${doc.orderId}`;
    const orderSummary=$('#eid-order-summary',overlay);if(orderSummary){const count=itemCount({items:snap.items||[]});orderSummary.innerHTML=`<div><strong>Commande #${esc(doc.orderId)} · ${count} article(s)</strong><small>${(snap.items||[]).slice(0,3).map(item=>`${esc(item.name||'Article')} × ${Number(item.quantity)||0}`).join(' · ')}${(snap.items||[]).length>3?' · …':''}</small></div><div class="eid-order-total">${money(snap.total||0)}</div>`;}
    const body=$('.eid-body',overlay);if(body)body.scrollTop=0;
    const status=$('#eid-invoice-status',overlay); if(status)status.innerHTML='<i class="bi bi-shield-check"></i><span>État : brouillon à compléter. L’aperçu restera marqué comme non officiel.</span>';
    form.querySelector('[name="buyerName"]')?.focus();
  };
  const closeInvoiceEditor = () => {const overlay=$('#etokiana-invoice-draft-overlay');if(overlay){overlay.hidden=true;document.body.style.overflow='';}};
  const saveInvoiceDraft = (preview=false) => {
    const overlay=$('#etokiana-invoice-draft-overlay'), form=$('#eid-invoice-form',overlay); if(!overlay||!form)return null;
    const u=userNow();if(!canIssue(u)){window.alert('Votre rôle ne permet pas de modifier un projet de facture.');return null;}
    const docs=readDocs(),doc=docs.find(item=>String(item.id)===String(overlay.dataset.docId));const relatedOrder=doc&&readOrders().find(item=>String(item.id)===String(doc.orderId));if(!doc||doc.type!=='invoice'||!relatedOrder||!ownsOrder(u,relatedOrder)||(['seller','provider'].includes(role(u))&&String(doc.sellerId||'')!==String(u.id??''))){window.alert('Projet de facture introuvable. Actualisez la liste.');closeInvoiceEditor();return null;}
    const data=Object.fromEntries(new FormData(form).entries()); const checked=key=>form.elements.namedItem(key)?.checked===true;
    if(!String(doc.number||'').startsWith('PROJET-FAC-'))doc.number=nextNumber('invoice',docs.filter(item=>String(item.id)!==String(doc.id)));
    doc.snapshot={...(doc.snapshot||{}),buyerName:String(data.buyerName||'').trim(),buyerEmail:String(data.buyerEmail||'').trim(),buyerPhone:String(data.buyerPhone||'').trim(),buyerAddress:String(data.buyerAddress||'').trim(),paymentMethod:String(data.paymentMethod||'').trim(),notes:String(data.notes||'').trim()};
    doc.invoiceDraft={issueDate:String(data.issueDate||''),dueDate:String(data.dueDate||''),paymentMethod:String(data.paymentMethod||'').trim(),paymentTerms:String(data.paymentTerms||'').trim(),taxNote:String(data.taxNote||'').trim(),notes:String(data.notes||'').trim(),reviewIssuer:checked('reviewIssuer'),reviewBuyer:checked('reviewBuyer'),reviewAmounts:checked('reviewAmounts'),reviewTax:checked('reviewTax')};
    const issuer=readIssuer(); doc.issuer=issuer; const amountValid=Array.isArray(doc.snapshot.items)&&doc.snapshot.items.length>0&&doc.snapshot.items.some(item=>(Number(item.quantity)||0)>0&&(Number(item.unitPrice)||0)>=0)&&(Number(doc.snapshot.total)||0)>0;
    const profileValid=!!String(doc.snapshot.buyerName||'').trim()&&!!String(issuer.name||'').trim()&&!!String(issuer.address||'').trim();
    const reviewed=doc.invoiceDraft.reviewIssuer&&doc.invoiceDraft.reviewBuyer&&doc.invoiceDraft.reviewAmounts&&doc.invoiceDraft.reviewTax&&profileValid&&amountValid;
    doc.status=reviewed?'Projet relu · non officiel':'Brouillon à compléter';doc.updatedAt=new Date().toISOString();doc.updatedBy=u?.email||u?.name||'Utilisateur autorisé';
    saveDocs(docs);renderList();
    const status=$('#eid-invoice-status',overlay);if(status)status.innerHTML=reviewed?'<i class="bi bi-check-circle-fill"></i><span><strong>Contrôles cochés.</strong> Le document reste un projet non officiel ; aucune émission réglementaire n’a été réalisée.</span>':'<i class="bi bi-exclamation-circle-fill"></i><span><strong>Brouillon enregistré.</strong> Vérifiez les coordonnées, les montants et les mentions applicables. Le document reste non officiel.</span>';
    if(preview){closeInvoiceEditor();openDocument(doc,u);}
    return doc;
  };
  const createDocFromOrder = (orderId,type) => {
    const u=userNow(); if(!canIssue(u)) { window.alert('Votre rôle ne permet pas de créer un document commercial.'); return null; }
    const order=readOrders().find(item=>String(item.id)===String(orderId)); if(!order) { window.alert('Commande introuvable. Actualisez la page puis réessayez.'); return null; }
    if(!ownsOrder(u,order)) { window.alert('Vous ne pouvez agir que sur une commande contenant vos propres produits.'); return null; }
    if(type==='bl' && !isAdmin(u)) { window.alert('Le bon de livraison est réservé à l’administration dans cette version.'); return null; }
    if(type==='bl' && (!eligibleForDelivery(order)||statusGroup(order)==='cancelled')) { window.alert('Le bon de livraison peut être créé lorsque la commande est en préparation, expédiée ou livrée.'); return null; }
    if(type==='invoice' && statusGroup(order)==='cancelled') { window.alert('La commande est annulée : aucun projet de facture ne peut être créé.'); return null; }
    const doc=makeDoc(order,type,u); renderList(); if(doc) openDocument(doc,u); return doc;
  };
  const printDate = value => { const d = value ? new Date(value) : new Date(); return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}); };
  const openDocument = (doc, user = userNow()) => {
    if(!doc) return;
    const type=docTypes[doc.type]||docTypes.bc; let snapshot=doc.snapshot||{}; const invoiceDraft=doc.invoiceDraft||{}; const isSeller=sellerScoped(user);
    const liveOrder=readOrders().find(item=>String(item.id)===String(doc.orderId));
    if(doc.type==='invoice' && liveOrder){
      const live=snapshotOrder(liveOrder);
      snapshot={...snapshot,buyerName:live.buyerName,buyerEmail:live.buyerEmail,buyerPhone:live.buyerPhone,buyerAddress:live.buyerAddress};
    }
    const account=user||{}; const issuer=doc.type==='invoice' && isSeller
      ? {name:String(account.businessName||account.storeName||account.name||account.fullName||''),address:String(account.address||''),city:String(account.city||''),phone:String(account.phone||''),email:String(account.email||''),registration:String(account.registration||''),nif:String(account.nif||''),stat:String(account.stat||''),footer:String(account.invoiceFooter||'')}
      : (doc.issuer||readIssuer());
    let items=Array.isArray(snapshot.items)?snapshot.items.slice():[];
    let title=type.label; let number=doc.number; let notice=''; let subtotal=Number(snapshot.subtotal)||0; let shipping=Number(snapshot.shipping)||0; let total=Number(snapshot.total)||subtotal+shipping;
    if(isSeller) {
      const sellerId=String(user?.id??''); items=items.filter(item=>String(item.sellerId??'')===sellerId);
      subtotal=items.reduce((sum,item)=>sum+(Number(item.unitPrice)||0)*(Number(item.quantity)||0),0); shipping=0; total=subtotal;
      title=`Copie interne vendeur · ${type.label}`; number=`${doc.number}-COPIE`;
      notice='<div class="draft-banner">COPIE INTERNE VENDEUR — Extrait de commande, document non contractuel et non destiné à la facturation client.</div>';
    } else if(doc.type==='invoice') { title='Facture'; notice=''; } 
    const lines=items.map((item,index)=>`<tr><td>${index+1}</td><td><strong>${esc(item.name||'Article')}</strong>${item.reference?`<small>Réf. ${esc(item.reference)}</small>`:''}${item.category?`<small>${esc(item.category)}</small>`:''}</td><td class="num">${Number(item.quantity)||0}</td><td class="num">${money(item.unitPrice)}</td><td class="num">${money((Number(item.unitPrice)||0)*(Number(item.quantity)||0))}</td></tr>`).join('');
    const buyerName= snapshot.buyerName || 'Nom client non renseigné'; const itemsFallback = `<tr><td colspan="5" class="no-items">Aucun article détaillé dans cette commande.</td></tr>`;
    const addressParts=[snapshot.buyerAddress].filter(Boolean);
    const buyerBlock=`<strong>${esc(buyerName)}</strong>${snapshot.buyerEmail?`<span>${esc(snapshot.buyerEmail)}</span>`:''}${snapshot.buyerPhone?`<span>${esc(snapshot.buyerPhone)}</span>`:''}${addressParts.length?`<span>${esc(addressParts.join(', '))}</span>`:''}`;
    const issuerAddress=[issuer.address,issuer.city].filter(Boolean).join(', ');
    const issuerBlock=`<strong>${esc(issuer.name||'E-tokiana')}</strong>${issuerAddress?`<span>${esc(issuerAddress)}</span>`:''}${issuer.phone?`<span>${esc(issuer.phone)}</span>`:''}${issuer.email?`<span>${esc(issuer.email)}</span>`:''}${issuer.registration?`<span>Identifiant : ${esc(issuer.registration)}</span>`:''}${issuer.nif?`<span>NIF : ${esc(issuer.nif)}</span>`:''}${issuer.stat?`<span>STAT : ${esc(issuer.stat)}</span>`:''}${issuer.taxRegime?`<span>Régime fiscal : ${esc(issuer.taxRegime)}</span>`:''}`;
    const totals=`<div class="totals"><div><span>Sous-total</span><strong>${money(subtotal)}</strong></div>${shipping?`<div><span>Livraison</span><strong>${money(shipping)}</strong></div>`:''}<div class="grand-total"><span>Total ${doc.type==='invoice'?'à payer':'de la commande'}</span><strong>${money(total)}</strong></div></div>`;
    const deliveryNote=doc.type==='bl'?`<div class="delivery-check"><strong>Contrôle de livraison</strong><span>☐ Articles vérifiés</span><span>☐ Quantités vérifiées</span><span>☐ Réception confirmée</span><div class="signatures"><div>Préparé par : ____________________</div><div>Reçu par : ______________________</div><div>Date : _________________________</div></div></div>`:'';
    const footer=issuer.footer?`<p class="doc-footer-note">${esc(issuer.footer)}</p>`:'';
    const invoiceMeta=doc.type==='invoice'?`<div class="meta"><span><strong>Date de facture :</strong> ${esc(printDate(doc.invoiceDate||doc.createdAt))}</span>${invoiceDraft.paymentMethod||snapshot.paymentMethod?`<span><strong>Mode de paiement :</strong> ${esc(invoiceDraft.paymentMethod||snapshot.paymentMethod)}</span>`:''}${invoiceDraft.paymentTerms?`<span><strong>Conditions :</strong> ${esc(invoiceDraft.paymentTerms)}</span>`:''}</div>${invoiceDraft.notes?`<p class="doc-footer-note"><strong>Note :</strong> ${esc(invoiceDraft.notes)}</p>`:''}`:'';
    const disclaimer=doc.type==='invoice'?'':'<p class="doc-disclaimer">Document généré à partir des données disponibles dans E-tokiana.</p>';
    const w=window.open('','_blank','width=900,height=720'); if(!w){window.alert('Autorisez les fenêtres contextuelles pour imprimer le document.');return;}
    w.document.open(); w.document.write(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(number)} · ${esc(title)}</title><style>
      *{box-sizing:border-box}body{margin:0;background:#eef0eb;color:#28372b;font:13px/1.55 Arial,Helvetica,sans-serif}.toolbar{position:sticky;top:0;display:flex;justify-content:center;gap:8px;padding:12px;background:#193f2b;z-index:10}.toolbar button{border:0;border-radius:6px;padding:10px 14px;background:#fff;color:#224b32;font-weight:700;cursor:pointer}.toolbar button.secondary{background:rgba(255,255,255,.13);color:#fff;border:1px solid rgba(255,255,255,.25)}.page{position:relative;max-width:210mm;min-height:297mm;margin:25px auto;padding:18mm 17mm;background:#fff;box-shadow:0 12px 35px rgba(31,48,33,.12);overflow:hidden}.topline{display:flex;justify-content:space-between;align-items:flex-start;gap:25px;border-bottom:2px solid #285c3a;padding-bottom:20px}.brand{font-size:21px;font-weight:900;letter-spacing:-.04em;color:#244b31}.brand small{display:block;margin-top:5px;color:#8c9487;font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.doctype{text-align:right}.doctype h1{margin:0;color:#2e5739;font-size:24px;letter-spacing:-.04em}.doctype strong{display:block;margin-top:6px;color:#303d31;font-size:12px}.doctype span{display:block;color:#8a8f82;font-size:10px}.draft-banner{margin:18px 0;padding:10px 13px;border:1px solid #e4d7b3;border-radius:4px;background:#fbf5e5;color:#8a6b2f;font-size:10px;font-weight:800;letter-spacing:.025em}.parties{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin:24px 0}.party label{display:block;margin-bottom:8px;color:#9a7a42;font-size:9px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.party strong{display:block;color:#2d3f30;font-size:12px}.party span{display:block;color:#6e786e;font-size:10px;overflow-wrap:anywhere}.meta{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}.meta span{padding:7px 10px;border:1px solid #e6e7df;border-radius:4px;background:#fafbf7;color:#667363;font-size:9px}.meta strong{color:#334a36}.intro{margin:0 0 12px;color:#697568;font-size:11px}table{width:100%;border-collapse:collapse;font-size:10px}thead{background:#234b32;color:white}th{padding:11px 9px;text-align:left;font-size:9px;letter-spacing:.04em}td{padding:12px 9px;border-bottom:1px solid #e9ece5;vertical-align:top}tbody tr:nth-child(even){background:#fbfcf9}td strong{display:block;color:#2e3e30}td small{display:block;color:#94998e;font-size:8px}.num{text-align:right;white-space:nowrap}.totals{width:min(100%,320px);margin:20px 0 10px auto}.totals>div{display:flex;justify-content:space-between;gap:15px;padding:8px 0;border-bottom:1px solid #eceee7;color:#798274;font-size:10px}.totals strong{color:#354a37;white-space:nowrap}.totals .grand-total{border:0;padding-top:13px;color:#304c34;font-size:12px;font-weight:800}.totals .grand-total strong{color:#285a39;font-size:18px}.delivery-check{margin-top:22px;padding:15px;border:1px solid #e3e8dd;border-radius:5px;background:#fbfcf8}.delivery-check>strong{display:block;margin-bottom:10px;color:#354d38;font-size:11px}.delivery-check>span{display:inline-block;margin:0 15px 7px 0;color:#697569;font-size:9px}.signatures{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px;color:#6e786c;font-size:9px}.doc-footer-note{margin-top:20px;color:#4e6951;font-size:10px}.doc-disclaimer{margin-top:27px;padding-top:12px;border-top:1px solid #e8ebe3;color:#96998f;font-size:8px;line-height:1.7}.no-items{text-align:center;color:#91978b;padding:30px}.print-footer{display:flex;justify-content:space-between;gap:15px;margin-top:16px;color:#a0a397;font-size:8px}.watermark{position:absolute;z-index:2;top:44%;left:5%;width:90%;text-align:center;transform:rotate(-24deg);color:rgba(35,75,50,.12);font-size:58px;font-weight:900;letter-spacing:.08em;white-space:nowrap;pointer-events:none;user-select:none;mix-blend-mode:multiply}.page>*:not(.watermark){position:relative;z-index:1}.no-print{display:inline-flex}@page{size:A4;margin:0} @media print{body{background:#fff}.toolbar{display:none!important}.page{max-width:none;min-height:297mm;margin:0;box-shadow:none;padding:18mm 17mm;overflow:visible}.watermark{position:fixed;z-index:5;top:44%;left:5%;width:90%;font-size:58px;color:rgba(35,75,50,.12);mix-blend-mode:multiply;print-color-adjust:exact;-webkit-print-color-adjust:exact}.no-print{display:none!important}}
    </style></head><body><div class="toolbar no-print"><button onclick="window.print()"><span>⎙</span> Imprimer / Enregistrer en PDF</button><button class="secondary" onclick="window.close()">Fermer</button></div><main class="page"><div class="watermark" aria-hidden="true">E-TOKIANA</div><header class="topline"><div class="brand">${esc(issuer.name||'E-tokiana')}<small>Document commercial</small></div><div class="doctype"><h1>${esc(title)}</h1><strong>${esc(number)}</strong><span>Créé le ${esc(printDate(doc.createdAt))}</span></div></header>${notice}<section class="parties"><div class="party"><label>Émetteur</label>${issuerBlock}</div><div class="party"><label>${doc.type==='bl'?'Destinataire / réception':'Client'}</label>${buyerBlock}</div></section><div class="meta"><span><strong>Commande liée :</strong> #${esc(snapshot.orderId||doc.orderId)}</span><span><strong>Date commande :</strong> ${esc(printDate(snapshot.orderDate))}</span><span><strong>État :</strong> ${esc(snapshot.orderStatus||'Enregistrée')}</span></div>${invoiceMeta}<p class="intro">${doc.type==='bl'?'Veuillez vérifier les références et quantités des articles avant la remise au destinataire.':doc.type==='invoice'?'Récapitulatif des articles et montants rattachés à la commande.':'Récapitulatif des articles commandés et des montants enregistrés.'}</p><table><thead><tr><th style="width:6%">N°</th><th>Article / référence</th><th style="width:10%;text-align:right">Qté</th><th style="width:18%;text-align:right">Prix unitaire</th><th style="width:20%;text-align:right">Total ligne</th></tr></thead><tbody>${lines||itemsFallback}</tbody></table>${doc.type==='bl'?'':totals}${deliveryNote}${footer}${disclaimer}<div class="print-footer"><span>${esc(issuer.name||'E-tokiana')} · ${esc(number)}</span><span>Document généré le ${esc(printDate(doc.createdAt))}</span></div></main></body></html>`);
    w.document.close(); w.focus();
  };
  const renderAll = () => { try { renderList(); } catch (error) { console.error('E-tokiana documents:',error); } };
  document.addEventListener('click', event => {
    const nav=event.target.closest('.user-space-nav[data-user-view="documents"]');
    if(nav) window.setTimeout(() => {
      const modal=$('#user-space-modal');
      if(modal && !nav.hidden) {
        modal.querySelectorAll('.user-space-nav[data-user-view]').forEach(button => button.classList.toggle('active', button === nav));
        modal.querySelectorAll('.user-space-view[data-user-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.userPanel === 'documents'));
        renderAll();
      }
    }, 0);
    if(event.target.closest('[data-docs-refresh]')) { renderAll(); return; }
    const toggle=event.target.closest('[data-docs-toggle-issuer]'); if(toggle){const form=$('#commercial-docs-issuer-form');if(form){form.hidden=!form.hidden;toggle.innerHTML=form.hidden?'<i class="bi bi-pencil-square"></i> Modifier les coordonnées':'<i class="bi bi-x-lg"></i> Fermer le formulaire';if(!form.hidden)form.elements.namedItem('name')?.focus();}return;}
    const action=event.target.closest('[data-commercial-doc-action]'); if(!action)return;
    const kind=action.dataset.commercialDocAction;
    if(kind==='create'){createDocFromOrder(action.dataset.orderId,action.dataset.docType);return;}
    
    if(kind==='print'){const docs=readDocs();const doc=docs.find(item=>String(item.id)===String(action.dataset.docId));if(!doc){window.alert('Ce document n’est plus disponible. Actualisez la liste.');renderAll();return;}if(doc.type==='invoice'&&String(doc.number||'').startsWith('PROJET-FAC-')){doc.number=nextNumber('invoice',docs.filter(item=>String(item.id)!==String(doc.id)));doc.status='Facture';doc.invoiceDate=doc.invoiceDate||new Date().toISOString().slice(0,10);saveDocs(docs);}openDocument(doc,userNow());}
  });
  document.addEventListener('input', event => {if(event.target.matches('#commercial-docs-search'))renderAll();});
  document.addEventListener('change', event => {if(event.target.matches('#commercial-docs-type,#commercial-docs-status'))renderAll();});
  document.addEventListener('click', event => {
    if(event.target.closest('[data-invoice-close]')){closeInvoiceEditor();return;}
    if(event.target.closest('[data-invoice-preview]')){saveInvoiceDraft(true);return;}
    if(event.target.id==='etokiana-invoice-draft-overlay'){closeInvoiceEditor();return;}
  });
  document.addEventListener('keydown', event => {if(event.key==='Escape' && !$('#etokiana-invoice-draft-overlay')?.hidden)closeInvoiceEditor();});
  document.addEventListener('submit', event => {
    const invoiceForm=event.target.closest('#eid-invoice-form');if(invoiceForm){event.preventDefault();saveInvoiceDraft(false);return;}
    const form=event.target.closest('#commercial-docs-issuer-form'); if(!form)return; event.preventDefault(); const u=userNow();if(!isAdmin(u)){window.alert('Seul l’administrateur peut modifier l’identité commerciale.');return;}
    const data=Object.fromEntries(new FormData(form).entries()); data.name=String(data.name||'E-tokiana').trim()||'E-tokiana'; Object.keys(data).forEach(key=>data[key]=String(data[key]||'').trim());write('etokiana-doc-issuer',data);const live=$('#commercial-docs-issuer-live');if(live)live.textContent='Coordonnées commerciales enregistrées dans ce navigateur.';renderAll();
  });
  const userModal=$('#user-space-modal');
  if(userModal) new MutationObserver(()=>{if(!userModal.hidden && userModal.classList.contains('open'))renderAll();}).observe(userModal,{attributes:true,attributeFilter:['class','hidden','aria-hidden']});
  window.addEventListener('storage', event => {if(!event.key||['etokiana-orders','etokiana-user','etokiana-users','etokiana-commercial-documents','etokiana-doc-issuer'].includes(event.key))renderAll();});
  window.addEventListener('etokiana-documents-changed',renderAll);window.addEventListener('etokiana-users-changed',renderAll);window.addEventListener('etokiana-orders-changed',renderAll);
  const search=$('#commercial-docs-search'), typeSelect=$('#commercial-docs-type'), statusSelect=$('#commercial-docs-status');
  if(search)search.value=''; if(typeSelect)typeSelect.value='all'; if(statusSelect)statusSelect.value='all';
  // Restore the issuer form in the dedicated admin-only setting card.
  const issuerForm=$('#commercial-docs-issuer-form'); if(issuerForm){const issuer=readIssuer();Object.entries(issuer).forEach(([key,value])=>{if(issuerForm.elements.namedItem(key))issuerForm.elements.namedItem(key).value=value||'';});}
  // Keep the renderer in step with checkout / account-space opening without changing the commerce logic.
  if(typeof window.renderPremiumUserSpace==='function'&&!window.renderPremiumUserSpace.__commercialDocsWrapped){const original=window.renderPremiumUserSpace;const wrapped=function(...args){const result=original.apply(this,args);window.setTimeout(renderAll,25);return result;};wrapped.__commercialDocsWrapped=true;window.renderPremiumUserSpace=wrapped;}
  renderAll();
})();
