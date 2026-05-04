/**
 * Servicio para generar y gestionar equipos de LoL
 * Incluye lógica de randomización, validación y utilidades
 */

/**
 * Genera un equipo aleatorio balanceado por roles reales
 * @param {Array} champions - Lista de campeones disponibles
 * @returns {Array} Equipo de 5 campeones (1 por rol)
 */
export const generateRandomTeam = (champions) => {
  if (!champions || champions.length === 0) {
    return [];
  }

  const roles = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];
  const usedIds = new Set();
  const team = [];

  roles.forEach((role) => {
    const availableChamps = champions.filter(
      (champ) =>
        (Array.isArray(champ.role) 
          ? champ.role.includes(role) 
          : champ.role === role) &&
        !usedIds.has(champ.id)
    );

    if (availableChamps.length > 0) {
      const randomChamp = availableChamps[
        Math.floor(Math.random() * availableChamps.length)
      ];

      usedIds.add(randomChamp.id);
      team.push({
        ...randomChamp,
        assignedRole: role
      });
    }
  });

  return team;
};

/**
 * Valida si un equipo está completo (5 campeones)
 * @param {Array} team - Equipo a validar
 * @returns {Boolean}
 */
export const isTeamComplete = (team) => {
  return team && team.length === 5;
};

/**
 * Calcula la dificultad promedio del equipo (muy básico)
 * Idea: asignar puntuación a cada campeón según su tipo
 * @param {Array} team - Equipo a evaluar
 * @returns {String} "FÁCIL", "MEDIO", "DIFÍCIL"
 */
export const getTeamDifficulty = (team) => {
  if (!team || team.length === 0) return "DESCONOCIDO";

  // Asignar puntuación por tipo de campeón
  const difficultyScores = {
    "Assassin": 3,
    "Fighter": 2,
    "Mage": 2,
    "Marksman": 1,
    "Support": 1,
    "Tank": 2,
  };

  const totalScore = team.reduce((sum, champ) => {
    const score = difficultyScores[champ.type] || 1.5;
    return sum + score;
  }, 0);

  const avgScore = totalScore / team.length;

  if (avgScore < 1.5) return "FÁCIL";
  if (avgScore < 2.2) return "MEDIO";
  return "DIFÍCIL";
};

/**
 * Genera un ID único para compartir el equipo
 * @param {Array} team - Equipo
 * @returns {String} ID único
 */
export const generateTeamId = (team) => {
  if (!team || team.length === 0) return "";
  
  const championNames = team
    .map((c) => c.id)
    .join("-");
  
  const timestamp = Date.now().toString(36);
  return `${championNames}-${timestamp}`;
};

/**
 * Formatea un equipo para mostrar/compartir
 * @param {Array} team - Equipo
 * @returns {String} Formato legible
 */
export const formatTeamForShare = (team) => {
  if (!team || team.length === 0) return "Equipo vacío";

  const formatted = team
    .map((champ) => `${champ.assignedRole}: ${champ.name}`)
    .join("\n");

  return formatted;
};

export default {
  generateRandomTeam,
  isTeamComplete,
  getTeamDifficulty,
  generateTeamId,
  formatTeamForShare,
};
