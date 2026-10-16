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
products = products.map((product) => {
  const category = legacyCategoryNames[product.category] || product.category;
  const categoryPath =
    Array.isArray(product.categoryPath) && product.categoryPath.length
      ? product.categoryPath
      : legacyProductPaths[product.id] || [category];
  return {
    sellerId: product.sellerId || (product.id === 3 ? "demo-seller" : "owner"),
    discount: Number(product.discount) || (product.id === 3 ? 10 : 0),
    ...product,
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
let favorites = JSON.parse(localStorage.getItem("etokiana-favorites") || "[]");
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
let notifications = JSON.parse(
  localStorage.getItem("etokiana-notifications") || "[]",
);
const commissionRate = 0.1;
const effectivePrice = (product) =>
  product.price * (1 - (product.discount || 0) / 100);
const sellerLabel = (product) =>
  product.sellerId === "owner"
    ? "E-tokiana"
    : product.sellerId === "demo-seller"
      ? "Atelier Nomade"
      : JSON.parse(localStorage.getItem("etokiana-users") || "[]").find(
          (user) => user.id === product.sellerId,
        )?.name || "Vendeur partenaire";
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
        .map(
          (item) =>
            `<div class="notification-item ${item.read ? "" : "unread"}" data-notification-id="${item.id}"><strong>${item.message}</strong><small>${new Date(item.date).toLocaleString("fr-FR")}</small></div>`,
        )
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
    const orderMatch = notification.message.match(/#([A-Za-z0-9-]+)/);
    const order =
      orderMatch && orders.find((entry) => entry.id === orderMatch[1]);
    if (order) {
      closeModal(notificationModal);
      return openOrderTracking(order);
    }
    if (
      notification.message.includes("Nouveau message") &&
      notification.actor
    ) {
      closeModal(notificationModal);
      renderChatRecipients();
      document.querySelector("#chat-recipient").value = notification.actor;
      renderChatThread();
      return openModal(chatModal);
    }
    showToast(notification.message);
  });

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
trackingModal.innerHTML =
  '<div class="modal-panel tracking-panel"><div class="modal-header"><div><p class="eyebrow">Suivi de commande</p><h2>Votre livraison</h2></div><button class="close-button tracking-close" aria-label="Fermer le suivi">×</button></div><div class="tracking-details"></div></div>';
document.body.append(trackingModal);
trackingModal
  .querySelector(".tracking-close")
  .addEventListener("click", () => closeModal(trackingModal));
function openOrderTracking(order) {
  if (!order) return showToast("Aucune commande à suivre pour le moment.");
  const steps = [
    "Nouvelle commande",
    "Validée",
    "En préparation",
    "Expédiée",
    "Livrée",
  ];
  const currentStep = Math.max(0, steps.indexOf(order.status));
  trackingModal.querySelector(".tracking-details").innerHTML =
    `<div class="tracking-summary"><strong>#${order.id}</strong><span>${euro(order.total)}</span></div><p class="modal-muted">Client : ${order.buyerName || currentUser?.name || "Client"}</p><div class="tracking-steps">${steps.map((step, index) => `<div class="tracking-step ${index <= currentStep ? "complete" : ""}"><span>${index <= currentStep ? "✓" : index + 1}</span><strong>${step}</strong></div>`).join("")}</div>`;
  openModal(trackingModal);
}

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
      `${product.name} ${productPath.join(" ")} ${product.material}`
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
  const revenue = isSeller
    ? visibleOrders.reduce(
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
    : visibleOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
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
    amount.textContent = euro(
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

  const role = String(currentUser?.role || "client").toLowerCase();
  const isOwner = role === "owner" || role === "admin";
  const displayName = !currentUser
    ? "Se connecter"
    : isOwner
      ? (adminIdentity?.name || currentUser.name || "E-tokiana")
      : (currentUser.name || currentUser.fullName || currentUser.displayName || currentUser.username || "Utilisateur");

  const roleDetails = !currentUser
    ? { label: "", icon: "bi-person-fill", className: "" }
    : isOwner
      ? { label: "ADMIN", icon: "bi-shield-lock-fill", className: "role-admin" }
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
  ["role-admin", "role-client", "role-vendeur", "role-redac", "role-prestataire"].forEach((name) => profileButton.classList.remove(name));
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
  const userOrders = orders.filter(
    (order) => order.buyerId === currentUser?.email,
  );
  const orderView = document.querySelector('[data-view="orders"]');
  const savedView = document.querySelector('[data-view="saved"]');
  const overview = document.querySelector('[data-view="overview"]');
  if (overview) {
    const latestOrder = userOrders.slice().reverse()[0];
    overview
      .querySelectorAll(".account-card")[1]
      .querySelector("p").textContent = latestOrder
      ? `Commande #${latestOrder.id} · ${latestOrder.status}`
      : "Aucune commande enregistrée pour le moment";
  }
  if (orderView)
    orderView.innerHTML = userOrders.length
      ? userOrders
          .slice()
          .reverse()
          .map(
            (order) =>
              `<div class="order-row"><span>#${order.id}</span><span>${order.status}</span><strong>${euro(order.total)}</strong><button class="text-link account-action" data-track-order="${order.id}">Suivre</button></div>`,
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
                    `<div class="admin-table-row"><span><strong>${order.buyerName || "Client invité"}</strong><small>${order.buyerId || "E-mail non renseigné"}</small></span><span>#${order.id}<br />${item.name}</span><span>${euro(item.salePrice * item.quantity * 0.9)}</span><em class="status-pill">${order.status}</em></div>`,
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
        }</div><div class="admin-section"><div class="admin-section-heading"><strong>Commandes globales</strong></div>${orders.map((order) => `<div class="admin-row"><span><strong>${order.buyerName || "Client invité"}</strong><br /><small>${order.buyerId || ""}</small></span><strong>${euro(order.total)}</strong><em>${order.status}</em></div>`).join("") || '<p class="modal-muted">Aucune commande enregistrée.</p>'}</div>`
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
  return (
    {
      "Nouvelle commande": "Valider",
      Validée: "Préparer",
      "En préparation": "Expédier",
      Expédiée: "Marquer livrée",
      Livrée: "Terminée",
    }[status] || "Mettre à jour"
  );
}
function addSellerOrderActions() {
  if (currentUser?.role !== "seller") return;
  const sellerOrders = orders.filter((order) =>
    order.items?.some((item) => item.sellerId === currentUser.id),
  );
  const rows = document.querySelectorAll(
    '[data-admin-panel="seller-sales"] .admin-table-row',
  );
  rows.forEach((row, index) => {
    const order = sellerOrders[index];
    if (!order || row.querySelector("[data-order-status]")) return;
    const action = document.createElement("button");
    action.className = "stock-action order-status-action";
    action.dataset.orderStatus = order.id;
    action.textContent = nextOrderStatus(order.status);
    row.lastElementChild.append(action);
  });
}
function addOwnerOrderActions() {
  if (!["owner", "admin"].includes(currentUser?.role)) return;
  const panel = document.querySelector('[data-admin-panel="seller-sales"]');
  if (!panel) return;
  panel.querySelector(".owner-order-management")?.remove();
  const ownerOrders = orders.filter((order) =>
    order.items?.some((item) => item.sellerId === "owner"),
  );
  const section = document.createElement("div");
  section.className = "admin-section owner-order-management";
  section.innerHTML = `<div class="admin-section-heading"><strong>Commandes des produits E-tokiana</strong></div>${ownerOrders.map((order) => `<div class="admin-row"><span><strong>${order.buyerName || "Client invité"}</strong><small>${order.buyerId || "E-mail non renseigné"} · #${order.id}</small></span><strong>${euro(order.total)}</strong><span><em class="status-pill">${order.status}</em><button class="stock-action order-status-action" data-order-status="${order.id}">${nextOrderStatus(order.status)}</button></span></div>`).join("") || '<p class="modal-muted">Aucune commande pour vos produits.</p>'}`;
  panel.append(section);
}


// ===== Fiche produit premium =====
const DEFAULT_PRODUCT_DESCRIPTION =
  "Une pièce choisie pour son usage, sa qualité et sa capacité à trouver naturellement sa place dans votre quotidien.";
function isEditorUser(user = currentUser) {
  const role = String(user?.role || "").toLowerCase();
  return ["redac", "rédac", "editor", "writer", "journalist", "content"].some(
    (key) => role.includes(key),
  );
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
    ["Vendeur", sellerLabel(product)],
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
    `${(product.categoryPath || [product.category]).join(" / ")} / E-tokiana`;
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
const journalTrack = document.querySelector("#journal-track");
const journalSlides = [...journalTrack.querySelectorAll(".journal-slide")];
const journalPrevious = document.querySelector("[data-journal-prev]");
const journalNext = document.querySelector("[data-journal-next]");
const journalPosition = document.querySelector(".journal-position");
const journalCarousel = document.querySelector(".journal-carousel");
const journalReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
let journalUpdateFrame = 0;

function activeJournalIndex() {
  const trackRect = journalTrack.getBoundingClientRect();
  return journalSlides.reduce((nearestIndex, slide, index) => {
    const currentDistance = Math.abs(
      slide.getBoundingClientRect().left - trackRect.left,
    );
    const nearestDistance = Math.abs(
      journalSlides[nearestIndex].getBoundingClientRect().left - trackRect.left,
    );
    return currentDistance < nearestDistance ? index : nearestIndex;
  }, 0);
}

function updateJournalCarousel() {
  const activeIndex = activeJournalIndex();
  journalPosition.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(journalSlides.length).padStart(2, "0")}`;
  journalSlides.forEach((slide, index) => {
    slide.setAttribute(
      "aria-label",
      `Article ${index + 1} sur ${journalSlides.length}${index === activeIndex ? ", affiché" : ""}`,
    );
  });
}

function moveJournalCarousel(direction) {
  const targetIndex =
    (activeJournalIndex() + direction + journalSlides.length) %
    journalSlides.length;
  const trackRect = journalTrack.getBoundingClientRect();
  const targetSlide = journalSlides[targetIndex];
  const targetLeft =
    journalTrack.scrollLeft +
    targetSlide.getBoundingClientRect().left -
    trackRect.left;
  const maxScroll = journalTrack.scrollWidth - journalTrack.clientWidth;
  journalTrack.scrollTo({
    left: Math.max(0, Math.min(maxScroll, targetLeft)),
    behavior: journalReducedMotion.matches ? "auto" : "smooth",
  });
}

journalPrevious.addEventListener("click", () => moveJournalCarousel(-1));
journalNext.addEventListener("click", () => moveJournalCarousel(1));
journalTrack.addEventListener(
  "scroll",
  () => {
    if (journalUpdateFrame) return;
    journalUpdateFrame = requestAnimationFrame(() => {
      journalUpdateFrame = 0;
      updateJournalCarousel();
    });
  },
  { passive: true },
);
journalTrack.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  moveJournalCarousel(event.key === "ArrowRight" ? 1 : -1);
});
window.addEventListener("resize", updateJournalCarousel);
function journalIsInViewport() {
  const rect = journalCarousel.getBoundingClientRect();
  const visibleHeight = Math.max(
    0,
    Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
  );
  return visibleHeight >= Math.min(100, rect.height * 0.15);
}
window.setInterval(() => {
  if (
    !journalReducedMotion.matches &&
    journalIsInViewport() &&
    !document.hidden
  ) {
    moveJournalCarousel(1);
  }
}, 6000);
updateJournalCarousel();
document.querySelector("#cart-toggle").addEventListener("click", openCart);
document.querySelector("#cart-close").addEventListener("click", closeCart);
drawerBackdrop.addEventListener("click", closeCart);
document.querySelector("#checkout-button").addEventListener("click", () => {
  if (cart.length) {
    updatePaymentTotal();
    openModal(paymentModal);
  } else showToast("Ajoutez un article avant de commander.");
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
        currentUser.address = address.trim();
        localStorage.setItem("etokiana-user", JSON.stringify(currentUser));
        updateProfileButton();
        showToast("Adresse de livraison mise à jour.");
      }
    }
    if (action.textContent.includes("Suivre")) {
      const latestOrder = orders
        .filter((order) => order.buyerId === currentUser.email)
        .slice()
        .reverse()[0];
      openOrderTracking(latestOrder);
    }
  });
