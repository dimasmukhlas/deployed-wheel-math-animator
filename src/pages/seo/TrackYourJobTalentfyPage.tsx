import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LEGACY_PATH = "/2026/01/track-your-job-with-jejak-talenta.html";

function upsertMetaByName(name: string, content: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function TrackYourJobTalentfyPage() {
  useEffect(() => {
    const title = "Track your job with Talentfy.ink";
    document.title = title;

    upsertMetaByName(
      "description",
      "Track your job search in one place with Talentfy.ink — applications, follow-ups, outcomes, and notes."
    );

    const canonical =
      typeof window !== "undefined"
        ? `${window.location.origin}${LEGACY_PATH}`
        : `https://cognizo.net${LEGACY_PATH}`;
    upsertCanonical(canonical);
  }, []);

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-2">
          <p className="text-sm text-muted-foreground">Legacy indexed page</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Track your job with Talentfy.ink</h1>
          <p className="text-muted-foreground leading-relaxed">
            If you landed here from an old indexed link, this page now points you to{" "}
            <a
              className="underline text-primary hover:text-primary/90"
              href="https://talentfy.ink"
              target="_blank"
              rel="noopener noreferrer"
            >
              talentfy.ink
            </a>{" "}
            — a simple way to track your job applications and follow-ups.
          </p>
        </header>

        <Card className="border bg-gradient-to-br from-sky-500/10 to-indigo-500/5">
          <CardHeader className="pb-3">
            <CardTitle>What you can do with Talentfy.ink</CardTitle>
            <CardDescription>A lightweight tracker for your job hunt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
              <li>Record job applications (company, role, date, source).</li>
              <li>Track each stage (applied → interview → offer → outcome).</li>
              <li>Keep notes, links, and follow-up reminders in one place.</li>
              <li>Review your progress and spot what’s working.</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="sm:shrink-0">
                <a href="https://talentfy.ink" target="_blank" rel="noopener noreferrer">
                  Open Talentfy.ink
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link to="/">Back to Cognizo</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          URL preserved for search engines: <span className="font-mono">{LEGACY_PATH}</span>
        </p>
      </div>
    </main>
  );
}

