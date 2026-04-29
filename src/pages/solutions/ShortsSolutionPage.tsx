import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const heightsCm = [
  [131, 133, 140, 135, 134, 140, 132, 135, 147, 134],
  [133, 135, 138, 136, 132, 140, 144, 142, 150, 143],
  [139, 141, 143, 140, 137, 139, 141, 148, 146, 135],
];

function flattenHeights() {
  const flat: Array<{ value: number; row: number; col: number }> = [];
  heightsCm.forEach((row, r) => {
    row.forEach((v, c) => flat.push({ value: v, row: r + 1, col: c + 1 }));
  });
  return flat;
}

export default function ShortsSolutionPage() {
  const flat = useMemo(() => flattenHeights(), []);
  const max = useMemo(() => Math.max(...flat.map((x) => x.value)), [flat]);
  const top = useMemo(() => flat.find((x) => x.value === max) ?? null, [flat, max]);

  const canonicalUrl = useMemo(() => {
    // Safe: only used client-side.
    return `${window.location.origin}/shorts/oifgJ8l5Iik`;
  }, []);

  const jsonLd = useMemo(() => {
    if (!top) return null;
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
      headline: "Tinggi badan siswa kelas 5 — menentukan tinggi paling tinggi",
      datePublished: new Date().toISOString(),
      author: { "@type": "Organization", name: "Cognizo" },
      publisher: { "@type": "Organization", name: "Cognizo" },
      description: `Data tinggi siswa (kelas 5) dalam cm, mencari nilai maksimum. Jawaban: ${max} cm.`,
    };
  }, [canonicalUrl, max, top]);

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="outline">
            <Link to="/">Back</Link>
          </Button>
          <Button asChild variant="secondary">
            <a href="https://youtube.com/shorts/OifgJ8l5Iik" target="_blank" rel="noreferrer">
              Watch on YouTube
            </a>
          </Button>
        </div>

        {jsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        ) : null}

        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tinggi badan siswa kelas 5</h1>
          <p className="text-muted-foreground leading-relaxed">
            Dari video: <span className="font-medium">“Tinggi badan siswa kelas 5”</span>
          </p>
        </header>

        <Card className="p-5 md:p-6 space-y-4">
          <div className="space-y-1">
            <div className="font-semibold">Diketahui (tinggi badan dalam cm)</div>
            <div className="text-sm text-muted-foreground">Tabel 3 baris x 10 kolom</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <tbody>
                {heightsCm.map((row, r) => (
                  <tr key={r}>
                    {row.map((v, c) => (
                      <td
                        key={`${r}-${c}`}
                        className={[
                          "border px-3 py-2 whitespace-nowrap",
                          v === max ? "bg-primary/10 font-semibold" : "bg-background",
                        ].join(" ")}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">b) Berapa tinggi siswa yang paling tinggi?</div>
            <div>
              Tinggi paling tinggi adalah nilai maksimum dari seluruh data. Nilai maksimum yang muncul adalah <span className="font-bold">{max}</span>{" "}
              cm.
            </div>
            {top ? (
              <div className="text-sm text-muted-foreground">
                (Muncul pada baris {top.row}, kolom {top.col})
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  );
}

