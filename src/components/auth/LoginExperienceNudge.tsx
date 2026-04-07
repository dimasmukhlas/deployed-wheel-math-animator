import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import type { LandingLang } from "@/lib/landing-lang";
import { GUEST_PROGRESS_EVENT, getGuestWheelSessions } from "@/lib/guest-progress";
import { AuthDialog } from "./AuthDialog";
import { BookOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cognizo-login-nudge-dismissed-at";
const COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;

/** Bar fills toward this many guest sessions (soft goal). */
const PROGRESS_GOAL = 5;

const copy = {
  en: {
    progressTitle: "Your progress",
    body: "Save your learning and wheel history — sign in.",
    hintNone: "Try the wheel once — we’ll show your progress here.",
    hintSome: (n: number) =>
      `${n} practice session${n === 1 ? "" : "s"} on this device — sign in so you don’t lose them.`,
    logIn: "Log in",
    notNow: "Not now",
  },
  id: {
    progressTitle: "Kemajuanmu",
    body: "Simpan pengalaman belajar dan riwayat roda — masuk.",
    hintNone: "Coba Putaran Roda sekali — kemajuanmu akan tampil di sini.",
    hintSome: (n: number) =>
      `${n} sesi latihan di perangkat ini — masuk agar tidak hilang.`,
    logIn: "Masuk",
    notNow: "Nanti",
  },
} as const;

type Props = {
  lang: LandingLang;
  className?: string;
};

function shouldHideNudge(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const ts = Number.parseInt(raw, 10);
    if (Number.isNaN(ts)) return false;
    return Date.now() - ts <= COOLDOWN_MS;
  } catch {
    return false;
  }
}

export function LoginExperienceNudge({ lang, className }: Props) {
  const { user, loading } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [hidden, setHidden] = useState(shouldHideNudge);
  const [sessions, setSessions] = useState(getGuestWheelSessions);

  useEffect(() => {
    const sync = () => setSessions(getGuestWheelSessions());
    window.addEventListener(GUEST_PROGRESS_EVENT, sync);
    return () => window.removeEventListener(GUEST_PROGRESS_EVENT, sync);
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setHidden(true);
  };

  const t = copy[lang];
  const progressValue = Math.min((sessions / PROGRESS_GOAL) * 100, 100);

  if (loading || user || hidden) return null;

  return (
    <>
      <div
        role="dialog"
        aria-label={lang === "id" ? "Pengingat masuk" : "Login reminder"}
        className={cn(
          "fixed z-[100] bottom-4 right-4 max-w-[min(100vw-2rem,20rem)] rounded-xl border border-border/80 bg-card/95 backdrop-blur-md shadow-lg p-4 pr-10 text-sm text-foreground animate-in slide-in-from-bottom-4 fade-in duration-300",
          className
        )}
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-2 right-2 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          aria-label={t.notNow}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex gap-3">
          <div className="shrink-0 rounded-lg bg-primary/10 p-2 h-fit">
            <BookOpen className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <div className="space-y-3 min-w-0 pt-0.5 flex-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary/90">{t.progressTitle}</p>
              <Progress value={progressValue} className="mt-2 h-2" />
              <p className="text-[11px] text-muted-foreground mt-1.5 tabular-nums">
                {sessions >= PROGRESS_GOAL
                  ? lang === "id"
                    ? `${sessions} sesi di perangkat ini — target tercapai`
                    : `${sessions} sessions on this device — goal reached`
                  : lang === "id"
                    ? `${sessions} / ${PROGRESS_GOAL} sesi di perangkat ini`
                    : `${sessions} / ${PROGRESS_GOAL} sessions on this device`}
              </p>
            </div>
            <p className="leading-snug text-muted-foreground">{t.body}</p>
            <p className="text-xs text-muted-foreground/90 leading-snug">
              {sessions === 0 ? t.hintNone : t.hintSome(sessions)}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="gap-1.5" onClick={() => setDialogOpen(true)}>
                {t.logIn}
              </Button>
              <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={dismiss}>
                {t.notNow}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <AuthDialog open={dialogOpen} onOpenChange={setDialogOpen} lang={lang} />
    </>
  );
}
