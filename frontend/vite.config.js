import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// el plugin de react permite usar jsx; el puerto 5173 es el que permite el cors del backend
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
