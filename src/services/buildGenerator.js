// src/services/buildGenerator.js

// ---------- helpers ----------
const pickWeighted = (arr) => {
  const total = arr.reduce((acc, x) => acc + x.w, 0);
  let r = Math.random() * total;
  for (const x of arr) {
    r -= x.w;
    if (r <= 0) return x.item;
  }
  return arr[arr.length - 1]?.item ?? null;
};

const uniqById = (items) => {
  const seen = new Set();
  return items.filter((it) => {
    const id = it?.id;
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const hasAnyTag = (it, tags) => {
  const t = it?.tags ?? [];
  return tags.some((x) => t.includes(x));
};

// ---------- normalize RAW (B) ----------
export function normalizeItems(itemsRaw) {
  // itemsRaw esperado: { data: { "1001": {...}, ... }, basic, ... }
  const data = itemsRaw?.data ?? itemsRaw;
  if (!data || typeof data !== "object") return [];
  return Object.entries(data).map(([id, it]) => ({ ...it, id }));
}

// ---------- enrich items with custom tags (if API tags are incomplete) ----------
function enrichItemTags(items) {
  /**
   * Si la API DDragon no tiene tags, agregamos tags personalizados basados en:
   * - Nombre del ítem
   * - Stats (gold, health, armor, etc.)
   * - Propiedades especiales
   */
  return items.map((it) => {
    const tags = it?.tags ?? [];
    const name = (it?.name ?? "").toLowerCase();
    const gold = it?.gold?.total ?? 0;
    const stats = it?.stats ?? {};

    // Si ya tiene tags, confiar en ellos
    if (tags.length > 0) return it;

    const newTags = [];

    // Detectar por nombre
    if (name.includes("boot")) newTags.push("Boots");
    if (name.includes("sword") || name.includes("blade") || name.includes("axe")) newTags.push("Damage", "AD");
    if (name.includes("staff") || name.includes("wand") || name.includes("orb")) newTags.push("SpellDamage", "AP", "Mana");
    if (name.includes("armor") || name.includes("chain") || name.includes("plate")) newTags.push("Armor");
    if (name.includes("veil") || name.includes("cloak")) newTags.push("MagicResist");
    if (name.includes("heart") || name.includes("warmog")) newTags.push("Health");
    if (name.includes("thornmail")) newTags.push("Armor", "OnHit");
    if (name.includes("crit") || name.includes("reaver")) newTags.push("CriticalStrike");
    if (name.includes("life")) newTags.push("LifeSteal");
    if (name.includes("mana") || name.includes("tear")) newTags.push("Mana", "ManaRegen");
    if (name.includes("ghost")) newTags.push("AbilityHaste");
    if (name.includes("eye") || name.includes("ward")) newTags.push("Vision");
    if (name.includes("support") || name.includes("relic")) newTags.push("GoldPer", "Support");

    // Detectar por stats
    if (stats["Armor"] > 0) newTags.push("Armor");
    if (stats["SpellBlock"] > 0) newTags.push("MagicResist");
    if (stats["FlatHPPoolMod"] > 0) newTags.push("Health");
    if (stats["FlatCritChanceMod"] > 0) newTags.push("CriticalStrike");
    if (stats["FlatMovementSpeedMod"] > 0) newTags.push("Movement");

    // Detectar por oro (costo relativo)
    if (gold > 2800) newTags.push("Legendary");
    if (gold < 1200) newTags.push("Component");

    // Retornar ítem con tags enriquecidas (únicas)
    const allTags = [...new Set([...tags, ...newTags])];
    return { ...it, tags: allTags };
  });
}

// ---------- champion-specific item preferences ----------
const CHAMPION_ITEM_AFFINITY = {
  // Champions que prefieren ciertos ítems
  // Formato: "ChampionName": [itemIds]
  
  // TOP - AD/Bruisers
  "Aatrox": [3071, 3046, 3036],      // Black Cleaver, Cleaver, Doms
  "Darius": [3071, 3057, 3036],      // Black Cleaver, Serylda's, Lord Doms
  "Fiora": [3031, 3057, 3046],       // ER, Serylda, Cleaver
  "Garen": [3071, 3036, 3111],       // Black Cleaver, Doms, Kaenic
  "Illaoi": [3071, 3036, 3001],      // Black Cleaver, Doms, Protobelt
  "Jax": [3031, 3077, 3078, 3046],   // ER, Trinity, Manamune, Cleaver
  "Kled": [3071, 3046, 3057],        // Black Cleaver, Cleaver, Serylda
  "Mordekaiser": [3089, 3151, 3001], // Zhonyas, Liandry, Protobelt (AP Tank)
  "Ornn": [3071, 3065, 3111],        // Black Cleaver, Hollow, Kaenic
  "Renekton": [3071, 3036, 3046],    // Black Cleaver, Doms, Cleaver
  "Rengar": [3047, 3071, 3036],      // Serylda, Black Cleaver, Doms
  "Sion": [3071, 3065, 3001],        // Black Cleaver, Hollow, Protobelt
  "Tryndamere": [3031, 3033, 3046],  // ER, Statik, Cleaver
  "Urgot": [3077, 3046, 3057],       // Trinity, Cleaver, Serylda
  "Vladimir": [3089, 3151, 3001],    // Zhonyas, Liandry, Protobelt
  "Wukong": [3071, 3046, 3036],      // Black Cleaver, Cleaver, Doms
  "Yasuo": [3031, 3033, 3072, 3046], // ER, Statik, Shiv, Cleaver
  "Yone": [3031, 3033, 3072],        // ER, Statik, Shiv
  
  // TOP - Tanks
  "Cho": [3065, 3111, 3001],         // Hollow, Kaenic, Protobelt
  "Malphite": [3065, 3111, 3001],    // Hollow, Kaenic, Protobelt
  "Maokai": [3065, 3111, 3109],      // Hollow, Kaenic, Abyssal
  "Shen": [3065, 3111, 3001],        // Hollow, Kaenic, Protobelt
  "Tahm": [3065, 3111, 3060],        // Hollow, Kaenic, Relic Shield
  "Trundle": [3071, 3065, 3111],     // Black Cleaver, Hollow, Kaenic
  
  // JUNGLE - AD
  "Graves": [3031, 3085, 3046],      // ER, Kraken, Cleaver
  "Lee": [3047, 3071, 3036],         // Serylda, Black Cleaver, Doms
  "Nidalee": [3031, 3085, 3033],     // ER, Kraken, Statik
  "Rengar": [3047, 3071, 3036],      // Serylda, Black Cleaver, Doms
  "Vi": [3071, 3036, 3046],          // Black Cleaver, Doms, Cleaver
  
  // JUNGLE - AP
  "Diana": [3089, 3151, 3001],       // Zhonyas, Liandry, Protobelt
  "Elise": [3151, 3020, 3135],       // Liandry, Haunting, Morello
  "Evelynn": [3089, 3151, 3102],     // Zhonyas, Liandry, Ludens
  "Kindred": [3031, 3085, 3033],     // ER, Kraken, Statik (AD Marksman)
  "Taliyah": [3089, 3135, 3020],     // Zhonyas, Morello, Haunting
  
  // MID - AP
  "Ahri": [3089, 3151, 3135, 3102],  // Zhonyas, Liandry, Morello, Ludens
  "Akali": [3089, 3151, 3102],       // Zhonyas, Liandry, Ludens
  "Anivia": [3089, 3135, 3020],      // Zhonyas, Morello, Haunting
  "Annie": [3089, 3151, 3102],       // Zhonyas, Liandry, Ludens
  "Cassiopeia": [3089, 3020, 3135],  // Zhonyas, Haunting, Morello
  "Lux": [3089, 3020, 3135],         // Zhonyas, Haunting, Morello
  "Leblanc": [3089, 3102, 3020],     // Zhonyas, Ludens, Haunting
  "Malzahar": [3089, 3151, 3135],    // Zhonyas, Liandry, Morello
  "Orianna": [3089, 3135, 3020],     // Zhonyas, Morello, Haunting
  "Syndra": [3089, 3151, 3102],      // Zhonyas, Liandry, Ludens
  "Twisted": [3089, 3135, 3102],     // Zhonyas, Morello, Ludens
  "Viktor": [3089, 3102, 3020],      // Zhonyas, Ludens, Haunting
  "Xerath": [3089, 3135, 3020],      // Zhonyas, Morello, Haunting
  "Yasuo": [3031, 3033, 3072, 3046], // ER, Statik, Shiv, Cleaver
  "Yone": [3031, 3033, 3072],        // ER, Statik, Shiv
  "Zed": [3031, 3033, 3046],         // ER, Statik, Cleaver
  
  // ADC
  "Aphelios": [3031, 3085, 3033],    // ER, Kraken, Statik
  "Ashe": [3031, 3085, 3033],        // ER, Kraken, Statik
  "Caitlyn": [3031, 3085, 3033],     // ER, Kraken, Statik
  "Draven": [3031, 3085, 3046],      // ER, Kraken, Cleaver
  "Ezreal": [3031, 3077, 3078],      // ER, Trinity, Manamune
  "Jhin": [3031, 3085, 3046],        // ER, Kraken, Cleaver
  "Jinx": [3031, 3033, 3046, 3085],  // ER, Statik, Cleaver, Kraken
  "Kaisa": [3031, 3085, 3033],       // ER, Kraken, Statik
  "Kog": [3031, 3085, 3033],         // ER, Kraken, Statik
  "Miss": [3031, 3085, 3033],        // ER, Kraken, Statik
  "Quinn": [3031, 3033, 3046],       // ER, Statik, Cleaver (AD Marksman Top)
  "Samira": [3031, 3085, 3046],      // ER, Kraken, Cleaver
  "Senna": [3031, 3085, 3033],       // ER, Kraken, Statik
  "Twitch": [3031, 3085, 3033],      // ER, Kraken, Statik
  "Vayne": [3031, 3085, 3033],       // ER, Kraken, Statik
  
  // SUPPORT
  "Alistar": [3060, 3069, 3111],     // Relic, Redemption, Kaenic
  "Bard": [3060, 3069, 3089],        // Relic, Redemption, Zhonyas
  "Blitzcrank": [3060, 3109, 3111],  // Relic, Abyssal, Kaenic
  "Braum": [3060, 3109, 3111],       // Relic, Abyssal, Kaenic
  "Rell": [3060, 3111, 3001],        // Relic, Kaenic, Protobelt
  "Janna": [3060, 3069, 3029],       // Relic, Redemption, Ardent
  "Leona": [3060, 3069, 3111],       // Relic, Redemption, Kaenic
  "Lulu": [3060, 3069, 3029],        // Relic, Redemption, Ardent
  "Nautilus": [3060, 3109, 3111],    // Relic, Abyssal, Kaenic
  "Pyke": [3060, 3047, 3071],        // Relic, Serylda, Black Cleaver
  "Senna": [3031, 3085, 3033],       // ER, Kraken, Statik (ADC/Support Hybrid)
  "Shen": [3065, 3111, 3001],        // Hollow, Kaenic, Protobelt (Support Tank)
  "Thresh": [3060, 3109, 3050],      // Relic, Abyssal, Salve
  "Vel": [3089, 3020, 3135],         // Zhonyas, Haunting, Morello
  "Zyra": [3089, 3151, 3135],        // Zhonyas, Liandry, Morello
};

// ---------- filters (store + SR) ----------
export function filterStoreSummonersRift(items) {
  return items.filter((it) => {
    const gold = it?.gold?.total ?? 0;
    if (gold <= 0) return false; // descarta sin costo (basura/plantillas)
    if (it?.inStore === false) return false;
    if (it?.purchasable === false) return false;
    if (it?.consumed === true) return false;
    if (it?.hideFromAll === true) return false;
    if (it?.requiredChampion) return false;
    if (it?.requiredAlly) return false;
    if (it?.maps && it.maps["11"] === false) return false; // SR id 11 [3](https://stackoverflow.com/questions/10636611/how-does-the-access-control-allow-origin-header-work)
    return true;
  });
}

export function splitBoots(items) {
  const boots = items.filter((it) => (it?.tags ?? []).includes("Boots"));
  const nonBoots = items.filter((it) => !(it?.tags ?? []).includes("Boots"));
  return { boots, nonBoots };
}

// ---------- item classification ----------
function getItemClass(it) {
  const tags = it?.tags ?? [];
  const name = (it?.name ?? "").toLowerCase();

  if (tags.includes("Boots")) return "BOOTS";

  // Support-ish (no siempre el tag existe igual en todos los parches, usamos señal mixta)
  const isSupportish =
    tags.includes("GoldPer") ||
    tags.includes("Vision") ||
    name.includes("support");

  if (isSupportish) return "SUPPORT";

  const isTanky = hasAnyTag(it, ["Health", "Armor", "MagicResist", "Tenacity"]);
  const isAP = hasAnyTag(it, ["SpellDamage", "Mana", "ManaRegen"]);
  const isAD = hasAnyTag(it, [
    "Damage",
    "AttackSpeed",
    "CriticalStrike",
    "LifeSteal",
    "ArmorPenetration",
    "OnHit",
  ]);

  if (isTanky && (isAD || isAP)) return "BRUISER";
  if (isTanky) return "TANK";
  if (isAP && !isAD) return "AP";
  if (isAD && !isAP) return "AD";
  return "UTILITY";
}

// ---------- champion profile (role-aware) ----------
function getChampionProfile(champion, role) {
  const tags = champion?.tags ?? [];
  const info = champion?.info ?? {};
  const atk = info.attack ?? 0;
  const mag = info.magic ?? 0;

  if (role === "SUPPORT") return "SUPPORT";
  if (role === "ADC") return "AD";

  // TOP bruiser si es Fighter
  if (role === "TOP" && tags.includes("Fighter")) return "BRUISER";

  // Tanks
  if (tags.includes("Tank") && !tags.includes("Mage")) return "TANK";

  // Mages / marksman
  if (tags.includes("Mage")) return "AP";
  if (tags.includes("Marksman")) return "AD";

  // fallback
  if (mag > atk) return "AP";
  return "AD";
}

// ---------- component detection ----------
function isComponentLike(it) {
  const tags = it?.tags ?? [];
  const gold = it?.gold?.total ?? 0;
  const name = (it?.name ?? "").toLowerCase();

  // Boots siempre permitidas (no es componente)
  if (tags.includes("Boots")) return false;

  // Items de soporte - permitidas
  if (tags.includes("GoldPer") || tags.includes("Vision")) return false;

  // Heurística: componentes típicamente <1200 gold
  if (gold > 0 && gold < 1100) return true;

  // Items que claramente son componentes por nombre
  if (name.includes("component") || name.includes("negatron") || name.includes("kindlegem") || name.includes("spectre")) return true;

  // Precursores (tienen into pero son baratos)
  const into = it?.into ?? [];
  if (into.length > 0 && gold > 0 && gold < 1500) return true;

  return false;
}

// ---------- hard constraints ----------
function isAllowedItem(it, role, profile) {
  const cls = getItemClass(it);
  const tags = it?.tags ?? [];

  // Filtrar componentes
  if (isComponentLike(it)) return false;

  // boots siempre
  if (cls === "BOOTS") return true;

  // support items SOLO para support
  if (cls === "SUPPORT") return role === "SUPPORT";

  // === STRICT PROFILE-BASED FILTERING ===
  
  // AD profiles: DEBE tener stats AD o ser defensa
  if (profile === "AD") {
    // Rechazar items que son PURO AP sin defensa
    const isPureAP = hasAnyTag(it, ["SpellDamage", "Mana"]) && 
                     !hasAnyTag(it, ["Damage", "AttackSpeed", "CriticalStrike", "LifeSteal", "ArmorPenetration", "Health", "Armor", "MagicResist"]);
    if (isPureAP) return false;
    
    // Permitir: items AD, bruiser, o defensa
    return true;
  }

  // AP profiles: DEBE tener stats AP o ser defensa
  if (profile === "AP") {
    // Rechazar items que son PURO AD sin defensa
    const isPureAD = hasAnyTag(it, ["Damage", "AttackSpeed", "CriticalStrike", "LifeSteal", "ArmorPenetration", "OnHit"]) && 
                     !hasAnyTag(it, ["SpellDamage", "Mana", "ManaRegen", "CooldownReduction", "Health", "Armor", "MagicResist"]);
    if (isPureAD) return false;
    
    // Permitir: items AP, bruiser, o defensa
    return true;
  }

  // TANK: permitir TANK y BRUISER, rechazar damage puro
  if (profile === "TANK") {
    if (cls === "AD" || cls === "AP") return false; // Rechazar damage puro
    return true;
  }

  // BRUISER: permitir BRUISER primero, pero también puede ser AD/AP con defensa
  if (profile === "BRUISER") {
    if (cls === "SUPPORT") return false; // Support no para bruiser
    return true;
  }

  // SUPPORT: rechazar damage puro
  if (profile === "SUPPORT") {
    if (cls === "AD" || cls === "AP") return false; // No damage puro
    return true;
  }

  return true;
}

// ---------- scoring (soft preference) ----------
const WEIGHTS = {
  AD: {
    Damage: 4,
    AttackSpeed: 3,
    CriticalStrike: 3,
    LifeSteal: 2,
    OnHit: 2,
    ArmorPenetration: 3,
    CooldownReduction: 1,
    Health: 1,
    Armor: 1,
    MagicResist: 1,
  },
  AP: {
    SpellDamage: 4,
    Mana: 2,
    ManaRegen: 2,
    CooldownReduction: 3,
    Health: 1,
    Armor: 1,
    MagicResist: 1,
  },
  TANK: {
    Health: 4,
    Armor: 4,
    MagicResist: 4,
    Tenacity: 2,
    CooldownReduction: 2,
    Aura: 2,
  },
  SUPPORT: {
    ManaRegen: 4,
    CooldownReduction: 3,
    Health: 2,
    Aura: 3,
    Vision: 3,
    Armor: 1,
    MagicResist: 1,
  },
  BRUISER: {
    Damage: 3,
    Health: 3,
    Armor: 2,
    MagicResist: 2,
    AbilityHaste: 2,
    AttackSpeed: 1,
  },
};

function scoreItem(it, profile, champion = null) {
  const tags = it?.tags ?? [];
  const weights = WEIGHTS[profile] ?? {};
  let score = 0;

  for (const t of tags) score += weights[t] ?? 0;

  // penalización FUERTE para componentes (no items finales)
  const gold = it?.gold?.total ?? 0;
  if (gold > 0 && gold < 900 && profile !== "SUPPORT") score -= 30;

  // ✨ BONUS FORTE: si el campeón tiene afinidad con este ítem, +50 de score (PRIORIDAD MÁXIMA)
  if (champion) {
    const champName = champion?.name;
    const affinity = CHAMPION_ITEM_AFFINITY[champName];
    if (affinity && affinity.includes(parseInt(it?.id))) {
      score += 50; // Bonus FUERTE para items específicos del champ
    }
  }

  return Math.max(score, 0.1);
}

function pickFromPool(pool, profile, role, used, champion = null) {
  const filtered = pool
    .filter((it) => !used.has(it.id))
    .filter((it) => isAllowedItem(it, role, profile));

  // NO fallback a UTILITY - si no hay items válidos, retorna null
  // Esto evita items incoherentes
  if (!filtered.length) return null;

  const weighted = filtered.map((it) => ({ item: it, w: scoreItem(it, profile, champion) }));
  if (!weighted.length) return null;
  return pickWeighted(weighted);
}

// ---------- public API ----------
export function generateBuildForChampion(champion, itemsRaw, opts = {}) {
  const { role = "UNKNOWN", size = 6, includeBoots = true } = opts;

  const normalized = normalizeItems(itemsRaw);
  const enriched = enrichItemTags(normalized); // ✨ Enriquecer con tags automáticos
  const storeItems = filterStoreSummonersRift(enriched);
  const { boots, nonBoots } = splitBoots(storeItems);

  const profile = getChampionProfile(champion, role);

  const used = new Set();
  const build = [];

  // boots
  if (includeBoots) {
    const b = pickFromPool(boots, profile, role, used, champion); // ✨ Pasar campeón
    if (b) {
      used.add(b.id);
      build.push(b);
    }
  }

  while (build.length < size) {
    const it = pickFromPool(nonBoots, profile, role, used, champion); // ✨ Pasar campeón
    if (!it) break;
    used.add(it.id);
    build.push(it);
  }

  return {
    championId: champion?.ddId ?? champion?.id,
    role,
    profile,
    items: uniqById(build).slice(0, size),
  };
}

export function generateBuildsForTeam(teamByRole, itemsRaw) {
  const out = {};
  for (const [role, champ] of Object.entries(teamByRole ?? {})) {
    if (!champ) {
      out[role] = null;
      continue;
    }
    out[role] = generateBuildForChampion(champ, itemsRaw, { role });
  }
  return out;
}