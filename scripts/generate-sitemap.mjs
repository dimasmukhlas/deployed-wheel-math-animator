/**
 * Writes public/sitemap.xml and public/robots.txt for search engines.
 * Set SITE_URL when building for a custom domain, e.g.:
 *   SITE_URL=https://www.example.com npm run build
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");

const SITE_URL = (process.env.SITE_URL || "https://cognizowheel.web.app").replace(/\/$/, "");

const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/wheel", changefreq: "weekly", priority: "0.9" },
  { path: "/shape/", changefreq: "weekly", priority: "0.8" },
  { path: "/fraction/", changefreq: "weekly", priority: "0.8" },
];

const lastmod = new Date().toISOString().split("T")[0];

function absoluteUrl(path) {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

const urlEntries = routes
  .map(
    (r) => `  <url>
    <loc>${absoluteUrl(r.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

writeFileSync(join(publicDir, "sitemap.xml"), sitemap, "utf8");

const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemap (generated with SITE_URL=${SITE_URL})
Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(join(publicDir, "robots.txt"), robots, "utf8");

console.log(`Sitemap: ${SITE_URL}/sitemap.xml (${routes.length} URLs)`);
