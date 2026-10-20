const categoryNames = {
  fashion: "Prêt-à-porter / Mode",
  home: "Maison & Décoration",
  tech: "Électronique / High-Tech",
  grocery: "Épicerie fine / Alimentaire",
};
const catalogCategoryPaths = [
  ...["Robes", "Tops", "Pantalons"].map((item) => [
    categoryNames.fashion,
    "Femme",
    "Vêtements",
    item,
  ]),
  ...["Baskets", "Talons", "Bottines"].map((item) => [
    categoryNames.fashion,
    "Femme",
    "Chaussures",
    item,
  ]),
  ...["Sacs", "Bijoux", "Écharpes"].map((item) => [
    categoryNames.fashion,
    "Femme",
    "Accessoires",
    item,
  ]),
  ...["Chemises", "T-shirts", "Jeans"].map((item) => [
    categoryNames.fashion,
    "Homme",
    "Vêtements",
    item,
  ]),
  ...["Chaussures de ville", "Baskets"].map((item) => [
    categoryNames.fashion,
    "Homme",
    "Chaussures",
    item,
  ]),
  [categoryNames.fashion, "Nouveautés & Promos"],
  ...["Canapés", "Tables", "Chaises", "Lits"].map((item) => [
    categoryNames.home,
    "Mobilier",
    item,
  ]),
  ...["Lampadaires", "Suspensions", "Lampes à poser"].map((item) => [
    categoryNames.home,
    "Luminaires",
    item,
  ]),
  ...["Linge de lit", "Rideaux", "Coussins"].map((item) => [
    categoryNames.home,
    "Textile de maison",
    item,
  ]),
  ...["Cadres", "Miroirs", "Affiches"].map((item) => [
    categoryNames.home,
    "Décoration murale",
    item,
  ]),
  ...["Ordinateurs portables", "Écrans", "Composants"].map((item) => [
    categoryNames.tech,
    "Informatique",
    item,
  ]),
  ...["Smartphones", "Coques", "Chargeurs"].map((item) => [
    categoryNames.tech,
    "Téléphonie",
    item,
  ]),
  ...["Casques audio", "Enceintes", "Téléviseurs"].map((item) => [
    categoryNames.tech,
    "Audio & Vidéo",
    item,
  ]),
  ...["Montres intelligentes", "Domotique"].map((item) => [
    categoryNames.tech,
    "Objets connectés",
    item,
  ]),
  ...["Huiles d’olive", "Épices", "Conserves fines"].map((item) => [
    categoryNames.grocery,
    "Salé",
    item,
  ]),
  ...["Chocolats", "Biscuits", "Confitures"].map((item) => [
    categoryNames.grocery,
    "Sucré",
    item,
  ]),
  ...["Vins", "Cafés", "Thés bio"].map((item) => [
    categoryNames.grocery,
    "Boissons",
    item,
  ]),
  ...["Paniers garnis", "Assortiments"].map((item) => [
    categoryNames.grocery,
    "Coffrets cadeaux",
    item,
  ]),
  [categoryNames.home, "Art de la table"],
  [categoryNames.home, "Décoration & senteurs"],
  ["Beauté"],
  ["Loisirs"],
  ["Services"],
];
const legacyCategoryNames = {
  Maison: categoryNames.home,
  Table: categoryNames.home,
  Mode: categoryNames.fashion,
  Tech: categoryNames.tech,
  Épicerie: categoryNames.grocery,
  Soin: "Beauté",
};
const legacyImageReplacements = {
  "https://images.unsplash.com/photo-1578500351865-d6c3706e5e8c?auto=format&fit=crop&w=700&q=85":
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1607006483225-2d9e2346efae?auto=format&fit=crop&w=700&q=85":
    "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1583845112203-454c7b4c5bb3?auto=format&fit=crop&w=700&q=85":
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1610701596421-1f2f6bdb1a3a?auto=format&fit=crop&w=700&q=85":
    "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=700&q=85",
};
const legacyProductPaths = {
  1: [categoryNames.home, "Décoration & senteurs"],
  2: [categoryNames.home, "Art de la table"],
  3: [categoryNames.home, "Décoration & senteurs"],
  5: [categoryNames.home, "Art de la table"],
  6: [categoryNames.home, "Textile de maison", "Linge de lit"],
  8: [categoryNames.home, "Art de la table"],
  10: [categoryNames.home, "Décoration & senteurs"],
  11: [categoryNames.home, "Art de la table"],
  12: [categoryNames.home, "Décoration & senteurs"],
  13: [categoryNames.fashion, "Homme", "Vêtements", "Chemises"],
  14: [categoryNames.fashion, "Femme", "Accessoires", "Sacs"],
  15: [categoryNames.fashion, "Homme", "Chaussures", "Baskets"],
  16: [categoryNames.tech, "Audio & Vidéo", "Casques audio"],
  17: [categoryNames.home, "Luminaires", "Lampes à poser"],
  18: [categoryNames.tech, "Informatique", "Composants"],
  22: [categoryNames.grocery, "Boissons", "Cafés"],
  23: [categoryNames.grocery, "Salé", "Huiles d’olive"],
  24: [categoryNames.grocery, "Boissons", "Thés bio"],
};

let products = [
  {
    id: 1,
    name: "Vase Silo",
    category: "Maison",
    material: "Grès chamotté · Écru",
    price: 48,
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=85",
    tag: "Nouveau",
  },
  {
    id: 2,
    name: "Tasse Alba",
    category: "Table",
    material: "Céramique · Sienne",
    price: 24,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 3,
    name: "Bougie N°04",
    category: "Maison",
    material: "Cire végétale · Pin",
    price: 32,
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=85",
    tag: "Best-seller",
    discount: 10,
    sellerId: "demo-seller",
  },
  {
    id: 4,
    name: "Savon Surgras",
    category: "Soin",
    material: "Huile d’olive · 100 g",
    price: 14,
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 5,
    name: "Pichet Onda",
    category: "Table",
    material: "Grès émaillé · Bleu",
    price: 58,
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 6,
    name: "Linge Fala",
    category: "Maison",
    material: "Lin lavé · Sable",
    price: 36,
    image:
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 7,
    name: "Huile Visage",
    category: "Soin",
    material: "Jojoba · 30 ml",
    price: 29,
    image:
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=85",
    tag: "Rituel",
  },
  {
    id: 8,
    name: "Assiette Lune",
    category: "Table",
    material: "Faïence · Craie",
    price: 19,
    image:
      "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 9,
    name: "Porte-savon Aube",
    category: "Soin",
    material: "Céramique · Rose pâle",
    price: 18,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 10,
    name: "Boîte Calme",
    category: "Maison",
    material: "Bois de hêtre · Naturel",
    price: 42,
    image:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 11,
    name: "Cuillère Sève",
    category: "Table",
    material: "Bois d’olivier · 18 cm",
    price: 16,
    image:
      "https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 12,
    name: "Brume Chambre",
    category: "Maison",
    material: "Néroli · 100 ml",
    price: 26,
    image:
      "https://images.unsplash.com/photo-1611073761687-6e58f5b84b6c?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 13,
    name: "Surchemise Atlas",
    category: "Mode",
    material: "Coton recyclé · M",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=700&q=85",
    tag: "Nouveau",
  },
  {
    id: 14,
    name: "Sac Weekend",
    category: "Mode",
    material: "Toile canvas · Kaki",
    price: 74,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 15,
    name: "Baskets Nova",
    category: "Mode",
    material: "Cuir végétal · 41",
    price: 96,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 16,
    name: "Casque Sonar",
    category: "Tech",
    material: "Audio sans fil · Noir",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",
    tag: "Top vente",
  },
  {
    id: 17,
    name: "Lampe Halo",
    category: "Tech",
    material: "LED rechargeable · Sable",
    price: 64,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 18,
    name: "Clavier Compact",
    category: "Tech",
    material: "Bluetooth · Crème",
    price: 58,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 19,
    name: "Crème Mains",
    category: "Beauté",
    material: "Karité · 75 ml",
    price: 16,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 20,
    name: "Palette Terre",
    category: "Beauté",
    material: "Pigments naturels · 6 tons",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 21,
    name: "Peigne Atelier",
    category: "Beauté",
    material: "Acétate · Écaille",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1522338140262-f46f5913618a?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 22,
    name: "Café Origine",
    category: "Épicerie",
    material: "Arabica · 250 g",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=700&q=85",
    tag: "Artisan",
  },
  {
    id: 23,
    name: "Huile d’olive",
    category: "Épicerie",
    material: "Première pression · 500 ml",
    price: 21,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 24,
    name: "Coffret Infusions",
    category: "Épicerie",
    material: "Plantes bio · 20 sachets",
    price: 19,
    image:
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 25,
    name: "Carnet Relié",
    category: "Loisirs",
    material: "Papier recyclé · A5",
    price: 17,
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 26,
    name: "Kit Aquarelle",
    category: "Loisirs",
    material: "12 couleurs · Nomade",
    price: 34,
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 27,
    name: "Tapis Yoga",
    category: "Loisirs",
    material: "Liège naturel · 4 mm",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 28,
    name: "Ménage à domicile",
    category: "Services",
    material: "Réservation · 2 heures",
    price: 42,
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=85",
    tag: "Service",
  },
  {
    id: 29,
    name: "Cours de cuisine",
    category: "Services",
    material: "Atelier · 1 personne",
    price: 65,
    image:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=700&q=85",
    tag: "Réservable",
  },
  {
    id: 30,
    name: "Robe Alba",
    category: categoryNames.fashion,
    categoryPath: [categoryNames.fashion, "Femme", "Vêtements", "Robes"],
    material: "Coton biologique · S",
    price: 78,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85",
    tag: "Nouveau",
  },
  {
    id: 31,
    name: "T-shirt Minéral",
    category: categoryNames.fashion,
    categoryPath: [categoryNames.fashion, "Homme", "Vêtements", "T-shirts"],
    material: "Jersey de coton · M",
    price: 32,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 32,
    name: "Canapé Sillage",
    category: categoryNames.home,
    categoryPath: [categoryNames.home, "Mobilier", "Canapés"],
    material: "Lin naturel · 3 places",
    price: 890,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=85",
    tag: "Pièce signature",
  },
  {
    id: 33,
    name: "Smartphone Orée",
    category: categoryNames.tech,
    categoryPath: [categoryNames.tech, "Téléphonie", "Smartphones"],
    material: "128 Go · Vert sauge",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: 34,
    name: "Coffret Cacao",
    category: categoryNames.grocery,
    categoryPath: [categoryNames.grocery, "Sucré", "Chocolats"],
    material: "Chocolat noir · 12 pièces",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=85",
    tag: "Artisan",
  },
  {
    id: 35,
    name: "Montre Tempo",
    category: categoryNames.tech,
    categoryPath: [
      categoryNames.tech,
      "Objets connectés",
      "Montres intelligentes",
    ],
    material: "Suivi santé · Noir",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
  },
];

const demonstrationProducts = products;
const savedProducts = JSON.parse(
  localStorage.getItem("etokiana-products") || JSON.stringify(products),
);
const savedProductIds = new Set(
  savedProducts.map((product) => String(product.id)),
);
products = [
  ...savedProducts,
  ...demonstrationProducts.filter(
    (product) => !savedProductIds.has(String(product.id)),
  ),
];
const getStoredAccountsForProducts = () => {
  try { return JSON.parse(localStorage.getItem("etokiana-users") || "[]"); }
  catch (_) { return []; }
};
const isSellerRoleValue = (role) => ["seller", "vendeur", "vendor"].includes(
  String(role || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(),
);
products = products.map((product) => {
  const category = legacyCategoryNames[product.category] || product.category;
  const categoryPath =
    Array.isArray(product.categoryPath) && product.categoryPath.length
      ? product.categoryPath
      : legacyProductPaths[product.id] || [category];
  const accounts = getStoredAccountsForProducts();
  const originalSellerId = String(product.sellerId ?? (product.id === 3 ? "demo-seller" : "owner"));
  const creatorId = String(product.createdById ?? product.publisherId ?? "");
  const creatorName = String(product.createdByName ?? product.publisherName ?? product.creatorName ?? "").trim().toLocaleLowerCase("fr-FR");
  const creatorAccount = accounts.find((account) =>
    (creatorId && String(account.id) === creatorId) ||
    (creatorName && String(account.name || account.fullName || "").trim().toLocaleLowerCase("fr-FR") === creatorName && isSellerRoleValue(account.role))
  );
  // Répare les anciennes fiches attribuées par erreur à E-tokiana alors
  // qu'elles ont été publiées par un compte vendeur identifié.
  const sellerId = ["owner", "admin", "superadmin", ""].includes(originalSellerId) && creatorAccount && isSellerRoleValue(creatorAccount.role)
    ? String(creatorAccount.id)
    : originalSellerId;
  return {
    ...product,
    sellerId,
    discount: Number(product.discount) || (product.id === 3 ? 10 : 0),
    image: legacyImageReplacements[product.image] || product.image,
    category: categoryPath[0] || category,
    categoryPath,
  };
});

// Référence métier structurée : catégorie, sous-catégorie, produit, vendeur,
// options de couleur/taille et suffixe séquentiel garantissant l'unicité.
function productReferenceNumber(reference) {
  const value = String(reference || "").trim().toUpperCase();
  const composite = value.match(/-(\d{4,})$/);
  if (composite) return Number(composite[1]);
  const legacy = value.match(/^ETK-(\d+)$/);
  return legacy ? Number(legacy[1]) : 0;
}
function formatProductReference(number) {
  return String(number).padStart(4, "0");
}
function referenceAscii(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}
function referenceToken(value, maxLength = 3, fallback = "GEN") {
  const compact = referenceAscii(value).replace(/\s+/g, "");
  return compact.slice(0, maxLength) || fallback;
}
function productNameReferenceToken(name) {
  const words = referenceAscii(name).split(/\s+/).filter(Boolean);
  if (!words.length) return "PROD";
  if (words.length === 1) return words[0].slice(0, 6) || "PROD";
  return words.slice(0, 2).map((word) => word.slice(0, 3)).join("").slice(0, 6) || "PROD";
}
function productCategoryReferenceToken(categoryPath, category) {
  const root = String((categoryPath && categoryPath[0]) || category || "");
  const norm = referenceAscii(root);
  const known = [
    [/PRET A PORTER|MODE/, "MOD"],
    [/MAISON|DECORATION/, "MAI"],
    [/ELECTRONIQUE|HIGH TECH|TECHNOLOG/, "TEC"],
    [/EPICERIE|ALIMENTAIRE|GROCERY/, "ALI"],
    [/SERVICE|RESERVATION/, "SER"],
    [/LOISIR|SPORT|JEU/, "LOI"],
    [/BEAUTE|BIEN ETRE|COSMET/, "BEA"],
    [/BEBE|ENFANT/, "ENF"],
    [/AUTO|MOTO|VEHICULE/, "AUT"],
    [/JARDIN|EXTERIEUR/, "JAR"],
  ];
  const match = known.find(([pattern]) => pattern.test(norm));
  return match ? match[1] : referenceToken(root, 3, "CAT");
}
function productSellerReferenceToken(sellerId) {
  const id = String(sellerId || "owner");
  if (id === "owner" || id === "admin" || id === "superadmin") return "ETK";
  if (id === "demo-seller") return "ANM";
  let seller = null;
  try {
    const users = JSON.parse(localStorage.getItem("etokiana-users") || "[]");
    seller = users.find((user) => String(user.id) === id) || null;
    if (!seller) {
      const active = JSON.parse(localStorage.getItem("etokiana-user") || "null");
      if (active && String(active.id) === id) seller = active;
    }
  } catch (_) { /* Une fiche vendeur absente ne doit pas empêcher la référence. */ }
  const sellerName = seller?.shopName || seller?.storeName || seller?.boutique || seller?.name || id;
  const words = referenceAscii(sellerName).split(/\s+/).filter(Boolean);
  if (words.length >= 3) return words.slice(0, 3).map((part) => part[0]).join("");
  if (words.length === 2) return (words[0][0] + words[1][0] + (words[0][1] || words[1][1] || "X")).slice(0, 3);
  return referenceToken(sellerName, 3, "VEN");
}
function productOptionList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || "").split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean);
}
const productColorPalette = [
  { value: "Noir", color: "#252525" },
  { value: "Blanc", color: "#FFFFFF" },
  { value: "Rouge", color: "#D94A4A" },
  { value: "Bleu", color: "#3979D5" },
  { value: "Vert", color: "#3D8A5D" },
  { value: "Vert sauge", color: "#A7B7A0" },
  { value: "Rose", color: "#E59AB7" },
  { value: "Jaune", color: "#E6C34D" },
  { value: "Orange", color: "#E8873B" },
  { value: "Violet", color: "#8C69C8" },
  { value: "Beige", color: "#D9C5A4" },
  { value: "Marron", color: "#8C5F48" },
  { value: "Gris", color: "#8E9299" },
  { value: "Doré", color: "#C9A64E" },
  { value: "Argenté", color: "#BFC6CC" },
  { value: "Multicolore", color: "conic-gradient(#e74c3c, #f1c40f, #2ecc71, #3498db, #9b59b6, #e74c3c)" },
];
function productSizePalette(categoryPath = []) {
  const path = referenceAscii((categoryPath || []).join(" "));
  if (/CHAUSSURE|BASKET|TALON|BOTTINE|SANDALE|MOCASSIN/.test(path)) {
    return ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
  }
  if (/SAC|BIJOU|ECHARPE|ACCESSOIRE|MONTRE|COQUE|CHARGEUR|COMPOSANT|CASQUE|ENCEINTE/.test(path)
      && !/CHAUSSURE|BASKET|TALON|BOTTINE|SANDALE|MOCASSIN/.test(path)) {
    return ["Unique", "Petit", "Moyen", "Grand"];
  }
  if (/SMARTPHONE|TELEPHONIE|TELEPHONE|MOBILE/.test(path)) {
    return ["64 Go", "128 Go", "256 Go", "512 Go", "1 To"];
  }
  if (/ORDINATEUR|INFORMATIQUE|ECRAN|TELEVISEUR|AUDIO VIDEO/.test(path)) {
    return ["13 pouces", "14 pouces", "15 pouces", "16 pouces", "21 pouces", "24 pouces", "27 pouces", "32 pouces", "43 pouces", "55 pouces", "65 pouces"];
  }
  if (/VETEMENT|VETEMENTS|ROBE|PANTALON|CHEMISE|TSHIRT|T SHIRT|TOP|JEAN|TEXTILE/.test(path)) {
    return ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "34", "36", "38", "40", "42", "44", "46", "48", "50", "52"];
  }
  if (/CANAPE|TABLE|CHAISE|LIT|RIDEAU|COUSSIN|LINGE|MOBILIER|MAISON|DECORATION/.test(path)) {
    return ["Unique", "Petit", "Moyen", "Grand", "90 × 190 cm", "140 × 190 cm", "160 × 200 cm", "180 × 200 cm"];
  }
  return ["Unique", "XS", "S", "M", "L", "XL", "Petit", "Moyen", "Grand"];
}
function getPaletteColor(value) {
  const normalized = referenceAscii(value);
  return productColorPalette.find((item) => referenceAscii(item.value) === normalized)?.color || "#D6D6CE";
}
function createVariantChoiceButton({ kind, value, selected, detail = false, onToggle }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = detail ? "pd-choice-button" : "variant-choice";
  button.classList.toggle("is-selected", Boolean(selected));
  button.setAttribute("aria-pressed", String(Boolean(selected)));
  button.setAttribute("aria-label", `${value}${selected ? ", sélectionné" : ""}`);
  button.title = value;
  if (kind === "color") {
    const swatch = document.createElement("span");
    swatch.className = "variant-color-swatch";
    const color = getPaletteColor(value);
    swatch.style.setProperty("--swatch-color", color);
    swatch.style.background = color;
    swatch.setAttribute("aria-hidden", "true");
    button.append(swatch);
  }
  const label = document.createElement("span");
  label.textContent = value;
  button.append(label);
  button.addEventListener("click", () => onToggle?.(value));
  return button;
}
function appendUnknownVariantOptions(presets, selected) {
  const options = [...presets];
  selected.forEach((value) => {
    if (!options.some((option) => referenceAscii(option.value || option) === referenceAscii(value))) options.push(value);
  });
  return options;
}

function productOptionReferenceToken(values, noneToken = "NA") {
  const options = productOptionList(values);
  if (!options.length) return noneToken;
  if (options.length > 1) return "VAR";
  return referenceToken(options[0], 3, noneToken);
}
function productReferenceBase(product = {}) {
  const categoryPath = Array.isArray(product.categoryPath) && product.categoryPath.length
    ? product.categoryPath
    : [product.category || "Général"];
  const subcategory = categoryPath.length > 1 ? categoryPath[categoryPath.length - 1] : "Général";
  return [
    productCategoryReferenceToken(categoryPath, product.category),
    referenceToken(subcategory, 3, "GEN"),
    productNameReferenceToken(product.name),
    productSellerReferenceToken(product.sellerId),
    productOptionReferenceToken(product.availableColors || product.colors, "NC"),
    productOptionReferenceToken(product.availableSizes || product.sizes, "NT"),
  ].join("-");
}
function productReferenceUsedSet(exceptId = null) {
  return new Set(products
    .filter((item) => exceptId === null || String(item.id) !== String(exceptId))
    .map((item) => String(item.reference || item.sku || "").trim().toUpperCase())
    .filter(Boolean));
}
function findNextProductReference(product, commit = false) {
  const used = productReferenceUsedSet(product?.id ?? null);
  let number = Math.max(
    Number(localStorage.getItem("etokiana-product-reference-sequence") || 0),
    ...products.map((item) => productReferenceNumber(item.reference || item.sku)),
  );
  let candidate;
  do {
    number += 1;
    candidate = `${productReferenceBase(product)}-${formatProductReference(number)}`;
  } while (used.has(candidate.toUpperCase()));
  if (commit) localStorage.setItem("etokiana-product-reference-sequence", String(number));
  return candidate;
}
function assignMissingProductReferences(list) {
  const used = new Set();
  list.forEach((product) => {
    const supplied = String(product.reference || product.sku || product.productReference || "").trim().toUpperCase();
    if (supplied && !used.has(supplied)) {
      product.reference = supplied;
      used.add(supplied);
    } else {
      product.reference = "";
    }
  });
  list.forEach((product) => {
    if (product.reference) return;
    const id = Number(product.id);
    if (Number.isSafeInteger(id) && id > 0 && id <= 9999) {
      const candidate = `ETK-${formatProductReference(id)}`;
      if (!used.has(candidate)) {
        product.reference = candidate;
        used.add(candidate);
      }
    }
  });
  let nextNumber = Math.max(0, ...Array.from(used, productReferenceNumber));
  list.forEach((product) => {
    if (product.reference) return;
    let candidate;
    do {
      nextNumber += 1;
      candidate = `ETK-${formatProductReference(nextNumber)}`;
    } while (used.has(candidate));
    product.reference = candidate;
    used.add(candidate);
  });
}
assignMissingProductReferences(products);
const maxAssignedProductReference = Math.max(
  0,
  ...products.map((product) => productReferenceNumber(product.reference)),
);
const savedProductReferenceSequence = Number(
  localStorage.getItem("etokiana-product-reference-sequence") || 0,
);
localStorage.setItem(
  "etokiana-product-reference-sequence",
  String(Math.max(savedProductReferenceSequence, maxAssignedProductReference)),
);
window.getProductReference = function (product) {
  return String(product?.reference || product?.sku || "Référence indisponible");
};
function nextProductReference(product) {
  return findNextProductReference(product, true);
}

function populateCategorySelects() {
  const groupedPaths = catalogCategoryPaths.reduce((groups, path) => {
    const category = path[0];
    groups[category] ||= [];
    groups[category].push(path);
    return groups;
  }, {});
  const formCategory = document.querySelector("#new-product-category");
  Object.entries(groupedPaths).forEach(([category, paths]) => {
    const formGroup = document.createElement("optgroup");
    formGroup.label = category;
    paths.forEach((path) => {
      const value = JSON.stringify(path);
      const label = path.slice(1).join(" · ") || category;
      const formOption = new Option(label, value);
      formGroup.append(formOption);
    });
    formCategory.append(formGroup);
  });
}
populateCategorySelects();

const categoryFamilyPaths = Array.from(
  new Map(
    catalogCategoryPaths.map((path) => {
      const familyPath = path.length > 2 ? path.slice(0, -1) : path;
      return [JSON.stringify(familyPath), familyPath];
    }),
  ).values(),
);
const catalogRootPaths = Array.from(
  new Set(catalogCategoryPaths.map((path) => path[0])),
  (category) => [category],
);

function renderSubcategoryOptions() {
  const subcategoryFilter = document.querySelector("#subcategory-filter");
  const options = activeFamilyPath.length
    ? catalogCategoryPaths.filter(
        (path) =>
          path.length === activeFamilyPath.length + 1 &&
          activeFamilyPath.every((part, index) => path[index] === part),
      )
    : catalogRootPaths;
  const emptyLabel = activeFamilyPath.length
    ? "Toutes les sous-catégories"
    : "Toutes les catégories";
  subcategoryFilter.replaceChildren(new Option(emptyLabel, ""));
  options.forEach((path) =>
    subcategoryFilter.add(new Option(path.at(-1), JSON.stringify(path))),
  );
  subcategoryFilter.disabled =
    activeFamilyPath.length > 0 && options.length === 0;
}

function renderCategoryFamilyOptions() {
  const familyFilter = document.querySelector("#category-family-filter");
  const previousValue = familyFilter.value;
  const availablePaths = categoryFamilyPaths;
  const groups = new Map();
  availablePaths.forEach((path) => {
    if (!groups.has(path[0])) {
      const group = document.createElement("optgroup");
      group.label = path[0];
      groups.set(path[0], group);
    }
    groups
      .get(path[0])
      .append(
        new Option(path.slice(1).join(" · ") || path[0], JSON.stringify(path)),
      );
  });
  familyFilter.replaceChildren(
    new Option("Toutes les familles", ""),
    ...groups.values(),
  );
  familyFilter.value = availablePaths.some(
    (path) => JSON.stringify(path) === previousValue,
  )
    ? previousValue
    : "";
  activeFamilyPath = familyFilter.value ? JSON.parse(familyFilter.value) : [];
  renderSubcategoryOptions();
}

function refreshCatalogueDropdown(select) {
  const dropdown = document.querySelector(
    `[data-catalogue-dropdown="${select.id}"]`,
  );
  const toggle = dropdown.querySelector(".catalogue-dropdown-toggle");
  const valueLabel = toggle.querySelector(".catalogue-dropdown-value");
  const menu = dropdown.querySelector(".catalogue-dropdown-menu");
  const selectedOption = select.selectedOptions[0];
  const defaultLabels = {
    "category-family-filter": "Toutes les familles",
    "subcategory-filter": "Toutes les sous-catégories",
    "sort-select": "Notre sélection",
  };
  valueLabel.textContent =
    selectedOption?.textContent || defaultLabels[select.id];
  toggle.setAttribute(
    "aria-label",
    `${dropdown.previousElementSibling.textContent} : ${valueLabel.textContent}`,
  );
  toggle.disabled = select.disabled;
  menu.replaceChildren();

  let currentGroup = null;
  Array.from(select.options).forEach((option) => {
    const group =
      option.parentElement.tagName === "OPTGROUP"
        ? option.parentElement.label
        : null;
    if (group && group !== currentGroup) {
      const heading = document.createElement("h6");
      heading.className = "dropdown-header catalogue-dropdown-heading";
      heading.textContent = group;
      menu.append(heading);
      currentGroup = group;
    }
    const item = document.createElement("button");
    item.type = "button";
    item.className = `dropdown-item catalogue-dropdown-item${option.selected ? " selected" : ""}`;
    item.dataset.dropdownOption = option.value;
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", String(option.selected));
    item.disabled = option.disabled;
    item.innerHTML = `<span>${option.textContent}</span>${option.selected ? '<i class="bi bi-check2" aria-hidden="true"></i>' : ""}`;
    menu.append(item);
  });
}

