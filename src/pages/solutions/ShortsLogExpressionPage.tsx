import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { youtubeIdFromUrl, youtubeThumbUrl } from "@/lib/youtube";

const VIDEO_URL = "https://youtu.be/X0qA1h47OCY";
const VIDEO_ID = youtubeIdFromUrl(VIDEO_URL) ?? "X0qA1h47OCY";

function safeNumber(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

export default function ShortsLogExpressionPage() {
  const canonicalUrl = useMemo(
    () => `${window.location.origin}/shorts/${VIDEO_ID}`,
    []
  );

  // Soal: 1 + 3,3 log 30
  const [c, setC] = useState<number>(1);
  const [a, setA] = useState<number>(3.3);
  const [x, setX] = useState<number>(30);
  // Di matematika sekolah, "log" biasanya berarti log basis 10.
  const [base, setBase] = useState<number>(10);
  const [digits, setDigits] = useState<number>(4);

  const logValue = useMemo(() => {
    // log_base(x) = ln(x) / ln(base)
    const lnX = Math.log(x);
    const lnB = Math.log(base);
    if (!Number.isFinite(lnX) || !Number.isFinite(lnB) || lnB === 0) return NaN;
    return lnX / lnB;
  }, [base, x]);

  const result = useMemo(() => {
    if (!Number.isFinite(logValue)) return NaN;
    return c + a * logValue;
  }, [a, c, logValue]);

  const thumbnail = useMemo(() => youtubeThumbUrl(VIDEO_ID, "hq"), []);

  const jsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
          headline: "1 + 3,3 log 30",
          description:
            "Halaman interaktif untuk menghitung hasil dari 1 + 3,3 log 30 (log basis 10 secara default).",
          image: [thumbnail],
          author: { "@type": "Organization", name: "Cognizo" },
          publisher: { "@type": "Organization", name: "Cognizo" },
          datePublished: new Date().toISOString(),
        },
        {
          "@type": "VideoObject",
          name: "1 + 3,3 log 30 (Shorts)",
          thumbnailUrl: [thumbnail],
          embedUrl: `https://www.youtube-nocookie.com/embed/${VIDEO_ID}`,
          contentUrl: VIDEO_URL,
          uploadDate: new Date().toISOString(),
        },
      ],
    };
  }, [canonicalUrl, thumbnail]);

  const fmt = (n: number) =>
    Number.isFinite(n)
      ? n.toLocaleString(undefined, { maximumFractionDigits: digits })
      : "—";

  const logLabel = useMemo(() => {
    if (!Number.isFinite(logValue)) return "log";
    return `log_${base}`;
  }, [base, logValue]);

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 md:pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button asChild variant="outline">
            <Link to="/">Back</Link>
          </Button>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">Interaktif</Badge>
            <Badge variant="secondary">Logaritma</Badge>
            <Button asChild variant="secondary">
              <a href={VIDEO_URL} target="_blank" rel="noreferrer">
                Watch on YouTube
              </a>
            </Button>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Hasil: 1 + 3,3 log 30</h1>
          <p className="text-muted-foreground leading-relaxed">
            Default: <span className="font-medium">log basis 10</span>. Kamu bisa ubah basisnya kalau di video
            pakai definisi lain.
          </p>
        </header>

        <Card className="p-5 md:p-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Konstanta (c)</div>
              <Input
                type="number"
                value={c}
                step={0.1}
                onChange={(e) => setC(safeNumber(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Koefisien (a)</div>
              <Input
                type="number"
                value={a}
                step={0.1}
                onChange={(e) => setA(safeNumber(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Nilai di dalam log (x)</div>
              <Input
                type="number"
                value={x}
                step={1}
                min={0}
                onChange={(e) => setX(safeNumber(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Basis log (base)</div>
              <Input
                type="number"
                value={base}
                step={1}
                min={0.000001}
                onChange={(e) => setBase(Math.max(1e-9, safeNumber(e.target.value)))}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="text-sm text-muted-foreground">Perhitungan</div>
            <div className="mt-1 text-lg font-semibold">
              log ({fmt(x)}) = {logLabel}({fmt(x)}) = {fmt(logValue)}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              a × log + c = {fmt(a)} × {fmt(logValue)} + {fmt(c)}
            </div>
            <div className="mt-3 text-3xl font-bold">{fmt(result)}</div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Pembulatan (digit)</div>
              <div className="text-sm text-muted-foreground">Tentukan banyak angka di belakang koma.</div>
            </div>
            <div className="w-36">
              <Input
                type="number"
                value={digits}
                step={1}
                min={0}
                max={10}
                onChange={(e) => setDigits(Math.max(0, Math.min(10, Math.floor(safeNumber(e.target.value)))))}
              />
            </div>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="aspect-video bg-muted">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
              title="1 + 3,3 log 30 (Shorts)"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

