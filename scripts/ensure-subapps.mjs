import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const shapeIndex = join(root, "public", "shape", "index.html");
const fractionIndex = join(root, "public", "fraction", "index.html");

if (!existsSync(shapeIndex) || !existsSync(fractionIndex)) {
  console.info("[cognizo] Building Cognizo Shape & Pecahan Seru into public/ (first run or after clean)…");
  execSync("node scripts/build-subapps.mjs", { cwd: root, stdio: "inherit" });
} else {
  console.info("[cognizo] Sub-apps found in public/shape & public/fraction — skip build.");
}
