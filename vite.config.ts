import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Vite serves `public/shape/index.html` at `/shape/index.html`, not `/shape/`.
 * This rewrites `/shape`, `/shape/`, and client routes to `index.html` while
 * leaving `/shape/assets/*` and other static files alone (dev + preview).
 */
function subappSpaFallback(): Plugin {
  const bases = ["/shape", "/fraction"] as const;

  const middleware = (req: { url?: string }, _res: unknown, next: () => void) => {
    const raw = req.url ?? "";
    const pathname = raw.split("?")[0] ?? "";
    const query = raw.includes("?") ? "?" + raw.split("?")[1] : "";

    for (const base of bases) {
      if (pathname === base || pathname === `${base}/`) {
        req.url = `${base}/index.html${query}`;
        return next();
      }
      if (!pathname.startsWith(`${base}/`)) continue;
      if (pathname.startsWith(`${base}/assets/`)) return next();
      const last = pathname.split("/").filter(Boolean).pop() ?? "";
      const looksLikeFile = last.includes(".") && last.length > 1;
      if (looksLikeFile) return next();
      req.url = `${base}/index.html${query}`;
      return next();
    }
    next();
  };

  return {
    name: "subapp-spa-fallback",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    subappSpaFallback(),
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
