import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

      "@api": path.resolve(__dirname, "./src/api"),

      "@app": path.resolve(__dirname, "./src/app"),

      "@assets": path.resolve(__dirname, "./src/assets"),

      "@content": path.resolve(__dirname, "./src/content"),

      "@features": path.resolve(__dirname, "./src/features"),

      "@layouts": path.resolve(__dirname, "./src/layouts"),

      "@routes": path.resolve(__dirname, "./src/routes"),

      "@shared": path.resolve(__dirname, "./src/shared"),

      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },
});


