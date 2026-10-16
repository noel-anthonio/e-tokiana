/* ==========================================================================
   E-tokiana — admin.js   (à charger APRÈS features.js, chat.js)
   1. Personnel : vrais comptes d'équipe avec rôles, droits d'accès, suspension,
      mot de passe temporaire, présence « en ligne »
   2. Alertes par rôle : stock → gestionnaire de stock, commandes → gestionnaire
      de commandes, nouveaux clients → gestionnaire de clients, + récapitulatif
      de stock automatique
   3. Tableau de bord enrichi (ventes 7 jours, top produits, statuts, « à faire »)
   4. Produits : recherche, filtres, tri, modification (prix, remise, stock),
      bouton « Alerter le gestionnaire de stock »
   5. Clients (recherche), exports CSV (commandes, historique)
   6. Mon profil + changement de mot de passe (équipe, vendeurs, clients)
   ========================================================================== */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const parse = (value) => {
    try {
      return value == null ? null : JSON.parse(value);
    } catch {
      return null;
    }
  };
  const h = (tag, cls, html) => {
    const element = document.createElement(tag);
    if (cls) element.className = cls;
    if (html !== undefined) element.innerHTML = html;
    return element;
  };
  const F = window.EtoFeatures || {};
  const nativeSet = F.nativeSet || Storage.prototype.setItem;
  const STEPS = [
    "Nouvelle commande",
    "Validée",
    "En préparation",
    "Expédiée",
    "Livrée",
  ];
  const SYSTEM = {
    email: "systeme@etokiana.fr",
    name: "Système",
    role: "client",
  };
  const DIGEST_KEY = "etokiana-stock-digest";
  const PRES_KEY = "etokiana-presence";
  const RESERVED_EMAILS = [
    "client@etokiana.fr",
    "admin@etokiana.fr",
    "vendeur@etokiana.fr",
  ];

  const initialsOf = (name) => {
    const parts = String(name || "U")
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    return (
      parts.length > 1
        ? parts[0][0] + parts.at(-1)[0]
        : (parts[0] || "U").slice(0, 2)
    ).toLocaleUpperCase("fr-FR");
  };
  const timeAgo = (ts) => {
    const seconds = (Date.now() - ts) / 1000;
    if (seconds < 60) return "à l’instant";
    if (seconds < 3600) return `il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `il y a ${Math.floor(seconds / 3600)} h`;
    return `il y a ${Math.floor(seconds / 86400)} j`;
  };
  const toast = (message) => {
    if (typeof showToast === "function") showToast(message);
  };
  const onOpen = (selector, callback) => {
    const element = $(selector);
    if (element)
      new MutationObserver(() => {
        if (element.classList.contains("open")) callback();
      }).observe(element, { attributes: true, attributeFilter: ["class"] });
  };

  /* ====================================================================== */
  /* Rôles et droits                                                         */
  /* ====================================================================== */
  const ROLES = {
    Administrateur: {
      tabs: [
        "dashboard",
        "products",
        "orders",
        "sellers",
        "customers",
        "staff",
        "history",
      ],
      notify: ["products", "orders", "sellers", "customers"],
      access: "Accès complet",
      alerts: "Toutes les alertes",
    },
    "Gestionnaire stocks": {
      tabs: ["dashboard", "products", "history"],
      notify: ["products"],
      access: "Produits et stocks",
      alerts: "Stock épuisé / faible + récapitulatif",
    },
    "Gestionnaire commandes": {
      tabs: ["dashboard", "orders", "history"],
      notify: ["orders"],
      access: "Commandes et statuts",
      alerts: "Nouvelles commandes",
    },
    "Gestionnaire clients": {
      tabs: ["dashboard", "customers", "orders", "history"],
      notify: ["customers"],
      access: "Clients (commandes en lecture)",
      alerts: "Nouveaux clients",
    },
  };
  const SELLER_TABS = ["dashboard", "products", "orders", "history", "profile"];
  const can = (perm) => {
    const user = currentUser;
    if (!user) return false;
    if (["owner", "admin"].includes(user.role)) return perm !== "profile";
    if (user.role === "seller") return SELLER_TABS.includes(perm);
    if (user.role === "staff")
      return (
        perm === "profile" || (ROLES[user.staffRole]?.tabs || []).includes(perm)
      );
    return false;
  };
  const isSellerUser = () => currentUser?.role === "seller";

  const readUsers = () => parse(localStorage.getItem("etokiana-users")) || [];
  const writeUsers = (list) =>
    nativeSet.call(localStorage, "etokiana-users", JSON.stringify(list));
  const staffMembers = () =>
    readUsers().filter((user) => user.role === "staff");
  const emailsFor = (perm) =>
    staffMembers()
      .filter(
        (member) =>
          member.active !== false &&
          (ROLES[member.staffRole]?.notify || []).includes(perm),
      )
      .map((member) => member.email);
  const tempPassword = () =>
    Array.from(
      { length: 8 },
      () => "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)],
    ).join("");
  const presence = () => parse(localStorage.getItem(PRES_KEY)) || {};
  const log = (type, text) => {
    try {
      F.logAction?.(type, text);
    } catch {
      /* journal indisponible */
    }
  };

  /* ====================================================================== */
  /* Fenêtres de dialogue                                                    */
  /* ====================================================================== */
  function dialog(html) {
    $(".adm-dialog")?.remove();
    const box = h("div", "adm-dialog");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML = `<div class="adm-dialog-panel">${html}</div>`;
    box.addEventListener("click", (event) => {
      if (event.target === box || event.target.closest("[data-dlg-close]"))
        box.remove();
    });
    document.body.append(box);
    $("input, select", box)?.focus();
    return box;
  }
  const dlgHead = (title) =>
    `<header><strong>${title}</strong><button type="button" class="adm-x" data-dlg-close aria-label="Fermer"><i class="bi bi-x-lg" aria-hidden="true"></i></button></header>`;
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && $(".adm-dialog")) {
        $(".adm-dialog").remove();
        event.stopImmediatePropagation();
      }
    },
    true,
  );

  function copy(text, label) {
    const done = () => toast(`${label} copié`);
    if (navigator.clipboard?.writeText)
      navigator.clipboard
        .writeText(text)
        .then(done, () => toast("Copie impossible."));
    else {
      const area = h("textarea");
      area.value = text;
      document.body.append(area);
      area.select();
      try {
        document.execCommand("copy");
        done();
      } catch {
        toast("Copie impossible.");
      }
      area.remove();
    }
  }

  function credentialsDialog(member, title) {
    const box = dialog(`${dlgHead(title)}
      <p class="adm-note">Communiquez ces accès à <strong>${esc(member.name)}</strong> (aucun e-mail n’est envoyé par ce site de démonstration).</p>
      <div class="adm-cred"><span>Identifiant</span><code>${esc(member.email)}</code><button type="button" class="space-mini" data-copy="${esc(member.email)}" data-label="Identifiant">Copier</button></div>
      <div class="adm-cred"><span>Mot de passe</span><code>${esc(member.password)}</code><button type="button" class="space-mini" data-copy="${esc(member.password)}" data-label="Mot de passe">Copier</button></div>
      <div class="adm-actions"><button type="button" class="space-mini primary" data-dlg-close>Terminé</button></div>`);
    box.addEventListener("click", (event) => {
      const button = event.target.closest("[data-copy]");
      if (button) copy(button.dataset.copy, button.dataset.label);
    });
  }

  /* ====================================================================== */
  /* 1. PERSONNEL                                                            */
  /* ====================================================================== */
  function renderStaff() {
    const panel = $('[data-admin-panel="staff"]');
    if (!panel) return;
    const members = staffMembers();
    const online = presence();
    const week = Date.now() - 7 * 86400000;
    const entries = (F.readLog?.() || []).filter(
      (entry) => new Date(entry.date).getTime() > week,
    );
    const manage = can("staff");
    const stateOf = (member) =>
      member.active === false
        ? { key: "off", label: "Suspendu" }
        : Date.now() - (online[member.email] || 0) < 60000
          ? { key: "on", label: "En ligne" }
          : {
              key: "idle",
              label: online[member.email]
                ? `Vu ${timeAgo(online[member.email])}`
                : "Jamais connecté",
            };
    const onlineCount = members.filter(
      (member) => stateOf(member).key === "on",
    ).length;
    const suspended = members.filter(
      (member) => member.active === false,
    ).length;

    panel.innerHTML = `<div class="hist-heading"><div><p class="eyebrow">Équipe</p><h3>Personnel</h3></div>${manage ? '<button type="button" class="space-mini primary" data-staff-add><i class="bi bi-person-plus" aria-hidden="true"></i>Inviter un membre</button>' : ""}</div>
      <div class="space-kpis staff-kpis"><div><i class="bi bi-people" aria-hidden="true"></i><strong>${members.length}</strong><span>Membres</span></div><div><i class="bi bi-circle-fill" style="color:var(--green)" aria-hidden="true"></i><strong>${onlineCount}</strong><span>En ligne</span></div><div><i class="bi bi-pause-circle" aria-hidden="true"></i><strong>${suspended}</strong><span>Suspendus</span></div><div><i class="bi bi-bell" aria-hidden="true"></i><strong>${members.filter((member) => member.active !== false && (ROLES[member.staffRole]?.notify || []).includes("products")).length}</strong><span>Alertes stock actives</span></div></div>
      <div class="staff-list">
        <article class="staff-card owner"><span class="space-avatar owner">ET</span><div class="staff-main"><strong>${esc(adminIdentity.name)}</strong><small>${esc(adminIdentity.email)}</small></div><span class="staff-role-fixed">Propriétaire</span><span class="staff-state on"><i class="bi bi-shield-check" aria-hidden="true"></i>Accès total</span></article>
        ${
          members
            .map((member) => {
              const state = stateOf(member);
              const count = entries.filter(
                (entry) => entry.email === member.email,
              ).length;
              const self = currentUser?.email === member.email;
              return `<article class="staff-card ${member.active === false ? "is-off" : ""}" data-email="${esc(member.email)}">
            <span class="space-avatar seller">${esc(initialsOf(member.name))}</span>
            <div class="staff-main"><strong>${esc(member.name)}${self ? " <em>(vous)</em>" : ""}</strong><small>${esc(member.email)} · ${count} action${count > 1 ? "s" : ""} sur 7 j</small></div>
            ${
              manage && !self
                ? `<select class="staff-role" data-staff-role aria-label="Rôle de ${esc(member.name)}">${Object.keys(
                    ROLES,
                  )
                    .map(
                      (role) =>
                        `<option ${role === member.staffRole ? "selected" : ""}>${role}</option>`,
                    )
                    .join("")}</select>`
                : `<span class="staff-role-fixed">${esc(member.staffRole)}</span>`
            }
            <span class="staff-state ${state.key}"><i class="bi bi-circle-fill" aria-hidden="true"></i>${esc(state.label)}</span>
            <div class="staff-actions">
              <button type="button" class="space-mini" data-staff-act="write" title="Écrire"><i class="bi bi-chat-dots" aria-hidden="true"></i></button>
              ${
                manage && !self
                  ? `<button type="button" class="space-mini" data-staff-act="test" title="Envoyer une alerte de test"><i class="bi bi-bell" aria-hidden="true"></i></button>
              <button type="button" class="space-mini" data-staff-act="reset" title="Nouveau mot de passe"><i class="bi bi-key" aria-hidden="true"></i></button>
              <button type="button" class="space-mini" data-staff-act="toggle" title="${member.active === false ? "Réactiver" : "Suspendre"}"><i class="bi ${member.active === false ? "bi-play-circle" : "bi-pause-circle"}" aria-hidden="true"></i></button>
              <button type="button" class="space-mini danger" data-staff-act="remove" title="Supprimer"><i class="bi bi-trash3" aria-hidden="true"></i></button>`
                  : ""
              }
            </div></article>`;
            })
            .join("") ||
          '<div class="space-empty"><i class="bi bi-person-plus" aria-hidden="true"></i><strong>Aucun membre dans l’équipe</strong><p>Invitez un gestionnaire de stock, de commandes ou de clients : il recevra automatiquement les alertes de son domaine.</p></div>'
        }
      </div>
      <section class="staff-matrix"><h4>Droits et alertes par rôle</h4>
        <div class="staff-table"><div class="staff-table-head"><span>Rôle</span><span>Accès</span><span>Alertes reçues</span></div>
        ${Object.entries(ROLES)
          .map(
            ([role, info]) =>
              `<div class="staff-table-row"><strong>${role}</strong><span>${info.access}</span><span>${info.alerts}</span></div>`,
          )
          .join("")}</div></section>`;
  }

  function inviteDialog() {
    const box = dialog(`${dlgHead("Inviter un membre")}
      <form class="space-form" id="inv-form">
        <label>Nom complet<input id="inv-name" type="text" required placeholder="Ex. Camille Rakoto" /></label>
        <label>Adresse e-mail (identifiant)<input id="inv-email" type="email" required placeholder="camille@etokiana.mg" /></label>
        <label>Rôle<select id="inv-role">${Object.entries(ROLES)
          .map(
            ([role, info]) =>
              `<option value="${role}">${role} — ${info.alerts}</option>`,
          )
          .join("")}</select></label>
        <p class="login-error" id="inv-error" aria-live="polite"></p>
        <div class="adm-actions"><button type="button" class="space-mini" data-dlg-close>Annuler</button><button class="space-mini primary" type="submit">Créer le compte</button></div>
      </form>`);
    $("#inv-form", box).addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#inv-name", box).value.trim();
      const email = $("#inv-email", box).value.trim().toLowerCase();
      const staffRole = $("#inv-role", box).value;
      const users = readUsers();
      if (!name || !email) return;
      if (
        users.some((user) => user.email === email) ||
        RESERVED_EMAILS.includes(email)
      ) {
        $("#inv-error", box).textContent =
          "Cette adresse e-mail est déjà utilisée.";
        return;
      }
      const member = {
        id: `staff-${Date.now()}`,
        name,
        email,
        phone: "",
        address: "",
        role: "staff",
        staffRole,
        password: tempPassword(),
        active: true,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.email,
      };
      users.push(member);
      writeUsers(users);
      log("profile", `Membre ajouté : ${name} (${staffRole})`);
      addNotification(
        email,
        `Bienvenue dans l’équipe E-tokiana : vous êtes ${staffRole}. Vous recevrez ici les alertes de votre domaine.`,
      );
      renderStaff();
      credentialsDialog(member, "Compte créé");
    });
  }

  function staffAction(action, email) {
    const users = readUsers();
    const index = users.findIndex((user) => user.email === email);
    const member = users[index];
    if (!member) return;
    if (action === "write") {
      $(".adm-dialog")?.remove();
      return F.openChatWith?.(email);
    }
    if (!can("staff")) return;
    if (action === "test") {
      addNotification(
        email,
        "Alerte de test : si vous voyez ce message, vos alertes fonctionnent ✔",
        SYSTEM,
      );
      toast(`Alerte de test envoyée à ${member.name}`);
    } else if (action === "reset") {
      if (
        !window.confirm(`Générer un nouveau mot de passe pour ${member.name} ?`)
      )
        return;
      member.password = tempPassword();
      writeUsers(users);
      log("profile", `Mot de passe réinitialisé : ${member.name}`);
      credentialsDialog(member, "Nouveau mot de passe");
    } else if (action === "toggle") {
      member.active = member.active === false;
      writeUsers(users);
      log(
        "profile",
        `${member.active ? "Compte réactivé" : "Compte suspendu"} : ${member.name}`,
      );
      toast(
        member.active
          ? `${member.name} peut de nouveau se connecter.`
          : `${member.name} est suspendu.`,
      );
    } else if (action === "remove") {
      if (
        !window.confirm(`Supprimer définitivement ${member.name} de l’équipe ?`)
      )
        return;
      users.splice(index, 1);
      writeUsers(users);
      log("profile", `Membre supprimé : ${member.name}`);
      toast(`${member.name} a été retiré de l’équipe.`);
    }
    renderStaff();
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-staff-add]")) {
      inviteDialog();
      return;
    }
    const button = event.target.closest("[data-staff-act]");
    if (button)
      staffAction(
        button.dataset.staffAct,
        button.closest("[data-email]").dataset.email,
      );
  });
  document.addEventListener("change", (event) => {
    const select = event.target.closest?.("[data-staff-role]");
    if (!select || !can("staff")) return;
    const users = readUsers();
    const member = users.find(
      (user) => user.email === select.closest("[data-email]").dataset.email,
    );
    if (!member) return;
    const before = member.staffRole;
    member.staffRole = select.value;
    writeUsers(users);
    log(
      "profile",
      `Rôle modifié : ${member.name} (${before} → ${member.staffRole})`,
    );
    addNotification(
      member.email,
      `Votre rôle est maintenant : ${member.staffRole}.`,
    );
    toast(`${member.name} : ${member.staffRole}`);
    renderStaff();
  });

  // Connexion : un compte suspendu ne peut pas entrer
  $("#login-modal")?.addEventListener(
    "submit",
    (event) => {
      if (event.target.id !== "login-form") return;
      const email = $("#login-email").value.trim().toLowerCase();
      const member = staffMembers().find((user) => user.email === email);
      if (member && member.active === false) {
        event.preventDefault();
        event.stopPropagation();
        $("#login-error").textContent =
          "Ce compte est suspendu. Contactez un administrateur.";
      }
    },
    true,
  );

  // Espace de l'équipe : même fenêtre que l'espace admin, avec des onglets limités par rôle
  const originalOpenUserSpace = window.openUserSpace;
  window.openUserSpace = function () {
    if (currentUser?.role === "staff") {
      $("#admin-title").textContent = `Espace ${currentUser.staffRole}`;
      $("#admin-space-label").textContent = "Équipe E-tokiana";
      renderAdminDashboard();
      renderSellerAndOwnerViews();
      addSellerOrderActions();
      addOwnerOrderActions();
      openModal(adminModal);
      return;
    }
    return originalOpenUserSpace.apply(this, arguments);
  };

  // Un gestionnaire de commandes peut faire avancer les statuts (app.js ne connaît pas ce rôle)
  $(".admin-content")?.addEventListener(
    "click",
    (event) => {
      const button = event.target.closest("[data-order-status]");
      if (!button || currentUser?.role !== "staff") return;
      event.stopPropagation();
      if (
        !["Administrateur", "Gestionnaire commandes"].includes(
          currentUser.staffRole,
        )
      ) {
        toast("Vous n’avez pas la permission de modifier les commandes.");
        return;
      }
      F.advanceOrder?.(
        orders.find((order) => order.id === button.dataset.orderStatus),
      );
    },
    true,
  );

  // L'identité (fenêtre « Mon identité ») affiche le rôle d'équipe
  onOpen("#identity-modal", () => {
    if (currentUser?.role !== "staff") return;
    $$("#identity-modal .identity-row").forEach((row) => {
      if (/Rôle/i.test(row.firstElementChild?.textContent || ""))
        row.lastElementChild.textContent = currentUser.staffRole || "Équipe";
    });
  });

  /* ====================================================================== */
  /* 2. ALERTES PAR RÔLE                                                     */
  /* ====================================================================== */
  let skipRoute = false;
  const permFor = (message) =>
    /Stock (épuisé|faible)/i.test(message)
      ? "products"
      : /Nouvelle commande|concerne votre produit|Mise à jour de la commande/i.test(
            message,
          )
        ? "orders"
        : /vendeur inscrit/i.test(message)
          ? "sellers"
          : /client inscrit/i.test(message)
            ? "customers"
            : null;

  // Chaque alerte destinée à l'admin est aussi envoyée aux membres concernés
  const baseAddNotification = window.addNotification;
  window.addNotification = function (recipient, message) {
    const before = notifications.length;
    const result = baseAddNotification.apply(this, arguments);
    try {
      if (
        !skipRoute &&
        recipient === adminIdentity.email &&
        notifications.length > before
      ) {
        const original = notifications.at(-1);
        const perm = permFor(original.message);
        if (perm) {
          emailsFor(perm)
            .filter((email) => email !== original.actor)
            .forEach((email) =>
              notifications.push({
                ...original,
                id: Date.now() + Math.random(),
                recipient: email,
              }),
            );
          nativeSet.call(
            localStorage,
            "etokiana-notifications",
            JSON.stringify(notifications),
          );
        }
      }
    } catch (error) {
      console.warn("Routage des alertes :", error);
    }
    return result;
  };

  // Récapitulatif de stock : à l'ouverture de session puis toutes les 12 h
  function stockDigest() {
    if (!currentUser?.email || !can("products") || !F.stockOf) return;
    const list = isSellerUser()
      ? products.filter((product) => product.sellerId === currentUser.id)
      : products;
    let out = 0,
      low = 0;
    list.forEach((product) => {
      if (F.unlimited(product)) return;
      const n = F.stockOf(product);
      if (n <= 0) out++;
      else if (n <= F.LOW) low++;
    });
    if (!out && !low) return;
    const key = userNotificationKey();
    const store = parse(localStorage.getItem(DIGEST_KEY)) || {};
    if (Date.now() - (store[key] || 0) < 12 * 3600 * 1000) return;
    store[key] = Date.now();
    nativeSet.call(localStorage, DIGEST_KEY, JSON.stringify(store));
    skipRoute = true;
    try {
      addNotification(
        key,
        `Stock faible : récapitulatif · ${out} épuisé${out > 1 ? "s" : ""}, ${low} bientôt épuisé${low > 1 ? "s" : ""}`,
        SYSTEM,
      );
    } finally {
      skipRoute = false;
    }
    if (typeof renderNotifications === "function") renderNotifications();
  }

  // Présence + sécurité (compte suspendu ou supprimé pendant la session)
  function heartbeat() {
    if (!currentUser?.email) return;
    const all = presence();
    all[currentUser.email] = Date.now();
    nativeSet.call(localStorage, PRES_KEY, JSON.stringify(all));
    if (currentUser.role === "staff") {
      const entry = staffMembers().find(
        (member) => member.email === currentUser.email,
      );
      if (!entry || entry.active === false) {
        $(".identity-logout", identityModal)?.click();
        toast(
          entry
            ? "Votre compte a été suspendu."
            : "Votre compte a été supprimé.",
        );
      }
    }
  }
  setInterval(heartbeat, 20000);
  setInterval(stockDigest, 60000);
  setTimeout(() => {
    heartbeat();
    stockDigest();
  }, 1500);

  /* ====================================================================== */
  /* 3. TABLEAU DE BORD ENRICHI                                              */
  /* ====================================================================== */
  const scopedOrders = () =>
    isSellerUser()
      ? orders.filter((order) =>
          order.items?.some((item) => item.sellerId === currentUser.id),
        )
      : orders;
  const ownLines = (order) =>
    isSellerUser()
      ? (order.items || []).filter((item) => item.sellerId === currentUser.id)
      : order.items || [];
  const lineValue = (item) =>
    (Number(item.salePrice) || Number(item.price) || 0) * item.quantity;
  const orderValue = (order) =>
    isSellerUser()
      ? ownLines(order).reduce((sum, item) => sum + lineValue(item) * 0.9, 0)
      : Number(order.total) || 0;
  const compact = (value) => {
    const ar = value * currencyRate;
    return ar >= 1e6
      ? `${(ar / 1e6).toFixed(1)} M`
      : `${Math.round(ar / 1000)} k`;
  };
  const stockCounts = () => {
    const list = isSellerUser()
      ? products.filter((product) => product.sellerId === currentUser.id)
      : products;
    let out = 0,
      low = 0;
    if (F.stockOf)
      list.forEach((product) => {
        if (F.unlimited(product)) return;
        const n = F.stockOf(product);
        if (n <= 0) out++;
        else if (n <= F.LOW) low++;
      });
    return { out, low };
  };

  const prodState = { q: "", filter: "all", sort: "recent" };

  function renderDashboardExtra() {
    const panel = $('[data-admin-panel="dashboard"]');
    const stats = panel && $(".admin-stats", panel);
    if (!stats) return;
    $(".dash-extra", panel)?.remove();

    const list = scopedOrders();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      days.push({
        key: date.toDateString(),
        label: date.toLocaleDateString("fr-FR", { weekday: "short" }),
        value: 0,
      });
    }
    list.forEach((order) => {
      const day = days.find(
        (item) => item.key === new Date(order.date || 0).toDateString(),
      );
      if (day) day.value += orderValue(order);
    });
    const max = Math.max(...days.map((day) => day.value), 1);
    const total7 = days.reduce((sum, day) => sum + day.value, 0);

    const top = new Map();
    list.forEach((order) =>
      ownLines(order).forEach((item) => {
        const row = top.get(item.name) || {
          name: item.name,
          image: item.image,
          quantity: 0,
          value: 0,
        };
        row.quantity += item.quantity;
        row.value += lineValue(item);
        top.set(item.name, row);
      }),
    );
    const best = [...top.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    const bestMax = Math.max(...best.map((row) => row.quantity), 1);

    const byStatus = STEPS.map((step) => ({
      step,
      count: list.filter((order) => order.status === step).length,
    }));
    const statusTotal = byStatus.reduce((sum, row) => sum + row.count, 0);

    const { out, low } = stockCounts();
    const pending = list.filter((order) => order.status !== "Livrée").length;
    const week = Date.now() - 7 * 86400000;
    const newClients = can("customers")
      ? (F.readLog?.() || []).filter(
          (entry) =>
            entry.type === "auth" &&
            entry.text === "Compte créé" &&
            ["client", "guest"].includes(entry.role) &&
            new Date(entry.date).getTime() > week,
        ).length
      : 0;
    const unread =
      typeof unreadChatCount === "function" ? unreadChatCount() : 0;
    const todo = [
      can("orders") && pending
        ? [
            "orders",
            "bi-hourglass-split",
            pending,
            `commande${pending > 1 ? "s" : ""} à traiter`,
            "orders",
          ]
        : null,
      can("products") && out + low
        ? [
            "products",
            "bi-exclamation-triangle",
            out + low,
            `produit${out + low > 1 ? "s" : ""} à réapprovisionner`,
            "warn",
          ]
        : null,
      newClients
        ? [
            "customers",
            "bi-person-plus",
            newClients,
            `nouveau${newClients > 1 ? "x" : ""} client${newClients > 1 ? "s" : ""} cette semaine`,
            "info",
          ]
        : null,
      unread
        ? [
            "chat",
            "bi-chat-dots",
            unread,
            `message${unread > 1 ? "s" : ""} non lu${unread > 1 ? "s" : ""}`,
            "info",
          ]
        : null,
    ].filter(Boolean);

    const extra = h("div", "dash-extra");
    extra.innerHTML = `
      <section class="dash-todo"><h4>À faire</h4>${todo.length ? `<div class="dash-todo-list">${todo.map(([go, icon, count, label, tone]) => `<button type="button" class="dash-todo-item ${tone}" data-dash-go="${go}"><i class="bi ${icon}" aria-hidden="true"></i><strong>${count}</strong><span>${label}</span><i class="bi bi-arrow-right" aria-hidden="true"></i></button>`).join("")}</div>` : '<p class="dash-ok"><i class="bi bi-check-circle" aria-hidden="true"></i> Rien à traiter pour le moment.</p>'}</section>
      <section class="dash-card"><div class="dash-card-head"><h4>Ventes · 7 derniers jours</h4><strong>${euro(total7)}</strong></div>
        <div class="dash-chart" role="img" aria-label="Ventes des 7 derniers jours">${days.map((day) => `<div class="chart-col"><span class="chart-val">${day.value ? compact(day.value) : ""}</span><div class="chart-track"><i style="height:${day.value ? Math.max(6, (day.value / max) * 100) : 0}%"></i></div><b>${day.label}</b></div>`).join("")}</div></section>
      <div class="dash-two">
        <section class="dash-card"><h4>Produits les plus vendus</h4>${best.length ? best.map((row) => `<div class="top-row"><img src="${esc(row.image)}" alt="" loading="lazy" /><div><strong>${esc(row.name)}</strong><div class="top-bar"><i style="width:${(row.quantity / bestMax) * 100}%"></i></div></div><span>${row.quantity}×</span></div>`).join("") : '<p class="dash-empty">Les ventes apparaîtront ici.</p>'}</section>
        <section class="dash-card"><h4>Commandes par statut</h4>${statusTotal ? `<div class="status-bar">${byStatus.map((row, index) => (row.count ? `<i class="s${index}" style="flex:${row.count}" title="${row.step} : ${row.count}"></i>` : "")).join("")}</div><ul class="status-legend">${byStatus.map((row, index) => `<li><i class="s${index}"></i>${row.step}<b>${row.count}</b></li>`).join("")}</ul>` : '<p class="dash-empty">Aucune commande pour le moment.</p>'}</section>
      </div>`;
    stats.after(extra);
  }

  document.addEventListener("click", (event) => {
    const go = event.target.closest("[data-dash-go]")?.dataset.dashGo;
    if (!go) return;
    if (go === "chat") {
      typeof chatButton !== "undefined" && chatButton.click();
      return;
    }
    if (go === "products") {
      prodState.filter = "low";
    }
    activateAdminView(go);
    if (go === "products") applyProductFilters();
  });

  /* ====================================================================== */
  /* 4. PRODUITS : recherche, filtres, tri, modification, alerte             */
  /* ====================================================================== */
  const productOfRow = (row) =>
    products.find((product) => String(product.id) === row.dataset.pid);
  const stockKey = (product) => {
    if (!F.stockOf || F.unlimited(product)) return "ok";
    const n = F.stockOf(product);
    return n <= 0 ? "out" : n <= F.LOW ? "low" : "ok";
  };
  let lastChips = "";

  function ensureProductTools() {
    const panel = $('[data-admin-panel="products"]');
    if (!panel || $(".prod-tools", panel)) return;
    const tools = h("div", "prod-tools");
    tools.innerHTML = `<div class="msgr-search"><i class="bi bi-search" aria-hidden="true"></i><input type="search" id="prod-q" placeholder="Rechercher un produit" autocomplete="off" /></div>
      <div class="notif-chips" id="prod-chips"></div>
      <select id="prod-sort" aria-label="Trier les produits"><option value="recent">Plus récents</option><option value="name">Nom A–Z</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option><option value="stock-asc">Stock croissant</option></select>`;
    ($(".admin-view-heading", panel) || panel.firstElementChild).after(tools);
    $("#prod-q", tools).addEventListener("input", (event) => {
      prodState.q = event.target.value;
      applyProductFilters();
    });
    $("#prod-sort", tools).addEventListener("change", (event) => {
      prodState.sort = event.target.value;
      applyProductFilters();
    });
    $("#prod-chips", tools).addEventListener("click", (event) => {
      const chip = event.target.closest("[data-prod-filter]");
      if (chip) {
        prodState.filter = chip.dataset.prodFilter;
        applyProductFilters();
      }
    });
    new MutationObserver((records) => {
      const toolbar = $(".prod-tools", panel);
      if (records.every((record) => toolbar?.contains(record.target))) return;
      applyProductFilters();
    }).observe(panel, { childList: true, subtree: true });
  }

  function applyProductFilters() {
    const panel = $('[data-admin-panel="products"]');
    const table = panel && $(".space-products", panel);
    if (!table) return;
    ensureProductTools();
    const rows = $$(".space-row[data-pid]", table);
    const query = prodState.q.trim().toLowerCase();
    const counts = { all: 0, out: 0, low: 0, promo: 0 };
    rows.forEach((row) => {
      const product = productOfRow(row);
      if (!product) return;
      const state = stockKey(product),
        promo = Boolean(product.discount);
      // boutons « Modifier » et « Alerter » (une seule fois par ligne)
      const actions = $(".space-row-actions", row);
      if (actions && !$(".prod-edit", actions)) {
        actions.append(
          h(
            "button",
            "space-mini prod-edit",
            '<i class="bi bi-pencil" aria-hidden="true"></i>Modifier',
          ),
        );
        $(".prod-edit", actions).dataset.prodEdit = product.id;
        if (can("staff") && !F.unlimited?.(product)) {
          const alert = h(
            "button",
            "space-mini prod-alert",
            '<i class="bi bi-bell" aria-hidden="true"></i>',
          );
          alert.dataset.prodAlert = product.id;
          alert.title = "Alerter le gestionnaire de stock";
          alert.setAttribute("aria-label", "Alerter le gestionnaire de stock");
          actions.prepend(alert);
        }
      }
      counts.all++;
      if (state === "out") counts.out++;
      if (state === "low") counts.low++;
      if (promo) counts.promo++;
      const matchesQuery =
        !query ||
        `${product.name} ${product.material || ""} ${(product.categoryPath || [product.category]).join(" ")}`
          .toLowerCase()
          .includes(query);
      const matchesFilter =
        prodState.filter === "all" ||
        (prodState.filter === "out" && state === "out") ||
        (prodState.filter === "low" && (state === "low" || state === "out")) ||
        (prodState.filter === "promo" && promo);
      row.hidden = !(matchesQuery && matchesFilter);
    });

    const chips = [
      ["all", "Tous", counts.all],
      ["out", "Épuisés", counts.out],
      ["low", "Stock faible", counts.low + counts.out],
      ["promo", "En promo", counts.promo],
    ]
      .map(
        ([key, label, count]) =>
          `<button type="button" class="notif-chip ${prodState.filter === key ? "active" : ""}" data-prod-filter="${key}">${label}<b>${count}</b></button>`,
      )
      .join("");
    if (chips !== lastChips) {
      lastChips = chips;
      const holder = $("#prod-chips");
      if (holder) holder.innerHTML = chips;
    }
    const select = $("#prod-sort");
    if (select && select.value !== prodState.sort)
      select.value = prodState.sort;
    const input = $("#prod-q");
    if (input && input.value !== prodState.q) input.value = prodState.q;

    // tri (seulement si l'ordre change : évite les boucles avec les autres observateurs)
    const byPid = (row) => productOfRow(row);
    const compare = {
      name: (a, b) => byPid(a).name.localeCompare(byPid(b).name, "fr"),
      "price-asc": (a, b) => byPid(a).price - byPid(b).price,
      "price-desc": (a, b) => byPid(b).price - byPid(a).price,
      "stock-asc": (a, b) =>
        (F.stockOf?.(byPid(a)) ?? 0) - (F.stockOf?.(byPid(b)) ?? 0),
      recent: (a, b) => byPid(b).id - byPid(a).id,
    }[prodState.sort];
    const valid = rows.filter((row) => productOfRow(row));
    const sorted = valid.slice().sort(compare);
    if (sorted.some((row, index) => row !== valid[index]))
      sorted.forEach((row) => table.append(row));
  }

  function editProductDialog(id) {
    const product = products.find((item) => String(item.id) === String(id));
    if (!product) return;
    const free = F.unlimited?.(product);
    const box = dialog(`${dlgHead("Modifier le produit")}
      <form class="space-form" id="prod-edit">
        <label>Nom<input id="pe-name" type="text" value="${esc(product.name)}" required /></label>
        <div class="adm-two">
          <label>Prix (Ar)<input id="pe-price" type="number" min="0" step="100" value="${Math.round(product.price * currencyRate)}" required /></label>
          <label>Remise (%)<input id="pe-discount" type="number" min="0" max="90" step="1" value="${product.discount || 0}" /></label>
        </div>
        ${free ? "" : `<label>Stock disponible<input id="pe-stock" type="number" min="0" step="1" value="${F.stockOf(product)}" /></label>`}
        <label>Description courte<input id="pe-material" type="text" value="${esc(product.material || "")}" /></label>
        <div class="adm-actions"><button type="button" class="space-mini" data-dlg-close>Annuler</button><button class="space-mini primary" type="submit">Enregistrer</button></div>
      </form>`);
    $("#prod-edit", box).addEventListener("submit", (event) => {
      event.preventDefault();
      const name = $("#pe-name", box).value.trim();
      const price = (Number($("#pe-price", box).value) || 0) / currencyRate;
      const discount = Math.min(
        90,
        Math.max(0, Math.round(Number($("#pe-discount", box).value) || 0)),
      );
      if (!name) return;
      const changes = [];
      if (name !== product.name) changes.push("nom");
      if (Math.abs(price - product.price) > 1e-9)
        changes.push(`prix ${euro(product.price)} → ${euro(price)}`);
      if (discount !== (product.discount || 0))
        changes.push(`remise ${product.discount || 0} % → ${discount} %`);
      product.name = name;
      product.price = price;
      product.discount = discount;
      product.material = $("#pe-material", box).value.trim();
      localStorage.setItem("etokiana-products", JSON.stringify(products));
      const stockInput = $("#pe-stock", box);
      if (stockInput && !free) {
        const before = F.stockOf(product),
          after = Math.max(0, Math.floor(Number(stockInput.value) || 0));
        if (before !== after) {
          F.setStock(product.id, after);
          changes.push(`stock ${before} → ${after}`);
        }
      }
      cart.forEach((item) => {
        if (item.id === product.id)
          Object.assign(item, {
            name: product.name,
            price: product.price,
            discount: product.discount,
            material: product.material,
          });
      });
      saveCart();
      log(
        "catalog",
        `Produit modifié : ${product.name}${changes.length ? ` (${changes.join(", ")})` : ""}`,
      );
      renderProducts();
      window.EtoSpaces?.renderAdminProducts();
      try {
        renderAdminDashboard();
      } catch {
        /* tableau de bord fermé */
      }
      renderDashboardExtra();
      box.remove();
      toast("Produit mis à jour");
    });
  }

  function alertStockManager(id) {
    const product = products.find((item) => String(item.id) === String(id));
    if (!product) return;
    const emails = emailsFor("products").filter(
      (email) => email !== currentUser?.email,
    );
    if (!emails.length) {
      toast(
        "Aucun gestionnaire de stock actif : invitez-en un dans Personnel.",
      );
      return;
    }
    const n = F.stockOf(product);
    const message =
      n <= 0
        ? `Stock épuisé : ${product.name}`
        : `Stock faible : ${product.name} (plus que ${n})`;
    emails.forEach((email) => addNotification(email, message));
    log("catalog", `Alerte stock envoyée : ${product.name}`);
    toast(
      `Alerte envoyée à ${emails.length} gestionnaire${emails.length > 1 ? "s" : ""} de stock`,
    );
  }

  document.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-prod-edit]");
    if (edit) {
      editProductDialog(edit.dataset.prodEdit);
      return;
    }
    const alertButton = event.target.closest("[data-prod-alert]");
    if (alertButton) alertStockManager(alertButton.dataset.prodAlert);
  });

  /* ====================================================================== */
  /* 5. CLIENTS (recherche) + EXPORTS CSV                                    */
  /* ====================================================================== */
  let customerQuery = "";
  function enhanceCustomers() {
    const panel = $('[data-admin-panel="customers"]');
    if (!panel) return;
    if (!$(".cust-tools", panel)) {
      const tools = h(
        "div",
        "prod-tools cust-tools",
        '<div class="msgr-search"><i class="bi bi-search" aria-hidden="true"></i><input type="search" id="cust-q" placeholder="Rechercher un client (nom, e-mail, téléphone)" autocomplete="off" /></div>',
      );
      ($(".admin-view-heading", panel) || panel.firstElementChild).after(tools);
      $("#cust-q", tools).addEventListener("input", (event) => {
        customerQuery = event.target.value;
        filterCustomers();
      });
    }
    filterCustomers();
  }
  function filterCustomers() {
    const query = customerQuery.trim().toLowerCase();
    $$('[data-admin-panel="customers"] .admin-table-row').forEach((row) => {
      row.hidden =
        Boolean(query) && !row.textContent.toLowerCase().includes(query);
    });
  }

  function downloadCSV(filename, rows) {
    const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const url = URL.createObjectURL(
      new Blob(
        ["\ufeff" + rows.map((row) => row.map(quote).join(";")).join("\n")],
        { type: "text/csv;charset=utf-8" },
      ),
    );
    const link = Object.assign(document.createElement("a"), {
      href: url,
      download: filename,
    });
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function addExportButtons() {
    const ordersHeading = $('[data-admin-panel="orders"] .hist-heading');
    if (ordersHeading && !$('[data-export="orders"]', ordersHeading)) {
      const button = h(
        "button",
        "space-mini",
        '<i class="bi bi-download" aria-hidden="true"></i>Exporter CSV',
      );
      button.dataset.export = "orders";
      ordersHeading.append(button);
    }
    const historyHeading = $('[data-admin-panel="history"] .hist-heading');
    if (
      historyHeading &&
      can("staff") &&
      !$('[data-export="history"]', historyHeading)
    ) {
      const button = h(
        "button",
        "space-mini",
        '<i class="bi bi-download" aria-hidden="true"></i>Exporter CSV',
      );
      button.dataset.export = "history";
      historyHeading.append(button);
    }
  }
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-export]");
    if (!button) return;
    if (button.dataset.export === "orders") {
      downloadCSV(
        "commandes-e-tokiana.csv",
        [
          [
            "Commande",
            "Date",
            "Client",
            "E-mail",
            "Statut",
            "Montant (Ar)",
            "Articles",
          ],
        ].concat(
          scopedOrders().map((order) => [
            order.id,
            order.date ? new Date(order.date).toLocaleString("fr-FR") : "",
            order.buyerName || "",
            order.buyerId || "",
            order.status,
            Math.round(orderValue(order) * currencyRate),
            ownLines(order)
              .map((item) => `${item.name} × ${item.quantity}`)
              .join(" | "),
          ]),
        ),
      );
    } else if (button.dataset.export === "history" && can("staff")) {
      downloadCSV(
        "historique-e-tokiana.csv",
        [["Date", "Utilisateur", "E-mail", "Rôle", "Type", "Action"]].concat(
          (F.readLog?.() || [])
            .slice()
            .reverse()
            .map((entry) => [
              new Date(entry.date).toLocaleString("fr-FR"),
              entry.name,
              entry.email,
              entry.role,
              entry.type,
              entry.text,
            ]),
        ),
      );
    }
  });

  /* ====================================================================== */
  /* 6. MON PROFIL + MOT DE PASSE                                            */
  /* ====================================================================== */
  const storedAccount = () =>
    readUsers().some((user) => user.email === currentUser?.email);
  const passFormHTML = (prefix) =>
    storedAccount()
      ? `<form class="space-form" id="${prefix}-pass-form" data-pass-form><h3>Mot de passe</h3>
        <label>Mot de passe actuel<input type="password" data-pw="cur" autocomplete="current-password" required /></label>
        <label>Nouveau mot de passe<input type="password" data-pw="new" autocomplete="new-password" minlength="6" placeholder="6 caractères minimum" required /></label>
        <label>Confirmer<input type="password" data-pw="confirm" autocomplete="new-password" minlength="6" required /></label>
        <button class="button button-dark" type="submit">Changer le mot de passe <i class="bi bi-key" aria-hidden="true"></i></button></form>`
      : '<div class="space-form"><h3>Mot de passe</h3><p class="modal-muted">Compte de démonstration : le mot de passe ne peut pas être modifié.</p></div>';

  document.addEventListener("submit", (event) => {
    const form = event.target.closest?.("[data-pass-form]");
    if (!form) return;
    event.preventDefault();
    const users = readUsers();
    const index = users.findIndex((user) => user.email === currentUser?.email);
    const current = $('[data-pw="cur"]', form).value,
      next = $('[data-pw="new"]', form).value,
      confirmation = $('[data-pw="confirm"]', form).value;
    if (index < 0)
      return toast("Compte de démonstration : mot de passe non modifiable.");
    if (users[index].password !== current)
      return toast("Mot de passe actuel incorrect.");
    if (next.length < 6) return toast("6 caractères minimum.");
    if (next !== confirmation)
      return toast("Les deux mots de passe ne correspondent pas.");
    users[index].password = next;
    writeUsers(users);
    currentUser.password = next;
    nativeSet.call(localStorage, "etokiana-user", JSON.stringify(currentUser));
    form.reset();
    log("profile", "Mot de passe modifié");
    toast("Mot de passe mis à jour.");
  });

  function ensureProfileTab() {
    const nav = $("#admin-modal .admin-nav");
    const links = $(".space-links", nav);
    if (!links) return;
    let tab = $('[data-admin-view="profile"]', nav);
    if (!tab) {
      tab = h("button", "admin-nav-item");
      tab.type = "button";
      tab.dataset.adminView = "profile";
      tab.dataset.keep = "1";
      tab.innerHTML =
        '<i class="bi bi-person-gear" aria-hidden="true"></i><span>Mon profil</span>';
      tab.addEventListener("click", () => {
        activateAdminView("profile");
        renderProfilePanel();
      });
    }
    links.before(tab);
    let panel = $('[data-admin-panel="profile"]');
    if (!panel) {
      panel = h("div", "admin-view");
      panel.dataset.adminPanel = "profile";
      $(".admin-content").append(panel);
    }
  }

  function renderProfilePanel() {
    const panel = $('[data-admin-panel="profile"]');
    if (!panel || !currentUser) return;
    const stored = storedAccount();
    const role =
      currentUser.role === "staff"
        ? currentUser.staffRole
        : currentUser.role === "seller"
          ? "Vendeur"
          : "Administrateur";
    panel.innerHTML = `<div class="hist-heading"><div><p class="eyebrow">Compte</p><h3>Mon profil</h3></div></div>
      ${stored ? "" : '<p class="adm-note">Compte de démonstration : les modifications ne sont conservées que pendant la session.</p>'}
      <div class="adm-grid">
        <form class="space-form" id="adm-profile-form"><h3>Mes informations</h3>
          <label>${isSellerUser() ? "Nom de la boutique" : "Nom complet"}<input id="ap-name" type="text" value="${esc(currentUser.name || "")}" required /></label>
          <label>Téléphone<input id="ap-phone" type="tel" value="${esc(currentUser.phone || "")}" placeholder="+261 34 00 000 00" /></label>
          <label>E-mail<input type="email" value="${esc(currentUser.email || "")}" readonly /></label>
          <label>Rôle<input type="text" value="${esc(role)}" readonly /></label>
          <button class="button button-dark" type="submit">Enregistrer <i class="bi bi-check2" aria-hidden="true"></i></button></form>
        ${passFormHTML("ap")}
      </div>`;
    $("#adm-profile-form", panel).addEventListener("submit", (event) => {
      event.preventDefault();
      currentUser.name = $("#ap-name", panel).value.trim() || currentUser.name;
      currentUser.phone = $("#ap-phone", panel).value.trim();
      localStorage.setItem("etokiana-user", JSON.stringify(currentUser));
      const users = readUsers();
      const index = users.findIndex((user) => user.email === currentUser.email);
      if (index > -1) {
        users[index] = {
          ...users[index],
          name: currentUser.name,
          phone: currentUser.phone,
        };
        writeUsers(users);
      }
      updateProfileButton();
      toast("Profil enregistré.");
    });
  }

  // Mot de passe aussi dans l'espace client
  onOpen("#account-modal", () => {
    const form = $("#space-profile-form");
    if (
      !form ||
      $("#sp-pass-form") ||
      $("#account-modal .space-form:not(#space-profile-form)")
    )
      return;
    form.insertAdjacentHTML("afterend", passFormHTML("sp"));
  });

  /* ====================================================================== */
  /* Ouverture de l'espace admin / équipe / vendeur                          */
  /* ====================================================================== */
  function enhanceAdminSpace() {
    if (!currentUser) return;
    const nav = $("#admin-modal .admin-nav");
    if (!nav) return;
    ensureProfileTab();

    // droits : un onglet n'est visible que si le rôle y a accès
    const order = [
      "dashboard",
      "products",
      "orders",
      "sellers",
      "customers",
      "staff",
      "history",
      "profile",
    ];
    order.forEach((view) => {
      const tab = $(`[data-admin-view="${view}"]`, nav);
      if (tab) tab.hidden = !can(view);
    });
    const legacy = $('[data-admin-view="seller-sales"]', nav);
    if (legacy) legacy.hidden = true;
    const active = $(".admin-nav-item.active", nav);
    if (!active || active.hidden)
      activateAdminView(
        order.find(
          (view) => can(view) && $(`[data-admin-view="${view}"]`, nav),
        ) || "dashboard",
      );

    // boutons « ajouter un produit » : réservés aux rôles qui gèrent les produits
    $$(
      '.admin-actions [data-admin-message*="produit"], [data-admin-panel="products"] .admin-view-heading .admin-action',
    ).forEach((button) => {
      button.hidden = !can("products");
    });

    renderDashboardExtra();
    if (can("staff")) renderStaff();
    if (can("products")) {
      ensureProductTools();
      applyProductFilters();
    }
    if (can("customers")) enhanceCustomers();
    addExportButtons();
    if (can("profile")) renderProfilePanel();
  }
  onOpen("#admin-modal", enhanceAdminSpace);

  // Les listes sont redessinées par features.js après un changement de statut
  $(".admin-content")?.addEventListener("click", (event) => {
    if (event.target.closest("[data-order-status]"))
      setTimeout(() => {
        addExportButtons();
        renderDashboardExtra();
      }, 0);
  });
})();
