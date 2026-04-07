import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { fetchRecentRecords, type StoredRecord } from "@/lib/records";
import type { LandingLang } from "@/lib/landing-lang";
import { getAuthCopy } from "@/lib/auth-copy";
import { format } from "date-fns";
import { History, Loader2 } from "lucide-react";

type Props = {
  lang: LandingLang;
};

export function RecentRecordsCard({ lang }: Props) {
  const t = getAuthCopy(lang);
  const { user, loading: authLoading } = useAuth();
  const [records, setRecords] = useState<StoredRecord[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading || !user) {
      setRecords(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchRecentRecords(user.uid)
      .then((r) => {
        if (!cancelled) setRecords(r);
      })
      .catch(() => {
        if (!cancelled) setRecords([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  if (authLoading || !user) return null;

  return (
    <Card className="glass-card border border-primary/15 max-w-4xl mx-auto mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          {t.recentTitle}
        </CardTitle>
        <CardDescription>{t.dialogLead}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.saving}
          </div>
        ) : !records?.length ? (
          <p className="text-sm text-muted-foreground py-2">{t.recentEmpty}</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {records.map((rec) => (
              <li
                key={rec.id}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2"
              >
                <span className="font-medium text-foreground">
                  {rec.app === "wheel" && rec.wheel ? (
                    <>
                      {t.wheelLabel}: r={rec.wheel.radiusCm} cm, {rec.wheel.distanceM} m →{" "}
                      {rec.wheel.rotations.toFixed(2)} {lang === "id" ? "putaran" : "rot."}
                    </>
                  ) : (
                    rec.type
                  )}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {rec.createdAt
                    ? format(rec.createdAt.toDate(), lang === "id" ? "d MMM yyyy, HH:mm" : "MMM d yyyy, h:mm a")
                    : "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
