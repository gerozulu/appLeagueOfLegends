import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ddragon": {
        target: "https://ddragon.leagueoflegends.com",
        changeOrigin: true,
        secure: false, // útil en redes corporativas
        rewrite: (path) => path.replace(/^\/ddragon/, ""),
      },
    },
  },
});
