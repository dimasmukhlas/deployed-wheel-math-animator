export function youtubeIdFromUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  // Already an 11-char video id
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const u = new URL(raw);

    // https://www.youtube.com/watch?v=VIDEOID
    const v = u.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

    // https://youtu.be/VIDEOID
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\/+/, "").split("/")[0] ?? "";
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }

    // https://www.youtube.com/embed/VIDEOID
    const embedMatch = u.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch?.[1]) return embedMatch[1];

    return null;
  } catch {
    return null;
  }
}

export function youtubeThumbUrl(videoId: string, quality: "max" | "hq" = "max") {
  const q = quality === "max" ? "maxresdefault" : "hqdefault";
  return `https://img.youtube.com/vi/${videoId}/${q}.jpg`;
}

