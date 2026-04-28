import { Children, type ReactNode } from "react";

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\u2019']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const counts = new Map<string, number>();
  const items: TocItem[] = [];

  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!m) continue;
    const level = m[1].length;
    if (level !== 2 && level !== 3) continue;
    const rawText = m[2].replace(/\s+#*\s*$/, "").trim();
    if (!rawText) continue;

    const base = slugify(rawText) || "section";
    const next = (counts.get(base) ?? 0) + 1;
    counts.set(base, next);
    const id = next === 1 ? base : `${base}-${next}`;
    items.push({ id, text: rawText, level: level as 2 | 3 });
  }

  return items;
}

export function nodeText(children: ReactNode): string {
  return Children.toArray(children)
    .map((c) => {
      if (typeof c === "string") return c;
      if (typeof c === "number") return String(c);
      // If nested elements, we can only do a best-effort.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (c as any)?.props?.children ? nodeText((c as any).props.children) : "";
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