function closeCatalogueDropdown(dropdown, returnFocus = false) {
  dropdown.classList.remove("show");
  dropdown
    .querySelector(".catalogue-dropdown-toggle")
    .setAttribute("aria-expanded", "false");
  dropdown.querySelector(".catalogue-dropdown-menu").classList.remove("show");
  if (returnFocus) dropdown.querySelector(".catalogue-dropdown-toggle").focus();
}

function initializeCatalogueDropdowns() {
  const dropdowns = document.querySelectorAll(".catalogue-dropdown");
  dropdowns.forEach((dropdown) => {
    const select = document.querySelector(
      `#${dropdown.dataset.catalogueDropdown}`,
    );
    const toggle = dropdown.querySelector(".catalogue-dropdown-toggle");
    const menu = dropdown.querySelector(".catalogue-dropdown-menu");
    refreshCatalogueDropdown(select);
    select.addEventListener("change", () => {
      refreshCatalogueDropdown(select);
      if (select.id === "category-family-filter")
        refreshCatalogueDropdown(document.querySelector("#subcategory-filter"));
    });
    toggle.addEventListener("click", () => {
      const isOpen = dropdown.classList.contains("show");
      document
        .querySelectorAll(".catalogue-dropdown.show")
        .forEach((openDropdown) => closeCatalogueDropdown(openDropdown));
      if (!isOpen) {
        dropdown.classList.add("show");
        menu.classList.add("show");
        toggle.setAttribute("aria-expanded", "true");
      }
    });
    menu.addEventListener("click", (event) => {
      const item = event.target.closest("[data-dropdown-option]");
      if (!item || item.disabled) return;
      select.value = item.dataset.dropdownOption;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      closeCatalogueDropdown(dropdown, true);
    });
    toggle.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCatalogueDropdown(dropdown, true);
      }
    });
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".catalogue-dropdown")) {
      document
        .querySelectorAll(".catalogue-dropdown.show")
        .forEach((dropdown) => closeCatalogueDropdown(dropdown));
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      document
        .querySelectorAll(".catalogue-dropdown.show")
        .forEach((dropdown) => closeCatalogueDropdown(dropdown, true));
    }
  });
}

let activeFamilyPath = [];
let activeSubcategory = [];
let searchTerm = "";
let cart = JSON.parse(
  localStorage.getItem("etokiana-cart") ||
    localStorage.getItem("itokiana-cart") ||
    localStorage.getItem("noma-cart") ||
    "[]",
);
function etokianaFavoriteAccountKey(user) { return String(user?.id || user?.email || '').trim().toLowerCase(); }
function etokianaReadFavoritesForUser(user, migrateLegacy = false) {
  try {
    const map = JSON.parse(localStorage.getItem('etokiana-favorites-by-user') || '{}');
    const key = etokianaFavoriteAccountKey(user);
    if (user && Array.isArray(map[key])) return map[key];
    if (user && migrateLegacy && Object.keys(map).length === 0) {
      const legacy = JSON.parse(localStorage.getItem('etokiana-favorites') || '[]');
      map[key] = Array.isArray(legacy) ? legacy.map(String) : [];
      localStorage.setItem('etokiana-favorites-by-user', JSON.stringify(map));
      return map[key];
    }
    return [];
  } catch (_) { return []; }
}
let favorites = etokianaReadFavoritesForUser(JSON.parse(localStorage.getItem("etokiana-user") || "null"), true);
const productGrid = document.querySelector("#product-grid");
const emptyState = document.querySelector("#empty-state");
const cartDrawer = document.querySelector("#cart-drawer");
const drawerBackdrop = document.querySelector("#drawer-backdrop");
const cartItems = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");
const toast = document.querySelector("#toast");
const currencyRate = 4900;
const euro = (value) =>
  `${Math.round(value * currencyRate).toLocaleString("fr-FR")} Ar`;
const productPriceMarkup = (value) =>
  `<span class="price-amount">${Math.round(value * currencyRate).toLocaleString("fr-FR")}</span><span class="price-currency">Ar</span>`;
const accountModal = document.querySelector("#account-modal");
const paymentModal = document.querySelector("#payment-modal");
const productModal = document.querySelector("#product-modal");
let selectedProduct = null;
const loginModal = document.querySelector("#login-modal");
const signupModal = document.querySelector("#signup-modal");
const adminModal = document.querySelector("#admin-modal");
document.querySelector(".demo-credentials")?.remove();
let currentUser = JSON.parse(localStorage.getItem("etokiana-user") || "null");
let orders = JSON.parse(localStorage.getItem("etokiana-orders") || "[]");
// Répare les lignes de commandes anciennes dont le vendeur était mal attribué.
// La migration s'appuie sur l'identifiant produit, puis recalcule la commission à 10 %.
let didMigrateOrderOwners = false;
orders.forEach((order) => {
  let migratedThisOrder = false;
  (order.items || []).forEach((item) => {
    const product = products.find((candidate) =>
      (item.id != null && String(candidate.id) === String(item.id)) ||
      (item.reference && candidate.reference && String(candidate.reference) === String(item.reference))
    );
    if (product && String(product.sellerId ?? "owner") !== "owner" && ["", "owner", "admin", "superadmin", "undefined", "null"].includes(String(item.sellerId ?? "owner"))) {
      item.sellerId = product.sellerId;
      didMigrateOrderOwners = true;
      migratedThisOrder = true;
    }
  });
  if (migratedThisOrder) {
    order.commission = (order.items || []).reduce((sum, item) => {
      if (String(item.sellerId ?? "owner") === "owner") return sum;
      return sum + (Number(item.salePrice) || Number(item.price) || 0) * (Number(item.quantity) || 1) * 0.1;
    }, 0);
  }
});
if (didMigrateOrderOwners) localStorage.setItem("etokiana-orders", JSON.stringify(orders));
let notifications = JSON.parse(
  localStorage.getItem("etokiana-notifications") || "[]",
);
const commissionRate = 0.1;
const effectivePrice = (product) =>
  product.price * (1 - (product.discount || 0) / 100);
const sellerLabel = (product) => {
  const sellerId = String(product?.sellerId ?? "owner");
  if (["owner", "admin", "superadmin", ""].includes(sellerId)) return "E-tokiana";
  if (sellerId === "demo-seller") return "Atelier Nomade";
  let users = [];
  try { users = JSON.parse(localStorage.getItem("etokiana-users") || "[]"); } catch (_) {}
  const matchedUser = users.find((user) => String(user.id) === sellerId);
  if (matchedUser?.name || matchedUser?.fullName) return matchedUser.name || matchedUser.fullName;
  const creatorId = String(product?.createdById ?? product?.publisherId ?? "");
  const fallbackCreator = String(product?.createdByName ?? product?.publisherName ?? product?.creatorName ?? "").trim();
  if (creatorId && creatorId === sellerId && fallbackCreator) return fallbackCreator;
  return "Vendeur partenaire";
};
const sellerNameById = (sellerId) => sellerLabel({ sellerId: String(sellerId ?? "owner") });
const isSellerAccount = (user = currentUser) => isSellerRoleValue(user?.role);
// Le créateur est distinct du vendeur/propriétaire : un produit peut appartenir
// à une boutique tout en ayant été publié par une personne précise.
const productCreatorName = (product) => String(
  product?.createdByName || product?.publisherName || product?.creatorName || "Créateur non renseigné"
).trim();
const currentPublisherIdentity = () => ({
  id: currentUser?.id ?? currentUser?.email ?? null,
  name: String(currentUser?.name || currentUser?.fullName || (currentUser?.role === "owner" || currentUser?.role === "admin" ? "E-tokiana" : "Utilisateur")).trim(),
});
const adminIdentity = {
  email: "admin@etokiana.fr",
  name: "E-Tokiana (admin)",
  role: "owner",
};
function actorIdentity(user = currentUser) {
  if (!user) return { key: null, name: "Client invité" };
  if (user.role === "owner" || user.role === "admin")
    return { key: adminIdentity.email, name: adminIdentity.name };
  return { key: user.email, name: user.name || "Utilisateur" };
}
function addNotification(recipient, message, actor = currentUser) {
  const author = actorIdentity(actor);
  if (!recipient || recipient === author.key) return;
  notifications.push({
    id: Date.now() + Math.random(),
    recipient,
    message: `${author.name} : ${message}`,
    actor: author.key,
    actorName: author.name,
    date: new Date().toISOString(),
    read: false,
  });
  localStorage.setItem("etokiana-notifications", JSON.stringify(notifications));
}
function userNotificationKey(user = currentUser) {
  return user?.role === "owner" || user?.role === "admin"
    ? adminIdentity.email
    : user?.email;
}
function sellerEmail(sellerId) {
  if (sellerId === "demo-seller") return "vendeur@etokiana.fr";
  return JSON.parse(localStorage.getItem("etokiana-users") || "[]").find(
    (user) => user.id === sellerId,
  )?.email;
}

// Une migration unique remplace l'ancien format ETK-0001 par un code composite.
// Les références déjà structurées restent inchangées ; les nouveaux produits
// utilisent ensuite le même format avec un suffixe séquentiel unique.
function migrateLegacyProductReferences() {
  const reserved = new Set(products
    .filter((product) => !/^ETK-\d+$/i.test(String(product.reference || "")))
    .map((product) => String(product.reference || "").toUpperCase())
    .filter(Boolean));
  let sequence = Math.max(
    Number(localStorage.getItem("etokiana-product-reference-sequence") || 0),
    ...products.map((product) => productReferenceNumber(product.reference)),
  );
  products.forEach((product) => {
    const oldReference = String(product.reference || "").trim().toUpperCase();
    const legacyMatch = oldReference.match(/^ETK-(\d+)$/);
    if (!legacyMatch) {
      if (oldReference) reserved.add(oldReference);
      return;
    }
    // Récupération prudente de quelques options uniquement sur les fiches historiques
    // qui n'avaient pas encore de champs couleur/taille dédiés.
    const material = referenceAscii(product.material || "");
    const pathText = referenceAscii((product.categoryPath || [product.category || ""]).join(" "));
    if (!productOptionList(product.availableColors || product.colors).length) {
      const knownColors = [
        [/(VERT SAUGE)/, "Vert sauge"], [/(NOIR)/, "Noir"], [/(BLANC|BLANCHE)/, "Blanc"],
        [/(ROUGE)/, "Rouge"], [/(BLEU|BLEUE)/, "Bleu"], [/(ROSE)/, "Rose"],
        [/(BEIGE)/, "Beige"], [/(GRIS|GRISE)/, "Gris"], [/(MARRON)/, "Marron"],
        [/(VIOLET|VIOLETTE)/, "Violet"], [/(JAUNE)/, "Jaune"], [/(DOR[EÉ])/, "Doré"],
        [/(ARGENT[EÉ])/, "Argenté"], [/(NATUREL|NATURELLE)/, "Naturel"],
      ];
      const detected = knownColors.find(([pattern]) => pattern.test(material));
      if (detected && isVariantRelevantCategory(product.categoryPath || [product.category || ""])) product.availableColors = [detected[1]];
    }
    if (!productOptionList(product.availableSizes || product.sizes).length && /MODE|VETEMENT|CHAUSSURE|ROBE|PANTALON|CHEMISE|TSHIRT|JEAN|BASKET|TALON|BOTTINE/.test(pathText)) {
      const sizeMatch = material.match(/(?:^| )((?:XXS|XS|S|M|L|XL|XXL|XXXL|[0-9]{2}))$/);
      if (sizeMatch) product.availableSizes = [sizeMatch[1]];
    }
    let number = Math.max(1, Number(legacyMatch[1]) || 1);
    let candidate = `${productReferenceBase(product)}-${formatProductReference(number)}`;
    while (reserved.has(candidate.toUpperCase())) {
      sequence += 1;
      number = sequence;
      candidate = `${productReferenceBase(product)}-${formatProductReference(number)}`;
    }
    product.reference = candidate;
    reserved.add(candidate.toUpperCase());
    sequence = Math.max(sequence, number);
  });
  localStorage.setItem("etokiana-product-reference-sequence", String(sequence));
  localStorage.setItem("etokiana-products", JSON.stringify(products));
}
migrateLegacyProductReferences();
// const identityButton = document.createElement("button");
// identityButton.className = "identity-button";
// identityButton.type = "button";
// identityButton.title = "Voir l’identité de l’utilisateur";
// identityButton.innerHTML =
//   '<span class="identity-avatar" aria-hidden="true"><span id="identity-initials">U</span><span class="identity-role-icon" id="identity-role-icon"></span></span>';
// document.querySelector("#profile-button").after(identityButton);
const identityModal = document.createElement("section");
identityModal.className = "modal";
identityModal.id = "identity-modal";
identityModal.setAttribute("aria-hidden", "true");
identityModal.innerHTML =
  '<div class="modal-panel identity-panel"><div class="modal-header"><div><p class="eyebrow">Compte connecté</p><h2>Mon identité</h2></div><button class="close-button identity-close" aria-label="Fermer mon identité">×</button></div><div class="identity-details"></div><button class="button button-dark modal-submit identity-space" type="button">Ouvrir mon espace <i class="bi bi-box-arrow-in-right" aria-hidden="true"></i></button><button class="button modal-submit identity-logout" type="button">Se déconnecter <span>×</span></button></div>';
document.body.append(identityModal);
identityModal
  .querySelector(".identity-close")
  .addEventListener("click", () => closeModal(identityModal));
identityModal.querySelector(".identity-space").addEventListener("click", () => {
  closeModal(identityModal);
  openUserSpace();
});
identityModal
  .querySelector(".identity-logout")
  .addEventListener("click", () => {
    currentUser = null;
    localStorage.removeItem("etokiana-user");
    closeModal(identityModal);
    closeModal(accountModal);
    closeModal(adminModal);
    updateProfileButton();
    showToast("Vous êtes déconnecté.");
  });
const notificationButton = document.createElement("button");
notificationButton.className = "notification-button";
notificationButton.type = "button";
notificationButton.hidden = true;
notificationButton.setAttribute("aria-label", "Notifications");
notificationButton.innerHTML =
  '<i class="bi bi-bell notification-icon" aria-hidden="true"></i><span class="utility-label">Notifications</span><span class="notification-count" id="notification-count">0</span>';
notificationButton.title = "Voir les notifications";
document.querySelector("#cart-toggle").after(notificationButton);
const notificationModal = document.createElement("section");
notificationModal.className = "modal notification-modal";
notificationModal.id = "notification-modal";
notificationModal.setAttribute("aria-hidden", "true");
notificationModal.innerHTML =
  '<div class="modal-panel notification-panel"><div class="modal-header"><div><p class="eyebrow">Activité de votre espace</p><h2>Notifications</h2></div><button class="close-button notification-close" aria-label="Fermer les notifications">×</button></div><div class="notification-list"></div></div>';
document.body.append(notificationModal);
notificationModal
  .querySelector(".notification-close")
  .addEventListener("click", () => closeModal(notificationModal));
function notificationDestination(item) {
  // Une notification peut fournir une destination explicite; sinon, on déduit
  // le menu à partir de son type et de son contenu.
  const normalise = (value) => String(value ?? "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const explicit = normalise(item?.targetView || item?.view || item?.destination || item?.entityType || item?.module || "");
  const candidates = `${explicit} ${normalise(item?.type || item?.category || "")}`;
  const text = normalise(`${item?.message || ""} ${item?.details || ""} ${item?.title || ""}`);
  const find = (value) => candidates.includes(value);
  if (find("order") || find("commande") || /commande|commandes|livraison|paiement|expedition/.test(text)) return "orders";
  if (find("product") || find("produit") || find("catalogue") || /produit|produits|catalogue|stock|article|rupture/.test(text)) return "products";
  if (find("seller") || find("vendeur") || find("prestataire") || /vendeur|vendeurs|prestataire|prestataires|boutique/.test(text)) return "sellers";
  if (find("customer") || find("client") || /nouveau client|nouvelle cliente|clients|client|acheteur|acheteuse|inscription client/.test(text)) return "customers";
  return null;
}
function escapeNotificationText(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}
function renderNotifications() {
  const list = notificationModal.querySelector(".notification-list");
  const userNotifications = notifications.filter(
    (item) => item.recipient === userNotificationKey(),
  );
  const unread = userNotifications.filter((item) => !item.read).length;
  notificationButton.hidden = !currentUser;
  document.querySelector("#notification-count").textContent = unread;
  document.querySelector("#notification-count").hidden = unread === 0;
  list.innerHTML = userNotifications.length
    ? userNotifications
        .slice()
        .reverse()
        .map((item) => {
          const target = notificationDestination(item);
          const actions = {
            orders: ['bi-receipt', 'Voir les commandes'],
            sellers: ['bi-shop', 'Voir les vendeurs'],
            products: ['bi-box-seam', 'Voir les produits'],
            customers: ['bi-people', 'Voir les clients'],
          };
          const action = target ? actions[target] : null;
          const date = new Date(item.date);
          const dateLabel = Number.isNaN(date.getTime()) ? 'Date non renseignée' : date.toLocaleString("fr-FR");
          return `<div class="notification-item ${item.read ? "" : "unread"}" data-notification-id="${escapeNotificationText(item.id)}"><div class="notification-item-copy"><strong>${escapeNotificationText(item.message)}</strong><small>${escapeNotificationText(dateLabel)}</small></div>${action ? `<button class="notification-route-action" type="button" data-notification-target="${target}" aria-label="${action[1]}"><i class="bi ${action[0]}" aria-hidden="true"></i><span>${action[1]}</span><i class="bi bi-arrow-up-right" aria-hidden="true"></i></button>` : ''}</div>`;
        })
        .join("")
    : '<p class="modal-muted">Aucune notification pour le moment.</p>';
}
notificationButton.addEventListener("click", () => {
  notifications
    .filter((item) => item.recipient === userNotificationKey())
    .forEach((item) => {
      item.read = true;
    });
  localStorage.setItem("etokiana-notifications", JSON.stringify(notifications));
  renderNotifications();
  openModal(notificationModal);
});

// Clic sur une notification : on la marque comme lue et on ouvre directement
// son contenu (suivi de commande si elle référence une commande, chat si
// c'est un message, sinon un toast avec le message complet).
notificationModal
  .querySelector(".notification-list")
  .addEventListener("click", (event) => {
    const routeButton = event.target.closest("[data-notification-target]");
    const item = event.target.closest(".notification-item");
    if (!item) return;
    const notification = notifications.find(
      (entry) => String(entry.id) === item.dataset.notificationId,
    );
    if (!notification) return;
    notification.read = true;
    localStorage.setItem(
      "etokiana-notifications",
      JSON.stringify(notifications),
    );
    renderNotifications();

    if (routeButton) {
      const target = routeButton.dataset.notificationTarget;
      const labels = { orders: "les commandes", sellers: "les vendeurs", products: "les produits", customers: "les clients" };
      closeModal(notificationModal);
      if (!currentUser) return openModal(loginModal);

      // Ouvrir l’espace puis naviguer après son rendu complet. Les hooks de droits
      // et le rendu différé peuvent réinitialiser la vue sur le tableau de bord :
      // on réapplique donc la destination après les éventuels re-rendus.
      openUserSpace();
      const activateDestination = () => {
        const modal = document.getElementById("user-space-modal");
        if (!modal) return;
        const nav = modal.querySelector(`.user-space-nav[data-user-view="${target}"]`);
        const panel = modal.querySelector(`.user-space-view[data-user-panel="${target}"]`);
        if (!nav || !panel) return;
        if (nav.hidden || nav.getAttribute("aria-disabled") === "true") {
          showToast(`Votre profil n’a pas accès à ${labels[target] || "ce menu"}.`);
          return;
        }

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        if (!modal.classList.contains("open")) modal.classList.add("open");
        nav.click();

        const enforceActiveView = () => {
          const liveModal = document.getElementById("user-space-modal");
          if (!liveModal || liveModal.hidden) return;
          const liveNav = liveModal.querySelector(`.user-space-nav[data-user-view="${target}"]`);
          const livePanel = liveModal.querySelector(`.user-space-view[data-user-panel="${target}"]`);
          if (!liveNav || !livePanel || liveNav.hidden || liveNav.getAttribute("aria-disabled") === "true") return;
          liveModal.querySelectorAll(".user-space-nav[data-user-view]").forEach((button) => {
            const active = button === liveNav;
            button.classList.toggle("active", active);
            if (active) button.setAttribute("aria-current", "page");
            else button.removeAttribute("aria-current");
          });
          liveModal.querySelectorAll(".user-space-view[data-user-panel]").forEach((view) => {
            const active = view === livePanel;
            view.classList.toggle("active", active);
            if (active) view.removeAttribute("hidden");
          });
        };
        enforceActiveView();
        window.requestAnimationFrame(enforceActiveView);
        window.setTimeout(enforceActiveView, 100);
        window.setTimeout(enforceActiveView, 320);
      };
      window.setTimeout(activateDestination, 120);
      window.setTimeout(activateDestination, 260);
      return;
    }

    const orderMatch = notification.message.match(/#([A-Za-z0-9-]+)/);
    const order = orderMatch && orders.find((entry) => String(entry.id) === String(orderMatch[1]));
    if (order) {
      closeModal(notificationModal);
      return openOrderTracking(order);
    }
    if (notification.message.includes("Nouveau message") && notification.actor) {
      closeModal(notificationModal);
      renderChatRecipients();
      const recipient = document.querySelector("#chat-recipient");
      if (recipient) recipient.value = notification.actor;
      renderChatThread();
      return openModal(chatModal);
    }
    showToast(notification.message);
  });

// Habillage premium des actions de redirection des notifications.
if (!document.getElementById("etokiana-notification-route-style")) {
  const notificationRouteStyle = document.createElement("style");
  notificationRouteStyle.id = "etokiana-notification-route-style";
  notificationRouteStyle.textContent = `
    .notification-item { display:flex; flex-direction:column; align-items:stretch; gap:12px; }
    .notification-item-copy { display:flex; flex-direction:column; gap:5px; min-width:0; }
    .notification-item-copy strong { overflow-wrap:anywhere; }
    .notification-route-action { display:inline-flex; align-items:center; justify-content:center; align-self:flex-start; gap:8px; min-height:36px; max-width:100%; padding:9px 13px; border:1px solid #d6e7dc; border-radius:11px; background:linear-gradient(135deg,#f2faf5,#fff); color:#087443; font-family:inherit; font-size:12px; font-weight:700; line-height:1.2; cursor:pointer; transition:background .18s ease, border-color .18s ease, transform .18s ease, box-shadow .18s ease; }
    .notification-route-action:hover { border-color:#9cc9ad; background:#e8f6ed; box-shadow:0 5px 16px rgba(8,116,67,.10); transform:translateY(-1px); }
    .notification-route-action:focus-visible { outline:3px solid rgba(8,116,67,.25); outline-offset:3px; }
    .notification-route-action span { overflow-wrap:anywhere; }
    @media(max-width:480px) { .notification-route-action { width:100%; align-self:stretch; } }
  `;
  document.head.appendChild(notificationRouteStyle);
}

let messages = JSON.parse(localStorage.getItem("etokiana-messages") || "[]");
const quickReactions = ["👍", "❤️", "😂", "😮", "😢"];
// Identifiant du message dont le sélecteur de réactions rapides est visible
// (ouvert via un clic droit sur le message). null = aucun sélecteur visible.
let openReactionPickerId = null;
const chatButton = document.createElement("button");
chatButton.className = "chat-button";
chatButton.type = "button";
chatButton.hidden = true;
chatButton.setAttribute("aria-label", "Chat");
chatButton.title = "Ouvrir le chat";
chatButton.innerHTML =
  '<i class="bi bi-chat-dots chat-button-icon" aria-hidden="true"></i><span class="utility-label">Chat</span><span class="chat-unread-count" id="chat-unread-count" hidden>0</span>';
document.querySelector("#cart-toggle").after(chatButton);
const chatModal = document.createElement("section");
chatModal.className = "modal chat-modal";
chatModal.id = "chat-modal";
chatModal.setAttribute("aria-hidden", "true");
chatModal.innerHTML =
  '<div class="modal-panel chat-panel"><div class="modal-header"><div><p class="eyebrow">Messagerie</p><h2>Chat</h2></div><button class="close-button chat-close" aria-label="Fermer le chat">×</button></div><label class="chat-recipient-label">Destinataire<select id="chat-recipient"></select></label><div class="chat-thread" id="chat-thread"></div><form id="chat-form" class="chat-form"><input id="chat-message" type="text" placeholder="Écrire un message..." required /><button class="button button-dark" type="submit" aria-label="Envoyer"><i class="bi bi-send-fill"></i></button></form></div>';
document.body.append(chatModal);
chatModal
  .querySelector(".chat-close")
  .addEventListener("click", () => closeModal(chatModal));
function chatUsers() {
  const orderUsers = orders.map((order) => ({
    email: order.buyerId,
    name: order.buyerName,
    role: "client",
  }));
  const users = [
    { email: adminIdentity.email, name: adminIdentity.name, role: "owner" },
    { email: "vendeur@etokiana.fr", name: "Atelier Nomade", role: "seller" },
    { email: "client@etokiana.fr", name: "Alex Martin", role: "client" },
    ...JSON.parse(localStorage.getItem("etokiana-users") || "[]"),
    ...orderUsers,
  ];
  return users.filter(
    (user, index, list) =>
      user.email &&
      user.email !== currentUser?.email &&
      list.findIndex((item) => item.email === user.email) === index,
  );
}

// --- Chat : construction de la liste des destinataires (à l'ouverture
// uniquement) séparée de l'affichage du fil (à chaque changement, envoi,
// réaction ou réception d'un message), pour ne jamais réinitialiser la
// sélection du <select>.
function unreadChatCount() {
  return messages.filter(
    (message) => message.to === currentUser?.email && !message.read,
  ).length;
}
function updateChatBadge() {
  const badge = document.querySelector("#chat-unread-count");
  if (!badge) return;
  const count = unreadChatCount();
  badge.textContent = count;
  badge.hidden = count === 0;
}

function renderChatRecipients() {
  const recipient = document.querySelector("#chat-recipient");
  const previousValue = recipient.value;
  const users = chatUsers();
  recipient.innerHTML = users.length
    ? users
        .map(
          (user) =>
            `<option value="${user.email}">${user.name || user.email} · ${user.role === "owner" ? "Admin" : user.role === "seller" ? "Vendeur" : "Client"}</option>`,
        )
        .join("")
    : '<option value="">Aucun contact disponible</option>';
  if (users.some((user) => user.email === previousValue))
    recipient.value = previousValue;
  renderChatThread();
}

function toggleReaction(messageId, emoji) {
  const message = messages.find(
    (item) => String(item.id) === String(messageId),
  );
  if (!message || !currentUser?.email) return;
  message.reactions = message.reactions || {};
  const usersOnEmoji = message.reactions[emoji] || [];
  message.reactions[emoji] = usersOnEmoji.includes(currentUser.email)
    ? usersOnEmoji.filter((email) => email !== currentUser.email)
    : [...usersOnEmoji, currentUser.email];
  if (!message.reactions[emoji].length) delete message.reactions[emoji];
  localStorage.setItem("etokiana-messages", JSON.stringify(messages));
  renderChatThread();
}

function renderChatThread() {
  const recipient = document.querySelector("#chat-recipient");
  const selected = recipient.value;
  const thread = document.querySelector("#chat-thread");
  const threadMessages = messages.filter(
    (message) =>
      (message.from === currentUser?.email && message.to === selected) ||
      (message.to === currentUser?.email && message.from === selected),
  );
  let changed = false;
  threadMessages.forEach((message) => {
    if (
      message.to === currentUser?.email &&
      message.from === selected &&
      !message.read
    ) {
      message.read = true;
      changed = true;
    }
  });
  if (changed)
    localStorage.setItem("etokiana-messages", JSON.stringify(messages));
  thread.innerHTML = threadMessages.length
    ? threadMessages
        .map((message) => {
          const mine = message.from === currentUser?.email;
          const reactionEntries = Object.entries(
            message.reactions || {},
          ).filter(([, users]) => users.length);
          const pickerVisible =
            String(message.id) === String(openReactionPickerId);
          return `<div class="chat-message ${mine ? "mine" : "theirs"}" data-message-id="${message.id}">
        <strong>${message.fromName}</strong>
        <p>${message.text}</p>
        <div class="chat-message-footer">
          <small>${new Date(message.date).toLocaleString("fr-FR")}</small>
          ${mine ? `<small class="read-status ${message.read ? "seen" : ""}">${message.read ? "Vu" : "Envoyé"}</small>` : ""}
        </div>
        ${reactionEntries.length ? `<div class="chat-reactions">${reactionEntries.map(([emoji, users]) => `<button type="button" class="chat-reaction ${users.includes(currentUser?.email) ? "active" : ""}" data-react="${emoji}" data-message-id="${message.id}">${emoji} ${users.length}</button>`).join("")}</div>` : ""}
        <div class="chat-reaction-picker ${pickerVisible ? "visible" : ""}">${quickReactions.map((emoji) => `<button type="button" class="reaction-pick" data-react="${emoji}" data-message-id="${message.id}" aria-label="Réagir avec ${emoji}">${emoji}</button>`).join("")}</div>
      </div>`;
        })
        .join("")
    : '<p class="modal-muted">Aucun message dans cette conversation.</p>';
  updateChatBadge();
}

chatButton.addEventListener("click", () => {
  openReactionPickerId = null;
  renderChatRecipients();
  openModal(chatModal);
});
document
  .querySelector("#chat-recipient")
  .addEventListener("change", renderChatThread);
document.querySelector("#chat-thread").addEventListener("click", (event) => {
  const reactButton = event.target.closest("[data-react]");
  if (!reactButton) return;
  toggleReaction(reactButton.dataset.messageId, reactButton.dataset.react);
});
// Clic droit sur un message : ouvre (ou ferme) son sélecteur de réactions
// rapides, masqué par défaut.
document
  .querySelector("#chat-thread")
  .addEventListener("contextmenu", (event) => {
    const messageEl = event.target.closest(".chat-message");
    if (!messageEl) return;
    event.preventDefault();
    const messageId = messageEl.dataset.messageId;
    openReactionPickerId =
      String(openReactionPickerId) === String(messageId) ? null : messageId;
    renderChatThread();
  });
// Un clic ailleurs qu'un message referme le sélecteur de réactions ouvert.
document.addEventListener("click", (event) => {
  if (openReactionPickerId && !event.target.closest(".chat-message")) {
    openReactionPickerId = null;
    if (chatModal.classList.contains("open")) renderChatThread();
  }
});
document.querySelector("#chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const recipient = document.querySelector("#chat-recipient").value;
  const text = document.querySelector("#chat-message").value.trim();
  if (!recipient || !text) return;
  const message = {
    id: Date.now(),
    from: currentUser.email,
    fromName: actorIdentity().name,
    to: recipient,
    text,
    date: new Date().toISOString(),
    read: false,
    reactions: {},
  };
  messages.push(message);
  localStorage.setItem("etokiana-messages", JSON.stringify(messages));
  addNotification(recipient, `Nouveau message : ${text}`);
  document.querySelector("#chat-message").value = "";
  renderChatThread();
});
window.addEventListener("storage", (event) => {
  if (event.key === "etokiana-messages") {
    messages = JSON.parse(event.newValue || "[]");
    if (chatModal.classList.contains("open")) renderChatThread();
    else updateChatBadge();
  }
  if (event.key === "etokiana-notifications") {
    notifications = JSON.parse(event.newValue || "[]");
    renderNotifications();
  }
});
const trackingModal = document.createElement("section");
trackingModal.className = "modal";
trackingModal.id = "tracking-modal";
trackingModal.setAttribute("aria-hidden", "true");
trackingModal.setAttribute("role", "dialog");
trackingModal.setAttribute("aria-modal", "true");
trackingModal.setAttribute("aria-labelledby", "tracking-modal-title");
trackingModal.innerHTML =
  '<div class="modal-panel tracking-panel"><div class="modal-header"><div><p class="eyebrow">SUIVI DE COMMANDE</p><h2 id="tracking-modal-title">Suivre votre commande</h2></div><button type="button" class="close-button tracking-close" aria-label="Fermer le suivi">×</button></div><div class="tracking-details" aria-live="polite"></div></div>';
document.body.append(trackingModal);
trackingModal
  .querySelector(".tracking-close")
  .addEventListener("click", () => closeModal(trackingModal));
trackingModal.addEventListener("click", (event) => {
  if (event.target === trackingModal) closeModal(trackingModal);
});
function trackingEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;",
  })[character]);
}
function openOrderTracking(orderOrId) {
  try {
    // Recharge l'état enregistré pour ne jamais afficher un ancien statut.
    try {
      const savedOrders = JSON.parse(localStorage.getItem("etokiana-orders") || "[]");
      if (Array.isArray(savedOrders)) orders = savedOrders;
    } catch (error) {
      console.warn("Les commandes enregistrées n'ont pas pu être relues.", error);
    }
    const requestedId = orderOrId && typeof orderOrId === "object" ? orderOrId.id : orderOrId;
    const order = orders.find((candidate) => String(candidate.id) === String(requestedId))
      || (orderOrId && typeof orderOrId === "object" ? orderOrId : null);
    if (!order) {
      showToast("Aucune commande correspondante n'a été trouvée.");
      return false;
    }

    const steps = ["Nouvelle commande", "Validée", "En préparation", "Expédiée", "Livrée"];
    const normalizedStatus = String(order.status || "Nouvelle commande").toLocaleLowerCase("fr-FR");
    const cancelled = normalizedStatus.includes("annul");
    let currentStep = 0;
    if (normalizedStatus.includes("livr")) currentStep = 4;
    else if (normalizedStatus.includes("expédi") || normalizedStatus.includes("expedi")) currentStep = 3;
    else if (normalizedStatus.includes("préparation") || normalizedStatus.includes("preparation")) currentStep = 2;
    else if (normalizedStatus.includes("valid")) currentStep = 1;

    const date = order.date ? new Date(order.date) : null;
    const dateLabel = date && !Number.isNaN(date.getTime())
      ? date.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })
      : "Date non renseignée";
    const items = Array.isArray(order.items) ? order.items : [];
    const itemRows = items.map((item) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const itemName = trackingEscape(item.name || "Article");
      const color = item.selectedColor || item.color || item.variant?.color;
      const size = item.selectedSize || item.size || item.variant?.size;
      const options = [color ? `Couleur : ${trackingEscape(color)}` : "", size ? `Taille / format : ${trackingEscape(size)}` : ""].filter(Boolean);
      const amount = (Number(item.salePrice) || Number(item.price) || 0) * quantity;
      const sellerId = String(item.sellerId ?? "owner");
      const sellerName = trackingEscape(sellerNameById(sellerId));
      const sellerStatus = trackingEscape(getOrderStatusForSeller(order, sellerId));
      return `<div class="tracking-item"><div><strong>${itemName}</strong><small>Vendeur / propriétaire : <b>${sellerName}</b> · Qté ${quantity}${options.length ? ` · ${options.join(" · ")}` : ""}</small><small>Statut de cette partie : ${sellerStatus}</small></div><b>${euro(amount)}</b></div>`;
    }).join("");
    const timeline = steps.map((step, index) => {
      const done = !cancelled && index < currentStep;
      const current = !cancelled && index === currentStep;
      return `<div class="tracking-step ${done ? "complete" : ""} ${current ? "current" : ""}" ${current ? 'aria-current="step"' : ""}><span>${done ? "✓" : index + 1}</span><div><strong>${step}</strong><small>${done ? "Étape terminée" : current ? "Statut actuel" : "À venir"}</small></div></div>`;
    }).join("");
    const statusLabel = trackingEscape(order.status || "Nouvelle commande");
    const statusClass = cancelled ? "is-cancelled" : currentStep === 4 ? "is-delivered" : currentStep === 3 ? "is-shipped" : currentStep >= 1 ? "is-progress" : "is-new";
    trackingModal.querySelector(".tracking-details").innerHTML = `
      <div class="tracking-summary"><div><small>NUMÉRO DE COMMANDE</small><strong>#${trackingEscape(order.id)}</strong><small>Passée le ${trackingEscape(dateLabel)}</small></div><div class="tracking-summary-total"><small>Montant total</small><strong>${euro(Number(order.total) || 0)}</strong></div></div>
      <div class="tracking-status-banner ${statusClass}"><span class="tracking-status-dot"></span><div><small>STATUT ACTUEL</small><strong>${statusLabel}</strong></div></div>
      ${cancelled ? '<p class="tracking-cancel-note"><i class="bi bi-info-circle" aria-hidden="true"></i> Cette commande est annulée. La progression de livraison est arrêtée.</p>' : ''}
      <section class="tracking-progress-section"><h3>Progression de la commande</h3><div class="tracking-steps">${timeline}</div></section>
      <section class="tracking-items-section"><div class="tracking-section-heading"><h3>Articles commandés</h3><span>${items.length} article(s) référencé(s)</span></div>${itemRows || '<p class="modal-muted">Le détail des articles n’est pas disponible.</p>'}</section>
      <div class="tracking-footer-note"><i class="bi bi-shield-check" aria-hidden="true"></i><span>Le suivi reflète le dernier statut enregistré par la boutique.</span></div>`;
    openModal(trackingModal);
    trackingModal.querySelector(".tracking-close")?.focus({ preventScroll: true });
    return true;
  } catch (error) {
    console.error("Ouverture du suivi de commande impossible", error);
    showToast("Le suivi de cette commande n'a pas pu être ouvert. Réessayez.");
    return false;
  }
}
// Point d'entrée explicite pour les boutons générés dans les espaces utilisateur.
window.openOrderTracking = openOrderTracking;

