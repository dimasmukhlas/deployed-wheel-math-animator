/**
 * Builds scoped CSS for merged sub-apps: strips duplicate @tailwind, replaces :root with .subapp-*
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function stripTailwind(src) {
  return src.replace(/^@tailwind\s+\w+;\s*\n/gm, "");
}

const jobs = [
  {
    from: "deployed-sponge-bob/src/index.css",
    to: "src/styles/subapp-sponge.css",
    scope: "subapp-sponge",
    spongeFix: true,
  },
  {
    from: "deployed-shape-explorer-main/src/index.css",
    to: "src/styles/subapp-shape.css",
    scope: "subapp-shape",
  },
  {
    from: "deployed-fraction-fun-animated-main/src/index.css",
    to: "src/styles/subapp-fraction.css",
    scope: "subapp-fraction",
  },
];

for (const { from, to, scope, spongeFix } of jobs) {
  let s = readFileSync(join(root, from), "utf8");
  s = stripTailwind(s);
  s = s.replace(/:root\s*\{/g, `.${scope} {`);
  /* Only `body {` as a selector, not `font-body` or `body` inside words */
  s = s.replace(/(^|\n|\s)body\s*\{/g, `$1.${scope} {`);
  s = s.replace(
    /^\s*h1\s*,\s*h2\s*,\s*h3\s*,\s*h4\s*,\s*h5\s*,\s*h6\s*\{/gm,
    `  .${scope} h1, .${scope} h2, .${scope} h3, .${scope} h4, .${scope} h5, .${scope} h6 {`
  );
  /* Scope universal border reset to sub-app subtree */
  s = s.replace(
    /@layer base \{\s*\*\s*\{/,
    `@layer base {\n  .${scope} * {`
  );
  if (spongeFix) {
    s = s.replace(/@apply bg-background text-foreground font-body/g, "@apply bg-background text-foreground font-spongeBody");
  }
  writeFileSync(join(root, to), s);
  console.info(`[scope-css] ${from} → ${to}`);
}
