import { useState, useEffect } from 'react';
import championRoles from '../data/championRoles';

/**
 * Hook para obtener y gestionar la lista de campeones de LoL
 * @returns {Object} { champions: Array, loading: Boolean, error: String }
 */
export const useChampions = () => {
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Traer datos de la API oficial de LoL (DDragon)
        const response = await fetch(
          'https://ddragon.leagueoflegends.com/cdn/14.7.1/data/es_MX/champion.json'
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const championList = Object.values(data.data);

        // Mapear campeones con sus roles
        const mappedChampions = championList.map((champion) => ({
          id: champion.key,
          name: champion.name,
          image: `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/champion/${champion.id}.png`,
          type: champion.tags[0] || "Unknown",
          role: championRoles[champion.id] || ["UNKNOWN"]
        }));

        setChampions(mappedChampions);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching champions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChampions();
  }, []);

  return { champions, loading, error };
};
