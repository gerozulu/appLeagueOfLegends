import ChampionList from './ChampionList';
import InfoCard from '../../components/infoCard';
import styles from './HomePractica.module.css';
import Items from './Items';

const HomePractica = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🎮 Generador de Equipos LoL</h1>
      <p className={styles.description}>
        Randomiza equipos completos de League of Legends con roles reales. Juega partidas más dinámicas y divertidas con tus amigos.
      </p>
      <hr className={styles.divider} />

      <div className={styles.introCard}>
        <InfoCard
          icon="⚔️"  
          title="Combina Campeones e Ítems"
          description="Genera equipos balanceados por rol y descubre builds aleatorias"
        />
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📦 Ítems Disponibles</h2>
        <Items />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>⚡ Los Campeones de LoL</h2>
        <ChampionList />
        
      </section>
    </div>
  );
};

export default HomePractica;