function filteredProducts() {
  const filtered = products.filter((product) => {
    const productPath = product.categoryPath || [product.category];
    const isPromotionFilter =
      activeSubcategory.at(-1) === "Nouveautés & Promos";
    const matchesSubcategory =
      !activeSubcategory.length ||
      (isPromotionFilter
        ? product.category === categoryNames.fashion &&
          (product.tag === "Nouveau" || product.discount > 0)
        : activeSubcategory.every(
            (part, index) => productPath[index] === part,
          ));
    const matchesSearch =
      `${product.name} ${productPath.join(" ")} ${product.material} ${productCreatorName(product)}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesSubcategory && matchesSearch;
  });
  const sort = document.querySelector("#sort-select").value;
  if (sort === "price-low") return filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-high") return filtered.sort((a, b) => b.price - a.price);
  return filtered.sort((a, b) => a.id - b.id);
}

function productVariantSummary(product) {
  const colors = productOptionList(product.availableColors || product.colors);
  const sizes = productOptionList(product.availableSizes || product.sizes);
  const parts = [];
  if (colors.length) parts.push(`Couleurs : ${colors.join(", ")}`);
  if (sizes.length) parts.push(`Tailles : ${sizes.join(", ")}`);
  return parts.join(" · ");
}
function renderProducts() {
  const visibleProducts = filteredProducts();
  emptyState.hidden = visibleProducts.length > 0;
  productGrid.innerHTML = visibleProducts
    .map(
      (product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
        ${product.discount ? `<span class="discount-badge">-${product.discount}%</span>` : ""}
        <button class="favorite-button ${favorites.includes(product.id) ? "active" : ""}" data-favorite="${product.id}" aria-label="${favorites.includes(product.id) ? "Retirer" : "Ajouter"} ${product.name} ${favorites.includes(product.id) ? "des" : "aux"} favoris"><i class="bi ${favorites.includes(product.id) ? "bi-heart-fill" : "bi-heart"}"></i></button>
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-image-caption">
          <span class="product-image-category">${product.category}</span>
          <span class="product-image-subcategory">${(product.categoryPath || [product.category]).slice(1).join(" · ") || "Sélection générale"}</span>
          <span class="product-image-detail">${product.material}</span>
          ${productVariantSummary(product) ? `<span class="product-image-variants">${productVariantSummary(product)}</span>` : ""}
          <h3 class="product-image-name">${product.name}</h3>
          <span class="product-image-reference">Réf. ${window.getProductReference(product)}</span>
          <span class="product-image-publisher">Publié par : <strong>${trackingEscape(productCreatorName(product))}</strong></span>
          <p class="product-image-price">${product.discount ? `<del>${productPriceMarkup(product.price)}</del>` : ""}<strong>${productPriceMarkup(effectivePrice(product))}</strong>${product.discount ? `<span class="product-image-discount">-${product.discount}%</span>` : ""}</p>
        </div>
        <div class="product-image-actions">
          <button class="btn btn-light product-image-action" type="button" data-details="${product.id}" title="Voir les détails de ${product.name}">
            <i class="bi bi-eye" aria-hidden="true"></i><span>Détails</span>
          </button>
          <button class="btn btn-dark product-image-action product-image-action-primary" type="button" data-add="${product.id}" title="Ajouter ${product.name} au panier">
            <i class="bi bi-bag-plus" aria-hidden="true"></i><span>Ajouter</span>
          </button>
        </div>
      </div>
    </article>`,
    )
    .join("");
}

function renderCart() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document
    .querySelectorAll(".cart-count")
    .forEach((element) => (element.textContent = count));
  if (!cart.length) {
    cartItems.innerHTML =
      '<p class="cart-empty">Votre panier est encore vide.<br />Quelques objets vous attendent juste ici.</p>';
    cartTotal.textContent = euro(0);
    renderShippingSummary();
    return;
  }
  cartItems.innerHTML = cart
    .map((item) => {
      const lineId = item.cartLineId || cartLineKey(item.id, item.selectedColor, item.selectedSize);
      const variantDetails = [item.selectedColor ? `Couleur : ${item.selectedColor}` : "", item.selectedSize ? `Taille / format : ${item.selectedSize}` : ""].filter(Boolean).join(" · ");
      return `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div><p class="cart-item-name">${item.name}</p><p class="cart-item-detail">${item.material || ""}</p>${variantDetails ? `<p class="cart-item-variant-detail">${variantDetails}</p>` : ""}<div class="quantity-control"><button data-line-id="${lineId}" data-decrease="${lineId}" aria-label="Diminuer la quantité">−</button><span>${item.quantity}</span><button data-line-id="${lineId}" data-increase="${lineId}" aria-label="Augmenter la quantité">＋</button></div></div>
      <div><button class="remove-item" data-line-id="${lineId}" data-remove="${lineId}" aria-label="Retirer ${item.name}">×</button><p class="cart-item-price">${euro(effectivePrice(item) * item.quantity)}</p></div>
    </div>`;
    })
    .join("");
  cartTotal.textContent = euro(
    cart.reduce(
      (total, item) => total + effectivePrice(item) * item.quantity,
      0,
    ),
  );
  renderShippingSummary();
}

function saveCart() {
  localStorage.setItem("etokiana-cart", JSON.stringify(cart));
  renderCart();
}
function cartSubtotal() {
  return cart.reduce(
    (total, item) => total + effectivePrice(item) * item.quantity,
    0,
  );
}
function shippingFee() {
  const subtotal = cartSubtotal();
  return subtotal === 0 || subtotal >= 80 ? 0 : 5.9;
}
function renderShippingSummary() {
  const subtotal = cartSubtotal();
  const delivery = shippingFee();
  const total = subtotal + delivery;
  let summary = document.querySelector("#cart-summary");
  if (!summary) {
    summary = document.createElement("div");
    summary.id = "cart-summary";
    document.querySelector("#cart-total").parentElement.after(summary);
  }
  summary.innerHTML = `<div><span>Frais de livraison</span><strong>${delivery ? euro(delivery) : "Offerte"}</strong></div><div class="cart-grand-total"><span>Total</span><strong>${euro(total)}</strong></div>`;
  document.querySelector("#cart-total").textContent = euro(subtotal);
}
function saveFavorites() {
  localStorage.setItem("etokiana-favorites", JSON.stringify(favorites));
  const user = JSON.parse(localStorage.getItem("etokiana-user") || "null");
  if (user) {
    const map = (() => { try { const value = JSON.parse(localStorage.getItem('etokiana-favorites-by-user') || '{}'); return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; } catch (_) { return {}; } })();
    map[etokianaFavoriteAccountKey(user)] = [...new Set((favorites || []).map(String))];
    localStorage.setItem('etokiana-favorites-by-user', JSON.stringify(map));
  }
  window.dispatchEvent(new CustomEvent('etokiana-favorites-changed'));
}
function cartLineKey(productId, color = "", size = "") {
  return `${String(productId)}::${encodeURIComponent(String(color || ""))}::${encodeURIComponent(String(size || ""))}`;
}
function addToCart(product, quantity = 1, options = {}) {
  if (!product) return;
  const selectedColor = String(options.color || "");
  const selectedSize = String(options.size || "");
  const cartLineId = cartLineKey(product.id, selectedColor, selectedSize);
  const existing = cart.find((item) => (item.cartLineId || cartLineKey(item.id, item.selectedColor, item.selectedSize)) === cartLineId);
  if (existing) existing.quantity += quantity;
  else cart.push({ ...product, quantity, selectedColor, selectedSize, cartLineId });
  saveCart();
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}
function openCart() {
  cartDrawer.classList.add("open");
  drawerBackdrop.classList.add("visible");
  cartDrawer.setAttribute("aria-hidden", "false");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  drawerBackdrop.classList.remove("visible");
  cartDrawer.setAttribute("aria-hidden", "true");
}
// function openModal(modal) {
//   document.querySelectorAll(".modal.open").forEach((openedModal) => {
//     if (openedModal !== modal) closeModal(openedModal);
//   });
//   modal.classList.add("open");
//   modal.setAttribute("aria-hidden", "false");
// }
// function closeModal(modal) {
//   modal.classList.remove("open");
//   modal.setAttribute("aria-hidden", "true");
// }

function openModal(modal) {
  document.querySelectorAll(".modal.open").forEach((openedModal) => {
    if (openedModal !== modal) {
      closeModal(openedModal);
    }
  });

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");

  // Le site se réorganise lorsque les notifications s'ouvrent.
  document.body.classList.toggle(
    "notifications-open",
    modal.id === "notification-modal",
  );
}

function closeModal(modal) {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  // Le site reprend sa largeur normale à la fermeture.
  if (modal.id === "notification-modal") {
    document.body.classList.remove("notifications-open");
  }
}

function updatePaymentTotal() {
  renderShippingSummary();
}

function parseDashboardOrderDate(order) {
  const raw = order?.date || order?.createdAt || order?.created_at || order?.createdDate || order?.updatedAt || order?.updated_at;
  if (!raw) return null;
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    const date = new Date(raw); date.setHours(0, 0, 0, 0); return date;
  }
  const text = String(raw).trim();
  const localized = text.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})/);
  let date;
  if (localized) date = new Date(Number(localized[3]), Number(localized[2]) - 1, Number(localized[1]));
  else date = new Date(text);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}
