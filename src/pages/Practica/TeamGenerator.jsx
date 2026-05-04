    import { useEffect, useState } from "react";
import InfoCard from "../../components/infoCard";
import styles from "./TeamGenerator.module.css";
import championRoles from "../../data/championRoles";
import { getChampions, getItems, getRunes } from "../../services/apiService";
import { generateBuildsForTeam } from "../../services/buildGenerator";
import { generateRunesForTeam, runeIconUrl } from "../../services/runeGenerator";

const TeamGenerator = () => {
  const [champions, setChampions] = useState([]);
  const [itemsRaw, setItemsRaw] = useState(null);
  const [teamBuilds, setTeamBuilds] = useState(null);
  const [teamRunes, setTeamRunes] = useState(null);
  const [runesData, setRunesData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState([]);
  const [error, setError] = useState(null);

  // 🔥 CARGAR DATOS
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [championList, itemsData, runesDataList] = await Promise.all([
          getChampions(),
          getItems(),
          getRunes(), // runesReforged.json 
        ]);

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
        setItemsRaw(itemsData);
        setRunesData(runesDataList);
      } catch (e) {
        console.error(e);
        setError("Error cargando datos. Verifica tu conexión.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🎮 GENERAR EQUIPO ALEATORIO
  const generateTeam = () => {
    const roles = ["TOP", "JUNGLE", "MID", "ADC", "SUPPORT"];
    const usedIds = new Set();
    const newTeam = [];

    console.log("CLICK generateTeam | runesData length:", runesData?.length);
    roles.forEach((role) => {
      const pool = champions.filter(
        (champ) =>
          (Array.isArray(champ.role) ? champ.role.includes(role) : champ.role === role) &&
          !usedIds.has(champ.id)
      );

      if (pool.length === 0) return;

      const randomChamp = pool[Math.floor(Math.random() * pool.length)];
      usedIds.add(randomChamp.id);

      newTeam.push({ ...randomChamp, assignedRole: role });
    });

    setTeam(newTeam);

    // Convertir a objeto por rol
    const teamByRole = Object.fromEntries(newTeam.map((c) => [c.assignedRole, c]));

    // Generar builds
    if (itemsRaw?.data) {
      const builds = generateBuildsForTeam(teamByRole, itemsRaw);
      setTeamBuilds(builds);
    } else {
      setTeamBuilds(null);
    }

    // Generar runas
    if (Array.isArray(runesData) && runesData.length > 0) {
      const runes = generateRunesForTeam(teamByRole, runesData);
      setTeamRunes(runes);

      // Debug rápido (opcional)
      // console.log("RUNES sample MID:", runes?.MID);
      // console.log("Keystone icon:", runes?.MID?.keystone?.icon);
    } else {
      setTeamRunes(null);
    }
  };

  if (loading) return <p className={styles.loading}>⚙️ Cargando...</p>;

  return (
    <div className={styles.generatorPage}>
      {/* HEADER */}
      <section className={styles.headerSection}>
        <h1 className={styles.title}>⚔️ Generador de Equipo</h1>
        <p className={styles.subtitle}>
          Randomiza un equipo completo con roles, builds y runas optimizadas
        </p>
      </section>

      {/* ERROR */}
      {error && (
        <div className={styles.errorBox}>
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* BOTÓN GENERAR */}
      <section className={styles.actionSection}>
        <button
          onClick={generateTeam}
          className={styles.generateButton}
          disabled={loading}
        >
          🎲 Generar Equipo Aleatorio
        </button>
      </section>

      {/* EQUIPO GENERADO */}
      {team.length > 0 && (
        <section className={styles.teamSection}>
          <h2 className={styles.sectionTitle}>Tu Equipo</h2>

          <div className={styles.teamGrid}>
            {team.map((champion) => {
              const build = teamBuilds?.[champion.assignedRole];
              const runes = teamRunes?.[champion.assignedRole];

              return (
                <div
                  key={`${champion.id}-${champion.assignedRole}`}
                  className={styles.championWrapper}
                >
                  <div className={styles.roleLabel}>{champion.assignedRole}</div>

                  <InfoCard champion={champion}>
                    <div className={styles.buildContent}>
                      {/* ITEMS */}
                      {build?.items?.length > 0 && (
                        <div className={styles.buildBlock}>
                          <p className={styles.buildBlockTitle}>
                            Items ({build.profile})
                          </p>

                          <div className={styles.buildIcons}>
                            {build.items.map((it) => {
                              const version = itemsRaw?.version ?? "14.8.1";
                              const full = it?.image?.full;
                              const src = full
                                ? `/ddragon/cdn/${version}/img/item/${full}`
                                : null;

                              return (
                                <div
                                  key={it.id}
                                  className={styles.itemIconWrap}
                                  title={it.name}
                                >
                                  {src ? (
                                    <img
                                      src={src}
                                      alt={it.name}
                                      className={styles.itemIcon}
                                      loading="lazy"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    <div className={styles.itemIconFallback} />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* RUNAS */}
                      {runes?.keystone && (
                        <div className={styles.buildBlock}>
                          <p className={styles.buildBlockTitle}>
                            Runas ({runes.primaryStyle?.name} + {runes.secondaryStyle?.name})
                          </p>

                          {/* Primary: icono estilo + keystone + 3 minors */}
                          <div className={styles.runesPrimaryRow}>
                            {runeIconUrl(runes.primaryStyle?.icon) ? (
                              <img
                                src={runeIconUrl(runes.primaryStyle.icon)}
                                alt={runes.primaryStyle?.name}
                                title={runes.primaryStyle?.name}
                                className={styles.runeStyleIcon}
                                loading="lazy"
                              />
                            ) : (
                              <div className={styles.runeFallback} />
                            )}

                            {runeIconUrl(runes.keystone?.icon) ? (
                              <img
                                src={runeIconUrl(runes.keystone.icon)}
                                alt={runes.keystone?.name}
                                title={runes.keystone?.name}
                                className={styles.runeKeystone}
                                loading="lazy"
                              />
                            ) : (
                              <div className={styles.runeFallback} />
                            )}

                            <div className={styles.runeMinorsCol}>
                              {runes.primaryMinors?.map((r) => (
                                <img
                                  key={r.id}
                                  src={runeIconUrl(r.icon)}
                                  alt={r.name}
                                  title={r.name}
                                  className={styles.runeSmall}
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Secondary: icono estilo + 2 minors */}
                          <div className={styles.runesSecondaryRow}>
                            {runeIconUrl(runes.secondaryStyle?.icon) ? (
                              <img
                                src={runeIconUrl(runes.secondaryStyle.icon)}
                                alt={runes.secondaryStyle?.name}
                                title={runes.secondaryStyle?.name}
                                className={styles.runeStyleIconSmall}
                                loading="lazy"
                              />
                            ) : (
                              <div className={styles.runeFallback} />
                            )}

                            {runes.secondaryMinors?.map((r) => (
                              <img
                                key={r.id}
                                src={runeIconUrl(r.icon)}
                                alt={r.name}
                                title={r.name}
                                className={styles.runeSmall}
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </InfoCard>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ESTADO VACÍO */}
      {team.length === 0 && !loading && (
        <section className={styles.emptyState}>
          <p className={styles.emptyMessage}>
            Haz clic en "Generar Equipo Aleatorio" para comenzar
          </p>
        </section>
      )}
    </div>
  );
};

export default TeamGenerator;