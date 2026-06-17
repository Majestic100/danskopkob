import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// Project-site på GitHub Pages serveres fra /danskopkob/.
// Ved skift til eget domæne (root) sæt base til "/".
export default defineConfig({
  base: "/danskopkob/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
