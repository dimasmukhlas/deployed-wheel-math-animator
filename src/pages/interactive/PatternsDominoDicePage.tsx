import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { youtubeIdFromUrl, youtubeThumbUrl } from "@/lib/youtube";

const YT_URL = "https://youtu.be/Hvr6i6v3uwA";
const YT_ID = youtubeIdFromUrl(YT_URL) ?? "Hvr6i6v3uwA";

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

function renderDominoChain(params: { start: number; step: number; lengthDomino: number }) {
  const { start, step, lengthDomino } = params;
  // We model a straight domino line as consecutive dominoes:
  // Domino 1: (a0, a1), Domino 2: (a1, a2), ... Domino L: (a_{L-1}, a_L)
  // Where a_k = start + k*step
  const values = Array.from({ length: lengthDomino + 1 }, (_, k) => start + k * step);
  const dominoes = Array.from({ length: lengthDomino }, (_, i) => ({
    left: values[i],
    right: values[i + 1],
  }));
  const rightEnd = values[values.length - 1];
  const sumAllNumbers = values.reduce((acc, v) => acc + v, 0);
  return { values, dominoes, rightEnd, sumAllNumbers };
}

function valueAtSquare(params: { start: number; step: number; row: number; col: number }) {
  const { start, step, row, col } = params;
  // Square pattern (grid): value at (r,c) = start + step*(r + c - 2)
  return start + step * (row + col - 2);
}

