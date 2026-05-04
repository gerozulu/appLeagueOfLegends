import styles from "./infoCard.module.css";

export default function InfoCard({
  champion,
  pokemon,
  icon,
  title,
  description,
  children,
}) {
  // Soporta tanto 'champion' como 'pokemon' para compatibilidad
  const data = champion || pokemon;

  // Modo contextual (con icon, title, description)
  if (icon && title && description) {
    return (
      <div className={styles.contextCard}>
        <div className={styles.contextIcon}>{icon}</div>
        <h3 className={styles.contextTitle}>{title}</h3>
        <p className={styles.contextDescription}>{description}</p>
      </div>
    );
  }

  // Modo campeón/carta
  if (data) {
    return (
      <div className={styles.card}>
        {/* Imagen */}
        <div className={styles.imageWrapper}>
          <img
            src={data.image}
            alt={data.name}
            className={styles.image}
            loading="lazy"
          />
        </div>

        {/* Nombre y tipo */}
        <h3 className={styles.name}>{data.name}</h3>
        {data.type && <span className={styles.type}>{data.type}</span>}

        {/* Descripción opcional */}
        {data.description && (
          <p className={styles.description}>{data.description}</p>
        )}

        {/* Rol si existe */}
        {data.role && (
          <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: "8px 0" }}>
            {Array.isArray(data.role) ? data.role.join(" / ") : data.role}
          </p>
        )}

        {/* Extra: items + runas */}
        {children && (
          <div className={styles.cardExtra}>
            {children}
          </div>
        )}
      </div>
    );
  }

  // Modo por defecto
  return <div className={styles.card}>Cargando...</div>;
}