import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/users': process.env.VITE_BACKEND_URL || 'http://localhost:4000',
      '/captains': process.env.VITE_BACKEND_URL || 'http://localhost:4000',
      '/maps': process.env.VITE_BACKEND_URL || 'http://localhost:4000',
      '/rides': process.env.VITE_BACKEND_URL || 'http://localhost:4000'
    }
  }
});
