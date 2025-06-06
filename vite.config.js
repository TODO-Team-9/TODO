import { defineConfig } from "vite";

export default defineConfig({
  root: "./frontend",
  build: {
    outDir: "../public",
    emptyOutDir: true,
  },
  envDir: "./frontend", // Look for .env files in the frontend directory
});
