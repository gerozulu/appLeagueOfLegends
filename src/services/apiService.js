/**
 * Servicio centralizado (DEV) para Data Dragon usando proxy /ddragon (Vite).
 * En producción: recomendado cache/servidor (más adelante).
 */

const API_URLS = {
  CHAMPIONS: "/ddragon/cdn/14.7.1/data/es_MX/champion.json",
  ITEMS: "/ddragon/cdn/14.8.1/data/en_US/item.json",
   RUNES: "/ddragon/cdn/14.8.1/data/en_US/runesReforged.json"
};

const fetchJson = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  return res.json();
};


export const getRunes = async () => {
  try {
    const data = await fetchJson(API_URLS.RUNES);
    return data; // array de estilos con slots/runes [1](http://ddragon.leagueoflegends.com/cdn/10.16.1/data/en_US/runesReforged.json)[2](https://ddragon.leagueoflegends.com/cdn/8.3.1/data/en_US/runesReforged.json)
  } catch (error) {
    console.error("Error obteniendo runas:", error);
    return [];
  }
};


export const getChampions = async () => {
  try {
    const data = await fetchJson(API_URLS.CHAMPIONS);
    return Object.values(data.data || {});
  } catch (error) {
    console.error("Error obteniendo campeones:", error);
    return [];
  }
};

// ✅ RAW (B): retorna el JSON COMPLETO del item.json (incluye basic + data)
export const getItems = async () => {
  try {
    const data = await fetchJson(API_URLS.ITEMS);
    return data; // { type, version, basic, data: {...} } [3](https://stackoverflow.com/questions/10636611/how-does-the-access-control-allow-origin-header-work)
  } catch (error) {
    console.error("Error obteniendo ítems:", error);
    return null;
  }
};

export default { getChampions, getItems, getRunes };