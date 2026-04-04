import { execSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function installAndBuild(subdir) {
  const appDir = join(root, subdir);
  if (!existsSync(join(appDir, "node_modules"))) {
    execSync("npm ci", { cwd: appDir, stdio: "inherit" });
  }
  execSync("npm run build", { cwd: appDir, stdio: "inherit" });
}

function copyDist(subdir, publicName) {
  const dist = join(root, subdir, "dist");
  const dest = join(root, "public", publicName);
  if (existsSync(dest)) rmSync(dest, { recursive: true });
  cpSync(dist, dest, { recursive: true });
}

installAndBuild("deployed-shape-explorer-main");
copyDist("deployed-shape-explorer-main", "shape");

installAndBuild("deployed-fraction-fun-animated-main");
copyDist("deployed-fraction-fun-animated-main", "fraction");
