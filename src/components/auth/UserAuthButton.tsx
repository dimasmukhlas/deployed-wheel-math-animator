import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import type { LandingLang } from "@/lib/landing-lang";
import { getAuthCopy } from "@/lib/auth-copy";
import { AuthDialog } from "./AuthDialog";
import { GoogleIcon } from "./GoogleIcon";
import { Loader2, LogIn, LogOut, User } from "lucide-react";

type Props = {
  lang: LandingLang;
};

function googleErrorToast(lang: LandingLang, code: string) {
  if (code === "auth/popup-closed-by-user") return;
  if (code === "auth/popup-blocked") {
    toast.error(
      lang === "id"
        ? "Popup diblokir. Izinkan popup untuk situs ini."
        : "Popup blocked. Allow popups for this site."
    );
    return;
  }
  if (code === "auth/unauthorized-domain") {
    toast.error(
      lang === "id"
        ? "Domain belum diizinkan di Firebase Console."
        : "Domain not allowed in Firebase Console."
    );
    return;
  }
  toast.error(lang === "id" ? "Gagal masuk dengan Google." : "Google sign-in failed.");
}

export function UserAuthButton({ lang }: Props) {
  const t = getAuthCopy(lang);
  const { user, loading, logout, signInGoogle } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2 shrink-0">
        <User className="h-4 w-4 opacity-50" />
        …
      </Button>
    );
  }

  if (!user) {
    const handleGoogleHeader = () => {
      setGoogleBusy(true);
      signInGoogle()
        .catch((err: unknown) => {
          const code =
            err && typeof err === "object" && "code" in err ? String((err as { code?: string }).code) : "";
          googleErrorToast(lang, code);
        })
        .finally(() => setGoogleBusy(false));
    };

    return (
      <>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            size="sm"
            className="gap-2 shrink-0 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:bg-card dark:text-foreground dark:border-border dark:hover:bg-muted"
            onClick={handleGoogleHeader}
            disabled={googleBusy}
            aria-label={t.withGoogle}
          >
            {googleBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="shrink-0" />}
            <span className="hidden sm:inline">{t.googleShort}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 shrink-0"
            onClick={() => setDialogOpen(true)}
            disabled={googleBusy}
          >
            <LogIn className="h-4 w-4" />
            {t.logInWithEmail}
          </Button>
        </div>
        <AuthDialog open={dialogOpen} onOpenChange={setDialogOpen} lang={lang} />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 max-w-[min(100%,220px)] shrink-0">
          <User className="h-4 w-4 shrink-0" />
          <span className="truncate text-xs sm:text-sm">{user.email ?? t.account}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => {
            void logout();
          }}
          className="gap-2 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          {t.logOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