function dashboardOrderAmount(order, isSeller) {
  const status = String(order?.status || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (status.includes('annul')) return 0;
  if (!isSeller) return Number(order?.total) || 0;
  return (order?.items || []).filter(item => String(item.sellerId) === String(currentUser?.id)).reduce((sum, item) => sum + (Number(item.salePrice) || Number(item.price) || 0) * (Number(item.quantity) || 1) * 0.9, 0);
}
function renderAdminDashboardReports(visibleOrders, isSeller) {
  const chart = document.querySelector('[data-dashboard-revenue-chart]');
  const statusList = document.querySelector('[data-dashboard-status-breakdown]');
  if (!chart || !statusList) return;
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const days = [];
  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(now); date.setDate(now.getDate() - offset);
    days.push({ date, key: `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`, total: 0, count: 0 });
  }
  const byKey = new Map(days.map(day => [day.key, day]));
  visibleOrders.forEach(order => {
    if (String(order?.status || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes('annul')) return;
    const date = parseDashboardOrderDate(order);
    if (!date) return;
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    const day = byKey.get(key);
    if (day) { day.total += dashboardOrderAmount(order, isSeller); day.count += 1; }
  });
  const weekRevenue = days.reduce((sum, day) => sum + day.total, 0);
  const weekOrders = days.reduce((sum, day) => sum + day.count, 0);
  const weekRevenueNode = document.querySelector('[data-dashboard-week-revenue]');
  const weekOrdersNode = document.querySelector('[data-dashboard-week-orders]');
  const updatedNode = document.querySelector('[data-dashboard-updated-label]');
  if (weekRevenueNode) weekRevenueNode.textContent = euro(weekRevenue);
  if (weekOrdersNode) weekOrdersNode.textContent = String(weekOrders);
  if (updatedNode) updatedNode.textContent = `Actualisé le ${now.toLocaleDateString('fr-FR')}`;
  chart.replaceChildren();
  if (!weekOrders) {
    const empty = document.createElement('p'); empty.className = 'admin-dashboard-chart-empty';
    empty.textContent = 'Aucune commande datée sur les 7 derniers jours. Les rapports se rempliront avec les prochaines commandes.';
    chart.append(empty);
  } else {
    const max = Math.max(1, ...days.map(day => day.total));
    days.forEach(day => {
      const col = document.createElement('div'); col.className = 'admin-dashboard-chart-col';
      const wrap = document.createElement('div'); wrap.className = 'admin-dashboard-chart-bar-wrap';
      const bar = document.createElement('span'); bar.className = 'admin-dashboard-chart-bar';
      const ratio = day.total > 0 ? Math.max(5, Math.round(day.total / max * 100)) : 2;
      bar.style.setProperty('--bar-height', `${ratio}%`);
      const dateLabel = day.date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
      const dateShort = day.date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
      col.title = `${day.date.toLocaleDateString('fr-FR')}: ${euro(day.total)} · ${day.count} commande(s)`;
      col.setAttribute('aria-label', col.title);
      wrap.append(bar);
      const label = document.createElement('small'); label.textContent = dateLabel;
      label.setAttribute('title', dateShort);
      col.append(wrap, label); chart.append(col);
    });
  }
  const normalizedStatus = status => String(status || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const statusGroups = [
    { label: 'Nouvelles / validées', test: s => ['nouvelle commande','validee','valide'].includes(s) },
    { label: 'En préparation', test: s => s === 'en preparation' },
    { label: 'Expédiées', test: s => s === 'expediee' || s === 'expedie' },
    { label: 'Livrées', test: s => s === 'livree' || s === 'livre' },
    { label: 'Annulées', test: s => s.includes('annul') },
  ];
  const counts = statusGroups.map(group => ({ ...group, count: visibleOrders.filter(order => group.test(normalizedStatus(order.status))).length }));
  const maxCount = Math.max(1, ...counts.map(item => item.count));
  statusList.replaceChildren();
  counts.forEach(item => {
    const row = document.createElement('div'); row.className = 'admin-dashboard-status-row';
    const top = document.createElement('div'); top.className = 'admin-dashboard-status-top';
    const label = document.createElement('span'); label.textContent = item.label;
    const count = document.createElement('strong'); count.textContent = String(item.count);
    top.append(label, count);
    const track = document.createElement('div'); track.className = 'admin-dashboard-status-track';
    const fill = document.createElement('span'); fill.className = 'admin-dashboard-status-fill';
    fill.style.setProperty('--status-width', `${item.count ? Math.max(4, item.count / maxCount * 100) : 0}%`);
    track.append(fill); row.append(top, track); statusList.append(row);
  });
}
function activateDashboardTab(scope, name) {
  if (scope === 'user') {
    const root = document.querySelector('#user-space-modal [data-user-panel="dashboard"]');
    if (!root) return;
    root.querySelectorAll('[data-user-dashboard-tab]').forEach(button => {
      const active = button.dataset.userDashboardTab === name;
      button.classList.toggle('is-active', active); button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1;
    });
    root.querySelectorAll('[data-user-dashboard-panel]').forEach(panel => {
      const active = panel.dataset.userDashboardPanel === name; panel.hidden = !active; panel.classList.toggle('is-active', active);
    });
  } else {
    const root = document.querySelector('#admin-modal [data-admin-panel="dashboard"]');
    if (!root) return;
    root.querySelectorAll('[data-admin-dashboard-tab]').forEach(button => {
      const active = button.dataset.adminDashboardTab === name;
      button.classList.toggle('is-active', active); button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1;
    });
    root.querySelectorAll('[data-admin-dashboard-panel]').forEach(panel => {
      const active = panel.dataset.adminDashboardPanel === name; panel.hidden = !active; panel.classList.toggle('is-active', active);
    });
  }
}

function renderAdminDashboard() {
  const isSeller = currentUser?.role === "seller";
  const visibleProducts = isSeller
    ? products.filter((product) => product.sellerId === currentUser.id)
    : products;
  const visibleOrders = isSeller
    ? orders.filter((order) =>
        order.items?.some((item) => item.sellerId === currentUser.id),
      )
    : orders;
  const pendingOrders = visibleOrders.filter((order) =>
    ["Nouvelle commande", "Validée", "En préparation"].includes(order.status),
  );
  const activeRevenueOrders = visibleOrders.filter(order => !String(order?.status || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes('annul'));
  const revenue = isSeller
    ? activeRevenueOrders.reduce(
        (sum, order) =>
          sum +
          (order.items || [])
            .filter((item) => item.sellerId === currentUser.id)
            .reduce(
              (itemSum, item) =>
                itemSum +
                (Number(item.salePrice) || Number(item.price) || 0) *
                  item.quantity *
                  0.9,
              0,
            ),
        0,
      )
    : activeRevenueOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const stats = [
    [
      "products",
      visibleProducts.length,
      isSeller ? "Mes produits" : "Produits actifs",
    ],
    [
      "orders",
      visibleOrders.length,
      isSeller ? "Commandes reçues" : "Commandes enregistrées",
    ],
    [
      "revenue",
      euro(revenue),
      isSeller ? "Gains nets estimés" : "Chiffre d’affaires enregistré",
    ],
    ["pending", pendingOrders.length, isSeller ? "À préparer" : "À traiter"],
  ];
  stats.forEach(([key, value, label]) => {
    const card = document
      .querySelector(`[data-dashboard-stat="${key}"]`)
      .closest("div");
    card.querySelector("strong").textContent = value;
    card.querySelector("span").textContent = label;
  });
  renderAdminDashboardReports(visibleOrders, isSeller);
  const heading = document.querySelector(
    '[data-admin-panel="dashboard"] .admin-section-heading strong',
  );
  heading.textContent = isSeller
    ? "Mes commandes récentes"
    : "Commandes récentes";
  const recentOrders = document.querySelector("[data-admin-recent-orders]");
  const sortedOrders = visibleOrders
    .slice()
    .sort((left, right) => new Date(right.date || 0) - new Date(left.date || 0))
    .slice(0, 5);
  recentOrders.replaceChildren();
  if (!sortedOrders.length) {
    const empty = document.createElement("p");
    empty.className = "admin-empty";
    empty.textContent = isSeller
      ? "Aucune commande reçue pour le moment."
      : "Les commandes apparaîtront ici dès le premier achat.";
    recentOrders.append(empty);
    return;
  }
  sortedOrders.forEach((order) => {
    const row = document.createElement("div");
    row.className = "admin-row admin-dashboard-row";
    const buyer = document.createElement("span");
    const orderId = document.createElement("strong");
    orderId.textContent = `#${order.id}`;
    const buyerName = document.createElement("small");
    buyerName.textContent = order.buyerName || "Client invité";
    buyer.append(orderId, buyerName);
    const amount = document.createElement("strong");
    const isCancelled = String(order?.status || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes('annul');
    amount.textContent = isCancelled ? "Exclu du CA" : euro(
      isSeller
        ? (order.items || [])
            .filter((item) => item.sellerId === currentUser.id)
            .reduce(
              (sum, item) =>
                sum +
                (Number(item.salePrice) || Number(item.price) || 0) *
                  item.quantity *
                  0.9,
              0,
            )
        : Number(order.total) || 0,
    );
    const status = document.createElement("em");
    status.className = `status-pill ${order.status === "Livrée" ? "muted" : ""}`;
    status.textContent = order.status || "Statut inconnu";
    row.append(buyer, amount, status);
    recentOrders.append(row);
  });
}

function openUserSpace() {
  if (!currentUser) return openModal(loginModal);

  // L'espace utilisateur premium du HTML est désormais le point d'entrée unique.
  // app.js conserve le routage et transmet la main au rendu premium selon le rôle.
  if (typeof window.renderPremiumUserSpace === "function") {
    window.renderPremiumUserSpace();
    // Synchronise les raccourcis (journal et page « À propos ») après lecture du compte connecté.
    try { syncJournalAdminAccessSafe(); } catch (_) {}
    window.dispatchEvent(new CustomEvent("etokiana-user-space-rendered"));
    return;
  }

  // Fallback pour les anciennes pages qui ne possèdent pas encore l'espace premium.
  if (["admin", "owner", "seller"].includes(currentUser.role)) {
    const isSeller = currentUser.role === "seller";
    document.querySelector("#admin-title").textContent = isSeller
      ? "Espace Vendeurs"
      : "Espace Admin";
    document.querySelector("#admin-space-label").textContent = isSeller
      ? "Gestion de votre boutique"
      : "Administration de la marketplace";
    renderAdminDashboard();
    renderSellerAndOwnerViews();
    addSellerOrderActions();
    addOwnerOrderActions();
    openModal(adminModal);
  } else {
    document.querySelector("#account-title").textContent = "Espace Client";
    document.querySelector("#account-greeting").textContent =
      `Bonjour, ${currentUser.name || "Client"}.`;
    renderAccountData();
    openModal(accountModal);
  }
}
function updateProfileButton() {
  const profileButton = document.querySelector("#profile-button");
  const profileLabel = document.querySelector("#profile-label");
  const profileRole = document.querySelector("#profile-role");
  const profileAvatarIcon = profileButton?.querySelector(".profile-avatar i");
  if (!profileButton) return;

  const role = String(currentUser?.role || currentUser?.type || "client").toLowerCase();
  const isOwner = ["owner", "admin", "superadmin"].includes(role);
  const staffRoleKey = String(currentUser?.staffRoleKey || "").trim().toLowerCase();
  const staffRoleName = String(currentUser?.staffRole || "").trim().toLocaleLowerCase("fr-FR");
  const isStaffMember = role === "staff" || Boolean(staffRoleKey);
  const isCommunityManager = staffRoleKey === "community" || staffRoleName.includes("community manager");
  const displayName = !currentUser
    ? "Se connecter"
    : isOwner
      ? (adminIdentity?.name || currentUser.name || "E-tokiana")
      : (currentUser.name || currentUser.fullName || currentUser.displayName || currentUser.username || "Utilisateur");

  const roleDetails = !currentUser
    ? { label: "", icon: "bi-person-fill", className: "" }
    : isOwner
      ? { label: "ADMIN", icon: "bi-shield-lock-fill", className: "role-admin" }
      : isStaffMember
        ? { label: isCommunityManager ? "CM" : "STAFF", icon: isCommunityManager ? "bi-megaphone-fill" : "bi-person-gear", className: "role-staff" }
        : role === "seller"
          ? { label: "VENDEUR", icon: "bi-shop", className: "role-vendeur" }
          : role === "redac" || role === "editor"
            ? { label: "RÉDAC", icon: "bi-pencil-square", className: "role-redac" }
            : role === "prestataire" || role === "provider"
              ? { label: "PRESTATAIRE", icon: "bi-briefcase-fill", className: "role-prestataire" }
              : { label: "CLIENT", icon: "bi-person-fill", className: "role-client" };

  profileButton.hidden = false;
  profileButton.classList.toggle("is-logged-in", Boolean(currentUser));
  profileButton.classList.toggle("is-logged-out", !currentUser);
  ["role-admin", "role-client", "role-vendeur", "role-redac", "role-prestataire", "role-staff"].forEach((name) => profileButton.classList.remove(name));
  if (roleDetails.className) profileButton.classList.add(roleDetails.className);

  if (profileLabel) profileLabel.textContent = displayName;
  if (profileRole) {
    profileRole.textContent = roleDetails.label;
    profileRole.hidden = !currentUser;
  }
  if (profileAvatarIcon) profileAvatarIcon.className = `bi ${roleDetails.icon}`;

  profileButton.setAttribute(
    "aria-label",
    !currentUser ? "Se connecter à mon compte" : `Ouvrir l’espace utilisateur de ${displayName}`,
  );
  profileButton.title = !currentUser
    ? "Se connecter"
    : `Espace utilisateur · ${displayName}${roleDetails.label ? ` · ${roleDetails.label}` : ""}`;

  chatButton.hidden = !currentUser;
  renderNotifications();
  updateChatBadge();
  if (typeof syncJournalAdminAccess === "function") syncJournalAdminAccess();
  if (currentUser?.role === "client") {
    document.querySelector("#account-title").textContent =
      `Bonjour, ${currentUser.name || "Client"}.`;
    const address = document.querySelector(".account-card p");
    if (address)
      address.innerHTML = currentUser.address
        ? `${currentUser.address}<br />${currentUser.phone || ""}`
        : "Ajoutez votre adresse de livraison";
  }
  if (currentUser?.role === "seller")
    document.querySelector("#admin-title").textContent =
      `Boutique de ${currentUser.name || "vendeur"}`;
  if (currentUser?.role === "owner" || currentUser?.role === "admin")
    document.querySelector("#admin-title").textContent = "E-Tokiana · Administration";
}

function renderAccountData() {
  const normalizedBuyerEmail = String(currentUser?.email || "").trim().toLocaleLowerCase("fr-FR");
  const userOrders = orders.filter(
    (order) => String(order.buyerId || "").trim().toLocaleLowerCase("fr-FR") === normalizedBuyerEmail,
  );
  const orderView = document.querySelector('[data-view="orders"]');
  const savedView = document.querySelector('[data-view="saved"]');
  const overview = document.querySelector('[data-view="overview"]');
  if (overview) {
    const latestOrder = userOrders.slice().sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime() || 0;
      const dateB = new Date(b.date || 0).getTime() || 0;
      return dateB - dateA;
    })[0];
    const latestOrderCard = overview.querySelectorAll(".account-card")[1];
    const latestOrderText = latestOrderCard?.querySelector("p");
    const latestOrderButton = latestOrderCard?.querySelector("[data-track-latest-order]");
    if (latestOrderText) latestOrderText.textContent = latestOrder
      ? `Commande #${latestOrder.id} · ${latestOrder.status || "Nouvelle commande"}`
      : "Aucune commande enregistrée pour le moment";
    if (latestOrderButton) {
      if (latestOrder) {
        latestOrderButton.dataset.orderId = String(latestOrder.id);
        latestOrderButton.disabled = false;
        latestOrderButton.setAttribute("aria-label", `Suivre la commande ${latestOrder.id}`);
      } else {
        delete latestOrderButton.dataset.orderId;
        latestOrderButton.disabled = false;
        latestOrderButton.setAttribute("aria-label", "Aucune commande à suivre");
      }
    }
  }
  if (orderView)
    orderView.innerHTML = userOrders.length
      ? userOrders
          .slice()
          .reverse()
          .map(
            (order) =>
              `<div class="order-row"><span>#${order.id}</span><span>${order.status}</span><strong>${euro(order.total)}</strong><button class="text-link account-action" data-track-order="${order.id}">Suivre</button>${String(currentUser?.role || "").toLowerCase() === "client" && ["nouvelle commande", "nouvelle", "a confirmer", "confirmee", "validee", "valide", "commande validee"].includes(String(order.status || "Nouvelle commande").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()) ? `<button class="text-link account-action" data-cancel-account-order="${order.id}">Annuler</button>` : ""}</div>`,
          )
          .join("")
      : '<p class="modal-muted">Vos commandes apparaîtront ici après votre premier achat.</p>';
  if (savedView) {
    const savedProducts = products.filter((product) =>
      favorites.includes(product.id),
    );
    savedView.innerHTML = savedProducts.length
      ? savedProducts
          .map(
            (product) =>
              `<div class="order-row"><span>${product.name}</span><span>${euro(effectivePrice(product))}</span><button class="text-link account-action" data-details="${product.id}">Voir</button></div>`,
          )
          .join("")
      : '<p class="modal-muted">Ajoutez un article avec le cœur pour le retrouver dans vos favoris.</p>';
  }
}
// Toute annulation met à jour immédiatement les KPI financiers dans la session courante.
window.addEventListener("etokiana-orders-changed", () => {
  try { const stored = JSON.parse(localStorage.getItem("etokiana-orders") || "[]"); if (Array.isArray(stored)) orders = stored; } catch (_) {}
  try { renderAdminDashboard(); } catch (_) {}
  try { renderAccountData(); } catch (_) {}
});

function renderSellerAndOwnerViews() {
  const content = document.querySelector(".admin-content");
  const nav = document.querySelector(".admin-nav");
  if (!content || !nav) return;
  const sellerId = currentUser?.role === "seller" ? currentUser.id : null;
  const visibleProducts = sellerId
    ? products.filter((product) => product.sellerId === sellerId)
    : products;
  const visibleOrders = sellerId
    ? orders.filter((order) =>
        order.items?.some((item) => item.sellerId === sellerId),
      )
    : orders;
  nav
    .querySelectorAll(
      '[data-admin-view="customers"], [data-admin-view="staff"]',
    )
    .forEach((item) => {
      item.hidden = Boolean(sellerId);
    });
  const productPanel = content.querySelector('[data-admin-panel="products"]');
  if (sellerId && productPanel) {
    const table = productPanel.querySelector(".admin-table");
    if (table)
      table.innerHTML = `<div class="admin-table-head"><span>Produit</span><span>Prix</span><span>Remise</span><span>Stock</span></div>${visibleProducts.map((product) => `<div class="admin-table-row"><span><strong>${product.name}</strong><small>${product.category}</small></span><span>${euro(effectivePrice(product))}</span><span>${product.discount ? `-${product.discount}%` : "Aucune"}</span><span class="stock-value">Disponible</span></div>`).join("") || '<p class="modal-muted">Vous n’avez pas encore publié de produit.</p>'}`;
  }
  let sellerTab = nav.querySelector('[data-admin-view="seller-sales"]');
  if (!sellerTab) {
    sellerTab = document.createElement("button");
    sellerTab.className = "admin-nav-item";
    sellerTab.dataset.adminView = "seller-sales";
    sellerTab.textContent = "Ventes & gains";
    nav.insertBefore(sellerTab, nav.lastElementChild);
    sellerTab.addEventListener("click", () =>
      activateAdminView("seller-sales"),
    );
  }
  let sellerPanel = content.querySelector('[data-admin-panel="seller-sales"]');
  if (!sellerPanel) {
    sellerPanel = document.createElement("div");
    sellerPanel.className = "admin-view";
    sellerPanel.dataset.adminPanel = "seller-sales";
    content.appendChild(sellerPanel);
  }
  const sellerRevenue = visibleOrders.reduce(
    (sum, order) =>
      sum +
      (order.items || [])
        .filter((item) => item.sellerId === sellerId)
        .reduce(
          (itemSum, item) =>
            itemSum + item.salePrice * item.quantity * (sellerId ? 0.9 : 1),
          0,
        ),
    0,
  );
  sellerPanel.innerHTML = `<div class="admin-view-heading"><div><p class="eyebrow">${sellerId ? "Ma boutique" : "Super-administration"}</p><h3>${sellerId ? "Commandes reçues et gains" : "Liste des vendeurs"}</h3></div></div>${
    sellerId
      ? `<div class="admin-stats"><div><strong>${visibleProducts.length}</strong><span>Mes produits</span></div><div><strong>${visibleOrders.length}</strong><span>Commandes reçues</span></div><div><strong>${euro(sellerRevenue)}</strong><span>Gains nets</span></div></div><div class="admin-table"><div class="admin-table-head"><span>Client</span><span>Commande</span><span>Gain</span><span>Statut</span></div>${
          visibleOrders
            .map((order) =>
              (order.items || [])
                .filter((item) => item.sellerId === sellerId)
                .map(
                  (item) =>
                    `<div class="admin-table-row"><span><strong>${order.buyerName || "Client invité"}</strong><small>${order.buyerId || "E-mail non renseigné"}</small></span><span>#${order.id}<br /><strong>${item.name}</strong><small>Vendeur / propriétaire : ${sellerNameById(item.sellerId)}</small></span><span>${euro(item.salePrice * item.quantity * 0.9)}</span><span class="order-fulfillment-cell"><em class="status-pill">${getOrderStatusForSeller(order, sellerId)}</em><button class="stock-action order-status-action" data-order-status="${order.id}" data-order-seller-id="${sellerId}" ${getOrderStatusForSeller(order, sellerId) === "Livrée" || getOrderStatusForSeller(order, sellerId) === "Annulée" ? "disabled" : ""}>${nextOrderStatus(getOrderStatusForSeller(order, sellerId))}</button></span></div>`,
                )
                .join(""),
            )
            .join("") ||
          '<p class="modal-muted">Aucune commande reçue pour le moment.</p>'
        }</div>`
      : `<div class="admin-table"><div class="admin-table-head"><span>Vendeur</span><span>Produits</span><span>Ventes</span><span>Statut</span></div>${
          JSON.parse(localStorage.getItem("etokiana-users") || "[]")
            .filter((user) => user.role === "seller")
            .map(
              (user) =>
                `<div class="admin-table-row"><span><strong>${user.name}</strong><small>${user.email}</small></span><span>${products.filter((product) => product.sellerId === user.id).length}</span><span>${euro(orders.reduce((sum, order) => sum + (order.items || []).filter((item) => item.sellerId === user.id).reduce((itemSum, item) => itemSum + item.salePrice * item.quantity, 0), 0))}</span><em class="status-pill">Actif</em></div>`,
            )
            .join("") ||
          '<p class="modal-muted">Aucun vendeur inscrit pour le moment.</p>'
        }</div><div class="admin-section admin-orders-readonly"><div class="admin-section-heading"><strong>Commandes globales — consultation uniquement</strong><small>L’administration peut consulter les commandes, mais les actions de validation, préparation, expédition, livraison et annulation appartiennent au vendeur / propriétaire du produit.</small></div>${orders.map((order) => `<div class="admin-row admin-order-readonly-row"><span><strong>Commande #${order.id} · ${order.buyerName || "Client invité"}</strong><small>${order.buyerId || "E-mail non renseigné"}</small>${(order.items || []).map((item) => `<small class="admin-order-seller-line">${item.name || "Produit"} — Vendeur / propriétaire : <strong>${sellerNameById(item.sellerId)}</strong> · ${getOrderStatusForSeller(order, String(item.sellerId ?? "owner"))}</small>`).join("")}</span><strong>${euro(order.total)}</strong><em>${order.status || "Nouvelle commande"}</em></div>`).join("") || '<p class="modal-muted">Aucune commande enregistrée.</p>'}</div>`
  }`;
}
function activateAdminView(viewName) {
  const activeNav = document.querySelector(".admin-nav-item.active");
  const activePanel = document.querySelector(".admin-view.active");
  const targetNav = document.querySelector(`[data-admin-view="${viewName}"]`);
  const targetPanel = document.querySelector(
    `[data-admin-panel="${viewName}"]`,
  );
  if (activeNav) activeNav.classList.remove("active");
  if (activePanel) activePanel.classList.remove("active");
  if (targetNav) targetNav.classList.add("active");
  if (targetPanel) targetPanel.classList.add("active");
}
function nextOrderStatus(status) {
  return ({
    "Nouvelle commande": "Valider",
    "Validée": "Préparer",
    "En préparation": "Expédier",
    "Expédiée": "Marquer livrée",
    "Livrée": "Livrée",
  })[status] || "Mettre à jour";
}
function orderSellerKeys(order) {
  return [...new Set((order?.items || []).map(item => String(item.sellerId ?? "owner")))];
}
function getOrderStatusForSeller(order, sellerId) {
  const key = String(sellerId ?? "owner");
  const stored = order?.fulfillmentBySeller && order.fulfillmentBySeller[key];
  if (stored) return stored;
  const globalStatus = String(order?.status || "Nouvelle commande");
  return ["Nouvelle commande", "Validée", "En préparation", "Expédiée", "Livrée", "Annulée"].includes(globalStatus)
    ? globalStatus : "Nouvelle commande";
}
function addSellerOrderActions() {
  // Les boutons sont générés dans chaque ligne vendeur, afin de ne pas associer
  // une action à une autre commande lorsque plusieurs produits sont commandés.
  return;
}
function addOwnerOrderActions() {
  // L'administration est en lecture seule sur le registre des commandes.
  // La validation et les étapes de traitement appartiennent au vendeur concerné.
  document.querySelector('[data-admin-panel="seller-sales"] .owner-order-management')?.remove();
}


// ===== Fiche produit premium =====
const DEFAULT_PRODUCT_DESCRIPTION =
  "Une pièce choisie pour son usage, sa qualité et sa capacité à trouver naturellement sa place dans votre quotidien.";
function isEditorUser(user = currentUser) {
  const role = String(user?.role || "").toLowerCase();
  if (role === "staff" && (user?.staffRoleKey === "editor" || user?.staffPermissions?.includes("content.edit"))) return true;
  return ["redac", "rédac", "editor", "writer", "journalist", "content"].some((key) => role.includes(key));
}
function productStock(product) {
  if (Number.isFinite(Number(product?.stock)) && product.stock !== "" && product.stock != null)
    return Number(product.stock);
  const match = String(product?.material || "").match(/(\d+)\s*unités?/i);
  return match ? Number(match[1]) : null;
}
function renderProductStock(product) {
  const stock = productStock(product);
  const label = document.querySelector("#product-modal-stock");
  const badge = document.querySelector("#product-modal-badge");
  const addButton = document.querySelector("#product-modal-add");
  const qty = document.querySelector("#product-modal-quantity");
  const minus = document.querySelector("#pd-qty-minus");
  const plus = document.querySelector("#pd-qty-plus");
  let state = "ok";
  let text = "En stock";
  const inactive = product.active === false || product.status === "inactive";
  if (stock === 0) {
    state = "out";
    text = "Épuisé";
  } else if (inactive) {
    state = "out";
    text = "Produit inactif";
  } else if (stock !== null && stock <= 5) {
    state = "low";
    text = `Plus que ${stock} en stock`;
  }
  label.className = `pd-stock pd-stock-${state}`;
  const stockIcon = state === "out"
    ? `<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.4"/><path d="m7 7 6 6m0-6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
    : state === "low"
      ? `<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><path d="M10 2.8 18 17H2z" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round"/><path d="M10 7v4.5m0 2.2v.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`
      : `<svg aria-hidden="true" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.4"/><path d="m6.5 10 2.2 2.2 4.7-4.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  label.innerHTML = `${stockIcon}<span>${text}</span>`;
  badge.hidden = false;
  badge.textContent = state === "out" ? "Indisponible" : state === "low" ? "Stock limité" : "Disponible";
  badge.className = `pd-badge pd-badge-${state}`;
  const priceAvailability = document.querySelector("#product-modal-price-availability");
  if (priceAvailability) {
    priceAvailability.classList.toggle("is-out", state === "out");
    priceAvailability.classList.toggle("is-low", state === "low");
    const priceAvailabilityLabel = priceAvailability.querySelector("span");
    if (priceAvailabilityLabel) priceAvailabilityLabel.textContent = state === "out" ? "Indisponible" : "Disponible";
  }
  const out = state === "out";
  addButton.disabled = out;
  qty.disabled = out;
  minus.disabled = out;
  plus.disabled = out;
  addButton.querySelector("span").textContent = out
    ? "Produit indisponible"
    : "Ajouter au panier";
  qty.max = stock !== null && stock > 0 ? String(stock) : "99";
  updateProductVariantPurchaseState();
}
function renderProductDescription(product) {
  const field = document.querySelector("#product-modal-description");
  const saveButton = document.querySelector("#product-modal-save-desc");
  const lock = document.querySelector("#pd-desc-lock");
  const hint = document.querySelector("#pd-desc-hint");
  const canEdit = isEditorUser();
  field.value = product.description || DEFAULT_PRODUCT_DESCRIPTION;
  field.disabled = !canEdit;
  field.readOnly = !canEdit;
  field.classList.toggle("is-locked", !canEdit);
  lock.hidden = canEdit;
  saveButton.hidden = !canEdit;
  hint.textContent = canEdit
    ? "Vous pouvez modifier cette description en tant que rédacteur."
    : "Seuls les rédacteurs peuvent modifier la description.";
}
function productMetaItems(product) {
  const stock = productStock(product);
  const state =
    stock === 0
      ? "Épuisé"
      : product.active === false || product.status === "inactive"
        ? "Inactif"
        : stock !== null && stock <= 3
          ? "Stock faible"
          : "Disponible";
  const dateLabel = (value) => {
    if (!value) return "Non renseignée";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "Non renseignée" : d.toLocaleDateString("fr-FR");
  };
  const created =
    product.createdAt || product.created_at || product.dateAdded || product.dateIntegration || product.createdDate;
  const outDate =
    product.ruptureDate || product.stockOutDate || product.outOfStockDate || product.dateRupture;
  const category = (Array.isArray(product.categoryPath) && product.categoryPath.length)
    ? product.categoryPath.join(" / ")
    : (product.category || "Non renseignée");
  const discount = Number(product.discount) || 0;
  return [
    ["Catégorie", category],
    ["Matière / variante", product.material || "Non renseignée"],
    ["Couleurs disponibles", productOptionList(product.availableColors || product.colors).join(", ") || "Non renseignées"],
    ["Tailles / formats", productOptionList(product.availableSizes || product.sizes).join(", ") || "Non renseignés / non applicable"],
    ["Prix catalogue", euro(product.price)],
    ["Remise", discount > 0 ? `${discount}%` : "Aucune"],
    ["Référence produit", window.getProductReference(product)],
    ["Vendeur / propriétaire", sellerLabel(product)],
    ["Publié par (créateur de la fiche)", productCreatorName(product)],
    ["Disponibilité", stock === 0 || product.active === false || product.status === "inactive" ? "Indisponible" : "Disponible"],
    ["Quantité en stock", stock === null ? "Non renseignée" : `${stock} unité(s)`],
    ["État du produit", state],
    ["Date d’intégration", dateLabel(created)],
    ["Date de rupture de stock", stock === 0 ? dateLabel(outDate) : (outDate ? dateLabel(outDate) : "Aucune rupture signalée")],
  ];
}
let selectedProductOptions = { color: "", size: "" };
function renderProductDetailVariantChoice(kind) {
  if (!selectedProduct) return;
  const isColor = kind === "color";
  const available = productOptionList(isColor
    ? (selectedProduct.availableColors || selectedProduct.colors)
    : (selectedProduct.availableSizes || selectedProduct.sizes));
  const row = document.querySelector(isColor ? "#product-modal-colors-row" : "#product-modal-sizes-row");
  const list = document.querySelector(isColor ? "#product-modal-colors-choices" : "#product-modal-sizes-choices");
  const selectedLabel = document.querySelector(isColor ? "#product-modal-selected-color" : "#product-modal-selected-size");
  if (!row || !list || !selectedLabel) return;
  row.hidden = available.length === 0;
  list.replaceChildren();
  const selectedValue = isColor ? selectedProductOptions.color : selectedProductOptions.size;
  selectedLabel.textContent = selectedValue || (available.length > 1 ? "Choix requis" : "Option indisponible");
  available.forEach((value) => {
    list.append(createVariantChoiceButton({
      kind: isColor ? "color" : "size",
      value,
      selected: value === selectedValue,
      detail: true,
      onToggle: (next) => {
        if (isColor) selectedProductOptions.color = next;
        else selectedProductOptions.size = next;
        renderProductDetailVariantChoice(kind);
        updateProductVariantPurchaseState();
      },
    }));
  });
}
function updateProductVariantPurchaseState() {
  const button = document.querySelector("#product-modal-add");
  if (!button || !selectedProduct) return;
  const availableColors = productOptionList(selectedProduct.availableColors || selectedProduct.colors);
  const availableSizes = productOptionList(selectedProduct.availableSizes || selectedProduct.sizes);
  const missingColor = availableColors.length > 1 && !selectedProductOptions.color;
  const missingSize = availableSizes.length > 1 && !selectedProductOptions.size;
  const unavailable = productStock(selectedProduct) === 0 || selectedProduct.active === false || selectedProduct.status === "inactive";
  button.disabled = unavailable || missingColor || missingSize;
  const label = button.querySelector("span");
  if (label) label.textContent = unavailable
    ? "Produit indisponible"
    : missingColor && missingSize
      ? "Choisir couleur et taille"
      : missingColor
        ? "Choisir une couleur"
        : missingSize
          ? "Choisir une taille"
          : "Ajouter au panier";
}

function openProductDetail(product, opts = {}) {
  if (!product) return;
  selectedProduct = product;
  const staff = Boolean(opts.staff);
  productModal.classList.toggle("pd-staff", staff);
  const productCategoryText = `${product.category || ""} ${(product.categoryPath || []).join(" ")}`.toLowerCase();
  const productDescriptionText = `${product.name || ""} ${product.material || ""}`.toLowerCase();
  const isBeautyTextureProduct = /(beauté|soin|cosmé|beauty)/i.test(productCategoryText)
    && /(ml|crème|creme|huile|lotion|sérum|serum|karité|karite|savon)/i.test(productDescriptionText);
  productModal.classList.toggle("pd-with-texture", staff && isBeautyTextureProduct);
  const metaBox = document.querySelector("#product-modal-meta");
  const metaList = document.querySelector("#product-modal-meta-list");
  metaList.replaceChildren();
  metaBox.hidden = !staff;
  if (staff) {
    productMetaItems(product).forEach(([label, value]) => {
      // Chaque information est regroupée pour former une carte lisible et homogène.
      const item = document.createElement("div");
      item.className = "pd-meta-item";
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = String(value);
      item.append(dt, dd);
      metaList.append(item);
    });
  }
  document.querySelector("#product-modal-image").src = product.image;
  document.querySelector("#product-modal-image").alt = product.name;
  document.querySelector("#product-modal-category").textContent =
    `${(product.categoryPath || [product.category]).join(" / ")} / ${sellerLabel(product)}`;
  document.querySelector("#product-modal-title").textContent = product.name;
  document.querySelector("#product-modal-reference").textContent = `Référence ${window.getProductReference(product)}`;
  document.querySelector("#product-modal-material").textContent =
    product.material;
  const variantBox = document.querySelector("#product-modal-variants");
  const availableColors = productOptionList(product.availableColors || product.colors);
  const availableSizes = productOptionList(product.availableSizes || product.sizes);
  selectedProductOptions = {
    color: availableColors.length === 1 ? availableColors[0] : "",
    size: availableSizes.length === 1 ? availableSizes[0] : "",
  };
  variantBox.hidden = availableColors.length === 0 && availableSizes.length === 0;
  renderProductDetailVariantChoice("color");
  renderProductDetailVariantChoice("size");
  const variantHelp = document.querySelector("#product-modal-variant-help");
  if (variantHelp) variantHelp.hidden = variantBox.hidden;
  document.querySelector("#product-modal-price").innerHTML = product.discount
    ? `<del>${euro(product.price)}</del> <strong>${euro(effectivePrice(product))}</strong> <span class="discount-inline">-${product.discount}%</span>`
    : euro(product.price);
  document.querySelector("#product-modal-quantity").value = "1";
  renderProductStock(product);
  const availability = document.querySelector("#product-modal-availability");
  if (availability) {
    const stock = productStock(product);
    const inactive = product.active === false || product.status === "inactive";
    const state = stock === 0 || inactive ? "out" : stock !== null && stock <= 5 ? "low" : "ok";
    availability.textContent = state === "out" ? "Indisponible" : "Disponible";
    availability.classList.toggle("is-out", state === "out");
    availability.classList.toggle("is-low", state === "low");
  }
  renderProductDescription(product);
  openModal(productModal);
  productModal.querySelector(".pd-sheet").scrollTop = 0;
}
(function bindProductDetail() {
  const qty = document.querySelector("#product-modal-quantity");
  const clamp = () => {
    const max = Number(qty.max) || 99;
    qty.value = String(Math.min(max, Math.max(1, Number.parseInt(qty.value, 10) || 1)));
  };
  document.querySelector("#pd-qty-minus").addEventListener("click", () => {
    qty.value = String((Number.parseInt(qty.value, 10) || 1) - 1);
    clamp();
  });
  document.querySelector("#pd-qty-plus").addEventListener("click", () => {
    qty.value = String((Number.parseInt(qty.value, 10) || 1) + 1);
    clamp();
  });
  qty.addEventListener("change", clamp);
  document
    .querySelector("#product-modal-save-desc")
    .addEventListener("click", () => {
      if (!isEditorUser() || !selectedProduct) return;
      const value = document
        .querySelector("#product-modal-description")
        .value.trim();
      selectedProduct.description = value || DEFAULT_PRODUCT_DESCRIPTION;
      localStorage.setItem("etokiana-products", JSON.stringify(products));
      showToast("Description enregistrée");
    });
})();


// Ouverture de la fiche produit : un seul gestionnaire, quel que soit l'endroit du site
document.addEventListener(
  "click",
  (event) => {
    const detailsButton = event.target.closest("[data-details]");
    if (!detailsButton) return;
    const product = products.find(
      (item) => String(item.id) === String(detailsButton.dataset.details),
    );
    if (!product) return;
    event.preventDefault();
    event.stopPropagation();
    const role = String(currentUser?.role || "client").toLowerCase();
    const inUserSpace = Boolean(detailsButton.closest("#user-space-modal"));
    openProductDetail(product, { staff: inUserSpace && role !== "client" });
  },
  true,
);

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const favoriteButton = event.target.closest("[data-favorite]");
  const detailsButton = event.target.closest("[data-details]");
  if (addButton) {
    const product = products.find(
      (item) => String(item.id) === String(addButton.dataset.add),
    );
    if (!product) return;
    const hasOptions = productOptionList(product.availableColors || product.colors).length > 0
      || productOptionList(product.availableSizes || product.sizes).length > 0;
    if (hasOptions) {
      openProductDetail(product);
    } else {
      addToCart(product);
      showToast(`${product.name} a rejoint votre panier`);
    }
  }
  if (favoriteButton) {
    const productId = Number(favoriteButton.dataset.favorite);
    favorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];
    saveFavorites();
    renderProducts();
    renderAccountData();
    showToast(
      favorites.includes(productId)
        ? "Ajouté à vos favoris"
        : "Retiré de vos favoris",
    );
  }
});
cartItems.addEventListener("click", (event) => {
  const action = event.target.closest("[data-increase], [data-decrease], [data-remove]");
  if (!action) return;
  const key = action.dataset.lineId || action.dataset.increase || action.dataset.decrease || action.dataset.remove;
  const item = cart.find((product) => (product.cartLineId || cartLineKey(product.id, product.selectedColor, product.selectedSize)) === key);
  if (!item) return;
  if (action.dataset.increase) item.quantity += 1;
  if (action.dataset.decrease) item.quantity = Math.max(1, item.quantity - 1);
  if (action.dataset.remove) cart = cart.filter((product) => (product.cartLineId || cartLineKey(product.id, product.selectedColor, product.selectedSize)) !== key);
  saveCart();
});
document
  .querySelector("#category-family-filter")
  .addEventListener("change", (event) => {
    activeFamilyPath = event.target.value ? JSON.parse(event.target.value) : [];
    activeSubcategory = activeFamilyPath;
    renderSubcategoryOptions();
    renderProducts();
  });
