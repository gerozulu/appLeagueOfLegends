import { useCallback } from 'react';

/**
 * Hook para generar equipos aleatorios balanceados por rol
 * @param {Array} champions - Lista de campeones disponibles
 * @returns {Object} { generateTeam: Function }
 */
export const useTeamGenerator = (champions) => {
  const generateTeam = useCallback(() => {
    const roles = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];
    const usedIds = new Set();
    const newTeam = [];

    roles.forEach((role) => {
      // Filtrar campeones que pueden jugar este rol y no han sido usados
      const availableChamps = champions.filter(
        (champ) =>
          (Array.isArray(champ.role) 
            ? champ.role.includes(role) 
            : champ.role === role) &&
          !usedIds.has(champ.id)
      );

      if (availableChamps.length > 0) {
        // Seleccionar campeón aleatorio
        const randomChamp = availableChamps[
          Math.floor(Math.random() * availableChamps.length)
        ];

        usedIds.add(randomChamp.id);

        // Agregar al equipo con el rol asignado
        newTeam.push({
          ...randomChamp,
          assignedRole: role
        });
      }
    });

    return newTeam;
  }, [champions]);

  return { generateTeam };
};
