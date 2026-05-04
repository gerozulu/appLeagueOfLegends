/**
 * UTILIDADES GENERALES
 * Funciones reutilizables en toda la aplicación
 */

/**
 * Valida si un valor es un email válido
 * @param {String} email
 * @returns {Boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitiza un string para evitar XSS
 * @param {String} str
 * @returns {String}
 */
export const sanitizeString = (str) => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Debounce para funciones
 * Útil para búsquedas y llamadas a API
 * @param {Function} func - Función a debounce
 * @param {Number} delay - Delay en ms
 * @returns {Function}
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Copia texto al portapapeles
 * @param {String} text - Texto a copiar
 * @returns {Promise<Boolean>}
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Error copying to clipboard:", err);
    return false;
  }
};

/**
 * Guarda datos en localStorage
 * @param {String} key
 * @param {Any} value
 */
export const saveToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

/**
 * Obtiene datos de localStorage
 * @param {String} key
 * @param {Any} defaultValue - Valor por defecto si no existe
 * @returns {Any}
 */
export const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return defaultValue;
  }
};

/**
 * Genera un ID único
 * @returns {String}
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formatea una fecha en formato legible
 * @param {Date} date
 * @returns {String}
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default {
  isValidEmail,
  sanitizeString,
  debounce,
  copyToClipboard,
  saveToLocalStorage,
  getFromLocalStorage,
  generateId,
  formatDate,
};
