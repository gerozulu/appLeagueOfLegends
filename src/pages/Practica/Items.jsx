import { useEffect, useMemo, useState } from "react";
import { getItems } from "../../services/apiService";
import styles from "./Items.module.css";

const ITEMS_VERSION = "14.8.1";

export default function Items() {
  const [itemsRaw, setItemsRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const raw = await getItems();
        setItemsRaw(raw);
      } catch (e) {
        console.error(e);
        setError("Error cargando ítems");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const itemsList = useMemo(() => {
    const map = itemsRaw?.data ?? {};
    return Object.entries(map)
      .map(([id, it]) => ({ id, ...it }))
      .filter((it) => {
        const gold = it?.gold?.total ?? 0;
        if (gold === 0) return false;
        if (it?.inStore === false) return false;
        if (it?.maps && it.maps["11"] === false) return false;
        return true;
      });
  }, [itemsRaw]);

  const iconUrl = (full) =>
    `https://ddragon.leagueoflegends.com/cdn/${ITEMS_VERSION}/img/item/${full}`;

  if (loading) return <p className={styles.loading}>Cargando ítems...</p>;
  if (error) return <p className={styles.error}>⚠️ {error}</p>;

  return (
    <div className={styles.itemsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>📦 Ítems Disponibles</h1>
        <p className={styles.subtitle}>Total: {itemsList.length} items</p>
      </div>

      <div className={styles.grid}>
        {itemsList.map((it) => (
          <div key={it.id} className={styles.itemCard} title={it.description || it.name}>
            <div className={styles.itemImageWrapper}>
              <img
                src={iconUrl(it?.image?.full)}
                alt={it.name}
                className={styles.itemImage}
                loading="lazy"
              />
            </div>
            <div className={styles.itemName}>{it.name}</div>
            <div className={styles.itemGold}>💰 {it?.gold?.total ?? "N/A"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}