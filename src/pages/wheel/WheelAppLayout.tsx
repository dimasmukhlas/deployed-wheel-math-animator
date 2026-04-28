import { useEffect } from "react";
import { Outlet, NavLink, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Home, Circle, Shapes, PieChart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAuthButton } from "@/components/auth/UserAuthButton";
import type { LandingLang } from "@/lib/landing-lang";
import { cn } from "@/lib/utils";

const hubLang: LandingLang = "id";

const activities = [
  { to: "/wheel", label: "Roda", icon: Circle, end: true as const },
  { to: "/wheel/shape", label: "Bentuk", icon: Shapes, end: false as const },
  { to: "/wheel/fraction", label: "Pecahan", icon: PieChart, end: false as const },
  { to: "/wheel/slowpoke", label: "Slowpoke", icon: Languages, end: false as const },
];

/**
 * Cognizo “wheel” shell: one integrated SPA with real paths (no ?tab=).
 * Child routes render wheel rotation, shape, fraction, or language lab (Slowpoke).
 */
const TAB_QUERY_MAP: Record<string, string> = {
  wheel: "/wheel",
  shape: "/wheel/shape",
  fraction: "/wheel/fraction",
  slowpoke: "/wheel/slowpoke",
  sponge: "/wheel/slowpoke",
};

const WheelAppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const t = searchParams.get("tab");
    if (!t || !TAB_QUERY_MAP[t]) return;
    navigate(TAB_QUERY_MAP[t], { replace: true });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-[100] border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-5xl mx-auto px-4 pt-3 pb-2 flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground shrink-0" asChild>
            <Link to="/">
              <Home className="w-4 h-4" />
              Beranda
            </Link>
          </Button>
          <UserAuthButton lang={hubLang} />
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-3">
          <p className="text-xs text-muted-foreground mb-2 text-center sm:text-left">
            Cognizo Wheel — belajar dengan putaran, bentuk, dan permainan
          </p>
          <nav className="flex flex-nowrap gap-1.5 overflow-x-auto pb-1" aria-label="Aktivitas">
            {activities.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-1.5 shrink-0 rounded-md border px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative" key={location.pathname}>
        <Outlet />
      </main>
    </div>
  );
};

export default WheelAppLayout;
