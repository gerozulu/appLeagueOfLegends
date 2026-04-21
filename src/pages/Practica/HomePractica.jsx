import PokemonList from './PokemonList';
import InfoCard from '../../components/infoCard';
import styles from './HomePractica.module.css';
import Items from './Items';

const HomePractica = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🏠 Mi Página de Práctica</h1>
      <p className={styles.description}>
        Bienvenido a tu espacio de práctica. Aquí verás todos los Pokémon y también una selección especial de los 5 más buscados.
      </p>
      <hr className={styles.divider} />

      <div className={styles.introCard}>
        <InfoCard
          icon="📊"  
          title="Top 5 del momento"
          description="Estos son los Pokémon más consultados esta semana"
        />
      <h2>y sus items</h2>
        <Items />
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🔥 Los Pokémon más buscados</h2>
        <PokemonList />
        
      </section>
    </div>
  );
};

export default HomePractica;
