/**
 * Rewrites `from "@/..."` / `from '@/...'` to `from "@PREFIX/..."` in sub-app sources
 * so the main Vite app can resolve each app under a distinct alias.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function walkFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walkFiles(p, acc);
    else if (/\.(ts|tsx)$/.test(name)) acc.push(p);
  }
  return acc;
}

const jobs = [
  { dir: "deployed-sponge-bob/src", prefix: "@sponge" },
  { dir: "deployed-shape-explorer-main/src", prefix: "@shape" },
  { dir: "deployed-fraction-fun-animated-main/src", prefix: "@fraction" },
];

for (const { dir, prefix } of jobs) {
  const abs = join(root, dir);
  const files = walkFiles(abs);
  let n = 0;
  for (const file of files) {
    let s = readFileSync(file, "utf8");
    const next = s
      .replaceAll(`from "@/`, `from "${prefix}/`)
      .replaceAll(`from '@/`, `from '${prefix}/`);
    if (next !== s) {
      writeFileSync(file, next);
      n++;
    }
  }
  console.info(`[prefix-imports] ${dir} → ${prefix}/ (${n} files)`);
}
