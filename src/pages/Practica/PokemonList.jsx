import { useState, useEffect, useMemo } from 'react';
import InfoCard from '../../components/infoCard';
import styles from './PokemonList.module.css';
import championRoles from '../../data/championroles';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [team, setTeam] = useState([]);

  // 🔥 TRAER CAMPEONES
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          'https://ddragon.leagueoflegends.com/cdn/14.7.1/data/es_MX/champion.json'
        );
        const data = await res.json();

        const champions = Object.values(data.data);

        const detalles = champions.map((champion) => ({
          id: champion.key,
          name: champion.name,
          image: `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/champion/${champion.id}.png`,
          type: champion.tags[0],
          role: championRoles[champion.id] || "UNKNOWN"
        }));

        setPokemons(detalles);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔍 BUSCADOR OPTIMIZADO
  const filteredChampions = useMemo(() => {
    return pokemons.filter((champion) =>
      champion.name.toLowerCase().includes(search.toLowerCase()) ||
      champion.type.toLowerCase().includes(search.toLowerCase())
    );
  }, [pokemons, search]);

  // 🎮 GENERAR EQUIPO POR ROLES REALES
  const generateTeam = () => {
    const roles = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];

    const usedIds = new Set();
    const newTeam = [];

    roles.forEach((role) => {
      const champs = pokemons.filter(
        (champ) =>
          champ.role === role &&
          !usedIds.has(champ.id)
      );

      if (champs.length === 0) return;

      const randomChamp =
        champs[Math.floor(Math.random() * champs.length)];

      usedIds.add(randomChamp.id);

      newTeam.push(randomChamp);
    });

    setTeam(newTeam);
  };

  return (
    <div className={styles.listPage}>
      
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Generador de equipo (roles reales)</h3>

        <button 
          onClick={generateTeam} 
          className={styles.changeDataButton}
        >
          Generar equipo
        </button>

        <div className={styles.grid}>
          {team.map((champion) => (
            <div key={champion.id}>
              <h4 style={{ textAlign: "center", marginBottom: "8px" }}>
                {champion.role}
              </h4>

              <InfoCard pokemon={champion} />

              {champion.role === "UNKNOWN" && (
                <p style={{ color: "red", textAlign: "center" }}>
                  Sin rol definido
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
      

      {/* 🔍 BUSCADOR */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Buscar campeón</h3>

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Ej: yasuo, mage..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {search !== "" && (
          <div className={styles.grid}>
            {filteredChampions.map((champion) => (
              <InfoCard key={champion.id} pokemon={champion} />
            ))}
          </div>
        )}

        {filteredChampions.length === 0 && search !== "" && (
          <p>No se encontró ningún campeón 😢</p>
        )}
      </section>

      {/* TODOS */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Todos los campeones</h3>

        {loading ? (
          <p className={styles.loading}>Cargando campeones...</p>
        ) : (
          <div className={styles.grid}>
            {pokemons.map((pokemon) => (
              <InfoCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        )}
      </section>

      {/* 🎮 GENERADOR DE EQUIPO */}
      

    </div>
  );
};

export default PokemonList;