export default function PatternsDominoDicePage() {
  // Domino straight-line pattern controls
  const [domStart, setDomStart] = useState(1);
  const [domStep, setDomStep] = useState(1);
  const [domLength, setDomLength] = useState(5); // number of dominoes on the line

  // Square pattern controls
  const [sqSize, setSqSize] = useState(6); // NxN
  const [sqStart, setSqStart] = useState(1);
  const [sqStep, setSqStep] = useState(1);
  const [sqQueryRow, setSqQueryRow] = useState(3);
  const [sqQueryCol, setSqQueryCol] = useState(4);

  const domino = useMemo(() => {
    const start = domStart;
    const step = domStep;
    const lengthDomino = clampInt(domLength, 1, 12);
    return renderDominoChain({ start, step, lengthDomino });
  }, [domStart, domStep, domLength]);

  const square = useMemo(() => {
    const size = clampInt(sqSize, 2, 12);
    const row = clampInt(sqQueryRow, 1, size);
    const col = clampInt(sqQueryCol, 1, size);
    return { size, row, col, value: valueAtSquare({ start: sqStart, step: sqStep, row, col }) };
  }, [sqSize, sqQueryRow, sqQueryCol, sqStart, sqStep]);

  const cover = useMemo(() => youtubeThumbUrl(YT_ID, "hq"), []);

  const canonicalUrl = useMemo(() => {
    return `${window.location.origin}/interact/pola-bilangan-domino-dan-persegi`;
  }, []);

  const jsonLd = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
          headline: "Pola bilangan garis lurus pada kartu domino & pola persegi pada dadu dan domino",
          description:
            "Halaman interaktif untuk membahas pola bilangan garis lurus pada kartu domino dan pola bilangan persegi pada dadu/kartu domino.",
          image: [cover],
          author: { "@type": "Organization", name: "Cognizo" },
          publisher: { "@type": "Organization", name: "Cognizo" },
        },
        {
          "@type": "VideoObject",
          name: "Pola bilangan garis lurus pada kartu domino & pola persegi pada dadu dan kartu domino",
          thumbnailUrl: [cover],
          uploadDate: new Date().toISOString(),
          embedUrl: `https://www.youtube-nocookie.com/embed/${YT_ID}`,
          contentUrl: `https://youtu.be/${YT_ID}`,
        },
      ],
    };
  }, [canonicalUrl, cover]);

  return (
    <div className="min-h-screen pb-20 px-4 pt-6 md:pt-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Button asChild variant="outline" className="w-fit">
            <Link to="/">Back</Link>
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Interaktif</Badge>
            <Badge variant="secondary">Pola bilangan</Badge>
          </div>
        </div>

        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Pola Bilangan: Garis Lurus (Domino) & Persegi (Dadu/Domino)
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Praktikkan cara berpikir pola bilangan dengan simulasi domino garis lurus dan pola bilangan persegi.
          </p>
        </header>

        <Card className="overflow-hidden">
          <div className="aspect-video bg-muted relative">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${YT_ID}`}
              title="Video Pola bilangan garis lurus pada kartu domino & pola persegi pada dadu dan kartu domino"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-background/0 to-transparent pointer-events-none" />
          </div>
        </Card>

        {jsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        ) : null}

        <Tabs defaultValue="domino" className="w-full">
          <TabsList>
            <TabsTrigger value="domino">Garis lurus domino</TabsTrigger>
            <TabsTrigger value="square">Persegi dadu/domino</TabsTrigger>
          </TabsList>

          <TabsContent value="domino">
            <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Pola bilangan garis lurus pada kartu domino</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Model sederhana: susun domino sebagai rantai berurutan. Nilai di setiap ujung bertemu sehingga membentuk barisan
                  aritmetika.
                </p>

                <Card className="p-4 md:p-6">
                  <div className="flex flex-wrap gap-2 items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Parameter</div>
                      <div className="text-xs text-muted-foreground">
                        Nilai urut: a<sub>k</sub> = {domino.values[0]} + k*{domStep}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Mulai (start)</div>
                      <Input
                        type="number"
                        value={domStart}
                        onChange={(e) => setDomStart(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Selisih (step)</div>
                      <Input
                        type="number"
                        value={domStep}
                        onChange={(e) => setDomStep(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Jumlah domino (L)</div>
                      <Input
                        type="number"
                        value={domLength}
                        onChange={(e) => setDomLength(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="text-sm font-medium mb-2">Simulasi rantai domino</div>
                    <div className="flex flex-wrap gap-3 items-center">
                      {domino.dominoes.map((d, i) => (
                        <div
                          key={i}
                          className="min-w-[90px] rounded-xl border bg-background/70 px-3 py-2 shadow-sm"
                        >
                          <div className="text-xs text-muted-foreground mb-1">Domino {i + 1}</div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold">{d.left}</div>
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">|</div>
                            <div className="font-semibold">{d.right}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border p-3 bg-muted/20">
                        <div className="text-xs text-muted-foreground">Ujung kanan (a<sub>L</sub>)</div>
                        <div className="text-2xl font-bold">{domino.rightEnd}</div>
                      </div>
                      <div className="rounded-lg border p-3 bg-muted/20">
                        <div className="text-xs text-muted-foreground">Jumlah semua angka pada barisan (a<sub>0</sub> ... a<sub>L</sub>)</div>
                        <div className="text-2xl font-bold">{domino.sumAllNumbers}</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-4 md:p-6 space-y-4">
                <h3 className="text-lg font-semibold tracking-tight">Rumus cepat</h3>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Jika barisan aritmetika: a<sub>k</sub> = start + k*step
                  <ul className="mt-2 space-y-2 list-disc pl-5">
                    <li>
                      Ujung kanan: a<sub>L</sub> = start + L*step
                    </li>
                    <li>
                      Jumlah barisan: (L+1)*start + step * L*(L+1)/2
                    </li>
                  </ul>
                </div>
                <p className="text-xs text-muted-foreground">
                  Sesuaikan start/step/L di parameter untuk melihat efeknya.
                </p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="square">
            <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Pola bilangan persegi pada dadu dan kartu domino</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Model sederhana pola “diagonal”: nilai di kotak (r,c) = start + step*(r + c − 2).
                  Anda bisa pakai ini sebagai latihan pola bilangan persegi.
                </p>

                <Card className="p-4 md:p-6">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Ukuran (N x N)</div>
                      <Input type="number" value={sqSize} onChange={(e) => setSqSize(Number(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Start</div>
                      <Input type="number" value={sqStart} onChange={(e) => setSqStart(Number(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Step</div>
                      <Input type="number" value={sqStep} onChange={(e) => setSqStep(Number(e.target.value))} />
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
                    <div>
                      <div className="text-sm font-medium mb-2">Tabel N x N</div>
                      <div className="inline-block overflow-auto max-w-full">
                        <div className="grid gap-px bg-muted rounded-lg p-1" style={{ gridTemplateColumns: `repeat(${square.size}, minmax(46px, 1fr))` }}>
                          {Array.from({ length: square.size }).map((_, r) =>
                            Array.from({ length: square.size }).map((__, c) => {
                              const row = r + 1;
                              const col = c + 1;
                              const v = valueAtSquare({ start: sqStart, step: sqStep, row, col });
                              const isHit = row === square.row && col === square.col;
                              return (
                                <div
                                  key={`${r}-${c}`}
                                  className={[
                                    "bg-background px-2 py-2 text-center text-sm font-medium",
                                    "flex items-center justify-center",
                                    isHit ? "bg-primary/10 border-2 border-primary" : "border border-transparent",
                                  ].join(" ")}
                                >
                                  {v}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 min-w-[220px]">
                      <div className="text-sm font-medium">Cari nilai kotak (r,c)</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Baris (r)</div>
                          <Input type="number" value={sqQueryRow} onChange={(e) => setSqQueryRow(Number(e.target.value))} />
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Kolom (c)</div>
                          <Input type="number" value={sqQueryCol} onChange={(e) => setSqQueryCol(Number(e.target.value))} />
                        </div>
                      </div>
                      <div className="rounded-lg border p-3 bg-muted/20">
                        <div className="text-xs text-muted-foreground">Nilai di (r={square.row}, c={square.col})</div>
                        <div className="text-2xl font-bold">{square.value}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 text-xs text-muted-foreground">
                    Catatan: beberapa video/persoalan bisa memakai definisi pola persegi yang berbeda.
                    Kalau Anda punya definisi persisnya, kirim detail soalnya supaya polanya bisa disesuaikan.
                  </div>
                </Card>
              </div>

              <Card className="p-4 md:p-6 space-y-4">
                <h3 className="text-lg font-semibold tracking-tight">Rumus cepat</h3>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  v(r,c) = start + step*(r + c − 2)
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Untuk membentuk pola persegi/dadu di soal, biasanya langkahnya:
                  <ol className="mt-2 space-y-2 list-decimal pl-5">
                    <li>Tentukan start pada kotak kiri-atas</li>
                    <li>Periksa kenaikan nilai tiap “geser” baris/kolom</li>
                    <li>Buat rumus nilai (r,c)</li>
                  </ol>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

