import ShapeIndex from "@shape/pages/Index";
import FractionIndex from "@fraction/pages/Index";
import LanguageQuizIndex from "@sponge/pages/Index";

/** Shape explorer — geometry “app” inside the wheel shell (same bundle, scoped styles). */
export function CognizoShapeApp() {
  return (
    <div className="subapp-shape min-h-screen">
      <ShapeIndex />
    </div>
  );
}

export function CognizoFractionApp() {
  return (
    <div className="subapp-fraction min-h-screen">
      <FractionIndex embed />
    </div>
  );
}

/** Bahasa Indonesia + language quizzes — Slowpoke / Pokémon-air theme (replaces SpongeBob). */
export function CognizoSlowpokeApp() {
  return (
    <div className="subapp-sponge min-h-screen">
      <LanguageQuizIndex variant="slowpoke" />
    </div>
  );
}
