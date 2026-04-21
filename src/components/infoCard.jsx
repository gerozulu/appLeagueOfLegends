import styles from "./infoCard.module.css";
import Pokemon from "../components/pokemon";

function InfoCard({ pokemon, icon, title, description }) {
  if (pokemon) {
    return (
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <img src={pokemon.image} alt={pokemon.name} className={styles.image} />
        </div>
        <h3 className={styles.name}>{pokemon.name}</h3>
        <p>2</p>
        <p className={styles.type}>{pokemon.type}</p>
        <p>3</p>
        <p className={styles.description}>{pokemon.description}</p>
      </div>
    );
  }

  return (
    <div className={styles.contextCard}>
      {icon && <div className={styles.contextIcon}>{icon}</div>}
      <h2 className={styles.contextTitle}>{title}</h2>
      <p className={styles.contextDescription}>{description}</p>
    </div>
  );
}

export default InfoCard;