import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8080",
      "/health": "http://localhost:8080",
      "/ml-api": {
        target: "http://localhost:8001",
        rewrite: (path) => path.replace(/^\/ml-api/, ""),
      },
    },
  },
});
