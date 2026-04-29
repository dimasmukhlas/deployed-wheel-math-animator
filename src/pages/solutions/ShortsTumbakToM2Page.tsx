import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { youtubeIdFromUrl, youtubeThumbUrl } from "@/lib/youtube";

const VIDEO_URL = "https://youtu.be/HltvQZmIgFg";
const VIDEO_ID = youtubeIdFromUrl(VIDEO_URL) ?? "HltvQZmIgFg";

const TUMBAK_TO_M2 = 14.0625; // commonly used conversion for tumbak -> m²

export default function ShortsTumbakToM2Page() {
  const canonicalUrl = useMemo(
    () => `${window.location.origin}/shorts/HltvQZmIgFg`,
    []
  );

  const [tumbak, setTumbak] = useState<number>(5);

  const m2 = useMemo(() => tumbak * TUMBAK_TO_M2, [tumbak]);

  const thumbnail = useMemo(() => youtubeThumbUrl(VIDEO_ID, "hq"), []);

  const jsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
          headline: "5 tumbak tanah berapa meter persegi?",
          description:
            "Halaman interaktif untuk menghitung konversi 5 tumbak tanah ke meter persegi (m²).",
          image: [thumbnail],
          author: { "@type": "Organization", name: "Cognizo" },
          publisher: { "@type": "Organization", name: "Cognizo" },
          datePublished: new Date().toISOString(),
        },
        {
          "@type": "VideoObject",
          name: "5 tumbak tanah berapa meter persegi? (Shorts)",
          thumbnailUrl: [thumbnail],
          embedUrl: `https://www.youtube-nocookie.com/embed/${VIDEO_ID}`,
          contentUrl: VIDEO_URL,
          uploadDate: new Date().toISOString(),
        },
      ],
    };
  }, [canonicalUrl, thumbnail]);

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 md:pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button asChild variant="outline">
            <Link to="/">Back</Link>
          </Button>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">Interaktif</Badge>
            <Badge variant="secondary">Konversi satuan</Badge>
            <Button asChild variant="secondary">
              <a href={VIDEO_URL} target="_blank" rel="noreferrer">
                Watch on YouTube
              </a>
            </Button>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">5 tumbak tanah berapa meter persegi?</h1>
          <p className="text-muted-foreground leading-relaxed">
            Konversi menggunakan: <span className="font-medium">1 tumbak = {TUMBAK_TO_M2} m²</span>.
          </p>
        </header>

        <Card className="p-5 md:p-6 space-y-5">
          <div className="space-y-1">
            <div className="font-semibold">Masukkan jumlah tumbak</div>
            <div className="text-sm text-muted-foreground">Untuk soal ini biasanya nilai awalnya 5.</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[220px_1fr] items-end">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">tumbak</div>
              <Input
                type="number"
                min={0}
                step={0.01}
                value={Number.isFinite(tumbak) ? tumbak : 0}
                onChange={(e) => setTumbak(Number(e.target.value || 0))}
              />
            </div>

            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="text-sm text-muted-foreground">Rumus</div>
              <div className="mt-1 text-lg font-semibold">
                m² = tumbak × {TUMBAK_TO_M2}
              </div>
              <div className="mt-2 text-2xl font-bold">
                {m2.toLocaleString(undefined, { maximumFractionDigits: 4 })} m²
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              Untuk soal ini (tumbak = 5):
              <div className="mt-1 font-medium text-foreground">
                5 × {TUMBAK_TO_M2} = {m2} m²
              </div>
            </div>
            <div>
              Catatan: beberapa dokumen bisa memakai pembulatan yang sedikit berbeda. Jika video kamu memakai nilai lain,
              kirim angka konversinya dan aku bisa sesuaikan.
            </div>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="aspect-video bg-muted">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`}
              title="5 tumbak tanah berapa meter persegi (Shorts)"
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

