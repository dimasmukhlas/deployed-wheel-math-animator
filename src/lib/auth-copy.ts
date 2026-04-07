import type { LandingLang } from "@/lib/landing-lang";

export function getAuthCopy(lang: LandingLang) {
  if (lang === "id") {
    return {
      logIn: "Masuk",
      logOut: "Keluar",
      account: "Akun",
      email: "Email",
      password: "Kata sandi",
      signIn: "Masuk",
      signUp: "Daftar",
      withGoogle: "Lanjutkan dengan Google",
      googleShort: "Google",
      logInWithEmail: "Email",
      needAccount: "Belum punya akun? Daftar",
      haveAccount: "Sudah punya akun? Masuk",
      dialogTitle: "Masuk ke Cognizo",
      dialogLead: "Simpan riwayat latihan roda dan aktivitas ke cloud.",
      saving: "Menyimpan…",
      recordSaved: "Riwayat putaran tersimpan.",
      recentTitle: "Riwayat terbaru",
      recentEmpty: "Belum ada riwayat. Mainkan Putaran Roda saat sudah masuk.",
      wheelLabel: "Putaran roda",
    };
  }
  return {
    logIn: "Log in",
    logOut: "Log out",
    account: "Account",
    email: "Email",
    password: "Password",
    signIn: "Sign in",
    signUp: "Sign up",
    withGoogle: "Continue with Google",
    googleShort: "Google",
    logInWithEmail: "Email",
    needAccount: "Need an account? Sign up",
    haveAccount: "Already have an account? Sign in",
    dialogTitle: "Sign in to Cognizo",
    dialogLead: "Save your wheel sessions and activity history to the cloud.",
    saving: "Saving…",
    recordSaved: "Rotation saved to your account.",
    recentTitle: "Recent activity",
    recentEmpty: "No records yet. Run the wheel animation while signed in.",
    wheelLabel: "Wheel session",
  };
}
