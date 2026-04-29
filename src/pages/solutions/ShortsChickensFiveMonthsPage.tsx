import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const YT_URL = "https://youtube.com/shorts/cGT9jICNDBs";
const YT_ID = "cGT9jICNDBs";

function sum(values: number[]) {
  return values.reduce((acc, v) => acc + v, 0);
}

export default function ShortsChickensFiveMonthsPage() {
  const canonicalUrl = useMemo(() => `${window.location.origin}/shorts/cGT9jICNDBs`, []);

  const [m1, setM1] = useState<number>(0);
  const [m2, setM2] = useState<number>(0);
  const [m3, setM3] = useState<number>(0);
  const [m4, setM4] = useState<number>(0);
  const [m5, setM5] = useState<number>(0);

  const months = useMemo(() => [m1, m2, m3, m4, m5], [m1, m2, m3, m4, m5]);
  const total = useMemo(() => sum(months), [months]);

  const jsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
          headline: "Jumlah ayam selama 5 bulan (diagram)",
          description: "Masukkan data ayam per bulan untuk menghitung jumlah ayam selama 5 bulan.",
          author: { "@type": "Organization", name: "Cognizo" },
          publisher: { "@type": "Organization", name: "Cognizo" },
          datePublished: new Date().toISOString(),
        },
        {
          "@type": "VideoObject",
          name: "Diagram banyak ayam dalam 5 bulan",
          thumbnailUrl: [`https://img.youtube.com/vi/${YT_ID}/hqdefault.jpg`],
          uploadDate: new Date().toISOString(),
          embedUrl: `https://www.youtube-nocookie.com/embed/${YT_ID}`,
          contentUrl: YT_URL,
        },
      ],
    };
  }, [canonicalUrl]);

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 md:pt-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button asChild variant="outline">
            <Link to="/">Back</Link>
          </Button>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">Interaktif</Badge>
            <Badge variant="secondary">Soal diagram</Badge>
            <Button asChild variant="secondary">
              <a href={YT_URL} target="_blank" rel="noreferrer">
                Watch on YouTube
              </a>
            </Button>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Banyak ayam dalam 5 bulan</h1>
          <p className="text-muted-foreground leading-relaxed">
            Tentukan: <span className="font-medium">d) Jumlah ayam di peternakan selama 5 bulan</span>
          </p>
        </header>

        <Card className="p-5 md:p-6 space-y-5">
          <div className="space-y-1">
            <div className="font-semibold">Input data (isi sesuai diagram)</div>
            <div className="text-sm text-muted-foreground">Masukkan jumlah ayam per bulan (angka bulat).</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Bulan 1</div>
              <Input type="number" value={m1} onChange={(e) => setM1(Number(e.target.value || 0))} min={0} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Bulan 2</div>
              <Input type="number" value={m2} onChange={(e) => setM2(Number(e.target.value || 0))} min={0} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Bulan 3</div>
              <Input type="number" value={m3} onChange={(e) => setM3(Number(e.target.value || 0))} min={0} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Bulan 4</div>
              <Input type="number" value={m4} onChange={(e) => setM4(Number(e.target.value || 0))} min={0} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <div className="text-sm font-medium">Bulan 5</div>
              <Input type="number" value={m5} onChange={(e) => setM5(Number(e.target.value || 0))} min={0} />
            </div>
          </div>

          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="text-sm text-muted-foreground">Rumus</div>
            <div className="text-lg font-semibold mt-1">
              Total = Bulan1 + Bulan2 + Bulan3 + Bulan4 + Bulan5
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Total = {m1} + {m2} + {m3} + {m4} + {m5}
            </div>
            <div className="text-3xl font-bold mt-2">{total} ayam</div>
          </div>

          <div className="text-sm text-muted-foreground">
            Jika kamu kirim angka dari diagram (5 nilai per bulan), aku bisa isi otomatis dan tuliskan langkah pengerjaannya sesuai versi video.
          </div>
        </Card>
      </div>
    </div>
  );
}

