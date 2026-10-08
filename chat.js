/* ==========================================================================
   E-tokiana — chat.js   (à charger APRÈS features.js)
   Complète chat.css sans toucher à app.js ni à features.js :
   - regroupe les bulles consécutives d'un même expéditeur
   - séparateurs de jour (« Aujourd'hui », « Hier », …)
   - réactions : barre rapide au survol + bouton « + » pour tout afficher
   - pièces jointes : trombone, glisser-déposer, collage, aperçu avant envoi,
     image toujours affichée dans la bulle, aperçu plein écran
   - sélecteur d'émojis, bouton « retour en bas », bouton d'envoi qui s'active

   Pièces jointes : le message envoyé par app.js reste du texte ; on y ajoute
   un repère ⟦pj:identifiants⟧ et les fichiers sont gardés dans localStorage
   (« etokiana-attachments »). Le repère — ou, à défaut, l'identifiant seul —
   est remplacé à l'affichage par la pièce jointe, et masqué dans les aperçus.
   ========================================================================== */
(() => {
  'use strict';

  const modal = document.querySelector('#chat-modal');
  if (!modal) return;
  modal.classList.add('chat-modal');

  const ATT_KEY = 'etokiana-attachments';
  const MAX_FILES = 4;                 // pièces jointes par message
  const MAX_FILE = 1.5 * 1024 * 1024;  // fichiers non réduits (octets)
  const MAX_STORED = 80;               // pièces conservées au total
  const TOKEN = /\s*⟦pj:([a-z0-9,]+)⟧/;
  const STRIP = /\s*⟦[^⟧]*(?:⟧|$)/g;
  const LOOKS_LIKE_ID = /a[a-z0-9]{10,13}/;
  const EMOJIS = ['😀', '😂', '😊', '😍', '😉', '😅', '🤔', '😮', '😢', '👍', '👌', '🙏', '👏', '🙌', '🤝', '👋', '❤️', '🔥', '🎉', '⭐', '✅', '📦', '🚚', '💳'];

  let pending = [];
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
  const toast = message => { if (typeof showToast === 'function') showToast(message); };
  const fmtSize = n => n < 1024 ? `${n} o` : n < 1048576 ? `${Math.round(n / 1024)} Ko` : `${(n / 1048576).toFixed(1)} Mo`;

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
  const labelFor = list => list.length > 1 ? `📎 ${list.length} pièces jointes` : isImage(list[0]) ? '📎 Photo' : '📎 Fichier';

  /* ---------------------------------------------------------------- */
  /* Nettoyage des textes (repère technique, identifiant seul)          */
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

  // Les toasts d'app.js ne doivent jamais afficher d'identifiant
  if (typeof window.showToast === 'function' && !window.showToast.__clean) {
    const original = window.showToast;
    const wrapped = (message, ...rest) => original(typeof message === 'string' ? cleanPreview(message) : message, ...rest);
    wrapped.__clean = true;
    window.showToast = wrapped;
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

    // Envoi : on ajoute le repère de pièce jointe au texte avant qu'app.js ne le lise
    form.addEventListener('submit', event => {
      if (!pending.length) return;
      const store = { ...readAtt() };
      pending.forEach(a => { store[a.id] = a; });
      const keys = Object.keys(store);
      if (keys.length > MAX_STORED) keys.slice(0, keys.length - MAX_STORED).forEach(key => delete store[key]);
      try { localStorage.setItem(ATT_KEY, JSON.stringify(store)); }
      catch {
        event.preventDefault();
        event.stopImmediatePropagation();
        toast('Espace de stockage plein : retirez une pièce jointe ou choisissez une image plus légère.');
        return;
      }
      const text = input.value.trim() || labelFor(pending);
      input.value = `${text} ⟦pj:${pending.map(a => a.id).join(',')}⟧`;
      pending = [];
      renderPending();
    }, true);
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

  function renderAttachments(message) {
    const text = message.querySelector('p');
    if (!text) return;
    const raw = text.textContent;
    const match = raw.match(TOKEN);
    const ids = match ? match[1].split(',') : knownIds(raw);   // repli : identifiant affiché seul
    if (!ids.length) return;
    const store = readAtt();
    const items = ids.map(id => store[id]);
    const caption = tidy(raw, ids);
    const auto = !caption || caption.startsWith('📎');           // libellé généré : on ne l'affiche pas
    const wrap = h('div', 'msg-att');
    items.forEach(a => wrap.append(buildAttachment(a)));
    message.insertBefore(wrap, text);
    if (auto) text.remove(); else text.textContent = caption;
    message.classList.add('has-att');
    message.classList.toggle('att-only', auto);
    message.classList.toggle('att-media', items.length > 0 && items.every(a => a && isImage(a)));
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
    const image = event.target.closest('.att-img');
    if (image) { openLightbox(image); return; }
    const react = event.target.closest('.msg-react-btn');
    if (react) { toggleReactions(react.closest('.chat-message')); return; }
    const more = event.target.closest('.pick-more');
    if (more) {
      const picker = more.closest('.chat-reaction-picker');
      closePickers(picker);
      picker.classList.remove('visible');
      more.setAttribute('aria-expanded', String(picker.classList.toggle('expanded')));
      return;
    }
    if (!event.target.closest('.chat-reaction-picker')) closePickers();
    if (emojiPanel && !emojiPanel.hidden && !event.target.closest('.chat-emoji, #chat-emoji-btn')) {
      emojiPanel.hidden = true;
      modal.querySelector('#chat-emoji-btn')?.setAttribute('aria-expanded', 'false');
    }
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
    const lightbox = document.querySelector('.chat-lightbox');
    if (lightbox) { lightbox.remove(); event.stopImmediatePropagation(); return; }
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
    try { all = JSON.parse(localStorage.getItem('etokiana-messages') || '[]') || []; } catch { all = []; }
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
        renderAttachments(message);

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

    // Aperçus (liste des contacts, notifications) : jamais de repère ni d'identifiant
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
