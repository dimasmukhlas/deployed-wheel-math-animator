import { Link } from "react-router-dom";

const links = [
  { label: "YouTube", href: "https://www.youtube.com/@cognizodotnet" },
  { label: "dimasmukhlas.com", href: "https://dimasmukhlas.com" },
  { label: "notafra.id", href: "https://notafra.id" },
  { label: "codify.my.id", href: "https://codify.my.id" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-background/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] items-start">
          <div className="space-y-2">
            <div className="text-lg font-semibold tracking-tight">
              <span className="text-gradient">Cognizo</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              The learning platform — interactive activities and YouTube-based posts for math, logic, language, and
              practical explanations.
            </p>
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Cognizo. All rights reserved.
            </div>
          </div>

          <div className="md:justify-self-end">
            <div className="text-sm font-semibold mb-3">Links</div>
            <nav className="grid gap-2 text-sm">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-muted-foreground hover:text-foreground transition-colors underline decoration-transparent hover:decoration-primary/40 underline-offset-4"
                >
                  {l.label}
                </a>
              ))}
              <Link
                to="/youtube"
                className="text-muted-foreground hover:text-foreground transition-colors underline decoration-transparent hover:decoration-primary/40 underline-offset-4"
              >
                YouTube posts
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

