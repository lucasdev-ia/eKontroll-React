import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
    host: '0.0.0.0', // Faz com que Vite escute em todas as interfaces
    port: 3000,      // Você pode mudar o número da porta se necessário
  },
  plugins: [react()],
});
