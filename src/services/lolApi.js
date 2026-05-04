/**
 * Servicio para gestionar llamadas a la API oficial de League of Legends (DDragon)
 * 
 * API Base: https://ddragon.leagueoflegends.com/cdn/
 * Documentación: https://developer.riotgames.com/
 */

const API_BASE = 'https://ddragon.leagueoflegends.com/cdn';
const VERSION = '14.7.1'; // Actualizar a versión más reciente si es necesario
const LANGUAGE = 'es_MX';

/**
 * Obtiene la lista de campeones desde DDragon
 * @returns {Promise<Object>} { data: { championName: {...}, ... } }
 */
export const fetchChampions = async () => {
  try {
    const url = `${API_BASE}/${VERSION}/data/${LANGUAGE}/champion.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching champions:', error);
    throw error;
  }
};

/**
 * Obtiene todos los ítems disponibles de LoL
 * @returns {Promise<Object>} { data: { itemId: {...}, ... } }
 */
export const fetchItems = async () => {
  try {
    const url = `${API_BASE}/${VERSION}/data/${LANGUAGE}/item.json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

/**
 * Obtiene una imagen de campeón
 * @param {String} championId - ID del campeón (ej: "Yasuo")
 * @returns {String} URL de la imagen
 */
export const getChampionImage = (championId) => {
  return `${API_BASE}/${VERSION}/img/champion/${championId}.png`;
};

/**
 * Obtiene una imagen de ítem
 * @param {String} itemId - ID del ítem (ej: "3001")
 * @returns {String} URL de la imagen
 */
export const getItemImage = (itemId) => {
  return `${API_BASE}/${VERSION}/img/item/${itemId}.png`;
};

/**
 * Obtiene la versión más reciente de LoL
 * @returns {Promise<String>} Versión actual (ej: "14.7.1")
 */
export const getLatestVersion = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/versions.json`);
    const versions = await response.json();
    return versions[0]; // Primera es la más reciente
  } catch (error) {
    console.error('Error fetching latest version:', error);
    return VERSION; // Fallback a la versión predefinida
  }
};

export default {
  fetchChampions,
  fetchItems,
  getChampionImage,
  getItemImage,
  getLatestVersion,
};
