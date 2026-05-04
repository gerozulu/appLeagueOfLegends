import { NavLink } from "react-router-dom";
import styles from "./AppHeader.module.css";

export default function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⚔</span>
          <div className={styles.brandTextWrap}>
            <div className={styles.brandTitle}>Generador de Equipo</div>
            <div className={styles.brandSubtitle}>
              Randomiza un equipo completo con roles, builds y runas optimizadas
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? styles.active : styles.link)}
          >
            Home
          </NavLink>

          <NavLink
            to="/team"
            className={({ isActive }) => (isActive ? styles.active : styles.link)}
          >
            Team
          </NavLink>

          <NavLink
            to="/champions"
            className={({ isActive }) => (isActive ? styles.active : styles.link)}
          >
            Champions
          </NavLink>

          <NavLink
            to="/items"
            className={({ isActive }) => (isActive ? styles.active : styles.link)}
          >
            Items
          </NavLink>
        </nav>

        <div className={styles.actions}>
          <NavLink to="/team" className={styles.cta}>
            GENERAR EQUIPO ALEATORIO
          </NavLink>
        </div>
      </div>

      <div className={styles.bottomLine} />
    </header>
  );
}