import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import styles from "./AppLayout.module.css";

export default function AppLayout() {
  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.container}>
        <Outlet />
      </main>
    </div>
  );
}