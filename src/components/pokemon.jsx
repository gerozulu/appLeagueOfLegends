import { useState, useEffect } from "react";
import styles from "./todoApp.module.css";
import InfoCard from "./infoCard";

function Pokemon() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");

      if (!response.ok) {
        throw new Error(`error http: ${response.status}`);
      }

      const data = await response.json();
      setPokemons(data);
    };

    fetchData();
  }, []);

  return (
    <>


    <main className={styles.pokemonPage}>
      <h1 className={styles.titulo}>POKEMONS</h1>
      
  
      <div className={styles.pokemonGrid}>
        {pokemons.map((pokemon) => (
          <InfoCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </main>
    </>
  );
}

export default Pokemon;  