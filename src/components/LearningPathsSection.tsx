import { Fragment } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { LucideIcon } from "lucide-react";
import { GraduationCap, Route } from "lucide-react";
import type { LandingLang } from "@/lib/landing-lang";
import { cn } from "@/lib/utils";

export type LearningPathSubject = {
  id: string;
  title: string;
  intro: string;
  steps: readonly string[];
  Icon: LucideIcon;
};

type Props = {
  lang: LandingLang;
  title: string;
  lead: string;
  subjects: LearningPathSubject[];
  /** Small label above the title (e.g. grade level). */
  eyebrow?: string;
  /** Unique id for the section heading (a11y). */
  headingId?: string;
};

export function LearningPathsSection({
  lang,
  title,
  lead,
  subjects,
  eyebrow,
  headingId = "learning-paths-heading",
}: Props) {
  const pathLabel = lang === "id" ? "Jalur belajar" : "Learning path";
  const eyebrowText =
    eyebrow ?? (lang === "id" ? "Setelah permainan" : "After the games");

  return (
    <section className="max-w-5xl mx-auto mt-14 md:mt-20 scroll-mt-8" aria-labelledby={headingId}>
      <div className="relative rounded-3xl border border-border/60 bg-gradient-to-b from-muted/40 via-background/80 to-muted/30 p-6 md:p-10 overflow-hidden">
        {/* soft decorative orbs */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-secondary/15 blur-3xl"
          aria-hidden
        />

        <div className="relative text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 text-primary mb-3">
            <GraduationCap className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-widest">{eyebrowText}</span>
          </div>
          <h2 id={headingId} className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{lead}</p>
        </div>

        {/* Animated path overview (desktop) */}
        <div className="hidden md:flex items-stretch justify-center gap-0 mb-10 px-2 max-w-3xl mx-auto">
          {subjects.map((s, i) => (
            <Fragment key={s.id}>
              <div
                className={cn(
                  "flex flex-col items-center gap-2 w-[28%] min-w-[7rem]",
                  "animate-[landing-fade-up_0.6s_ease-out_both]"
                )}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="relative">
                  <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-35 [animation-duration:2.5s]" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/40 bg-background shadow-soft">
                    <s.Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-center text-foreground/90 line-clamp-2 leading-tight">
                  {s.title}
                </span>
              </div>
              {i < subjects.length - 1 && (
                <div
                  className="flex-1 min-w-[2rem] self-center h-1 mx-1 rounded-full bg-muted relative overflow-hidden"
                  aria-hidden
                >
                  <div className="absolute inset-0 landing-path-dash opacity-90" />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <div className="relative flex items-center gap-2 justify-center mb-6 md:hidden">
          <Route className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-medium text-muted-foreground">{pathLabel}</span>
        </div>

        <Accordion type="single" collapsible defaultValue={subjects[0]?.id} className="space-y-3">
          {subjects.map((s, i) => (
            <AccordionItem
              key={s.id}
              value={s.id}
              className={cn(
                "border rounded-2xl px-4 bg-card/70 backdrop-blur-sm shadow-sm overflow-hidden",
                "animate-[landing-fade-up_0.55s_ease-out_both]"
              )}
              style={{ animationDelay: `${200 + i * 90}ms` }}
            >
              <AccordionTrigger className="text-left hover:no-underline py-4 gap-3 [&>svg]:shrink-0">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <s.Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{s.title}</p>
                    <p className="text-sm text-muted-foreground font-normal mt-0.5 leading-snug">{s.intro}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-0">
                <div className="ml-[3.25rem] pl-4 border-l-2 border-primary/25 space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">{pathLabel}</p>
                  <ol className="space-y-3">
                    {s.steps.map((step, j) => (
                      <li key={j} className="flex gap-3 text-sm text-foreground/90 leading-relaxed">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary"
                          aria-hidden
                        >
                          {j + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
