import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import type { LandingLang } from "@/lib/landing-lang";
import { getAuthCopy } from "@/lib/auth-copy";
import { Loader2 } from "lucide-react";
import { GoogleIcon } from "./GoogleIcon";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: LandingLang;
};

export function AuthDialog({ open, onOpenChange, lang }: Props) {
  const t = getAuthCopy(lang);
  const { signInEmail, signUpEmail, signInGoogle } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError(lang === "id" ? "Kata sandi minimal 6 karakter." : "Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        await signInEmail(email, password);
      } else {
        await signUpEmail(email, password);
      }
      resetForm();
      onOpenChange(false);
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? String((err as { code?: string }).code) : "";
      if (code === "auth/email-already-in-use") {
        setError(lang === "id" ? "Email sudah terdaftar. Coba masuk." : "Email already in use. Try signing in.");
      } else if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError(lang === "id" ? "Email atau kata sandi salah." : "Invalid email or password.");
      } else if (code === "auth/invalid-email") {
        setError(lang === "id" ? "Format email tidak valid." : "Invalid email address.");
      } else {
        setError(lang === "id" ? "Terjadi kesalahan. Coba lagi." : "Something went wrong. Try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      await signInGoogle();
      resetForm();
      onOpenChange(false);
    } catch (err: unknown) {
      const code = err && typeof err === "object" && "code" in err ? String((err as { code?: string }).code) : "";
      if (code === "auth/popup-closed-by-user") {
        setError(null);
      } else if (code === "auth/popup-blocked") {
        setError(
          lang === "id"
            ? "Popup diblokir. Izinkan popup untuk situs ini atau coba lagi."
            : "Popup was blocked. Allow popups for this site or try again."
        );
      } else if (code === "auth/unauthorized-domain") {
        setError(
          lang === "id"
            ? "Domain ini belum diizinkan di Firebase (Authentication → Settings)."
            : "This domain is not authorized in Firebase (Authentication → Settings)."
        );
      } else {
        setError(lang === "id" ? "Gagal masuk dengan Google." : "Google sign-in failed.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t.dialogTitle}</DialogTitle>
          <DialogDescription>{t.dialogLead}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 border-border/80 bg-background hover:bg-muted/80"
            onClick={handleGoogle}
            disabled={busy}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon className="shrink-0" />}
            {t.withGoogle}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="auth-email">{t.email}</Label>
              <Input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-password">{t.password}</Label>
              <Input
                id="auth-password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={busy}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {mode === "signin" ? t.signIn : t.signUp}
            </Button>
          </form>

          <button
            type="button"
            className="text-sm text-primary underline-offset-4 hover:underline w-full text-center"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
          >
            {mode === "signin" ? t.needAccount : t.haveAccount}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
