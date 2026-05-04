// src/services/runeGenerator.js
// Generador MVP de runas (coherente por rol/perfil)
// Fuente de datos: runesReforged.json (Data Dragon) con styles -> slots -> runes 

const STYLE_IDS = {
  PRECISION: 8000,
  DOMINATION: 8100,
  SORCERY: 8200,
  INSPIRATION: 8300,
  RESOLVE: 8400,
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function getChampionProfile(champ, role) {
  const tags = champ?.tags ?? [];
  const info = champ?.info ?? {};
  const atk = info.attack ?? 0;
  const mag = info.magic ?? 0;

  if (role === "SUPPORT") return "SUPPORT";
  if (role === "ADC") return "AD";
  if (role === "TOP" && tags.includes("Fighter")) return "BRUISER";
  if (tags.includes("Tank") && !tags.includes("Mage")) return "TANK";
  if (tags.includes("Mage")) return "AP";
  if (tags.includes("Marksman")) return "AD";
  return mag > atk ? "AP" : "AD";
}

function getDefaultStyles(profile, role) {
  if (profile === "TANK") return [STYLE_IDS.RESOLVE, STYLE_IDS.INSPIRATION];
  if (profile === "SUPPORT") return [STYLE_IDS.INSPIRATION, STYLE_IDS.RESOLVE];
  if (profile === "AP") return [STYLE_IDS.SORCERY, STYLE_IDS.DOMINATION];
  if (role === "JUNGLE") return [STYLE_IDS.DOMINATION, STYLE_IDS.PRECISION];
  if (profile === "BRUISER") return [STYLE_IDS.PRECISION, STYLE_IDS.RESOLVE];
  return [STYLE_IDS.PRECISION, STYLE_IDS.DOMINATION]; // AD default
}

function indexByStyle(runesData) {
  const byStyle = new Map();
  for (const style of runesData ?? []) byStyle.set(style.id, style);
  return byStyle;
}

// slots[0] contiene keystones en runesReforged.json 
function pickKeystone(style) {
  const slot0 = style?.slots?.[0];
  const options = slot0?.runes ?? [];
  return options.length ? pickRandom(options) : null;
}

function pickFromSlot(slot, used) {
  const options = (slot?.runes ?? []).filter((r) => !used.has(r.id));
  if (!options.length) return null;
  const chosen = pickRandom(options);
  used.add(chosen.id);
  return chosen;
}

function pickSecondaryTwo(style, used) {
  // secondary: NO usar slot[0] (keystone)
  const slots = (style?.slots ?? []).slice(1);
  const picks = [];
  const availableSlots = slots.slice();

  while (picks.length < 2 && availableSlots.length) {
    const slot = availableSlots.splice(
      Math.floor(Math.random() * availableSlots.length),
      1
    )[0];
    const r = pickFromSlot(slot, used);
    if (r) picks.push(r);
  }

  return picks;
}

/**
 * runesData: array completo de runesReforged.json
 * retorna objeto con primaryStyle, secondaryStyle, keystone, primaryMinors, secondaryMinors
 */
export function generateRunesForChampion(champion, runesData, opts = {}) {
  const role = opts.role ?? "UNKNOWN";
  const profile = getChampionProfile(champion, role);

  const byStyle = indexByStyle(runesData);
  const [primaryId, secondaryId] = getDefaultStyles(profile, role);

  const primaryStyle = byStyle.get(primaryId) ?? runesData?.[0];
  const secondaryStyle = byStyle.get(secondaryId) ?? runesData?.[1];

  if (!primaryStyle || !secondaryStyle) {
    return null;
  }

  const used = new Set();

  const keystone = pickKeystone(primaryStyle);
  if (keystone) used.add(keystone.id);

  // primarias: 3 slots (1..3)
  const primaryMinors = [];
  for (const slot of (primaryStyle?.slots ?? []).slice(1)) {
    const r = pickFromSlot(slot, used);
    if (r) primaryMinors.push(r);
  }

  // secundarias: 2 runas de slots (1..3)
  const secondaryMinors = pickSecondaryTwo(secondaryStyle, used);

  return {
    championId: champion?.ddId ?? champion?.id,
    role,
    profile,
    primaryStyle: {
      id: primaryStyle.id,
      name: primaryStyle.name,
      icon: primaryStyle.icon,
    },
    secondaryStyle: {
      id: secondaryStyle.id,
      name: secondaryStyle.name,
      icon: secondaryStyle.icon,
    },
    keystone,
    primaryMinors,
    secondaryMinors,
  };
}

export function generateRunesForTeam(teamByRole, runesData) {
  const out = {};
  for (const [role, champ] of Object.entries(teamByRole ?? {})) {
    out[role] = champ ? generateRunesForChampion(champ, runesData, { role }) : null;
  }
  return out;
}

// --- Icon URLs (oficiales) ---
// En runesReforged.json el campo `icon` suele venir como "perk-images/..." y se sirve desde /cdn/img/perk-images/... 
function normalizeRuneIconPath(iconPath) {
  if (!iconPath) return null;

  if (iconPath.startsWith("perk-images/")) return iconPath;

  // fallback por si llega formato viejo
  if (iconPath.startsWith("ASSETS/Perks/")) {
    return iconPath
      .replace(/^ASSETS\/Perks\//, "perk-images/")
      .replace(/\.dds$/i, ".png");
  }

  return iconPath;
}

export const runeIconUrl = (iconPath) => {
  const normalized = normalizeRuneIconPath(iconPath);
  return normalized ? `/ddragon/cdn/img/${normalized}` : null;
};