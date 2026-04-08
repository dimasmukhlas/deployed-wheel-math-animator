import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const root = path.resolve(__dirname);

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    // Sub-apps ship their own node_modules; without this, lazy chunks get a second React
    // and hooks throw: Cannot read properties of null (reading 'useState').
    dedupe: ["react", "react-dom"],
    alias: {
      react: path.join(root, "node_modules/react"),
      "react-dom": path.join(root, "node_modules/react-dom"),
      "@": path.resolve(__dirname, "./src"),
      "@sponge": path.resolve(__dirname, "./deployed-sponge-bob/src"),
      "@shape": path.resolve(__dirname, "./deployed-shape-explorer-main/src"),
      "@fraction": path.resolve(__dirname, "./deployed-fraction-fun-animated-main/src"),
    },
  },
}));