document
  .querySelector("#subcategory-filter")
  .addEventListener("change", (event) => {
    activeSubcategory = event.target.value
      ? JSON.parse(event.target.value)
      : activeFamilyPath;
    renderProducts();
  });
document.querySelector("[data-show-services]").addEventListener("click", () => {
  const familyFilter = document.querySelector("#category-family-filter");
  familyFilter.value = "";
  familyFilter.dispatchEvent(new Event("change", { bubbles: true }));
  const subcategoryFilter = document.querySelector("#subcategory-filter");
  subcategoryFilter.value = JSON.stringify(["Services"]);
  subcategoryFilter.dispatchEvent(new Event("change", { bubbles: true }));
});
document
  .querySelector("#sort-select")
  .addEventListener("change", renderProducts);
document.querySelector("#search-toggle").addEventListener("click", () => {
  const bar = document.querySelector("#search-bar");
  bar.hidden = !bar.hidden;
  if (!bar.hidden) document.querySelector("#search-input").focus();
});
document.querySelector("#search-close").addEventListener("click", () => {
  document.querySelector("#search-bar").hidden = true;
});
document.querySelector("#search-input").addEventListener("input", (event) => {
  searchTerm = event.target.value;
  renderProducts();
});
/* E-tokiana — journal multi-thèmes : rubriques libres, carrousels et gestion locale des publications. */
const ETK_JOURNAL_STORAGE_KEY = "etokiana-journal-articles";
const ETK_JOURNAL_COLLECTIONS_STORAGE_KEY = "etokiana-journal-collections";
const ETK_JOURNAL_DEFAULT_COLLECTIONS = [
  { key: "daily", title: "Rituels & quotidien", subtitle: "De petites habitudes pour alléger les journées et mieux profiter de l’essentiel.", kicker: "Au fil des jours" },
  { key: "craft", title: "Inspirations & savoir-faire", subtitle: "Des matières, des gestes et des idées qui mettent le travail bien fait à l’honneur.", kicker: "Le geste juste" },
  { key: "home", title: "Maison & bien-être", subtitle: "Des inspirations accessibles pour un intérieur accueillant et un quotidien plus doux.", kicker: "L’art de se sentir bien" },
  { key: "makers", title: "Portraits de créateurs", subtitle: "Rencontrez les personnes, les ateliers et les histoires derrière les objets que l’on choisit.", kicker: "Derrière les créations" },
  { key: "selections", title: "Tendances & sélections", subtitle: "Des idées choisies avec attention pour découvrir, offrir ou renouveler ses indispensables.", kicker: "La sélection E-tokiana" },
];
function etkJournalNormalizeCollection(item, index = 0) {
  if (!item || typeof item !== "object") return null;
  const key = String(item.key || "").trim().toLowerCase();
  const title = String(item.title || "").trim().slice(0, 60);
  if (!/^[a-z0-9][a-z0-9-]{0,59}$/.test(key) || !title) return null;
  return {
    key, title,
    subtitle: String(item.subtitle ?? "Explorez cette rubrique du journal E-tokiana.").trim().slice(0, 180),
    kicker: String(item.kicker || "Rubrique éditoriale").trim().slice(0, 60),
  };
}
function etkJournalReadCollections() {
  try {
    const stored = localStorage.getItem(ETK_JOURNAL_COLLECTIONS_STORAGE_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const seen = new Set();
        const valid = parsed.map(etkJournalNormalizeCollection).filter((item) => {
          if (!item || seen.has(item.key)) return false;
          seen.add(item.key); return true;
        });
        if (valid.length) return valid;
      }
    }
  } catch (error) { console.warn("Lecture des rubriques du journal impossible.", error); }
  return ETK_JOURNAL_DEFAULT_COLLECTIONS.map((item) => ({ ...item }));
}
let ETK_JOURNAL_COLLECTIONS = etkJournalReadCollections();
const ETK_JOURNAL_SEED = [
  { id: "journal-seed-001", title: "Les petits gestes qui changent le quotidien", collection: "daily", date: "2026-10-20", image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85", imageAlt: "Carnet et tasse posés dans une ambiance calme", excerpt: "Organiser son espace, préparer les choses essentielles et prendre quelques minutes pour soi : des habitudes simples qui font du bien sans compliquer la journée.", status: "published" },
  { id: "journal-seed-002", title: "Faire une pause, vraiment", collection: "daily", date: "2026-10-17", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85", imageAlt: "Bureau clair avec carnet et ordinateur", excerpt: "Une courte pause sans écran, une boisson chaude et quelques respirations peuvent suffire à retrouver un peu de calme au milieu d’une journée chargée.", status: "published" },
  { id: "journal-seed-003", title: "Un carnet pour mieux s’organiser", collection: "daily", date: "2026-10-14", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=85", imageAlt: "Carnet ouvert et stylo sur une table", excerpt: "Noter trois priorités, conserver les idées utiles et préparer le lendemain : une méthode simple pour garder le cap sans remplir chaque minute.", status: "published" },
  { id: "journal-seed-004", title: "Préparer sa semaine en douceur", collection: "daily", date: "2026-10-10", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85", imageAlt: "Main écrivant dans un carnet à la lumière naturelle", excerpt: "Quelques minutes pour faire le point, anticiper les repas et rassembler ses indispensables peuvent rendre la semaine plus fluide.", status: "published" },

  { id: "journal-seed-005", title: "Derrière chaque objet, un savoir-faire", collection: "craft", date: "2026-10-18", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=85", imageAlt: "Atelier lumineux aménagé pour travailler", excerpt: "Matières, gestes précis et attention aux détails : apprendre à regarder autrement les objets qui nous accompagnent et apprécier le travail nécessaire à leur réalisation.", status: "published" },
  { id: "journal-seed-006", title: "La beauté des matières naturelles", collection: "craft", date: "2026-10-13", image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=85", imageAlt: "Matériaux et échantillons dans un atelier", excerpt: "Le bois, le lin, la céramique ou le papier racontent chacun une histoire. Comprendre leurs textures aide à choisir des objets agréables et faits pour durer.", status: "published" },
  { id: "journal-seed-007", title: "Réparer plutôt que remplacer", collection: "craft", date: "2026-10-08", image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=85", imageAlt: "Espace de création avec outils et matériaux", excerpt: "Un bouton recousu, une finition entretenue ou une pièce réparée prolongent la vie des objets et rendent leur valeur encore plus personnelle.", status: "published" },
  { id: "journal-seed-008", title: "Quand les détails font la différence", collection: "craft", date: "2026-10-02", image: "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?auto=format&fit=crop&w=900&q=85", imageAlt: "Détails et outils utilisés pour une création artisanale", excerpt: "Finitions, assemblages et choix des matières : les détails presque invisibles révèlent souvent le soin apporté à une création.", status: "published" },

  { id: "journal-seed-009", title: "Créer un intérieur qui respire", collection: "home", date: "2026-10-16", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85", imageAlt: "Salon lumineux aux matières naturelles", excerpt: "Faire de la place, privilégier la lumière et choisir quelques éléments utiles : des pistes accessibles pour un intérieur apaisant, fonctionnel et personnel.", status: "published" },
  { id: "journal-seed-010", title: "Une lumière douce à la maison", collection: "home", date: "2026-10-11", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85", imageAlt: "Salon contemporain éclairé par la lumière du jour", excerpt: "Multiplier les sources lumineuses, préférer une lumière chaleureuse le soir et profiter de la lumière naturelle change l’atmosphère sans grands travaux.", status: "published" },
  { id: "journal-seed-011", title: "Des matières qui invitent au repos", collection: "home", date: "2026-10-06", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85", imageAlt: "Décoration intérieure dans des tons naturels", excerpt: "Le lin, le coton, le bois et les teintes douces apportent du relief tout en conservant une impression d’équilibre et de simplicité.", status: "published" },
  { id: "journal-seed-012", title: "Le plaisir d’une maison bien pensée", collection: "home", date: "2026-09-29", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=85", imageAlt: "Objets de soin alignés dans un décor minimaliste", excerpt: "Ranger les produits par usage, garder les essentiels à portée de main et laisser respirer les surfaces rend les routines plus agréables.", status: "published" },

  { id: "journal-seed-013", title: "Les personnes derrière les belles idées", collection: "makers", date: "2026-10-15", image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85", imageAlt: "Équipe échangeant autour d’une table de travail", excerpt: "Chaque projet naît d’un regard, d’une expérience et d’une envie de bien faire. Découvrir les créateurs, c’est aussi découvrir les histoires qui inspirent leurs pièces.", status: "published" },
  { id: "journal-seed-014", title: "Une création, une histoire", collection: "makers", date: "2026-10-09", image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85", imageAlt: "Créateurs discutant autour d’un projet", excerpt: "Derrière un objet se trouvent des essais, des choix et des gestes répétés. Mettre ces histoires en lumière rapproche les personnes qui fabriquent de celles qui choisissent.", status: "published" },
  { id: "journal-seed-015", title: "La créativité au cœur de l’atelier", collection: "makers", date: "2026-10-03", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85", imageAlt: "Vêtements et accessoires présentés avec soin", excerpt: "La recherche d’une coupe, d’une couleur ou d’une finition révèle une démarche créative où l’usage quotidien rencontre la personnalité de la personne qui fabrique.", status: "published" },
  { id: "journal-seed-016", title: "Choisir des créations avec du sens", collection: "makers", date: "2026-09-26", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85", imageAlt: "Présentation éditoriale de vêtements et accessoires", excerpt: "S’intéresser à l’origine, à la matière et à la manière de fabriquer permet de faire des choix plus réfléchis et de mieux apprécier ce que l’on possède.", status: "published" },

  { id: "journal-seed-017", title: "Les indispensables à choisir avec soin", collection: "selections", date: "2026-10-12", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85", imageAlt: "Canapé confortable dans un intérieur contemporain", excerpt: "Avant d’acheter, pensez à l’usage, aux dimensions, aux matières et à la facilité d’entretien. Quelques critères simples aident à privilégier ce qui vous servira vraiment.", status: "published" },
  { id: "journal-seed-018", title: "Des idées de cadeaux attentionnés", collection: "selections", date: "2026-10-07", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85", imageAlt: "Chocolats présentés pour offrir", excerpt: "Un cadeau juste n’a pas besoin d’être compliqué : privilégiez un usage, une petite attention artisanale ou un produit qui correspond réellement aux goûts de la personne.", status: "published" },
  { id: "journal-seed-019", title: "Les objets utiles au quotidien", collection: "selections", date: "2026-10-01", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85", imageAlt: "Produits de soin présentés dans un arrangement épuré", excerpt: "Les meilleurs indispensables sont ceux que l’on utilise souvent. Comparez la qualité, le format et l’entretien avant de privilégier un objet simplement parce qu’il est tendance.", status: "published" },
  { id: "journal-seed-020", title: "Mieux choisir, moins accumuler", collection: "selections", date: "2026-09-24", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85", imageAlt: "Smartphone présenté sur un fond neutre", excerpt: "Définir ses priorités, comparer ce qui compte réellement et vérifier la durée d’usage attendue permet de choisir avec plus de sérénité.", status: "published" },
];

function etkJournalEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}
function etkJournalToday() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function etkJournalDateLabel(value) {
  const input = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) return "Date non renseignée";
  const date = new Date(`${input}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "Date non renseignée";
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date);
}
function etkJournalNormalizeArticle(article, index = 0) {
  if (!article || typeof article !== "object") return null;
  const collection = ETK_JOURNAL_COLLECTIONS.some((item) => item.key === article.collection)
    ? article.collection : (ETK_JOURNAL_COLLECTIONS[0]?.key || "daily");
  const image = String(article.image || "").trim();
  let imageUrl = "";
  try {
    const parsed = new URL(image, window.location.href);
    if (["http:", "https:"].includes(parsed.protocol)) imageUrl = parsed.href;
  } catch (_) {}
  if (!imageUrl) return null;
  const title = String(article.title || "").trim().slice(0, 120);
  const excerpt = String(article.excerpt || "").trim().slice(0, 500);
  const imageAlt = String(article.imageAlt || title).trim().slice(0, 180);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(String(article.date || "")) ? String(article.date) : etkJournalToday();
  if (!title || !excerpt) return null;
  return {
    id: String(article.id || `journal-${Date.now()}-${index}`), title, collection, date,
    image: imageUrl, imageAlt, excerpt,
    status: article.status === "draft" ? "draft" : "published",
  };
}
function etkJournalReadArticles() {
  try {
    const stored = localStorage.getItem(ETK_JOURNAL_STORAGE_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed.map(etkJournalNormalizeArticle).filter(Boolean);
    }
  } catch (error) {
    console.warn("Lecture du journal local impossible ; utilisation des articles initiaux.", error);
  }
  return ETK_JOURNAL_SEED.map(etkJournalNormalizeArticle).filter(Boolean);
}
let etkJournalArticles = etkJournalReadArticles();
function etkJournalGetCollection(key) {
  return ETK_JOURNAL_COLLECTIONS.find((collection) => collection.key === key) || ETK_JOURNAL_COLLECTIONS[0];
}
function etkJournalRenderCollectionOptions() {
  const select = document.querySelector('#etk-journal-form [name="collection"]');
  if (!select) return;
  const current = select.value;
  select.innerHTML = ETK_JOURNAL_COLLECTIONS.map((collection) => `<option value="${etkJournalEscape(collection.key)}">${etkJournalEscape(collection.title)}</option>`).join("");
  select.value = ETK_JOURNAL_COLLECTIONS.some((collection) => collection.key === current) ? current : (ETK_JOURNAL_COLLECTIONS[0]?.key || "");
}
function etkJournalRenderTopicNavigation() {
  const nav = document.querySelector("#journal-topic-nav");
  if (!nav) return;
  nav.innerHTML = ETK_JOURNAL_COLLECTIONS.map((collection, index) => `
    <button type="button" class="journal-topic-chip${index === 0 ? " is-active" : ""}" data-journal-topic-target="${etkJournalEscape(collection.key)}" aria-pressed="${index === 0 ? "true" : "false"}">
      <span class="journal-topic-chip-index">${String(index + 1).padStart(2, "0")}</span>${etkJournalEscape(collection.title)}
    </button>`).join("");
  if (nav.dataset.journalTopicReady !== "true") {
    nav.dataset.journalTopicReady = "true";
    nav.addEventListener("click", (event) => {
      const button = event.target.closest("[data-journal-topic-target]");
      if (!button) return;
      const key = button.dataset.journalTopicTarget;
      const target = document.getElementById(`journal-topic-${key}`);
      if (target) target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      nav.querySelectorAll("[data-journal-topic-target]").forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  }
}
function etkJournalRenderPublic() {
  const host = document.querySelector("#journal-carousel-groups");
  if (!host) return;
  etkJournalRenderTopicNavigation();
  host.innerHTML = ETK_JOURNAL_COLLECTIONS.map((collection, collectionIndex) => {
    const articles = etkJournalArticles
      .filter((article) => article.collection === collection.key && article.status === "published")
      .sort((a, b) => b.date.localeCompare(a.date));
    const carouselId = collectionIndex === 0 ? "journal-articles" : `journal-articles-${collection.key}`;
    const cards = articles.map((article, articleIndex) => `
      <article class="journal-article journal-slide" role="group" aria-roledescription="diapositive" aria-label="Article ${articleIndex + 1} sur ${articles.length}" tabindex="0">
        <img loading="lazy" decoding="async" src="${etkJournalEscape(article.image)}" alt="${etkJournalEscape(article.imageAlt)}" />
        <div class="journal-article-copy">
          <p class="article-meta"><span>${etkJournalEscape(collection.title)}</span><time datetime="${etkJournalEscape(article.date)}">${etkJournalEscape(etkJournalDateLabel(article.date))}</time></p>
          <h3>${etkJournalEscape(article.title)}</h3>
          <p class="article-excerpt">${etkJournalEscape(article.excerpt)}</p>
        </div>
      </article>`).join("");
    return `
      <section class="journal-shelf" id="journal-topic-${etkJournalEscape(collection.key)}" aria-labelledby="journal-shelf-title-${etkJournalEscape(collection.key)}">
        <div class="journal-shelf-heading">
          <div class="journal-shelf-heading-copy">
            <span class="journal-shelf-kicker">${etkJournalEscape(collection.kicker)}</span>
            <h3 id="journal-shelf-title-${etkJournalEscape(collection.key)}">${etkJournalEscape(collection.title)}</h3>
            ${collection.subtitle ? `<p>${etkJournalEscape(collection.subtitle)}</p>` : ""}
          </div>
          <span class="journal-shelf-index">${String(collectionIndex + 1).padStart(2, "0")} / ${String(ETK_JOURNAL_COLLECTIONS.length).padStart(2, "0")}</span>
        </div>
        <div class="journal-carousel" id="${carouselId}" data-journal-carousel role="region" aria-roledescription="carrousel" aria-label="${etkJournalEscape(collection.title)}">
          <div class="journal-track" data-journal-track tabindex="0" aria-label="Articles de ${etkJournalEscape(collection.title)} ; utilisez les flèches gauche et droite pour naviguer">
            ${cards || '<div class="journal-empty-state">Aucun article publié dans cette rubrique pour le moment.</div>'}
          </div>
          <div class="journal-controls" role="group" aria-label="Navigation : ${etkJournalEscape(collection.title)}">
            <button class="journal-control" type="button" data-journal-prev aria-label="Article précédent · ${etkJournalEscape(collection.title)}"><i class="bi bi-chevron-left" aria-hidden="true"></i></button>
            <span class="journal-position" aria-live="polite">${articles.length ? "01" : "00"} / ${String(articles.length).padStart(2, "0")}</span>
            <button class="journal-control" type="button" data-journal-next aria-label="Article suivant · ${etkJournalEscape(collection.title)}"><i class="bi bi-chevron-right" aria-hidden="true"></i></button>
          </div>
        </div>
      </section>`;
  }).join("");
  etkJournalInitCarousels();
}
function etkJournalRenderCollectionAdmin() {
  const list = document.querySelector("#etk-journal-collection-list");
  if (!list) return;
  list.innerHTML = ETK_JOURNAL_COLLECTIONS.map((collection) => {
    const count = etkJournalArticles.filter((article) => article.collection === collection.key).length;
    return `<article class="journal-admin-collection-item">
      <div class="journal-admin-collection-copy"><strong>${etkJournalEscape(collection.title)}</strong><small>${count} article${count === 1 ? "" : "s"} associé${count === 1 ? "" : "s"}</small>${collection.subtitle ? `<p>${etkJournalEscape(collection.subtitle)}</p>` : ""}</div>
      <div class="journal-admin-collection-actions"><button type="button" class="journal-admin-item-action" data-journal-collection-edit="${etkJournalEscape(collection.key)}"><i class="bi bi-pencil" aria-hidden="true"></i> Modifier</button><button type="button" class="journal-admin-item-action is-danger" data-journal-collection-delete="${etkJournalEscape(collection.key)}" ${ETK_JOURNAL_COLLECTIONS.length <= 1 ? 'disabled title="Gardez au moins une rubrique"' : ''}><i class="bi bi-trash3" aria-hidden="true"></i> Supprimer</button></div>
    </article>`;
  }).join("");
  etkJournalRenderCollectionOptions();
}
function etkJournalResetCollectionForm() {
  const form = document.querySelector("#etk-journal-collection-form");
  if (!form) return;
  form.reset();
  form.elements.namedItem("key").value = "";
  const submit = form.querySelector('[type="submit"]');
  if (submit) submit.innerHTML = '<i class="bi bi-plus-circle" aria-hidden="true"></i> Ajouter la rubrique';
  const reset = document.querySelector("#etk-journal-collection-reset");
  if (reset) reset.hidden = true;
}
function etkJournalEditCollection(key) {
  const collection = etkJournalGetCollection(key);
  const form = document.querySelector("#etk-journal-collection-form");
  if (!collection || !form) return;
  form.elements.namedItem("key").value = collection.key;
  form.elements.namedItem("title").value = collection.title;
  form.elements.namedItem("subtitle").value = collection.subtitle || "";
  const submit = form.querySelector('[type="submit"]');
  if (submit) submit.innerHTML = '<i class="bi bi-check2-circle" aria-hidden="true"></i> Enregistrer la rubrique';
  const reset = document.querySelector("#etk-journal-collection-reset");
  if (reset) reset.hidden = false;
  form.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
  form.elements.namedItem("title").focus({ preventScroll: true });
}
function etkJournalCollectionKey(title) {
  const base = String(title || "rubrique").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 45) || "rubrique";
  let key = base; let suffix = 2;
  while (ETK_JOURNAL_COLLECTIONS.some((item) => item.key === key)) key = `${base}-${suffix++}`;
  return key;
}
function etkJournalPersistCollections(nextCollections) {
  try {
    localStorage.setItem(ETK_JOURNAL_COLLECTIONS_STORAGE_KEY, JSON.stringify(nextCollections));
    ETK_JOURNAL_COLLECTIONS = nextCollections;
    etkJournalRenderCollectionAdmin();
    etkJournalRenderPublic();
    window.dispatchEvent(new CustomEvent("etokiana-journal-collections-changed", { detail: { count: nextCollections.length } }));
    return true;
  } catch (error) {
    console.error("Enregistrement des rubriques impossible", error);
    etkJournalSetStatus("Impossible d’enregistrer les rubriques. Vérifiez l’espace de stockage du navigateur.");
    return false;
  }
}
function etkJournalActiveIndex(track, slides) {
  if (!slides.length) return 0;
  const trackRect = track.getBoundingClientRect();
  return slides.reduce((nearestIndex, slide, index) => {
    const distance = Math.abs(slide.getBoundingClientRect().left - trackRect.left);
    const nearestDistance = Math.abs(slides[nearestIndex].getBoundingClientRect().left - trackRect.left);
    return distance < nearestDistance ? index : nearestIndex;
  }, 0);
}
function etkJournalUpdateCarousel(carousel) {
  const track = carousel.querySelector("[data-journal-track]");
  const slides = [...track.querySelectorAll(".journal-slide")];
  const previous = carousel.querySelector("[data-journal-prev]");
  const next = carousel.querySelector("[data-journal-next]");
  const position = carousel.querySelector(".journal-position");
  const activeIndex = etkJournalActiveIndex(track, slides);
  if (position) position.textContent = slides.length ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}` : "00 / 00";
  if (previous) previous.disabled = slides.length < 2;
  if (next) next.disabled = slides.length < 2;
  slides.forEach((slide, index) => slide.setAttribute("aria-label", `Article ${index + 1} sur ${slides.length}${index === activeIndex ? ", affiché" : ""}`));
}
function etkJournalMoveCarousel(carousel, direction) {
  const track = carousel.querySelector("[data-journal-track]");
  const slides = [...track.querySelectorAll(".journal-slide")];
  if (slides.length < 2) return;
  const targetIndex = (etkJournalActiveIndex(track, slides) + direction + slides.length) % slides.length;
  const trackRect = track.getBoundingClientRect();
  const targetSlide = slides[targetIndex];
  const targetLeft = track.scrollLeft + targetSlide.getBoundingClientRect().left - trackRect.left;
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
  track.scrollTo({ left: Math.max(0, Math.min(maxScroll, targetLeft)), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
function etkJournalInitCarousels() {
  document.querySelectorAll("[data-journal-carousel]").forEach((carousel) => {
    if (carousel.dataset.journalReady === "true") return;
    carousel.dataset.journalReady = "true";
    const track = carousel.querySelector("[data-journal-track]");
    let frame = 0;
    carousel.querySelector("[data-journal-prev]")?.addEventListener("click", () => etkJournalMoveCarousel(carousel, -1));
    carousel.querySelector("[data-journal-next]")?.addEventListener("click", () => etkJournalMoveCarousel(carousel, 1));
    track?.addEventListener("scroll", () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; etkJournalUpdateCarousel(carousel); });
    }, { passive: true });
    track?.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      etkJournalMoveCarousel(carousel, event.key === "ArrowRight" ? 1 : -1);
    });
    etkJournalUpdateCarousel(carousel);
  });
}
function etkJournalCurrentUser() {
  let user = null;
  try { user = typeof currentUser !== "undefined" && currentUser ? currentUser : null; } catch (_) {}
  if (!user) {
    for (const key of ["etokiana-user", "currentUser", "authUser"]) {
      try { user = JSON.parse(localStorage.getItem(key) || sessionStorage.getItem(key) || "null"); } catch (_) {}
      if (user) break;
    }
  }
  return user && typeof user === "object" ? user : null;
}
function etkJournalRole(user = etkJournalCurrentUser()) {
  return String(user?.role || user?.type || user?.accountType || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
function etkJournalIsAdmin() {
  const user = etkJournalCurrentUser();
  return user?.isAdmin === true || user?.is_admin === true || ["admin", "owner", "superadmin", "administrateur", "administrator"].includes(etkJournalRole(user));
}
let etkJournalStandaloneMode = false;
function etkJournalCanManage() {
  const user = etkJournalCurrentUser();
  const role = etkJournalRole(user);
  const permissions = Array.isArray(user?.staffPermissions) ? user.staffPermissions : [];
  return etkJournalIsAdmin() || (role === "staff" && (permissions.includes("journal.manage") || user?.staffRoleKey === "editor" || permissions.includes("content.edit"))) || ["editor", "redac", "writer", "journalist", "content"].includes(role);
}
function syncJournalAdminAccess() {
  const nav = document.querySelector('.admin-nav-item[data-admin-view="journal"]');
  const panel = document.querySelector('[data-admin-panel="journal"]');
  const userSpaceEntry = document.querySelector("#user-space-journal-settings-card");
  const modal = document.querySelector("#admin-modal");
  const allowed = etkJournalCanManage();
  if (nav) nav.hidden = !allowed;
  if (userSpaceEntry) userSpaceEntry.hidden = !allowed;
  if (modal) modal.classList.toggle("etk-journal-only-mode", allowed && (etkJournalStandaloneMode || !etkJournalIsAdmin()));
  if (!allowed && panel?.classList.contains("active")) {
    panel.classList.remove("active");
    const dashboard = document.querySelector('[data-admin-panel="dashboard"]');
    const dashboardNav = document.querySelector('.admin-nav-item[data-admin-view="dashboard"]');
    dashboard?.classList.add("active");
    dashboardNav?.classList.add("active");
  }
}
function openEtokianaJournalAdmin() {
  if (!etkJournalCanManage()) {
    if (typeof showToast === "function") showToast("Accès réservé à l’administration ou à un rédacteur autorisé.");
    return false;
  }
  // Le raccourci « Gérer le journal » ouvre un écran dédié, y compris pour l’administrateur.
  etkJournalStandaloneMode = true;
  document.querySelector("#user-space-close")?.click();
  document.querySelector("#admin-modal")?.classList.remove("etk-about-only-mode");
  syncJournalAdminAccess();
  const title = document.querySelector("#admin-title");
  const eyebrow = document.querySelector("#admin-space-label");
  if (title) title.textContent = etkJournalIsAdmin() ? "E-tokiana · Journal éditorial" : "Journal éditorial";
  if (eyebrow) eyebrow.textContent = "Gestion des publications";
  openModal(adminModal);
  const journalNav = document.querySelector('.admin-nav-item[data-admin-view="journal"]');
  if (journalNav) journalNav.click();
  etkJournalRenderAdminList();
  return true;
}
window.openEtokianaJournalAdmin = openEtokianaJournalAdmin;
// Réinitialiser le mode autonome à la fermeture : l’administration complète
// retrouvera son menu habituel à la prochaine ouverture.
document.querySelector("#admin-modal")?.addEventListener("click", (event) => {
  const modal = document.querySelector("#admin-modal");
  if (event.target === modal || event.target.closest('[data-close-modal="admin-modal"]')) {
    etkJournalStandaloneMode = false;
    modal?.classList.remove("etk-journal-only-mode");
  }
});
document.addEventListener("click", (event) => {
  if (event.target.closest("#user-space-journal-settings-open")) openEtokianaJournalAdmin();
});
function etkJournalRenderAdminList() {
  const list = document.querySelector("#etk-journal-admin-list");
  const count = document.querySelector("#etk-journal-count");
  if (!list || !count) return;
  const sorted = [...etkJournalArticles].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "fr"));
  count.textContent = `${sorted.length} article${sorted.length > 1 ? "s" : ""}`;
  if (!sorted.length) {
    list.innerHTML = '<div class="journal-admin-empty">Aucun article enregistré. Utilisez le formulaire ci-dessus pour commencer.</div>';
    return;
  }
  list.innerHTML = sorted.map((article) => {
    const collection = etkJournalGetCollection(article.collection);
    const isPublished = article.status === "published";
    return `<article class="journal-admin-item" data-journal-record="${etkJournalEscape(article.id)}">
      <div class="journal-admin-item-copy"><strong>${etkJournalEscape(article.title)}</strong><p>${etkJournalEscape(collection.title)} · ${etkJournalEscape(etkJournalDateLabel(article.date))}</p></div>
      <span class="journal-admin-item-status ${isPublished ? "is-published" : "is-draft"}"><i class="bi ${isPublished ? "bi-check-circle-fill" : "bi-file-earmark"}" aria-hidden="true"></i>${isPublished ? "Publié" : "Brouillon"}</span>
      <div class="journal-admin-item-actions">
        <button type="button" class="journal-admin-item-action" data-journal-share-toggle="${etkJournalEscape(article.id)}" aria-expanded="false" aria-controls="etk-journal-share-${etkJournalEscape(article.id)}" ${isPublished ? "" : "disabled title=\"Publiez cet article avant de le partager.\""}><i class="bi bi-share" aria-hidden="true"></i> Partager</button>
        <button type="button" class="journal-admin-item-action" data-journal-edit="${etkJournalEscape(article.id)}"><i class="bi bi-pencil-square" aria-hidden="true"></i> Modifier</button>
        <button type="button" class="journal-admin-item-action is-danger" data-journal-delete="${etkJournalEscape(article.id)}"><i class="bi bi-trash3" aria-hidden="true"></i> Supprimer</button>
      </div>
      <div class="journal-share-menu" id="etk-journal-share-${etkJournalEscape(article.id)}" data-journal-share-menu="${etkJournalEscape(article.id)}" hidden>
        <span>Partager cet article :</span>
        <button type="button" class="journal-share-platform" data-journal-share-platform="facebook" data-journal-share-id="${etkJournalEscape(article.id)}"><i class="bi bi-facebook" aria-hidden="true"></i> Facebook</button>
        <button type="button" class="journal-share-platform" data-journal-share-platform="whatsapp" data-journal-share-id="${etkJournalEscape(article.id)}"><i class="bi bi-whatsapp" aria-hidden="true"></i> WhatsApp</button>
        <button type="button" class="journal-share-platform" data-journal-share-platform="linkedin" data-journal-share-id="${etkJournalEscape(article.id)}"><i class="bi bi-linkedin" aria-hidden="true"></i> LinkedIn</button>
        <button type="button" class="journal-share-platform" data-journal-share-platform="x" data-journal-share-id="${etkJournalEscape(article.id)}"><i class="bi bi-twitter-x" aria-hidden="true"></i> X</button>
        <button type="button" class="journal-share-platform" data-journal-share-platform="copy" data-journal-share-id="${etkJournalEscape(article.id)}"><i class="bi bi-link-45deg" aria-hidden="true"></i> Copier le lien</button>
      </div>
    </article>`;
  }).join("");
}
function etkJournalShareArticle(id, platform) {
  if (!etkJournalCanManage()) {
    etkJournalSetStatus("Accès refusé : vous n’avez pas le droit de partager cet article.");
    return;
  }
  const article = etkJournalArticles.find((item) => item.id === String(id));
  if (!article || article.status !== "published") {
    etkJournalSetStatus("Seuls les articles publiés peuvent être partagés.");
    return;
  }
  if (!/^https?:$/.test(window.location.protocol) || window.location.origin === "null") {
    etkJournalSetStatus("Publiez d’abord le site sur une adresse web publique (https://…) pour partager un lien utilisable.");
    return;
  }
  const shareUrl = `${window.location.origin}${window.location.pathname}#journal`;
  const shareText = `${article.title}
${article.excerpt}
${shareUrl}`;
  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`,
  };
  if (platform === "copy") {
    const copied = () => etkJournalSetStatus(`Lien du journal copié : ${shareUrl}`);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(copied).catch(() => {
        window.prompt("Copiez le lien public du journal :", shareUrl);
        etkJournalSetStatus("Copiez le lien affiché pour le partager.");
      });
    } else {
      window.prompt("Copiez le lien public du journal :", shareUrl);
      etkJournalSetStatus("Copiez le lien affiché pour le partager.");
    }
    return;
  }
  const destination = urls[platform];
  if (!destination) return;
  const popup = window.open(destination, "_blank", "noopener,noreferrer,width=760,height=650");
  if (!popup) etkJournalSetStatus("La fenêtre de partage a été bloquée. Autorisez les fenêtres contextuelles ou copiez le lien.");
  else etkJournalSetStatus(`Fenêtre de partage ${platform === "x" ? "X" : platform} ouverte. Vérifiez le message avant de publier.`);
}

function etkJournalSetStatus(message) {
  const status = document.querySelector("#etk-journal-status");
  if (status) status.textContent = message;
}
function etkJournalResetForm() {
  const form = document.querySelector("#etk-journal-form");
  if (!form) return;
  form.reset();
  form.elements.namedItem("id").value = "";
  form.elements.namedItem("date").value = etkJournalToday();
  etkJournalRenderCollectionOptions();
  form.elements.namedItem("collection").value = ETK_JOURNAL_COLLECTIONS[0]?.key || "";
  form.elements.namedItem("status").value = "published";
  const title = document.querySelector("[data-journal-form-title]");
  if (title) title.textContent = "Ajouter un article";
  const submit = form.querySelector('[type="submit"]');
  if (submit) submit.innerHTML = '<i class="bi bi-check2-circle" aria-hidden="true"></i> Enregistrer l’article';
}
function etkJournalEditArticle(id) {
  if (!etkJournalCanManage()) { etkJournalSetStatus("Accès refusé : connectez-vous avec un compte autorisé à gérer les contenus."); return; }
  const article = etkJournalArticles.find((item) => item.id === String(id));
  const form = document.querySelector("#etk-journal-form");
  if (!article || !form) return;
  form.elements.namedItem("id").value = article.id;
  form.elements.namedItem("title").value = article.title;
  form.elements.namedItem("collection").value = article.collection;
  form.elements.namedItem("date").value = article.date;
  form.elements.namedItem("image").value = article.image;
  form.elements.namedItem("imageAlt").value = article.imageAlt;
  form.elements.namedItem("excerpt").value = article.excerpt;
  form.elements.namedItem("status").value = article.status;
  const title = document.querySelector("[data-journal-form-title]");
  if (title) title.textContent = "Modifier l’article";
  const submit = form.querySelector('[type="submit"]');
  if (submit) submit.innerHTML = '<i class="bi bi-check2-circle" aria-hidden="true"></i> Enregistrer les modifications';
  etkJournalSetStatus("Modifiez les champs nécessaires, puis enregistrez les modifications.");
  form.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
}
function etkJournalSaveArticles(nextArticles) {
  try {
    localStorage.setItem(ETK_JOURNAL_STORAGE_KEY, JSON.stringify(nextArticles));
    etkJournalArticles = nextArticles;
    etkJournalRenderPublic();
    etkJournalRenderAdminList();
    window.dispatchEvent(new CustomEvent("etokiana-journal-changed", { detail: { count: nextArticles.length } }));
    return true;
  } catch (error) {
    console.error("Enregistrement du journal impossible", error);
    etkJournalSetStatus("Enregistrement impossible. Vérifiez l’espace disponible dans le navigateur.");
    return false;
  }
}
function initEtkJournalAdmin() {
  const form = document.querySelector("#etk-journal-form");
  const panel = document.querySelector("#admin-journal-panel");
  if (!form || !panel) return;
  etkJournalResetForm();
  etkJournalRenderCollectionAdmin();
  etkJournalResetCollectionForm();
  etkJournalRenderAdminList();
  syncJournalAdminAccess();

  const collectionForm = document.querySelector("#etk-journal-collection-form");
  collectionForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!etkJournalCanManage()) { etkJournalSetStatus("Accès refusé."); return; }
    if (!collectionForm.reportValidity()) return;
    const key = String(collectionForm.elements.namedItem("key").value || "").trim();
    const title = String(collectionForm.elements.namedItem("title").value || "").trim().slice(0, 60);
    const subtitle = String(collectionForm.elements.namedItem("subtitle").value || "").trim().slice(0, 180);
    if (!title) return;
    if (ETK_JOURNAL_COLLECTIONS.some((item) => item.title.toLocaleLowerCase("fr-FR") === title.toLocaleLowerCase("fr-FR") && item.key !== key)) {
      etkJournalSetStatus("Une rubrique porte déjà ce nom. Choisissez un titre différent."); return;
    }
    const editing = Boolean(key);
    const next = editing
      ? ETK_JOURNAL_COLLECTIONS.map((item) => item.key === key ? { ...item, title, subtitle, kicker: item.kicker || "Rubrique éditoriale" } : item)
      : [...ETK_JOURNAL_COLLECTIONS, { key: etkJournalCollectionKey(title), title, subtitle, kicker: "À découvrir" }];
    if (etkJournalPersistCollections(next)) {
      etkJournalResetCollectionForm();
      etkJournalSetStatus(editing ? `Rubrique « ${title} » mise à jour.` : `Rubrique « ${title} » ajoutée. Vous pouvez maintenant publier des articles sur ce thème.`);
    }
  });
  document.querySelector("#etk-journal-collection-reset")?.addEventListener("click", () => etkJournalResetCollectionForm());

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!etkJournalCanManage()) { etkJournalSetStatus("Accès refusé : cette action est réservée à l’administration ou à un rédacteur autorisé."); return; }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const id = String(data.get("id") || "").trim();
    const title = String(data.get("title") || "").trim();
    const collection = String(data.get("collection") || "daily");
    const date = String(data.get("date") || etkJournalToday());
    const image = String(data.get("image") || "").trim();
    const imageAlt = String(data.get("imageAlt") || "").trim();
    const excerpt = String(data.get("excerpt") || "").trim();
    const status = data.get("status") === "draft" ? "draft" : "published";
    let parsedImage;
    try { parsedImage = new URL(image); } catch (_) { etkJournalSetStatus("Veuillez saisir une URL d’image valide, commençant par https:// ou http://."); return; }
    if (!["https:", "http:"].includes(parsedImage.protocol)) { etkJournalSetStatus("L’image doit utiliser une adresse web http:// ou https://."); return; }
    if (!ETK_JOURNAL_COLLECTIONS.some((item) => item.key === collection)) { etkJournalSetStatus("Sélectionnez une rubrique valide."); return; }
    if (!title || !excerpt || !imageAlt) { etkJournalSetStatus("Le titre, le résumé et le texte alternatif sont obligatoires."); return; }
    const article = { id: id || `journal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title, collection, date, image: parsedImage.href, imageAlt, excerpt, status };
    const next = id ? etkJournalArticles.map((item) => item.id === id ? article : item) : [article, ...etkJournalArticles];
    if (etkJournalSaveArticles(next)) {
      etkJournalResetForm();
      etkJournalSetStatus(status === "draft" ? "Brouillon enregistré. Il n’apparaît pas sur la page publique." : "Article enregistré et publié sur la page publique de ce navigateur.");
    }
  });

  document.querySelector("#etk-journal-reset")?.addEventListener("click", () => {
    etkJournalResetForm();
    etkJournalSetStatus("Formulaire prêt pour un nouvel article.");
  });

  panel.addEventListener("click", (event) => {
    const collectionEdit = event.target.closest("[data-journal-collection-edit]");
    if (collectionEdit) { if (!etkJournalCanManage()) { etkJournalSetStatus("Accès refusé."); return; } etkJournalEditCollection(collectionEdit.dataset.journalCollectionEdit); return; }
    const collectionDelete = event.target.closest("[data-journal-collection-delete]");
    if (collectionDelete) {
      if (!etkJournalCanManage()) { etkJournalSetStatus("Accès refusé."); return; }
      if (ETK_JOURNAL_COLLECTIONS.length <= 1) { etkJournalSetStatus("Conservez au moins une rubrique au journal."); return; }
      const collection = etkJournalGetCollection(collectionDelete.dataset.journalCollectionDelete);
      if (!collection) return;
      const replacement = ETK_JOURNAL_COLLECTIONS.find((item) => item.key !== collection.key);
      const articleCount = etkJournalArticles.filter((item) => item.collection === collection.key).length;
      const prompt = articleCount
        ? `Supprimer la rubrique « ${collection.title} » ? ${articleCount} article(s) associé(s) seront déplacés vers « ${replacement.title} ».`
        : `Supprimer la rubrique « ${collection.title} » ?`;
      if (!window.confirm(prompt)) return;
      const nextCollections = ETK_JOURNAL_COLLECTIONS.filter((item) => item.key !== collection.key);
      const nextArticles = etkJournalArticles.map((article) => article.collection === collection.key ? { ...article, collection: replacement.key } : article);
      try {
        localStorage.setItem(ETK_JOURNAL_COLLECTIONS_STORAGE_KEY, JSON.stringify(nextCollections));
        localStorage.setItem(ETK_JOURNAL_STORAGE_KEY, JSON.stringify(nextArticles));
        ETK_JOURNAL_COLLECTIONS = nextCollections;
        etkJournalArticles = nextArticles;
        etkJournalRenderCollectionAdmin();
        etkJournalRenderPublic();
        etkJournalRenderAdminList();
        etkJournalResetCollectionForm();
        etkJournalSetStatus(articleCount ? `Rubrique supprimée. ${articleCount} article(s) ont été conservés dans « ${replacement.title} ».` : "Rubrique supprimée.");
      } catch (error) { console.error(error); etkJournalSetStatus("Impossible de supprimer la rubrique. Vérifiez l’espace de stockage du navigateur."); }
      return;
    }
    const shareToggle = event.target.closest("[data-journal-share-toggle]");
    if (shareToggle) {
      if (!etkJournalCanManage()) { etkJournalSetStatus("Accès refusé."); return; }
      const id = shareToggle.dataset.journalShareToggle;
      const menu = panel.querySelector(`[data-journal-share-menu="${CSS.escape(id)}"]`);
      if (!menu) return;
      const opening = menu.hidden;
      panel.querySelectorAll("[data-journal-share-menu]").forEach((candidate) => { candidate.hidden = true; });
      panel.querySelectorAll("[data-journal-share-toggle]").forEach((button) => button.setAttribute("aria-expanded", "false"));
      menu.hidden = !opening;
      shareToggle.setAttribute("aria-expanded", String(opening));
      return;
    }
    const sharePlatform = event.target.closest("[data-journal-share-platform]");
    if (sharePlatform) {
      etkJournalShareArticle(sharePlatform.dataset.journalShareId, sharePlatform.dataset.journalSharePlatform);
      return;
    }
    const editButton = event.target.closest("[data-journal-edit]");
    if (editButton) { etkJournalEditArticle(editButton.dataset.journalEdit); return; }
    const deleteButton = event.target.closest("[data-journal-delete]");
    if (!deleteButton) return;
    if (!etkJournalCanManage()) { etkJournalSetStatus("Accès refusé."); return; }
    const article = etkJournalArticles.find((item) => item.id === deleteButton.dataset.journalDelete);
    if (!article) return;
    if (!window.confirm(`Supprimer l’article « ${article.title} » ? Cette action ne peut pas être annulée.`)) return;
    if (etkJournalSaveArticles(etkJournalArticles.filter((item) => item.id !== article.id))) {
      const activeId = document.querySelector('#etk-journal-form [name="id"]')?.value;
      if (activeId === article.id) etkJournalResetForm();
      etkJournalSetStatus("Article supprimé.");
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest('.admin-nav-item[data-admin-view="journal"]')) {
      syncJournalAdminAccess();
      if (etkJournalCanManage()) etkJournalRenderAdminList();
      else etkJournalSetStatus("Accès refusé : connectez-vous avec un compte administrateur ou rédacteur autorisé.");
    }
  });
  window.addEventListener("storage", (event) => {
    if (!event.key || event.key === ETK_JOURNAL_COLLECTIONS_STORAGE_KEY) {
      ETK_JOURNAL_COLLECTIONS = etkJournalReadCollections();
      etkJournalRenderCollectionAdmin();
      etkJournalRenderPublic();
    }
    if (!event.key || event.key === ETK_JOURNAL_STORAGE_KEY) {
      etkJournalArticles = etkJournalReadArticles();
      etkJournalRenderPublic();
      etkJournalRenderAdminList();
    }
    if (!event.key || event.key === "etokiana-user") syncJournalAdminAccess();
  });
}

function syncJournalAdminAccessSafe() {
  try { syncJournalAdminAccess(); } catch (_) {}
}
window.addEventListener("storage", syncJournalAdminAccessSafe);
etkJournalRenderPublic();
initEtkJournalAdmin();
window.EtokianaJournal = {
  refresh: () => { etkJournalArticles = etkJournalReadArticles(); etkJournalRenderPublic(); etkJournalRenderAdminList(); },
  getArticles: () => etkJournalArticles.map((article) => ({ ...article })),
  getCollections: () => ETK_JOURNAL_COLLECTIONS.map((item) => ({ ...item })),
  canManage: () => etkJournalCanManage(),
  shareArticle: (id, platform) => etkJournalShareArticle(id, platform),
};

document.querySelector("#cart-toggle").addEventListener("click", openCart);
document.querySelector("#cart-close").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);
document.querySelector("#checkout-button").addEventListener("click", () => {
  if (cart.length) {
    // Mettre à jour le total avant de passer à l'étape paiement.
    updatePaymentTotal();
    // Fermer le tiroir panier et son fond avant d'ouvrir le choix du paiement.
    closeCart();
    openModal(paymentModal);
  } else {
    showToast("Ajoutez un article avant de commander.");
  }
});
document
  .querySelector("#newsletter-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#form-message").textContent =
      "Bienvenue dans la lettre E-tokiana.";
    event.target.reset();
  });
document
  .querySelector("#profile-button")
  .addEventListener("click", openUserSpace);
const signupLink = document.createElement("button");
signupLink.className = "signup-link";
signupLink.textContent = "Créer un compte client";
document.querySelector("#login-form").after(signupLink);
signupLink.addEventListener("click", () => openModal(signupModal));
document
  .querySelectorAll("[data-close-modal]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      closeModal(document.querySelector(`#${button.dataset.closeModal}`)),
    ),
  );
document.querySelectorAll(".modal").forEach((modal) =>
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  }),
);
document.querySelectorAll(".account-tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    document.querySelector(".account-tab.active").classList.remove("active");
    tab.classList.add("active");
    document.querySelector(".account-view.active").classList.remove("active");
    document
      .querySelector(`[data-view="${tab.dataset.accountView}"]`)
      .classList.add("active");
  }),
);
document
  .querySelector('[data-view="overview"]')
  .addEventListener("click", (event) => {
    const action = event.target.closest(".account-action");
    if (!action || !currentUser) return;
    if (action.textContent.includes("Modifier")) {
      const address = window.prompt(
        "Nouvelle adresse de livraison",
        currentUser.address || "",
      );
      if (address?.trim()) {
        const previousAddress = String(currentUser.address || "");
        currentUser.address = address.trim();
        localStorage.setItem("etokiana-user", JSON.stringify(currentUser));
        window.EtoHistoryAudit?.log({ type: "Compte", action: "Adresse de livraison modifiée", target: currentUser.email || "Profil utilisateur", severity: "medium", before: { adresse: previousAddress || "Non renseignée" }, after: { adresse: address.trim() }, details: "Mise à jour de l’adresse de livraison." });
        updateProfileButton();
        showToast("Adresse de livraison mise à jour.");
      }
    }
    if (action.matches("[data-track-latest-order]") || action.textContent.includes("Suivre")) {
      const buyerEmail = String(currentUser.email || "").trim().toLocaleLowerCase("fr-FR");
      let savedOrders = orders;
      try {
        const parsed = JSON.parse(localStorage.getItem("etokiana-orders") || "[]");
        if (Array.isArray(parsed)) savedOrders = parsed;
      } catch (_) {}
      orders = savedOrders;
      const latestOrder = savedOrders
        .filter((order) => String(order.buyerId || "").trim().toLocaleLowerCase("fr-FR") === buyerEmail)
        .slice()
        .sort((a, b) => (new Date(b.date || 0).getTime() || 0) - (new Date(a.date || 0).getTime() || 0))[0];
      if (latestOrder) openOrderTracking(latestOrder.id);
      else {
        showToast("Vous n'avez pas encore de commande à suivre.");
        document.querySelector('[data-account-view="orders"]')?.click();
      }
    }
  });
document
  .querySelector('[data-view="orders"]')
  .addEventListener("click", (event) => {
    const cancelAction = event.target.closest("[data-cancel-account-order]");
    if (cancelAction && currentUser?.role === "client") {
      const savedOrders = JSON.parse(localStorage.getItem("etokiana-orders") || "[]");
      const order = savedOrders.find((item) => String(item.id) === String(cancelAction.dataset.cancelAccountOrder));
      const allowedStatuses = ["nouvelle commande", "nouvelle", "a confirmer", "confirmee", "validee", "valide", "commande validee"];
      const normalizeStatus = (value) => String(value || "Nouvelle commande").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
      if (!order || String(order.buyerId || "").trim().toLowerCase() !== String(currentUser.email || "").trim().toLowerCase() || !allowedStatuses.includes(normalizeStatus(order.status))) {
        showToast("Cette commande ne peut plus être annulée.");
        renderAccountData();
        return;
      }
      const previousStatus = order.status || "Nouvelle commande";
      const commitCancellation = reason => {
        reason = String(reason || '').trim(); if (!reason) { showToast("Veuillez renseigner un motif d’annulation."); return; }
        order.status = "Annulée";
        order.cancelledAt = new Date().toISOString();
        order.cancelReason = reason;
        order.cancelledPreviousStatus = previousStatus;
        order.cancelledBy = { name: currentUser.name || "Client", email: currentUser.email, role: currentUser.role };
        localStorage.setItem("etokiana-orders", JSON.stringify(savedOrders));
        orders = savedOrders;
        try { addNotification("admin@etokiana.fr", `Le client ${order.buyerName || order.buyerId} a annulé la commande #${order.id}. Motif : ${reason}.`); } catch (_) {}
        try { window.dispatchEvent(new CustomEvent("etokiana-orders-changed", { detail: { orderId: String(order.id), status: "Annulée" } })); } catch (_) {}
        try { window.EtoHistoryAudit?.log({ type: "Commande", action: "Commande annulée", target: `#${order.id}`, severity: "high", before: { statut: previousStatus }, after: { statut: "Annulée", motif: reason }, details: `Annulation effectuée par ${currentUser.name || currentUser.email}.` }); } catch (_) {}
        renderAccountData();
        showToast(`Commande #${order.id} annulée. Son montant ne sera pas inclus dans le chiffre d’affaires.`);
      };
      const openDialog = window.EtokianaPremiumDialogs?.open;
      if (typeof openDialog === 'function') {
        openDialog({
          variant:'order-cancel', icon:'bi-receipt-cutoff', kicker:'SUIVI DES COMMANDES', title:`Annuler la commande #${order.id} ?`,
          description:'La commande restera visible dans votre historique. Son montant sera exclu des indicateurs de chiffre d’affaires et de total dépensé.',
          summaryHtml:`<div class="etk-premium-summary-row"><strong>Montant de la commande</strong><span>${euro(Number(order.total)||0)}</span></div><p class="etk-premium-note">L’administration sera informée de votre annulation.</p>`,
          reasonLabel:'Motif de l’annulation (obligatoire)', reasonPlaceholder:'Ex. : changement d’avis, erreur de commande…', reasonRequired:true, confirmLabel:'Confirmer l’annulation', tone:'danger', onConfirm:commitCancellation
        });
      } else {
        const reasonInput = window.prompt("Motif de l’annulation (obligatoire) :", "Changement d’avis");
        if (reasonInput === null) return; const reason = String(reasonInput || '').trim();
        if (!reason) { showToast("Veuillez renseigner un motif d’annulation."); return; }
        if (window.confirm(`Confirmer l’annulation de la commande #${order.id} ?\nMotif : ${reason}`)) commitCancellation(reason);
      }
      return;
    }
    const action = event.target.closest("[data-track-order]");
    if (!action) return;
    openOrderTracking(
      orders.find((order) => String(order.id) === String(action.dataset.trackOrder)),
    );
  });
document.querySelector(".admin-content").addEventListener("click", (event) => {
  const action = event.target.closest("[data-order-status]");
  if (!action) return;
  const role = String(currentUser?.role || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (!isSellerRoleValue(role)) {
    window.alert("Action refusée : l’administration consulte l’historique ; seul le vendeur du produit peut traiter la commande.");
    return;
  }
  const order = orders.find(item => String(item.id) === String(action.dataset.orderStatus));
  if (!order) return;
  const sellerKey = String(currentUser?.id ?? "");
  const actionSellerKey = String(action.dataset.orderSellerId ?? sellerKey);
  if (actionSellerKey !== sellerKey) {
    window.alert("Action refusée : vous ne pouvez gérer que vos propres produits.");
    return;
  }
  const ownsLines = (order.items || []).some(item => String(item.sellerId ?? "owner") === sellerKey);
  if (!ownsLines) {
    window.alert("Action refusée : cette commande ne contient aucun de vos produits.");
    return;
  }
  const transitions = {
    "Nouvelle commande": "Validée",
    "Validée": "En préparation",
    "En préparation": "Expédiée",
    "Expédiée": "Livrée",
  };
  order.fulfillmentBySeller = order.fulfillmentBySeller && typeof order.fulfillmentBySeller === "object" ? order.fulfillmentBySeller : {};
  const initialStatus = ["Nouvelle commande", "Validée", "En préparation", "Expédiée", "Livrée", "Annulée"].includes(String(order.status || "")) ? String(order.status) : "Nouvelle commande";
  // Migration douce des commandes déjà existantes : chaque vendeur reçoit le statut
  // global antérieur avant que les suivis deviennent indépendants.
  orderSellerKeys(order).forEach(key => {
    if (!order.fulfillmentBySeller[key]) order.fulfillmentBySeller[key] = initialStatus;
  });
  const currentStatus = getOrderStatusForSeller(order, sellerKey);
  const nextStatus = transitions[currentStatus];
  if (!nextStatus) {
    showToast(currentStatus === "Livrée" ? "Cette partie de la commande est déjà livrée." : "Aucune autre action disponible pour ce statut.");
    return;
  }
  order.fulfillmentBySeller[sellerKey] = nextStatus;
  const keys = orderSellerKeys(order);
  const statuses = keys.map(key => getOrderStatusForSeller(order, key));
  order.status = statuses.every(status => status === statuses[0]) ? statuses[0] : "Traitement par vendeurs";
  localStorage.setItem("etokiana-orders", JSON.stringify(orders));
  if (typeof window.renderPremiumUserSpace === "function") window.renderPremiumUserSpace();
  addNotification(order.buyerId, `La partie de votre commande #${order.id} gérée par ${sellerKey === "owner" ? "E-tokiana" : (currentUser.name || "votre vendeur")} est maintenant : ${nextStatus}.`);
  addNotification(adminIdentity.email, `Commande #${order.id} : ${sellerKey === "owner" ? "E-tokiana" : (currentUser.name || "vendeur")} a fait passer sa partie au statut « ${nextStatus} ».`);
  renderSellerAndOwnerViews();
  addSellerOrderActions();
  addOwnerOrderActions();
  renderNotifications();
  showToast(`Commande ${order.id} : ${nextStatus}`);
});

// Onglets accessibles des deux tableaux de bord (espace utilisateur et administration).
document.addEventListener('click', event => {
  const userButton = event.target.closest('[data-user-dashboard-tab]');
  if (userButton) { activateDashboardTab('user', userButton.dataset.userDashboardTab); return; }
  const adminButton = event.target.closest('[data-admin-dashboard-tab]');
  if (adminButton) { activateDashboardTab('admin', adminButton.dataset.adminDashboardTab); return; }
});
document.addEventListener('keydown', event => {
  const button = event.target.closest('[data-user-dashboard-tab], [data-admin-dashboard-tab]');
  if (!button || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
  const user = button.hasAttribute('data-user-dashboard-tab');
  const root = button.closest(user ? '[data-user-panel="dashboard"]' : '[data-admin-panel="dashboard"]');
  const list = Array.from(root?.querySelectorAll(user ? '[data-user-dashboard-tab]' : '[data-admin-dashboard-tab]') || []);
  const index = list.indexOf(button); if (index < 0 || !list.length) return;
  event.preventDefault();
  const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? list.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length;
  list[nextIndex].focus(); list[nextIndex].click();
});

document.querySelectorAll(".admin-nav-item").forEach((tab) =>
  tab.addEventListener("click", () => {
    document.querySelector(".admin-nav-item.active").classList.remove("active");
    tab.classList.add("active");
    document.querySelector(".admin-view.active").classList.remove("active");
    document
      .querySelector(`[data-admin-panel="${tab.dataset.adminView}"]`)
      .classList.add("active");
    if (tab.dataset.adminView === "dashboard") renderAdminDashboard();
  }),
);
document.querySelectorAll("[data-admin-view-target]").forEach((button) =>
  button.addEventListener("click", () => {
    const target = document.querySelector(
      `[data-admin-view="${button.dataset.adminViewTarget}"]`,
    );
    if (target) target.click();
  }),
);
document.querySelectorAll("[data-stock-action]").forEach((button) =>
  button.addEventListener("click", () => {
    const stock = document.querySelector(
      `[data-stock="${button.dataset.stockAction}"]`,
    );
    const amount = Number.parseInt(stock.textContent, 10) + 5;
    stock.textContent = `${amount} unités`;
    stock.classList.remove("low");
    showToast("Stock mis à jour de 5 unités");
  }),
);
const paymentFieldGroups = {
  card: document.querySelector(".card-fields"),
  paypal: document.querySelector(".paypal-fields"),
  apple: document.querySelector(".apple-fields"),
  delivery: document.querySelector(".delivery-fields"),
  mobileMoney: document.querySelector(".mobile-money-fields"),
};
const paymentMethodDetails = {
  card: { label: "Simuler le paiement", icon: "bi-lock" },
  paypal: { label: "Simuler PayPal", icon: "bi-paypal" },
  apple: { label: "Simuler Apple Pay", icon: "bi-apple" },
  delivery: { label: "Confirmer la commande", icon: "bi-check2" },
  "mobile-money": { label: "Choisir un opérateur", icon: "bi-phone" },
  mvola: { label: "Simuler MVola", icon: "bi-phone" },
  "orange-money": { label: "Simuler Orange Money", icon: "bi-phone-fill" },
  "airtel-money": { label: "Simuler Airtel Money", icon: "bi-sim" },
};
const mobileMoneyProviderLabels = {
  mvola: "MVola",
  "orange-money": "Orange Money",
  "airtel-money": "Airtel Money",
};
const mobileMoneyOptions = document.querySelector("#mobile-money-options");
let selectedMobileMoneyProvider = null;

function selectPaymentMethod(methodName) {
  if (methodName !== "mobile-money") selectedMobileMoneyProvider = null;
  const providerSelected =
    methodName === "mobile-money" && Boolean(selectedMobileMoneyProvider);
  document.querySelectorAll(".payment-method").forEach((method) => {
    const selected = method.dataset.payment === methodName;
    method.classList.toggle("active", selected);
    method.setAttribute("aria-pressed", String(selected));
    method.setAttribute(
      "aria-expanded",
      String(selected && methodName === "mobile-money"),
    );
  });
  mobileMoneyOptions.hidden = methodName !== "mobile-money";
  document.querySelectorAll(".mobile-money-choice").forEach((choice) => {
    const selected = choice.dataset.mobileMoney === selectedMobileMoneyProvider;
    choice.classList.toggle("active", selected);
    choice.setAttribute("aria-pressed", String(selected));
  });
  const fieldGroupName = providerSelected ? "mobileMoney" : methodName;
  Object.entries(paymentFieldGroups).forEach(([name, group]) => {
    group.hidden = name !== fieldGroupName;
    group.querySelectorAll("input").forEach((input) => {
      input.required = name === fieldGroupName;
    });
  });
  if (methodName === "delivery") {
    const address = document.querySelector("#delivery-address");
    const phone = document.querySelector("#delivery-phone");
    if (!address.value && currentUser?.address)
      address.value = currentUser.address;
    if (!phone.value && currentUser?.phone) phone.value = currentUser.phone;
  }
  if (providerSelected) {
    document.querySelector("#mobile-money-provider").textContent =
      mobileMoneyProviderLabels[selectedMobileMoneyProvider];
    const mobileNumber = document.querySelector("#mobile-money-number");
    if (!mobileNumber.value && currentUser?.phone)
      mobileNumber.value = currentUser.phone;
  }
  const details =
    paymentMethodDetails[
      providerSelected ? selectedMobileMoneyProvider : methodName
    ];
  document.querySelector(".payment-submit-label").textContent = details.label;
  document.querySelector("#payment-submit > i").className =
    `bi ${details.icon}`;
  document.querySelector("#payment-submit").disabled =
    methodName === "mobile-money" && !providerSelected;
}

document
  .querySelectorAll(".payment-method")
  .forEach((method) =>
    method.addEventListener("click", () =>
      selectPaymentMethod(method.dataset.payment),
    ),
  );
document.querySelectorAll(".mobile-money-choice").forEach((choice) =>
  choice.addEventListener("click", () => {
    selectedMobileMoneyProvider = choice.dataset.mobileMoney;
    selectPaymentMethod("mobile-money");
  }),
);
selectPaymentMethod(
  document.querySelector(".payment-method.active").dataset.payment,
);
document.querySelector("#payment-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const subtotal = cartSubtotal();
  const delivery = shippingFee();
  const total = subtotal + delivery;
  const commission = cart.reduce(
    (sum, item) =>
      sum +
      (item.sellerId !== "owner"
        ? effectivePrice(item) * item.quantity * commissionRate
        : 0),
    0,
  );
  const order = {
    id: `ET-${Date.now()}`,
    buyerId: currentUser?.email || "guest",
    buyerName: currentUser?.name || "Client invité",
    subtotal,
    shipping: delivery,
    total,
    commission,
    items: cart.map((item) => ({ ...item, salePrice: effectivePrice(item) })),
    date: new Date().toISOString(),
    status: "Nouvelle commande",
  };
  orders.push(order);
  localStorage.setItem("etokiana-orders", JSON.stringify(orders));
  if (typeof window.renderPremiumUserSpace === "function") window.renderPremiumUserSpace();
  addNotification(
    order.buyerId,
    `Votre commande #${order.id} a été enregistrée avec ${delivery ? `${euro(delivery)} de livraison` : "la livraison offerte"}.`,
  );
  order.items.forEach((item) => {
    if (item.sellerId === "owner")
      addNotification(
        adminIdentity.email,
        `Une commande concerne votre produit ${item.name}.`,
      );
    else {
      const email = sellerEmail(item.sellerId);
      if (email)
        addNotification(
          email,
          `Nouvelle commande #${order.id} pour votre produit ${item.name}.`,
        );
    }
  });
  addNotification(
    adminIdentity.email,
    `Nouvelle commande #${order.id} reçue sur E-Tokiana.`,
  );
  cart = [];
  saveCart();
  renderAccountData();
  closeModal(paymentModal);
  closeCart();
  showToast(`Commande confirmée. Total : ${euro(total)}`);
});
document.querySelector("#product-modal-add").addEventListener("click", () => {
  if (!selectedProduct || productStock(selectedProduct) === 0) return;
  const availableColors = productOptionList(selectedProduct.availableColors || selectedProduct.colors);
  const availableSizes = productOptionList(selectedProduct.availableSizes || selectedProduct.sizes);
  if ((availableColors.length > 1 && !selectedProductOptions.color) || (availableSizes.length > 1 && !selectedProductOptions.size)) {
    showToast("Choisissez les options du produit avant de continuer.");
    return;
  }
  const quantity = Math.max(
    1,
    Number.parseInt(document.querySelector("#product-modal-quantity").value, 10) || 1,
  );
  addToCart(selectedProduct, quantity, selectedProductOptions);
  closeModal(productModal);
  const choiceSummary = [selectedProductOptions.color, selectedProductOptions.size].filter(Boolean).join(" · ");
  showToast(`${selectedProduct.name}${choiceSummary ? ` (${choiceSummary})` : ""} ajouté au panier`);
});
document.querySelector("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document
    .querySelector("#login-email")
    .value.trim()
    .toLowerCase();
  const password = document.querySelector("#login-password").value;
  const registeredUsers = JSON.parse(
    localStorage.getItem("etokiana-users") || "[]",
  );
  const credentials = {
    "client@etokiana.fr": {
      password: "client123",
      role: "client",
      name: "Alex Martin",
    },
    "admin@etokiana.fr": {
      password: "admin123",
      role: "owner",
      name: "E-Tokiana (admin)",
    },
    "vendeur@etokiana.fr": {
      password: "vendeur123",
      role: "seller",
      name: "Atelier Nomade",
      id: "demo-seller",
    },
    ...Object.fromEntries(
      registeredUsers.map((user) => [
        user.email,
        {
          password: user.password,
          role: user.role || "client",
          name: user.name,
          id: user.id,
        },
      ]),
    ),
  };
  const account = credentials[email];
  if (!account || account.password !== password) {
    window.EtoHistoryAudit?.log({ type: "Sécurité", action: "Échec de connexion", actorName: email ? `Tentative : ${email}` : "Tentative de connexion", actorEmail: email, actorRole: "tentative non authentifiée", target: "Authentification", severity: "critical", details: "Identifiants refusés par le formulaire de connexion." });
    document.querySelector("#login-error").textContent =
      "E-mail ou mot de passe incorrect.";
    return;
  }
  const registeredUser = registeredUsers.find((user) => String(user.email || "").trim().toLowerCase() === email);
  const registeredStatus = String(registeredUser?.status || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const registeredRestricted = registeredUser && (registeredUser.active === false || (registeredStatus && registeredStatus !== 'active')) && !['owner','admin','superadmin'].includes(String(registeredUser.role || '').toLowerCase());
  if (registeredRestricted) {
    const statusMessage = registeredStatus === 'blocked' ? 'Ce compte est bloqué. Contactez l’administration.' : registeredStatus === 'deactivated' ? 'Ce compte est désactivé. Contactez l’administration.' : 'L’accès à ce compte est suspendu. Contactez l’administration.';
    window.EtoHistoryAudit?.log({ type: "Sécurité", action: "Connexion refusée — compte restreint", actorName: `Tentative : ${email}`, actorEmail: email, actorRole: "compte non actif", target: "Authentification", severity: "critical", details: statusMessage });
    document.querySelector("#login-error").textContent = statusMessage;
    return;
  }
  currentUser = registeredUser
    ? { ...registeredUser, role: registeredUser.role || "client" }
    : { email, role: account.role, name: account.name, id: account.id };
  favorites = etokianaReadFavoritesForUser(currentUser, false);
  localStorage.setItem("etokiana-user", JSON.stringify(currentUser));
  window.EtoHistoryAudit?.log({ type: "Sécurité", action: "Connexion réussie", target: "Session utilisateur", severity: "normal", details: "Authentification réussie sur E-tokiana." });
  document.querySelector("#login-error").textContent = "";
  event.target.reset();
  closeModal(loginModal);
  updateProfileButton();
  showToast("Vous êtes connecté avec succès !");
});
document.querySelector("#signup-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const user = {
    id: `seller-${Date.now()}`,
    name: document.querySelector("#signup-name").value.trim(),
    phone: document.querySelector("#signup-phone").value.trim(),
    email: document.querySelector("#signup-email").value.trim().toLowerCase(),
    address: document.querySelector("#signup-address").value.trim(),
    password: document.querySelector("#signup-password").value,
    role: document.querySelector("#signup-role")?.value || "client",
  };
  const registeredUsers = JSON.parse(
    localStorage.getItem("etokiana-users") || "[]",
  );
  if (
    registeredUsers.some((existingUser) => existingUser.email === user.email) ||
    ["client@etokiana.fr", "admin@etokiana.fr"].includes(user.email)
  ) {
    document.querySelector("#signup-error").textContent =
      "Cette adresse e-mail est déjà utilisée.";
    return;
  }
  registeredUsers.push(user);
  localStorage.setItem("etokiana-users", JSON.stringify(registeredUsers));
  currentUser = { ...user };
  localStorage.setItem("etokiana-user", JSON.stringify(currentUser));
  event.target.reset();
  closeModal(signupModal);
  updateProfileButton();
  showToast("Compte créé avec succès !");
  showToast(
    user.role === "seller"
      ? "Votre boutique vendeur a été créée."
      : "Votre espace client a été créé.",
  );
});
document.querySelectorAll(".admin-action").forEach((button) =>
  button.addEventListener("click", () => {
    if (button.dataset.adminMessage?.includes("produit"))
      return openModal(document.querySelector("#product-form-modal"));
    if (button.dataset.adminMessage?.includes("personnel"))
      return openModal(document.querySelector("#staff-form-modal"));
    showToast(button.dataset.adminMessage || "Action administrateur effectuée");
  }),
);
document
  .querySelectorAll("[data-open-modal]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      openModal(document.querySelector(`#${button.dataset.openModal}`)),
    ),
  );
const discountField = document.querySelector("#new-product-discount");
const roleField =
  document.querySelector("#signup-role") ||
  (() => {
    const label = document.createElement("label");
    label.textContent = "Type de compte";
    label.innerHTML +=
      '<select id="signup-role"><option value="client">Client</option><option value="seller">Vendeur / boutique</option></select>';
    document.querySelector("#signup-email").closest("label").before(label);
    return label.querySelector("select");
  })();
function canManageProduct(product, user = currentUser) {
  if (!product || !user) return false;
  const role = String(user.role || "").toLowerCase();
  if (["owner", "admin", "administrator", "superadmin", "super-admin"].includes(role)) return true;
  if (role === "staff") return Array.isArray(user.staffPermissions) && user.staffPermissions.includes("products.manage");
  return isSellerRoleValue(role) && String(product.sellerId) === String(user.id);
}
function refreshProductsAndUserSpace() {
  localStorage.setItem("etokiana-products", JSON.stringify(products));
  renderProducts();
  if (typeof window.renderPremiumUserSpace === "function") window.renderPremiumUserSpace();
}
window.openProductFormForEdit = function (productId) {
  const product = products.find((item) => String(item.id) === String(productId));
  if (!canManageProduct(product)) { showToast("Vous n’êtes pas autorisé à modifier ce produit."); return; }
  document.querySelector("#product-edit-id").value = String(product.id);
  document.querySelector("#new-product-name").value = product.name || "";
  document.querySelector("#new-product-category").value = JSON.stringify(product.categoryPath || [product.category]);
  document.querySelector("#new-product-price").value = String(Math.round((Number(product.price) || 0) * currencyRate));
  document.querySelector("#new-product-stock").value = String(Number(product.stock) || 0);
  document.querySelector("#new-product-discount").value = String(Number(product.discount) || 0);
  document.querySelector("#new-product-image").value = product.image || "";
  document.querySelector("#new-product-description").value = product.description || "";
  document.querySelector("#new-product-colors").value = productOptionList(product.availableColors || product.colors).join(", ");
  document.querySelector("#new-product-sizes").value = productOptionList(product.availableSizes || product.sizes).join(", ");
  updateProductVariantFieldVisibility();
  updateProductReferencePreview(product);
  document.querySelector("#product-form-title").textContent = "Modifier le produit";
  document.querySelector("#product-form-submit").innerHTML = 'Enregistrer les modifications <i class="bi bi-check2" aria-hidden="true"></i>';
  openModal(document.querySelector("#product-form-modal"));
};
window.deleteManagedProduct = function (productId) {
  const product = products.find((item) => String(item.id) === String(productId));
  if (!canManageProduct(product)) { showToast("Vous n’êtes pas autorisé à supprimer ce produit."); return; }

  const escapeDialogHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
  const productName = String(product.name || "Produit sans nom");
  const productReference = window.getProductReference?.(product) || product.reference || product.id || "—";
  const productCategory = Array.isArray(product.categoryPath) && product.categoryPath.length
    ? product.categoryPath.join(" / ")
    : product.category || "Sans catégorie";
  const productStock = Number.isFinite(Number(product.stock)) ? Number(product.stock) : 0;
  const summaryHtml = [
    ["Produit", productName],
    ["Référence", productReference],
    ["Catégorie", productCategory],
    ["Stock actuel", `${productStock} unité(s)`],
  ].map(([label, value]) => `<div class="etk-premium-summary-row"><strong>${escapeDialogHtml(label)}</strong><span>${escapeDialogHtml(value)}</span></div>`).join("")
    + '<p class="etk-premium-note"><i class="bi bi-exclamation-triangle" aria-hidden="true"></i> La suppression est définitive. Le produit sera retiré du catalogue et cette action ne pourra pas être annulée.</p>';

  const commitDeletion = () => {
    // Relecture et vérification des droits au moment exact de confirmer.
    const latestProduct = products.find((item) => String(item.id) === String(productId));
    if (!latestProduct) { showToast("Ce produit n’existe plus dans le catalogue."); return; }
    if (!canManageProduct(latestProduct)) { showToast("Vous n’êtes pas autorisé à supprimer ce produit."); return; }
    const latestName = String(latestProduct.name || "Produit sans nom");
    products = products.filter((item) => String(item.id) !== String(productId));
    refreshProductsAndUserSpace();
    showToast(`Le produit « ${latestName} » a été supprimé.`);
  };

  const premiumDialog = window.EtokianaPremiumDialogs;
  if (premiumDialog && typeof premiumDialog.open === "function") {
    premiumDialog.open({
      kicker: "GESTION DU CATALOGUE",
      title: "Supprimer ce produit ?",
      description: "Vérifiez la fiche ci-dessous avant de continuer. Le produit sera retiré de votre catalogue.",
      icon: "bi-trash3",
      confirmLabel: "Supprimer définitivement",
      tone: "danger",
      summaryHtml,
      reasonHidden: true,
      onConfirm: commitDeletion,
    });
    return;
  }

  // Filet de sécurité si app.js est exécuté sans le composant de dialogue premium.
  if (window.confirm(`Supprimer « ${productName} » ? Cette action est définitive.`)) commitDeletion();
};
const productForm = document.querySelector("#product-form");
const productColorsField = document.querySelector("#new-product-colors");
const productSizesField = document.querySelector("#new-product-sizes");
const productColorsFieldWrap = document.querySelector("#new-product-colors-field");
const productSizesFieldWrap = document.querySelector("#new-product-sizes-field");
function isVariantRelevantCategory(categoryPath) {
  const root = referenceAscii((categoryPath || [""])[0] || "");
  return !/EPICERIE|ALIMENTAIRE|GROCERY|SERVICE|RESERVATION/.test(root);
}
function isSizeRelevantCategory(categoryPath) {
  const pathText = referenceAscii((categoryPath || []).join(" "));
  return /MODE|FEMME|HOMME|VETEMENT|CHAUSSURE|ROBE|PANTALON|CHEMISE|TSHIRT|JEAN|BASKET|TALON|BOTTINE|SAC|LINGE|TEXTILE|RIDEAU|COUSSIN|CANAPE|TABLE|CHAISE|LIT|INFORMATIQUE|ORDINATEUR|ECRAN|SMARTPHONE|TELEVISEUR|MONTRE|ACCESSOIRE/.test(pathText);
}
function renderAdminVariantChoices(kind) {
  const isColor = kind === "color";
  const field = isColor ? productColorsField : productSizesField;
  const container = document.querySelector(isColor ? "#new-product-colors-choices" : "#new-product-sizes-choices");
  const count = document.querySelector(isColor ? "#new-product-colors-count" : "#new-product-sizes-count");
  if (!field || !container) return;
  const selected = productOptionList(field.value);
  let categoryPath = [];
  try { categoryPath = JSON.parse(document.querySelector("#new-product-category").value || "[]"); } catch (_) {}
  const presets = isColor ? productColorPalette : productSizePalette(categoryPath);
  const options = appendUnknownVariantOptions(presets, selected);
  container.replaceChildren();
  options.forEach((option) => {
    const value = typeof option === "string" ? option : option.value;
    const active = selected.some((item) => referenceAscii(item) === referenceAscii(value));
    container.append(createVariantChoiceButton({
      kind: isColor ? "color" : "size",
      value,
      selected: active,
      onToggle: (next) => {
        const current = productOptionList(field.value);
        const exists = current.some((item) => referenceAscii(item) === referenceAscii(next));
        const updated = exists
          ? current.filter((item) => referenceAscii(item) !== referenceAscii(next))
          : [...current, next];
        field.value = updated.join(", ");
        field.dispatchEvent(new Event("input", { bubbles: true }));
        renderAdminVariantChoices(kind);
      },
    }));
  });
  if (count) count.textContent = `${selected.length} ${isColor ? (selected.length > 1 ? "choisies" : "choisie") : (selected.length > 1 ? "choisies" : "choisie")}`;
}
function renderAllAdminVariantChoices() {
  renderAdminVariantChoices("color");
  renderAdminVariantChoices("size");
}
function addCustomVariant(kind) {
  const isColor = kind === "color";
  const field = isColor ? productColorsField : productSizesField;
  const custom = document.querySelector(isColor ? "#new-product-colors-custom" : "#new-product-sizes-custom");
  const additions = productOptionList(custom?.value || "");
  if (!additions.length) {
    custom?.focus();
    return;
  }
  const selected = productOptionList(field.value);
  additions.forEach((value) => {
    if (!selected.some((item) => referenceAscii(item) === referenceAscii(value))) selected.push(value);
  });
  field.value = selected.join(", ");
  if (custom) custom.value = "";
  field.dispatchEvent(new Event("input", { bubbles: true }));
  renderAdminVariantChoices(kind);
  custom?.focus();
}
function updateProductVariantFieldVisibility() {
  const selector = document.querySelector("#new-product-category");
  let path = [];
  try { path = selector.value ? JSON.parse(selector.value) : []; } catch (_) {}
  const physical = isVariantRelevantCategory(path);
  productColorsFieldWrap.hidden = !physical;
  productSizesFieldWrap.hidden = !physical || !isSizeRelevantCategory(path);
  productColorsField.setAttribute("aria-hidden", String(!physical));
  productSizesField.setAttribute("aria-hidden", String(!physical || !isSizeRelevantCategory(path)));
  renderAllAdminVariantChoices();
}
window.refreshProductVariantChoices = function () {
  updateProductVariantFieldVisibility();
  updateProductReferencePreview();
};
function getFormReferenceProduct() {
  let categoryPath = [];
  try { categoryPath = JSON.parse(document.querySelector("#new-product-category").value || "[]"); } catch (_) {}
  return {
    name: document.querySelector("#new-product-name").value.trim() || "Nouveau produit",
    category: categoryPath[0] || "Général",
    categoryPath: categoryPath.length ? categoryPath : ["Général"],
    sellerId: isSellerAccount(currentUser) ? String(currentUser.id) : "owner",
    availableColors: productOptionList(productColorsField.value),
    availableSizes: productSizesFieldWrap.hidden ? [] : productOptionList(productSizesField.value),
  };
}
function updateProductReferencePreview(editingProduct = null) {
  const value = document.querySelector("#product-reference-preview-value");
  const label = document.querySelector("#product-reference-preview-label");
  const help = document.querySelector("#product-reference-preview-help");
  const box = document.querySelector("#product-reference-preview");
  if (!value || !label || !help || !box) return;
  if (editingProduct) {
    label.textContent = "Référence du produit";
    value.textContent = window.getProductReference(editingProduct);
    help.textContent = "Référence conservée pour préserver l’historique du produit.";
    return;
  }
  label.textContent = "Référence automatique";
  value.textContent = findNextProductReference(getFormReferenceProduct(), false);
  help.textContent = "Attribuée à la publication et conservée lors des modifications.";
}
["#new-product-name", "#new-product-colors", "#new-product-sizes"].forEach((selector) => {
  document.querySelector(selector)?.addEventListener("input", () => updateProductReferencePreview());
});
document.querySelector("#new-product-colors-add")?.addEventListener("click", () => addCustomVariant("color"));
document.querySelector("#new-product-sizes-add")?.addEventListener("click", () => addCustomVariant("size"));
["#new-product-colors-custom", "#new-product-sizes-custom"].forEach((selector) => {
  document.querySelector(selector)?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addCustomVariant(selector.includes("colors") ? "color" : "size");
    }
  });
});
document.querySelector("#new-product-category")?.addEventListener("change", () => {
  updateProductVariantFieldVisibility();
  updateProductReferencePreview();
});
productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#new-product-name").value.trim();
  const categoryPath = JSON.parse(document.querySelector("#new-product-category").value);
  const category = categoryPath[0];
  const price = Number(document.querySelector("#new-product-price").value) / currencyRate;
  const stock = Number(document.querySelector("#new-product-stock").value);
  const image = document.querySelector("#new-product-image").value.trim() || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85";
  const description = document.querySelector("#new-product-description").value.trim();
  const discount = Math.min(90, Math.max(0, Number(discountField?.value || 0)));
  const availableColors = productColorsFieldWrap.hidden ? [] : productOptionList(productColorsField.value);
  const availableSizes = productSizesFieldWrap.hidden ? [] : productOptionList(productSizesField.value);
  const editingId = document.querySelector("#product-edit-id").value;
  if (editingId) {
    const existing = products.find((item) => String(item.id) === String(editingId));
    if (!canManageProduct(existing)) { showToast("Vous n’êtes pas autorisé à modifier ce produit."); return; }
    Object.assign(existing, {
      name, category, categoryPath, stock, price, discount, image, description,
      availableColors, availableSizes,
      material: existing.material || `Produit · ${stock} unités`,
    });
    // La référence ne bouge pas lorsqu'un attribut éditable change.
    showToast(`Les informations de « ${name} » ont été mises à jour.`);
  } else {
    const newProduct = {
      id: Date.now(), name, category, categoryPath,
      material: `Produit · ${stock} unités`, stock,
      createdAt: new Date().toISOString(), price, discount, image, description,
      availableColors, availableSizes,
      sellerId: isSellerAccount(currentUser) ? String(currentUser.id) : "owner",
      createdById: currentPublisherIdentity().id,
      createdByName: currentPublisherIdentity().name,
      publisherId: currentPublisherIdentity().id,
      publisherName: currentPublisherIdentity().name,
    };
    newProduct.reference = nextProductReference(newProduct);
    products.push(newProduct);
    showToast(`« ${name} » a été publié dans le catalogue avec la référence ${newProduct.reference}.`);
  }
  refreshProductsAndUserSpace();
  event.target.reset();
  document.querySelector("#product-edit-id").value = "";
  document.querySelector("#product-form-title").textContent = "Ajouter un produit";
  document.querySelector("#product-form-submit").innerHTML = 'Publier le produit <i class="bi bi-cloud-arrow-up" aria-hidden="true"></i>';
  updateProductVariantFieldVisibility();
  updateProductReferencePreview();
  closeModal(document.querySelector("#product-form-modal"));
});
// Réinitialise le formulaire lorsqu’on ouvre une nouvelle fiche.
document.querySelectorAll('[data-open-modal="product-form-modal"]').forEach((button) => button.addEventListener("click", () => {
  document.querySelector("#product-edit-id").value = "";
  document.querySelector("#product-form").reset();
  document.querySelector("#product-form-title").textContent = "Ajouter un produit";
  document.querySelector("#product-form-submit").innerHTML = 'Publier le produit <i class="bi bi-cloud-arrow-up" aria-hidden="true"></i>';
  updateProductVariantFieldVisibility();
  updateProductReferencePreview();
}));
// Laisse l'aperçu prêt si le formulaire est ouvert depuis un autre point d'entrée.
updateProductVariantFieldVisibility();
updateProductReferencePreview();
document.querySelector("#staff-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#new-staff-name").value.trim();
  const email = document.querySelector("#new-staff-email").value.trim().toLowerCase();
  const roleSelect = document.querySelector("#new-staff-role");
  const staffRoleKey = roleSelect?.value || "logistics";
  const roleCatalog = window.EtoStaffRoles?.catalog || {};
  const roleMeta = roleCatalog[staffRoleKey];
  const customRole = document.querySelector("#new-staff-custom-role")?.value.trim();
  const staffRole = staffRoleKey === "custom" ? customRole : (roleMeta?.label || roleSelect?.selectedOptions?.[0]?.textContent.trim() || "Équipe");
  const customPermissions = Array.from(document.querySelectorAll("[data-staff-permission-check]:checked")).map((box) => box.value);
  const staffPermissions = staffRoleKey === "custom" ? [...new Set(customPermissions)] : (roleMeta?.permissions || ["dashboard.read"]);
  if (!name || !email) return;
  if (staffRoleKey === "custom" && !staffRole) {
    showToast("Donnez un nom au rôle personnalisé.");
    document.querySelector("#new-staff-custom-role")?.focus();
    return;
  }
  if (!staffPermissions.length) {
    showToast("Sélectionnez au moins une autorisation pour ce rôle.");
    return;
  }

  const inviteModal = document.querySelector("#staff-form-modal");
  const invitationOrigin = inviteModal?.dataset.staffOpenOrigin || "admin";
  const registeredUsers = JSON.parse(localStorage.getItem("etokiana-users") || "[]");
  const invitations = (() => {
    try { return JSON.parse(localStorage.getItem("etokiana-staff-invitations") || "[]"); }
    catch (_) { return []; }
  })();
  const editType = inviteModal?.dataset.staffEditType;
  const editId = inviteModal?.dataset.staffEditId;
  if (editType && editId) {
    const currentTypeEmailMatch = (item, type) => type === editType && String(item.id ?? item.email) === String(editId);
    const emailTakenByAccount = registeredUsers.some(user => String(user.email||'').trim().toLowerCase()===email && !(editType==='account' && currentTypeEmailMatch(user,'account')));
    const emailTakenByInvitation = invitations.some(item => String(item.email||'').trim().toLowerCase()===email && !(editType==='invitation' && String(item.id)===String(editId)));
    const reservedEmails = ["client@etokiana.fr", "admin@etokiana.fr", "vendeur@etokiana.fr"];
    if (emailTakenByAccount || emailTakenByInvitation || reservedEmails.includes(email)) { showToast("Cette adresse e-mail est déjà utilisée par un autre compte ou une invitation."); return; }
    const roleData = { name, email, role:"staff", staffRole, staffRoleKey, staffPermissions, updatedAt:new Date().toISOString() };
    if (editType === "invitation") {
      const target = invitations.find(item => String(item.id) === String(editId));
      if (!target) { showToast("Invitation introuvable."); return; }
      Object.assign(target, roleData);
      localStorage.setItem("etokiana-staff-invitations", JSON.stringify(invitations));
    } else {
      const target = registeredUsers.find(user => String(user.id ?? user.email) === String(editId) && String(user.role||'').toLowerCase()==='staff');
      if (!target) { showToast("Membre introuvable."); return; }
      const previousEmail = String(target.email||'').toLowerCase();
      Object.assign(target, roleData);
      localStorage.setItem("etokiana-users", JSON.stringify(registeredUsers));
      const signedIn = JSON.parse(localStorage.getItem("etokiana-user") || "null");
      if (signedIn && String(signedIn.email||'').toLowerCase() === previousEmail) { Object.assign(signedIn, roleData); localStorage.setItem("etokiana-user", JSON.stringify(signedIn)); }
    }
    delete inviteModal.dataset.staffEditType; delete inviteModal.dataset.staffEditId; delete inviteModal.dataset.staffOpenOrigin;
    event.target.reset();
    document.querySelector("#staff-form-title").textContent = "Ajouter un membre";
    const submitButton = event.target.querySelector('button[type="submit"]'); if (submitButton) submitButton.innerHTML = 'Créer l’invitation et préparer l’e-mail <i class="bi bi-envelope-arrow-up" aria-hidden="true"></i>';
    if (window.EtoStaffRoles?.syncFormPreview) window.EtoStaffRoles.syncFormPreview();
    closeModal(inviteModal); window.EtoStaffDirectory?.refresh?.(); window.dispatchEvent(new CustomEvent("etokiana-staff-changed"));
    showToast(`Les informations de ${name} ont été mises à jour.`); return;
  }
  const reservedEmails = ["client@etokiana.fr", "admin@etokiana.fr", "vendeur@etokiana.fr"];
  if (registeredUsers.some((user) => String(user.email || "").trim().toLowerCase() === email) || reservedEmails.includes(email)) {
    showToast("Cette adresse e-mail est déjà associée à un compte.");
    return;
  }
  if (invitations.some((item) => String(item.email || "").trim().toLowerCase() === email)) {
    showToast("Une invitation ou une entrée pour cette adresse existe déjà.");
    return;
  }
  const invitation = {
    id: `staff-invite-${Date.now()}`,
    name,
    email,
    role: "staff",
    staffRole,
    staffRoleKey,
    staffPermissions,
    invitationStatus: "pending",
    active: false,
    createdAt: new Date().toISOString(),
    invitationReference: `ETK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  };
  invitations.push(invitation);
  localStorage.setItem("etokiana-staff-invitations", JSON.stringify(invitations));
  event.target.reset();
  if (window.EtoStaffRoles?.syncFormPreview) window.EtoStaffRoles.syncFormPreview();
  closeModal(document.querySelector("#staff-form-modal"));
  if (inviteModal) { delete inviteModal.dataset.staffOpenOrigin; delete inviteModal.dataset.staffEditType; delete inviteModal.dataset.staffEditId; }
  document.querySelector("#staff-form-title").textContent = "Ajouter un membre";
  const staffSubmitButton = document.querySelector('#staff-form button[type="submit"]'); if (staffSubmitButton) staffSubmitButton.innerHTML = 'Créer l’invitation et préparer l’e-mail <i class="bi bi-envelope-arrow-up" aria-hidden="true"></i>';
  const adminModal = document.querySelector("#admin-modal");
  if (invitationOrigin === "user-space" && typeof window.renderPremiumUserSpace === "function") {
    window.renderPremiumUserSpace();
    document.querySelector('.user-space-nav[data-user-view="staff"]')?.click();
  } else {
    const userSpaceModal = document.querySelector("#user-space-modal");
    if (userSpaceModal && !userSpaceModal.hidden) {
      userSpaceModal.hidden = true;
      userSpaceModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("user-space-open");
    }
    if (adminModal) openModal(adminModal);
    if (typeof activateAdminView === "function") activateAdminView("staff");
  }
  window.EtoStaffDirectory?.refresh?.();
  window.dispatchEvent(new CustomEvent("etokiana-staff-changed"));
  const opened = window.EtoStaffRoles?.openEmailDraft?.(invitation) || false;
  showToast(opened
    ? `Invitation préparée pour ${name} · ${staffRole}. Vérifiez le brouillon puis cliquez sur Envoyer.`
    : `Invitation enregistrée pour ${name}. Votre logiciel e-mail n’a pas pu être ouvert automatiquement.`);
});
const customerDetails = [
  ["alex@exemple.fr", "06 12 34 56 78", "12 rue des Lilas, Paris"],
  ["samira@exemple.fr", "06 23 45 67 89", "8 avenue Victor Hugo, Lyon"],
  ["lea@exemple.fr", "06 34 56 78 90", "21 rue Nationale, Lille"],
];
document
  .querySelectorAll('[data-admin-panel="customers"] .admin-table-row small')
  .forEach((element, index) => {
    const details = customerDetails[index];
    if (details)
      element.innerHTML = `${details[0]}<br />${details[1]} · ${details[2]}`;
  });
const deliveryAddress = document.querySelector(".account-card p");
if (deliveryAddress)
  deliveryAddress.innerHTML = "12 rue des Lilas, Paris<br />06 12 34 56 78";
const dashboardStats = document.querySelectorAll(".admin-stats div");
if (dashboardStats.length === 3) {
  const thirdPartySales = orders.reduce(
    (sum, order) => sum + order.commission / commissionRate,
    0,
  );
  const ownerWallet = orders.reduce((sum, order) => sum + order.commission, 0);
  dashboardStats[0].innerHTML = `<strong>${products.length}</strong><span>Articles actifs</span>`;
  dashboardStats[1].innerHTML = `<strong>${orders.length || 128}</strong><span>Commandes</span>`;
  dashboardStats[2].innerHTML = `<strong>${euro(ownerWallet)}</strong><span>Wallet · commissions 10 %</span>`;
  const dashboardSection = document.querySelector(
    '[data-admin-panel="dashboard"] .admin-section',
  );
  if (dashboardSection)
    dashboardSection.insertAdjacentHTML(
      "afterbegin",
      `<div class="wallet-banner"><span>Portefeuille E-Tokiana (admin)</span><strong>${euro(ownerWallet)}</strong><small>${euro(thirdPartySales)} de ventes tierces suivies</small></div>`,
    );
}
document.querySelector("#admin-logout").addEventListener("click", () => {
  currentUser = null;
  localStorage.removeItem("etokiana-user");
  closeModal(adminModal);
  updateProfileButton();
  showToast("Vous êtes déconnecté.");
});
updateProfileButton();
renderCategoryFamilyOptions();
initializeCatalogueDropdowns();
renderProducts();
renderCart();


/* E-tokiana — journal local d’audit ciblé (ne stocke jamais de mot de passe ni de jeton). */
(() => {
  const AUDIT_KEY = "etokiana-audit-log";
  const MAX_AUDIT_ENTRIES = 1800;
  const trackedCollections = {
    "etokiana-products": "products",
    "etokiana-orders": "orders",
    "etokiana-users": "users",
    "etokiana-staff-invitations": "invitations",
  };
  const nativeGetItem = Storage.prototype.getItem;
  const nativeSetItem = Storage.prototype.setItem;
  const safeJson = (value, fallback = null) => {
    try { return value == null || value === "" ? fallback : JSON.parse(value); }
    catch (_) { return fallback; }
  };
  // Les baselines seront prises après le chargement de toutes les ressources
  // de la page afin d’ignorer les migrations initiales et données de démonstration.
  let startupBaselineRaw = null;
  const firstWriteKeys = new Set();
  const normaliseText = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const activeActor = () => {
    const user = safeJson(nativeGetItem.call(localStorage, "etokiana-user"), null);
    if (!user || typeof user !== "object") return { name: "Visiteur non authentifié", email: "", role: "visiteur" };
    const name = user.name || [user.firstName || user.prenom, user.lastName || user.nom].filter(Boolean).join(" ") || user.email || "Utilisateur";
    return { name: String(name), email: String(user.email || user.username || "").trim().toLowerCase(), role: String(user.staffRole || user.role || "utilisateur") };
  };
  const auditRead = () => {
    const parsed = safeJson(nativeGetItem.call(localStorage, AUDIT_KEY), []);
    return Array.isArray(parsed) ? parsed : [];
  };
  const auditWrite = (entry) => {
    const previous = auditRead();
    previous.push(entry);
    nativeSetItem.call(localStorage, AUDIT_KEY, JSON.stringify(previous.slice(-MAX_AUDIT_ENTRIES)));
    try { window.dispatchEvent(new CustomEvent("etokiana-audit-updated", { detail: entry })); } catch (_) {}
  };
  const snapshotFor = (kind, item) => {
    if (!item || typeof item !== "object") return null;
    if (kind === "products") return {
      nom: item.name || "Produit",
      reference: item.reference || item.sku || "",
      categorie: Array.isArray(item.categoryPath) ? item.categoryPath.join(" / ") : item.category || "",
      prix: Number.isFinite(Number(item.price)) ? Number(item.price) : null,
      stock: item.stock == null || item.stock === "" ? null : Number(item.stock),
      remise: Number(item.discount) || 0,
      statut: item.status || (item.active === false ? "Inactif" : "Actif"),
      couleurs: Array.isArray(item.availableColors || item.colors) ? (item.availableColors || item.colors).map(String) : String(item.availableColors || item.colors || ""),
      tailles: Array.isArray(item.availableSizes || item.sizes) ? (item.availableSizes || item.sizes).map(String) : String(item.availableSizes || item.sizes || ""),
    };
    if (kind === "orders") return {
      statut: item.status || "Nouvelle commande",
      client: item.buyerName || "Client invité",
      emailClient: item.buyerId || "",
      total: Number(item.total) || 0,
      sousTotal: Number(item.subtotal) || 0,
      livraison: Number(item.shipping) || 0,
      articles: (Array.isArray(item.items) ? item.items : []).slice(0, 30).map((line) => `${line.name || "Article"} × ${Number(line.quantity) || 1}${line.color ? ` · ${line.color}` : ""}${line.size ? ` · ${line.size}` : ""}`),
    };
    if (kind === "users") return {
      nom: item.name || [item.firstName || item.prenom, item.lastName || item.nom].filter(Boolean).join(" "),
      email: item.email || item.username || "",
      role: item.role || "client",
      roleEquipe: item.staffRole || item.staffRoleKey || "",
      permissions: Array.isArray(item.staffPermissions) ? item.staffPermissions.slice() : [],
      acces: item.active === false ? "Suspendu" : "Actif",
    };
    return {
      nom: item.name || "Membre invité",
      email: item.email || "",
      role: item.staffRole || item.staffRoleKey || item.role || "Équipe",
      roleEquipe: item.staffRoleKey || "",
      permissions: Array.isArray(item.staffPermissions) ? item.staffPermissions.slice() : [],
      invitation: item.invitationStatus || (item.active === false ? "En attente" : "Acceptée"),
    };
  };
  const stableKey = (item, index) => String(item?.id ?? item?.email ?? item?.reference ?? `ligne-${index}`);
  const metaFor = (kind, item, change, changedFields) => {
    const personName = item?.name || item?.buyerName || item?.email || "Élément";
    if (kind === "products") return { type: "Catalogue", target: `${personName}${item?.reference ? ` · ${item.reference}` : item?.id != null ? ` · #${item.id}` : ""}` };
    if (kind === "orders") return { type: "Commandes", target: `Commande #${item?.id ?? "—"}` };
    if (kind === "users") return { type: String(item?.role || "").toLowerCase() === "staff" ? "Personnel & accès" : "Comptes", target: `${personName}${item?.email ? ` · ${item.email}` : ""}` };
    return { type: "Personnel & accès", target: `Invitation · ${personName}${item?.email ? ` · ${item.email}` : ""}` };
  };
  const createChangeRecord = (kind, beforeItem, afterItem, change, changedFields = []) => {
    const item = afterItem || beforeItem || {};
    const meta = metaFor(kind, item, change, changedFields);
    const before = snapshotFor(kind, beforeItem);
    const after = snapshotFor(kind, afterItem);
    let action = "Modification enregistrée";
    let severity = "normal";
    if (change === "created") {
      action = kind === "products" ? "Produit créé" : kind === "orders" ? "Commande créée" : kind === "invitations" ? "Invitation créée" : "Compte créé";
      severity = kind === "invitations" ? "high" : "normal";
    } else if (change === "deleted") {
      action = kind === "products" ? "Produit supprimé" : kind === "orders" ? "Commande supprimée" : kind === "invitations" ? "Invitation supprimée" : "Compte utilisateur supprimé";
      severity = ["users", "orders"].includes(kind) ? "critical" : "high";
    } else if (kind === "orders" && changedFields.some((field) => normaliseText(field) === "statut")) {
      action = "Statut de commande modifié"; severity = "high";
    } else if (kind === "users" && changedFields.some((field) => /role|autoris|permission|acces/.test(normaliseText(field)))) {
      action = "Rôle ou accès utilisateur modifié"; severity = "critical";
    } else if (kind === "invitations" && changedFields.some((field) => /role|autoris|permission|invitation/.test(normaliseText(field)))) {
      action = "Rôle ou invitation modifié"; severity = "high";
    } else if (kind === "products" && changedFields.some((field) => /stock|prix|statut|disponibilite/.test(normaliseText(field)))) {
      action = "Stock, prix ou disponibilité modifié"; severity = "high";
    } else {
      action = kind === "products" ? "Produit modifié" : kind === "orders" ? "Commande modifiée" : kind === "users" ? "Compte utilisateur modifié" : "Invitation modifiée";
      severity = "medium";
    }
    const actor = activeActor();
    const changedDescription = changedFields.length ? `Champs modifiés : ${changedFields.join(", ")}.` : change === "created" ? "Nouvelle entrée enregistrée." : change === "deleted" ? "Entrée retirée du registre." : "Entrée mise à jour.";
    return {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      date: new Date().toISOString(), timestamp: new Date().toISOString(), createdAt: new Date().toISOString(),
      text: action, action, type: meta.type, category: meta.type, name: actor.name, actorName: actor.name,
      email: actor.email, actorEmail: actor.email, actorRole: actor.role,
      target: meta.target, entity: meta.target, details: changedDescription, before, after,
      severity, importance: severity, source: "local-audit", changedFields,
    };
  };
  const snapshotFields = (kind) => kind === "products"
    ? [["nom","Nom"],["reference","Référence"],["categorie","Catégorie"],["prix","Prix"],["stock","Stock"],["remise","Remise"],["statut","Statut"],["couleurs","Couleurs"],["tailles","Tailles"]]
    : kind === "orders"
      ? [["statut","Statut"],["client","Client"],["emailClient","E-mail client"],["total","Montant total"],["sousTotal","Sous-total"],["livraison","Livraison"],["articles","Articles"]]
      : [["nom","Nom"],["email","E-mail"],["role","Rôle"],["roleEquipe","Rôle équipe"],["permissions","Autorisations"],["acces","Accès"],["invitation","Statut invitation"]];
  const compareArrays = (key, oldRaw, newRaw) => {
    const oldList = oldRaw == null || oldRaw === "" ? [] : safeJson(oldRaw, null);
    const newList = newRaw == null || newRaw === "" ? [] : safeJson(newRaw, null);
    if (!Array.isArray(oldList) || !Array.isArray(newList)) return;
    const oldMap = new Map(oldList.map((item, index) => [stableKey(item, index), item]));
    const newMap = new Map(newList.map((item, index) => [stableKey(item, index), item]));
    const kind = trackedCollections[key];
    const labels = Object.fromEntries(snapshotFields(kind));
    const keys = new Set([...oldMap.keys(), ...newMap.keys()]);
    const records = [];
    for (const id of keys) {
      const beforeItem = oldMap.get(id);
      const afterItem = newMap.get(id);
      if (!beforeItem && afterItem) records.push(createChangeRecord(kind, null, afterItem, "created"));
      else if (beforeItem && !afterItem) records.push(createChangeRecord(kind, beforeItem, null, "deleted"));
      else if (beforeItem && afterItem) {
        const before = snapshotFor(kind, beforeItem) || {};
        const after = snapshotFor(kind, afterItem) || {};
        const changedKeys = Object.keys({ ...before, ...after }).filter((field) => JSON.stringify(before[field]) !== JSON.stringify(after[field]));
        if (!changedKeys.length) continue;
        const changedLabels = changedKeys.map((field) => labels[field] || field);
        records.push(createChangeRecord(kind, beforeItem, afterItem, "updated", changedLabels));
      }
      if (records.length >= 80) break;
    }
    records.forEach(auditWrite);
  };
  const log = (input = {}) => {
    const actor = activeActor();
    const date = new Date().toISOString();
    const record = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      date, timestamp: date, createdAt: date,
      text: String(input.action || input.text || "Action enregistrée"),
      action: String(input.action || input.text || "Action enregistrée"),
      type: String(input.type || input.category || "Plateforme"),
      category: String(input.category || input.type || "Plateforme"),
      name: String(input.actorName || actor.name), actorName: String(input.actorName || actor.name),
      email: String(input.actorEmail !== undefined ? input.actorEmail : actor.email),
      actorEmail: String(input.actorEmail !== undefined ? input.actorEmail : actor.email),
      actorRole: String(input.actorRole || actor.role),
      target: String(input.target || ""), entity: String(input.target || ""),
      details: String(input.details || ""),
      before: input.before === undefined ? undefined : input.before,
      after: input.after === undefined ? undefined : input.after,
      severity: String(input.severity || input.importance || "normal"),
      importance: String(input.importance || input.severity || "normal"),
      source: "local-audit",
    };
    auditWrite(record);
    return record;
  };
  window.EtoHistoryAudit = { read: auditRead, log, captureStorageChange: compareArrays };
  const installStorageAudit = () => {
    if (Storage.prototype.__etokianaHistoryAuditWrapped) return;
    startupBaselineRaw = {
      "etokiana-products": typeof products !== "undefined" && Array.isArray(products) ? JSON.stringify(products) : nativeGetItem.call(localStorage, "etokiana-products"),
      "etokiana-orders": typeof orders !== "undefined" && Array.isArray(orders) ? JSON.stringify(orders) : nativeGetItem.call(localStorage, "etokiana-orders"),
      "etokiana-users": nativeGetItem.call(localStorage, "etokiana-users"),
      "etokiana-staff-invitations": nativeGetItem.call(localStorage, "etokiana-staff-invitations"),
    };
    const originalSetItem = Storage.prototype.setItem;
    const originalRemoveItem = Storage.prototype.removeItem;
    Object.defineProperty(Storage.prototype, "__etokianaHistoryAuditWrapped", { value: true, configurable: false });
    Storage.prototype.setItem = function (key, value) {
      const trackedKey = String(key);
      const tracked = this === window.localStorage && Object.prototype.hasOwnProperty.call(trackedCollections, trackedKey);
      const previous = tracked ? (firstWriteKeys.has(trackedKey) ? nativeGetItem.call(this, trackedKey) : startupBaselineRaw[trackedKey]) : null;
      const result = originalSetItem.call(this, key, value);
      if (tracked) {
        firstWriteKeys.add(trackedKey);
        try { window.EtoHistoryAudit?.captureStorageChange(trackedKey, previous, String(value)); } catch (_) { /* Le journal ne bloque jamais l'action métier. */ }
      }
      return result;
    };
    Storage.prototype.removeItem = function (key) {
      const isSessionRemoval = this === window.localStorage && String(key) === "etokiana-user";
      if (isSessionRemoval && nativeGetItem.call(this, "etokiana-user")) {
        try { log({ type: "Sécurité", action: "Déconnexion", target: "Session utilisateur", severity: "normal", details: "La session locale a été fermée." }); } catch (_) {}
      }
      return originalRemoveItem.call(this, key);
    };
  };
  if (document.readyState === "complete") installStorageAudit();
  else window.addEventListener("load", installStorageAudit, { once: true });
})();

