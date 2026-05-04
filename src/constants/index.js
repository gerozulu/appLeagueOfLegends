/**
 * CONSTANTES GLOBALES DE LA APLICACIÓN
 * Valores que se reutilizan en múltiples lugares
 */

// API Configuration
export const API_CONFIG = {
  DDragonBase: 'https://ddragon.leagueoflegends.com/cdn',
  version: '14.7.1',
  language: 'es_MX',
};

// League of Legends Roles
export const LOL_ROLES = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

// Champion Types (Tags)
export const CHAMPION_TYPES = {
  ASSASSIN: "Assassin",
  FIGHTER: "Fighter",
  MAGE: "Mage",
  MARKSMAN: "Marksman",
  SUPPORT: "Support",
  TANK: "Tank",
};

// Application Settings
export const APP_CONFIG = {
  maxTeamsInHistory: 10,
  searchDebounceMs: 300,
  cacheExpirationMs: 3600000, // 1 hora
};

// Messages
export const MESSAGES = {
  LOADING: "Cargando campeones...",
  ERROR_FETCH: "Error al obtener los campeones. Intenta de nuevo.",
  NO_RESULTS: "No se encontró ningún campeón 😢",
  TEAM_GENERATED: "¡Equipo generado correctamente!",
  TEAM_COPIED: "Equipo copiado al portapapeles ✅",
};

export default {
  API_CONFIG,
  LOL_ROLES,
  CHAMPION_TYPES,
  APP_CONFIG,
  MESSAGES,
};
