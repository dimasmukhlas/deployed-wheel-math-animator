import ShapeIndex from "@shape/pages/Index";
import FractionIndex from "@fraction/pages/Index";
import SpongeIndex from "@sponge/pages/Index";

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

export function CognizoSpongeApp() {
  return (
    <div className="subapp-sponge min-h-screen">
      <SpongeIndex />
    </div>
  );
}
