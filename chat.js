/* ==========================================================================
   E-tokiana — chat.js  v2   (à charger APRÈS features.js)
   Remplace l'ancien chat.js. Compatible avec chat.css + chat-actions.css.

   Nouveautés v2
   - Pièces jointes : elles sont désormais rattachées au message (champ « att »)
     au lieu d'être cachées dans le texte → plus jamais de « ⟦pj:…⟧ » visible.
     Les anciens messages qui contiennent ce repère sont convertis au chargement.
   - Actions sur un message (bouton « ⋯ ») : Modifier, Transférer, Copier,
     Supprimer. Un message modifié affiche « modifié », un message supprimé
     laisse une trace « Message supprimé », un transfert affiche « Transféré ».
   ========================================================================== */
(() => {
  'use strict';

  const modal = document.querySelector('#chat-modal');
  if (!modal) return;
  modal.classList.add('chat-modal');

  const ATT_KEY = 'etokiana-attachments';
  const MSG_KEY = 'etokiana-messages';
  const MAX_FILES = 4;                 // pièces jointes par message
  const MAX_FILE = 1.5 * 1024 * 1024;  // fichiers non réduits (octets)
  const MAX_STORED = 80;               // pièces conservées au total
  const TOKEN = /\s*⟦pj:([a-z0-9,]+)⟧/;                // ancien format (migration)
  const STRIP = /\s*⟦[^⟧]*(?:⟧|$)/g;
  const LOOKS_LIKE_ID = /a[a-z0-9]{10,13}/;
  const EMOJIS = ['😀', '😂', '😊', '😍', '😉', '😅', '🤔', '😮', '😢', '👍', '👌', '🙏', '👏', '🙌', '🤝', '👋', '❤️', '🔥', '🎉', '⭐', '✅', '📦', '🚚', '💳'];

  let pending = [];
  let sending = null;
  let strip = null;
  let emojiPanel = null;
  let jumpButton = null;
  let requiredBefore = false;

  const h = (tag, cls, html) => {
    const element = document.createElement(tag);
    if (cls) element.className = cls;
    if (html !== undefined) element.innerHTML = html;
    return element;
  };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const toast = message => { if (typeof showToast === 'function') showToast(message); };
  const fmtSize = n => n < 1024 ? `${n} o` : n < 1048576 ? `${Math.round(n / 1024)} Ko` : `${(n / 1048576).toFixed(1)} Mo`;
  const decode = html => { const box = document.createElement('textarea'); box.innerHTML = html; return box.value; };
  const roleLabel = role => ({ owner: 'Admin', admin: 'Admin', seller: 'Vendeur' }[role] || 'Client');
  const roleClass = role => ['owner', 'admin'].includes(role) ? 'owner' : role === 'seller' ? 'seller' : 'client';
  const initialsOf = name => {
    const parts = String(name || 'U').trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? parts[0][0] + parts.at(-1)[0] : (parts[0] || 'U').slice(0, 2)).toLocaleUpperCase('fr-FR');
  };

  // Lecture du stockage avec cache (évite de relire plusieurs Mo à chaque mise à jour)
  let attRaw = null;
  let attCache = {};
  const readAtt = () => {
    const raw = localStorage.getItem(ATT_KEY) || '{}';
    if (raw !== attRaw) {
      attRaw = raw;
      try { attCache = JSON.parse(raw) || {}; } catch { attCache = {}; }
    }
    return attCache;
  };
  const saveMessages = () => localStorage.setItem(MSG_KEY, JSON.stringify(messages));

  const isImage = a => String(a.type).startsWith('image/');
  const iconFor = a => {
    const name = String(a.name).toLowerCase();
    if (isImage(a)) return 'bi-file-earmark-image';
    if (/\.pdf$/.test(name)) return 'bi-file-earmark-pdf';
    if (/\.(docx?|txt)$/.test(name)) return 'bi-file-earmark-text';
    if (/\.xlsx?$/.test(name)) return 'bi-file-earmark-spreadsheet';
    if (/\.zip$/.test(name)) return 'bi-file-earmark-zip';
    return 'bi-file-earmark';
  };
  const labelFor = list => !list.length ? '📎 Pièce jointe' : list.length > 1 ? `📎 ${list.length} pièces jointes` : isImage(list[0]) ? '📎 Photo' : '📎 Fichier';
  const labelForIds = ids => labelFor(ids.map(id => readAtt()[id]).filter(Boolean));
  const isAutoLabel = text => !text || text.trim().startsWith('📎');

  /* ---------------------------------------------------------------- */
  /* Nettoyage des textes (anciens repères, identifiant seul)           */
  /* ---------------------------------------------------------------- */
  const knownIds = text => LOOKS_LIKE_ID.test(text) ? Object.keys(readAtt()).filter(id => text.includes(id)) : [];
  const tidy = (text, ids) => {
    let result = text.replace(TOKEN, '').replace(STRIP, '');
    ids.forEach(id => { result = result.split(id).join(''); });
    if (ids.length) result = result.replace(/pj:?/g, '').replace(/[⟦⟧]/g, '');
    return result.trim();
  };
  const cleanPreview = text => {
    if (!text.includes('⟦') && !LOOKS_LIKE_ID.test(text)) return text;
    const ids = knownIds(text);
    const result = tidy(text, ids);
    return result || (ids.length ? '📎 Pièce jointe' : text);
  };

  // Les toasts d'app.js ne doivent jamais afficher de repère technique
  if (typeof window.showToast === 'function' && !window.showToast.__clean) {
    const original = window.showToast;
    const wrapped = (message, ...rest) => original(typeof message === 'string' ? cleanPreview(message) : message, ...rest);
    wrapped.__clean = true;
    window.showToast = wrapped;
  }

  // Migration : anciens messages / notifications contenant « ⟦pj:…⟧ »
  function migrateLegacy() {
    let changedMessages = false;
    if (typeof messages !== 'undefined') {
      messages.forEach(m => {
        const match = String(m.text || '').match(TOKEN);
        if (!match) return;
        m.att = match[1].split(',');
        m.text = tidy(m.text, m.att) || labelForIds(m.att);
        changedMessages = true;
      });
      if (changedMessages) saveMessages();
    }
    if (typeof notifications !== 'undefined') {
      let changed = false;
      notifications.forEach(n => {
        if (String(n.message || '').includes('⟦')) { n.message = tidy(n.message, []); changed = true; }
      });
      if (changed) localStorage.setItem('etokiana-notifications', JSON.stringify(notifications));
    }
  }
  migrateLegacy();

  const messageOf = bubble => (typeof messages !== 'undefined' ? messages.find(m => String(m.id) === bubble.dataset.messageId) : null) || null;

  function rerender(keepScroll = true) {
    const thread = modal.querySelector('#chat-thread');
    const top = thread ? thread.scrollTop : 0;
    renderChatThread();
    if (keepScroll && thread) requestAnimationFrame(() => { thread.scrollTop = top; updateJump(); });
  }

  /* ---------------------------------------------------------------- */
  /* Préparation des fichiers                                          */
  /* ---------------------------------------------------------------- */
  const readDataURL = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const shrinkImage = file => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, 1280 / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', .8));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('image')); };
    img.src = url;
  });

  async function prepare(file) {
    const id = ('a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)).slice(0, 13);
    let type = file.type || 'application/octet-stream';
    let data = null;
    if (/^image\/(jpeg|png|webp)$/.test(type)) {
      try { data = await shrinkImage(file); type = 'image/jpeg'; } catch { data = null; }   // photos réduites : stockage limité
    }
    if (!data) {
      if (file.size > MAX_FILE) throw new Error('size');
      data = await readDataURL(file);
    }
    return { id, name: file.name || 'photo.jpg', type, size: Math.round(data.length * .75), data };
  }

  async function addFiles(list) {
    for (const file of [...list]) {
      if (pending.length >= MAX_FILES) { toast(`Maximum ${MAX_FILES} pièces jointes par message.`); break; }
      try { pending.push(await prepare(file)); }
      catch (error) { toast(error.message === 'size' ? `${file.name} dépasse 1,5 Mo.` : `Impossible de joindre ${file.name}.`); }
    }
    renderPending();
  }

  /* ---------------------------------------------------------------- */
  /* Pièces jointes en attente + état du bouton d'envoi                  */
  /* ---------------------------------------------------------------- */
  function updateSend() {
    const form = modal.querySelector('#chat-form');
    const input = modal.querySelector('#chat-message');
    if (form && input) form.dataset.empty = String(!input.value.trim() && !pending.length);
  }

  function renderPending() {
    if (!strip) return;
    strip.hidden = pending.length === 0;
    strip.replaceChildren(...pending.map((a, index) => {
      const chip = h('div', 'pending-chip');
      const thumb = h('span', 'pending-thumb');
      if (isImage(a)) { const img = new Image(); img.src = a.data; img.alt = ''; thumb.append(img); }
      else thumb.innerHTML = `<i class="bi ${iconFor(a)}" aria-hidden="true"></i>`;
      const meta = h('span', 'pending-meta');
      const name = h('strong'); name.textContent = isImage(a) ? 'Photo' : a.name;
      const size = h('small'); size.textContent = fmtSize(a.size);
      meta.append(name, size);
      const remove = h('button', 'pending-remove', '<i class="bi bi-x-lg" aria-hidden="true"></i>');
      remove.type = 'button';
      remove.setAttribute('aria-label', 'Retirer cette pièce jointe');
      remove.addEventListener('click', () => { pending.splice(index, 1); renderPending(); });
      chip.append(thumb, meta, remove);
      return chip;
    }));
    // Un message composé uniquement de pièces jointes ne doit pas être bloqué par « required »
    const input = modal.querySelector('#chat-message');
    if (input) input.required = pending.length ? false : requiredBefore;
    updateSend();
  }

  /* ---------------------------------------------------------------- */
  /* Envoi : les écouteurs sont posés sur la fenêtre (ancêtre du formulaire),
     donc toujours exécutés AVANT (capture) et APRÈS (bulle) app.js.        */
  /* ---------------------------------------------------------------- */
  modal.addEventListener('submit', event => {
    if (event.target.id !== 'chat-form') return;
    sending = null;
    if (!pending.length) return;
    const input = modal.querySelector('#chat-message');
    const store = { ...readAtt() };
    pending.forEach(a => { store[a.id] = a; });
    const keys = Object.keys(store);
    if (keys.length > MAX_STORED) keys.slice(0, keys.length - MAX_STORED).forEach(key => delete store[key]);
    try { localStorage.setItem(ATT_KEY, JSON.stringify(store)); }
    catch {
      event.preventDefault();
      event.stopPropagation();
      toast('Espace de stockage plein : retirez une pièce jointe ou choisissez une image plus légère.');
      return;
    }
    sending = { items: pending.slice(), ids: pending.map(a => a.id), before: messages.length, original: input.value };
    input.value = input.value.trim() || labelFor(sending.items);   // app.js refuse un texte vide
    pending = [];
    renderPending();
  }, true);

  modal.addEventListener('submit', event => {
    if (event.target.id !== 'chat-form' || !sending) return;
    const job = sending;
    sending = null;
    const last = messages.at(-1);
    if (messages.length > job.before && last?.from === currentUser?.email) {
      last.att = job.ids;                      // la pièce jointe fait partie du message
      saveMessages();
      renderChatThread();
    } else {                                   // l'envoi n'a pas eu lieu : on restitue tout
      pending = job.items;
      modal.querySelector('#chat-message').value = job.original;
      renderPending();
    }
  });

  /* ---------------------------------------------------------------- */
  /* Barre de saisie : trombone, émojis, zone de dépôt, retour en bas    */
  /* ---------------------------------------------------------------- */
  function ensureTools() {
    const form = modal.querySelector('.msgr-conv #chat-form');
    if (!form || form.dataset.pjTools) return;
    form.dataset.pjTools = '1';
    const input = form.querySelector('#chat-message');
    requiredBefore = input.required;

    const attach = h('button', 'chat-tool', '<i class="bi bi-paperclip" aria-hidden="true"></i>');
    attach.type = 'button';
    attach.title = 'Joindre une photo ou un fichier';
    attach.setAttribute('aria-label', 'Joindre une photo ou un fichier');
    const emojiButton = h('button', 'chat-tool', '<i class="bi bi-emoji-smile" aria-hidden="true"></i>');
    emojiButton.type = 'button';
    emojiButton.id = 'chat-emoji-btn';
    emojiButton.title = 'Émojis';
    emojiButton.setAttribute('aria-label', 'Insérer un émoji');
    emojiButton.setAttribute('aria-expanded', 'false');
    const fileInput = h('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.hidden = true;
    fileInput.accept = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip';
    form.prepend(attach, emojiButton);
    form.append(fileInput);

    strip = h('div', 'chat-pending');
    strip.hidden = true;
    form.before(strip);

    const conversation = form.closest('.msgr-conv');
    emojiPanel = h('div', 'chat-emoji');
    emojiPanel.hidden = true;
    EMOJIS.forEach(emoji => {
      const button = h('button');
      button.type = 'button';
      button.textContent = emoji;
      button.setAttribute('aria-label', emoji);
      emojiPanel.append(button);
    });
    conversation.append(emojiPanel);

    jumpButton = h('button', 'chat-jump', '<i class="bi bi-arrow-down" aria-hidden="true"></i>');
    jumpButton.type = 'button';
    jumpButton.hidden = true;
    jumpButton.title = 'Aller au dernier message';
    jumpButton.setAttribute('aria-label', 'Aller au dernier message');
    jumpButton.addEventListener('click', () => {
      const thread = modal.querySelector('#chat-thread');
      thread?.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' });
    });
    conversation.append(jumpButton);

    attach.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });
    emojiButton.addEventListener('click', () => {
      emojiPanel.hidden = !emojiPanel.hidden;
      emojiButton.setAttribute('aria-expanded', String(!emojiPanel.hidden));
    });
    emojiPanel.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      input.setRangeText(button.textContent, input.selectionStart ?? input.value.length, input.selectionEnd ?? input.value.length, 'end');
      input.focus();
      updateSend();
    });
    input.addEventListener('input', updateSend);
    input.addEventListener('paste', event => {
      const files = [...(event.clipboardData?.files || [])];
      if (files.length) { event.preventDefault(); addFiles(files); }
    });
    updateSend();
  }

  // Glisser-déposer sur toute la messagerie
  const dropZone = () => modal.querySelector('.msgr-conv');
  const hasFiles = event => [...(event.dataTransfer?.types || [])].includes('Files');
  modal.addEventListener('dragover', event => { if (hasFiles(event)) { event.preventDefault(); dropZone()?.classList.add('is-dragging'); } });
  modal.addEventListener('dragleave', event => { if (!modal.contains(event.relatedTarget)) dropZone()?.classList.remove('is-dragging'); });
  modal.addEventListener('drop', event => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    dropZone()?.classList.remove('is-dragging');
    addFiles(event.dataTransfer.files);
  });

  /* ---------------------------------------------------------------- */
  /* Affichage des pièces jointes dans les bulles                       */
  /* ---------------------------------------------------------------- */
  function buildFile(a) {
    const link = h('a', 'att-file');
    link.href = a.data;
    link.download = a.name;
    const name = h('strong'); name.textContent = isImage(a) ? 'Photo' : a.name;
    const size = h('small'); size.textContent = fmtSize(a.size);
    const meta = h('span', 'att-meta');
    meta.append(name, size);
    link.append(h('span', 'att-ico', `<i class="bi ${iconFor(a)}" aria-hidden="true"></i>`), meta, h('i', 'bi bi-download'));
    return link;
  }

  function buildAttachment(a) {
    if (!a) return h('div', 'att-missing', '<i class="bi bi-image" aria-hidden="true"></i><span>Pièce jointe indisponible sur cet appareil</span>');
    if (!isImage(a)) return buildFile(a);
    const button = h('button', 'att-img');
    button.type = 'button';
    button.dataset.name = a.name;
    button.setAttribute('aria-label', 'Agrandir la photo');
    const img = new Image();
    img.alt = 'Photo envoyée';
    img.addEventListener('load', () => {
      const thread = modal.querySelector('#chat-thread');
      if (thread && thread.scrollHeight - thread.scrollTop - thread.clientHeight < 420) thread.scrollTop = thread.scrollHeight;
    });
    // Format illisible par le navigateur (ex. HEIC) : on propose le fichier à télécharger
    img.addEventListener('error', () => button.replaceWith(buildFile(a)));
    img.src = a.data;
    button.append(img);
    return button;
  }

  function renderAttachments(bubble, m) {
    if (bubble.querySelector(':scope > .msg-att')) return;
    const text = bubble.querySelector(':scope > p');
    let ids = Array.isArray(m?.att) ? m.att : [];
    let caption = text ? text.textContent.trim() : '';
    if (!ids.length && text) {                       // repli : ancien repère encore à l'écran
      const raw = text.textContent;
      const match = raw.match(TOKEN);
      ids = match ? match[1].split(',') : knownIds(raw);
      if (ids.length) caption = tidy(raw, ids);
    }
    if (!ids.length) return;
    const store = readAtt();
    const items = ids.map(id => store[id]);
    const auto = isAutoLabel(caption);               // libellé généré : on ne l'affiche pas
    const wrap = h('div', 'msg-att');
    items.forEach(a => wrap.append(buildAttachment(a)));
    bubble.insertBefore(wrap, text || bubble.querySelector(':scope > .chat-message-footer'));
    if (text) { if (auto) text.remove(); else text.textContent = caption; }
    bubble.classList.add('has-att');
    bubble.classList.toggle('att-only', auto);
    bubble.classList.toggle('att-media', items.length > 0 && items.every(a => a && isImage(a)));
  }

  function openLightbox(button) {
    const source = button.querySelector('img');
    const box = h('div', 'chat-lightbox');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Aperçu de la photo');
    const big = new Image();
    big.src = source.src;
    big.alt = source.alt;
    const download = h('a', 'chat-lightbox-dl', '<i class="bi bi-download" aria-hidden="true"></i>');
    download.href = source.src;
    download.download = button.dataset.name || 'photo.jpg';
    download.setAttribute('aria-label', 'Télécharger la photo');
    const close = h('button', 'chat-lightbox-close', '<i class="bi bi-x-lg" aria-hidden="true"></i>');
    close.type = 'button';
    close.setAttribute('aria-label', 'Fermer l’aperçu');
    box.append(big, download, close);
    box.addEventListener('click', event => { if (event.target !== big && !event.target.closest('.chat-lightbox-dl')) box.remove(); });
    document.body.append(box);
    close.focus();
  }

  /* ---------------------------------------------------------------- */
  /* Actions sur un message : modifier, supprimer, transférer, copier    */
  /* ---------------------------------------------------------------- */
  const MENU_ITEMS = {
    edit: ['pencil', 'Modifier'],
    forward: ['forward', 'Transférer'],
    copy: ['clipboard', 'Copier'],
    delete: ['trash3', 'Supprimer']
  };

  function addTools(bubble, m) {
    if (!m || bubble.querySelector(':scope > .chat-message-tools')) return;
    const mine = m.from === currentUser?.email;
    const actions = [];
    if (mine) actions.push('edit');
    actions.push('forward');
    if (bubble.querySelector(':scope > p')) actions.push('copy');
    if (mine) actions.push('delete');
    const tools = h('div', 'chat-message-tools');
    tools.innerHTML = `<button type="button" class="chat-message-more" aria-haspopup="menu" aria-expanded="false" aria-label="Actions du message"><i class="bi bi-three-dots" aria-hidden="true"></i></button>
      <div class="chat-message-menu" role="menu" hidden>${actions.map(action => `<button type="button" role="menuitem" data-message-action="${action}"><i class="bi bi-${MENU_ITEMS[action][0]}" aria-hidden="true"></i>${MENU_ITEMS[action][1]}</button>`).join('')}</div>`;
    bubble.append(tools);
  }

  function closeMenus() {
    modal.querySelectorAll('.chat-message-menu:not([hidden])').forEach(menu => {
      menu.hidden = true;
      menu.closest('.chat-message-tools')?.classList.remove('open');
      menu.closest('.chat-message-tools')?.querySelector('.chat-message-more')?.setAttribute('aria-expanded', 'false');
    });
  }

  function toggleMenu(button) {
    const tools = button.closest('.chat-message-tools');
    const menu = tools.querySelector('.chat-message-menu');
    const willOpen = menu.hidden;
    closeMenus();
    if (!willOpen) return;
    menu.hidden = false;
    tools.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    menu.classList.remove('up');
    const thread = modal.querySelector('#chat-thread');
    if (menu.getBoundingClientRect().bottom > thread.getBoundingClientRect().bottom - 4) menu.classList.add('up');   // pas assez de place dessous
  }

  function markDeleted(bubble) {
    if (bubble.classList.contains('is-deleted')) return;
    bubble.classList.add('is-deleted');
    bubble.classList.remove('has-att', 'att-only', 'att-media');
    bubble.querySelectorAll(':scope > .msg-att, :scope > .chat-reactions, :scope > .chat-reaction-picker, :scope > .msg-react-btn, :scope > .chat-message-tools, :scope > .chat-fwd').forEach(node => node.remove());
    let text = bubble.querySelector(':scope > p');
    if (!text) { text = h('p'); bubble.insertBefore(text, bubble.querySelector(':scope > .chat-message-footer')); }
    text.innerHTML = '<i class="bi bi-slash-circle" aria-hidden="true"></i> Message supprimé';
  }

  function addMarkers(bubble, m) {
    if (m?.fwd && !bubble.querySelector(':scope > .chat-fwd')) bubble.prepend(h('div', 'chat-fwd', '<i class="bi bi-forward-fill" aria-hidden="true"></i> Transféré'));
    const footer = bubble.querySelector(':scope > .chat-message-footer');
    if (m?.edited && footer && !footer.querySelector('.chat-edited')) {
      const label = h('span', 'chat-edited', 'modifié');
      label.title = `Modifié le ${new Date(m.edited).toLocaleString('fr-FR')}`;
      footer.append(label);
    }
  }

  function startEdit(bubble, m) {
    if (bubble.querySelector('.chat-edit')) return;
    const text = bubble.querySelector(':scope > p');
    const original = decode(m.text);
    const current = m.att?.length && isAutoLabel(original) ? '' : original;
    const box = h('div', 'chat-edit');
    const field = h('textarea', 'chat-edit-input');
    field.value = current;
    field.rows = 2;
    field.maxLength = 1000;
    field.setAttribute('aria-label', 'Modifier le message');
    box.append(field, h('div', 'chat-edit-actions', '<button type="button" class="chat-edit-cancel">Annuler</button><button type="button" class="chat-edit-save">Enregistrer</button>'));
    if (text) text.replaceWith(box); else bubble.insertBefore(box, bubble.querySelector(':scope > .chat-message-footer'));
    bubble.classList.add('is-editing');
    field.focus();
    field.setSelectionRange(field.value.length, field.value.length);
  }

  function saveEdit(bubble) {
    const m = messageOf(bubble);
    const field = bubble.querySelector('.chat-edit-input');
    if (!m || !field) return;
    let value = field.value.trim();
    if (!value) {
      if (!m.att?.length) { toast('Un message ne peut pas être vide.'); return; }
      value = labelForIds(m.att);
    }
    const safe = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (safe !== m.text) {
      m.text = safe;
      m.edited = new Date().toISOString();
      saveMessages();
    }
    rerender();
  }

  function deleteMessage(m) {
    if (!window.confirm('Supprimer ce message pour tous ?')) return;
    m.deleted = true;
    m.text = 'Message supprimé';
    m.reactions = {};
    delete m.att;
    delete m.fwd;
    saveMessages();
    rerender();
  }

  function copyMessage(bubble) {
    const text = bubble.querySelector(':scope > p')?.textContent.trim();
    if (!text) return;
    const done = () => toast('Message copié');
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, () => toast('Copie impossible.'));
    else {
      const area = h('textarea');
      area.value = text;
      document.body.append(area);
      area.select();
      try { document.execCommand('copy'); done(); } catch { toast('Copie impossible.'); }
      area.remove();
    }
  }

  function openForward(m) {
    document.querySelector('.chat-forward')?.remove();
    const contacts = typeof chatUsers === 'function' ? chatUsers() : [];
    const selected = new Set();
    const box = h('div', 'chat-forward');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Transférer le message');
    box.innerHTML = `<div class="chat-forward-panel">
      <header><strong>Transférer le message</strong><button type="button" class="chat-forward-close" aria-label="Fermer"><i class="bi bi-x-lg" aria-hidden="true"></i></button></header>
      <div class="chat-forward-preview"><i class="bi bi-forward-fill" aria-hidden="true"></i><span></span></div>
      <div class="msgr-search"><i class="bi bi-search" aria-hidden="true"></i><input type="search" placeholder="Rechercher un contact" autocomplete="off" /></div>
      <div class="chat-forward-list"></div>
      <footer><button type="button" class="space-mini primary chat-forward-send" disabled><i class="bi bi-send-fill" aria-hidden="true"></i><span>Transférer</span></button></footer>
    </div>`;
    box.querySelector('.chat-forward-preview span').textContent = decode(m.text).slice(0, 90);
    const list = box.querySelector('.chat-forward-list');
    const send = box.querySelector('.chat-forward-send');
    const search = box.querySelector('input');

    const draw = () => {
      const query = search.value.trim().toLowerCase();
      const rows = contacts.filter(user => !query || `${user.name || ''} ${user.email}`.toLowerCase().includes(query));
      list.innerHTML = rows.length ? rows.map(user => {
        const on = selected.has(user.email);
        return `<button type="button" class="fw-contact ${on ? 'selected' : ''}" data-email="${esc(user.email)}" aria-pressed="${on}"><span class="space-avatar mini ${roleClass(user.role)}">${esc(initialsOf(user.name || user.email))}</span><span class="mc-main"><strong>${esc(user.name || user.email)}</strong><small>${roleLabel(user.role)}</small></span><i class="bi ${on ? 'bi-check-circle-fill' : 'bi-circle'}" aria-hidden="true"></i></button>`;
      }).join('') : '<p class="modal-muted msgr-none">Aucun contact trouvé.</p>';
      send.disabled = selected.size === 0;
      send.querySelector('span').textContent = selected.size > 1 ? `Transférer à ${selected.size} contacts` : 'Transférer';
    };

    list.addEventListener('click', event => {
      const contact = event.target.closest('[data-email]');
      if (!contact) return;
      const email = contact.dataset.email;
      if (selected.has(email)) selected.delete(email); else selected.add(email);
      draw();
    });
    search.addEventListener('input', draw);
    box.addEventListener('click', event => { if (event.target === box || event.target.closest('.chat-forward-close')) box.remove(); });
    send.addEventListener('click', () => {
      if (!selected.size || !currentUser) return;
      const sender = typeof actorIdentity === 'function' ? actorIdentity().name : (currentUser.name || currentUser.email);
      const preview = decode(m.text);
      let index = 0;
      selected.forEach(email => {
        const copy = { id: Date.now() + index++, from: currentUser.email, fromName: sender, to: email, text: m.text, date: new Date().toISOString(), read: false, reactions: {}, fwd: true };
        if (m.att?.length) copy.att = [...m.att];
        messages.push(copy);
        if (typeof addNotification === 'function') addNotification(email, `Nouveau message : ${preview}`);
      });
      saveMessages();
      if (typeof renderNotifications === 'function') renderNotifications();
      box.remove();
      renderChatThread();
      toast(selected.size > 1 ? `Message transféré à ${selected.size} contacts` : `Message transféré à ${contacts.find(user => selected.has(user.email))?.name || 'votre contact'}`);
    });

    document.body.append(box);
    draw();
    search.focus();
  }

  function runAction(button) {
    const bubble = button.closest('.chat-message');
    const m = bubble && messageOf(bubble);
    closeMenus();
    if (!m || m.deleted) return;
    const own = m.from === currentUser?.email;
    switch (button.dataset.messageAction) {
      case 'edit': if (own) startEdit(bubble, m); break;
      case 'delete': if (own) deleteMessage(m); break;
      case 'forward': openForward(m); break;
      case 'copy': copyMessage(bubble); break;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Réactions                                                          */
  /* ---------------------------------------------------------------- */
  const closePickers = except => modal.querySelectorAll('.chat-reaction-picker.visible, .chat-reaction-picker.expanded').forEach(picker => {
    if (picker === except) return;
    picker.classList.remove('visible', 'expanded');
    picker.querySelector('.pick-more')?.setAttribute('aria-expanded', 'false');
  });

  // Tactile / clavier : le bouton « Réagir » ouvre directement toutes les réactions
  function toggleReactions(message) {
    const picker = message.querySelector('.chat-reaction-picker');
    if (!picker) return;
    const open = picker.classList.contains('expanded') || picker.classList.contains('visible');
    closePickers(picker);
    picker.classList.remove('visible', 'expanded');
    picker.querySelector('.pick-more')?.setAttribute('aria-expanded', String(!open));
    if (!open) picker.classList.add('expanded');
  }

  modal.addEventListener('click', event => {
    const more = event.target.closest('.chat-message-more');
    if (more) { closePickers(); toggleMenu(more); return; }
    const action = event.target.closest('[data-message-action]');
    if (action) { runAction(action); return; }
    if (!event.target.closest('.chat-message-tools')) closeMenus();

    if (event.target.closest('.chat-edit-cancel')) { rerender(); return; }
    const save = event.target.closest('.chat-edit-save');
    if (save) { saveEdit(save.closest('.chat-message')); return; }

    const image = event.target.closest('.att-img');
    if (image) { openLightbox(image); return; }
    const react = event.target.closest('.msg-react-btn');
    if (react) { toggleReactions(react.closest('.chat-message')); return; }
    const plus = event.target.closest('.pick-more');
    if (plus) {
      const picker = plus.closest('.chat-reaction-picker');
      closePickers(picker);
      picker.classList.remove('visible');
      plus.setAttribute('aria-expanded', String(picker.classList.toggle('expanded')));
      return;
    }
    if (!event.target.closest('.chat-reaction-picker')) closePickers();
    if (emojiPanel && !emojiPanel.hidden && !event.target.closest('.chat-emoji, #chat-emoji-btn')) {
      emojiPanel.hidden = true;
      modal.querySelector('#chat-emoji-btn')?.setAttribute('aria-expanded', 'false');
    }
  });

  // Édition : Entrée enregistre, Maj+Entrée = retour à la ligne, Échap annule
  modal.addEventListener('keydown', event => {
    if (!event.target.matches?.('.chat-edit-input')) return;
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); saveEdit(event.target.closest('.chat-message')); }
  });

  // Bulle proche du haut du fil : la barre de réactions s'ouvre en dessous
  modal.addEventListener('mouseover', event => {
    const message = event.target.closest('.chat-message');
    const thread = message?.closest('#chat-thread');
    if (!thread) return;
    message.classList.toggle('pick-below', message.getBoundingClientRect().top - thread.getBoundingClientRect().top < 56);
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const forward = document.querySelector('.chat-forward');
    if (forward) { forward.remove(); event.stopImmediatePropagation(); return; }
    const lightbox = document.querySelector('.chat-lightbox');
    if (lightbox) { lightbox.remove(); event.stopImmediatePropagation(); return; }
    if (document.activeElement?.matches?.('.chat-edit-input')) { rerender(); event.stopImmediatePropagation(); return; }
    if (modal.querySelector('.chat-message-menu:not([hidden])')) { closeMenus(); event.stopImmediatePropagation(); return; }
    if (emojiPanel && !emojiPanel.hidden) { emojiPanel.hidden = true; event.stopImmediatePropagation(); return; }
    if (modal.querySelector('.chat-reaction-picker.visible, .chat-reaction-picker.expanded')) { closePickers(); event.stopImmediatePropagation(); }
  }, true);

  /* ---------------------------------------------------------------- */
  /* Séparateurs de jour                                                */
  /* ---------------------------------------------------------------- */
  const dayLabel = iso => {
    const date = new Date(iso), today = new Date(), yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return 'Aujourd’hui';
    if (date.toDateString() === yesterday.toDateString()) return 'Hier';
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  function ensureDays(thread, bubbles) {
    const me = typeof currentUser !== 'undefined' ? currentUser?.email : null;
    const other = modal.querySelector('#chat-recipient')?.value;
    if (!me || !other) return;
    let all = [];
    try { all = JSON.parse(localStorage.getItem(MSG_KEY) || '[]') || []; } catch { all = []; }
    const conversation = all.filter(m => (m.from === me && m.to === other) || (m.to === me && m.from === other));
    if (conversation.length !== bubbles.length) return;   // correspondance incertaine : on n'ajoute rien
    const labels = conversation.map(m => dayLabel(m.date));
    const starts = labels.map((label, i) => i === 0 || label !== labels[i - 1]);
    const existing = thread.querySelectorAll(':scope > .chat-day');
    if (existing.length === starts.filter(Boolean).length) return;
    existing.forEach(node => node.remove());
    bubbles.forEach((bubble, i) => {
      if (!starts[i]) return;
      const day = h('div', 'chat-day');
      day.textContent = labels[i];
      thread.insertBefore(day, bubble);
    });
  }

  function updateJump() {
    const thread = modal.querySelector('#chat-thread');
    if (!thread || !jumpButton) return;
    jumpButton.hidden = thread.scrollHeight - thread.scrollTop - thread.clientHeight < 160;
  }

  /* ---------------------------------------------------------------- */
  /* Mise en forme du fil (exécutée avant l'affichage : pas de scintillement) */
  /* ---------------------------------------------------------------- */
  function enhance() {
    // Bouton d'envoi : icône seule
    const send = modal.querySelector('#chat-form .button');
    if (send && !send.dataset.iconified) {
      send.dataset.iconified = '1';
      send.setAttribute('aria-label', 'Envoyer le message');
      send.innerHTML = '<i class="bi bi-send-fill" aria-hidden="true"></i>';
    }
    ensureTools();
    updateSend();

    // En-tête de conversation : on retire l'astuce « clic droit »
    modal.querySelectorAll('.msgr-conv-head small').forEach(element => {
      const cleaned = element.textContent.replace(/\s*·?\s*clic droit sur un message pour réagir/i, '');
      if (cleaned !== element.textContent) element.textContent = cleaned;
    });

    const thread = modal.querySelector('#chat-thread');
    if (thread) {
      const bubbles = [...thread.querySelectorAll(':scope > .chat-message')];
      ensureDays(thread, bubbles);
      const initials = (modal.querySelector('.msgr-conv-head .space-avatar')?.textContent || '').trim();
      bubbles.forEach(message => {
        const mine = message.classList.contains('mine');
        const previous = message.previousElementSibling;
        const next = message.nextElementSibling;
        const same = other => other && other.classList.contains('chat-message') && other.classList.contains('mine') === mine;
        message.classList.toggle('is-first', !same(previous));
        message.classList.toggle('is-last', !same(next));
        if (initials && !mine) message.dataset.initials = initials;

        const m = messageOf(message);
        if (m?.deleted) { markDeleted(message); return; }
        renderAttachments(message, m);
        addMarkers(message, m);
        addTools(message, m);

        const picker = message.querySelector('.chat-reaction-picker');
        if (picker && !picker.querySelector('.pick-more')) {
          const more = h('button', 'pick-more', '<i class="bi bi-plus-lg" aria-hidden="true"></i>');
          more.type = 'button';
          more.title = 'Toutes les réactions';
          more.setAttribute('aria-label', 'Afficher toutes les réactions');
          more.setAttribute('aria-expanded', 'false');
          picker.append(more);
        }
        if (!message.querySelector(':scope > .msg-react-btn')) {
          const react = h('button', 'msg-react-btn', '<i class="bi bi-emoji-smile" aria-hidden="true"></i>');
          react.type = 'button';
          react.title = 'Réagir';
          react.setAttribute('aria-label', 'Réagir à ce message');
          message.append(react);
        }
      });
      if (!thread.dataset.jump) { thread.dataset.jump = '1'; thread.addEventListener('scroll', updateJump, { passive: true }); }
      updateJump();
    }

    // Aperçus (liste des contacts, notifications) : jamais de repère technique
    document.querySelectorAll('#msgr-list .mc-main small, #notification-modal .notif-body p').forEach(element => {
      const cleaned = cleanPreview(element.textContent);
      if (cleaned !== element.textContent) element.textContent = cleaned;
    });
  }

  // Appelé directement par l'observateur (micro-tâche) : le navigateur n'affiche
  // jamais la version brute des messages. Les passes suivantes ne changent plus rien.
  const observer = new MutationObserver(enhance);
  observer.observe(modal, { childList: true, subtree: true });
  observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
  const notifModal = document.querySelector('#notification-modal');
  if (notifModal) observer.observe(notifModal, { childList: true, subtree: true });
  enhance();
})();
