import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePractica from "./pages/Practica/HomePractica";
import TeamPage from "./services/TeamPage";
import ChampionsPage from "./pages/Practica/ChampionsPage";
import ItemsPage from "./pages/Practica/ItemsPages";

// (Opcional futuro)
// import SharePage from "./pages/Practica/SharePage";

import AppLayout from "./components/AppLayout"; // si ya tienes Layout con header

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout con header + container */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePractica />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/champions" element={<ChampionsPage />} />
          <Route path="/items" element={<ItemsPage />} />

          {/* Futuro */}
          {/* <Route path="/share/:id" element={<SharePage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
