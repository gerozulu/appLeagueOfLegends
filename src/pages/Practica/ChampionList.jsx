import { useEffect, useMemo, useState } from "react";
import InfoCard from "../../components/infoCard";
import styles from "./ChampionList.module.css";
import championRoles from "../../data/championRoles";
import { getChampions, getItems, getRunes } from "../../services/apiService";
import TeamGenerator from "./TeamGenerator";

const ChampionList = () => {
  const [champions, setChampions] = useState([]);
  const [itemsRaw, setItemsRaw] = useState(null);     // ✅ FALTABA
  const [runesData, setRunesData] = useState([]);     // ✅ ok

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  // 🔥 CARGAR CHAMPS + ITEMS + RUNAS
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [championList, itemsData, runesJson] = await Promise.all([
          getChampions(),
          getItems(),
          getRunes(),
        ]);

        setItemsRaw(itemsData);   // ✅ ahora existe
        setRunesData(runesJson);  // ✅ array de estilos
    


        const detalles = championList.map((champion) => ({
          id: champion.key,
          ddId: champion.id,
          name: champion.name,
          image: `https://ddragon.leagueoflegends.com/cdn/14.7.1/img/champion/${champion.id}.png`,
          type: champion.tags?.[0] ?? "Unknown",
          tags: champion.tags ?? [],
          info: champion.info ?? {},
          role: championRoles[champion.id] || ["UNKNOWN"],
        }));

        setChampions(detalles);
      } catch (e) {
        console.error(e);
        setError("Error cargando data (champs/items/runas).");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔍 BUSCADOR OPTIMIZADO
  const filteredChampions = useMemo(() => {
    const q = search.toLowerCase();
    return champions.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)
    );
  }, [champions, search]);

  return (
    <div className={styles.listPage}>
      {/* GENERADOR DE EQUIPO (aquí van builds + runas) */}
    

      {/* BUSCADOR / EXPLORADOR */}
      <section className={styles.section}>
        <h1 className={styles.mainTitle}>🎮 Explora Campeones</h1>
        <p className={styles.mainSubtitle}>
          Busca y descubre todos los campeones de League of Legends
        </p>

        {error && (
          <p style={{ color: "#ff9999", padding: 10 }}>
            ⚠️ {error}
          </p>
        )}

        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Busca por nombre o tipo (ej: Yasuo, Mage)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </section>

      {/* RESULTADOS O LISTADO */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {search ? `Resultados: ${filteredChampions.length}` : "Todos los Campeones"}
        </h2>

        {loading ? (
          <p className={styles.loading}>⚙️ Cargando campeones...</p>
        ) : champions.length > 0 ? (
          <>
            {search && filteredChampions.length === 0 ? (
              <p className={styles.noResults}>
                No se encontró ningún campeón que coincida con "{search}" 😢
              </p>
            ) : (
              <div className={styles.grid}>
                {(search ? filteredChampions : champions).map((champion) => (
                  <InfoCard key={champion.id} champion={champion} />
                ))}
              </div>
            )}
          </>
        ) : (
          <p>No se pudieron cargar los campeones.</p>
        )}
      </section>
    </div>
  );
};

export default ChampionList;