document
  .querySelector('[data-view="orders"]')
  .addEventListener("click", (event) => {
    const action = event.target.closest("[data-track-order]");
    if (!action) return;
    openOrderTracking(
      orders.find((order) => order.id === action.dataset.trackOrder),
    );
  });
document.querySelector(".admin-content").addEventListener("click", (event) => {
  const action = event.target.closest("[data-order-status]");
  if (!action || !["seller", "owner", "admin"].includes(currentUser?.role))
    return;
  const order = orders.find((item) => item.id === action.dataset.orderStatus);
  if (!order) return;
  const status = {
    "Nouvelle commande": "Validée",
    Validée: "En préparation",
    "En préparation": "Expédiée",
    Expédiée: "Livrée",
  };
  if (status[order.status]) {
    order.status = status[order.status];
    localStorage.setItem("etokiana-orders", JSON.stringify(orders));
    if (typeof window.renderPremiumUserSpace === "function") window.renderPremiumUserSpace();
    addNotification(
      order.buyerId,
      `Votre commande #${order.id} est maintenant : ${order.status}.`,
    );
    order.items
      .filter((item) => item.sellerId !== "owner")
      .forEach((item) => {
        const seller = JSON.parse(
          localStorage.getItem("etokiana-users") || "[]",
        ).find((user) => user.id === item.sellerId);
        if (seller?.email)
          addNotification(
            seller.email,
            `La commande #${order.id} est maintenant : ${order.status}.`,
          );
      });
    addNotification(
      adminIdentity.email,
      `Mise à jour de la commande #${order.id} : ${order.status}.`,
    );
    renderSellerAndOwnerViews();
    addSellerOrderActions();
    addOwnerOrderActions();
    renderNotifications();
    showToast(`Commande ${order.id} : ${order.status}`);
  }
});
document.querySelectorAll(".admin-nav-item").forEach((tab) =>
  tab.addEventListener("click", () => {
    document.querySelector(".admin-nav-item.active").classList.remove("active");
    tab.classList.add("active");
    document.querySelector(".admin-view.active").classList.remove("active");
    document
      .querySelector(`[data-admin-panel="${tab.dataset.adminView}"]`)
      .classList.add("active");
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
    document.querySelector("#login-error").textContent =
      "E-mail ou mot de passe incorrect.";
    return;
  }
  const registeredUser = registeredUsers.find((user) => user.email === email);
  currentUser = registeredUser
    ? { ...registeredUser, role: registeredUser.role || "client" }
    : { email, role: account.role, name: account.name, id: account.id };
  localStorage.setItem("etokiana-user", JSON.stringify(currentUser));
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
  return role === "seller" && String(product.sellerId) === String(user.id);
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
  if (!window.confirm(`Supprimer « ${product.name} » ? Cette action est définitive.`)) return;
  products = products.filter((item) => String(item.id) !== String(productId));
  refreshProductsAndUserSpace();
  showToast(`Le produit « ${product.name} » a été supprimé.`);
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
    sellerId: currentUser?.role === "seller" ? currentUser.id : "owner",
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
      sellerId: currentUser?.role === "seller" ? currentUser.id : "owner",
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
  const role = document.querySelector("#new-staff-role").value;
  event.target.reset();
  closeModal(document.querySelector("#staff-form-modal"));
  showToast(`Invitation envoyée à ${name} · ${role}`);
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
