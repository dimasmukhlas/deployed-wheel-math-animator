import slowpokeImg from "@sponge/assets/slowpoke-progress.png";
import slowbroImg from "@sponge/assets/slowbro-progress.png";
import slowkingImg from "@sponge/assets/slowking-progress.png";

export type PokeEvolutionStage = "slowpoke" | "slowbro" | "slowking";

interface ProgressBarProps {
  current: number;
  total: number;
  score: number;
  variant?: "sponge" | "slowpoke";
  /** Slowpoke line: which art to show on the marker. */
  evolution?: PokeEvolutionStage;
  /** Tap Slowpoke to evolve into Slowbro (once per quiz). */
  onPokeIconClick?: () => void;
}

const ProgressBar = ({
  current,
  total,
  score,
  variant = "slowpoke",
  evolution = "slowpoke",
  onPokeIconClick,
}: ProgressBarProps) => {
  const safeTotal = Math.max(1, total);
  const pct = Math.min(100, ((current + 1) / safeTotal) * 100);
  const frac = pct / 100;
  const label = `Question ${current + 1} of ${total}`;

  let src: string | null = null;
  let sizeClass = "h-[3.25rem] w-[3.25rem]";
  if (variant === "slowpoke") {
    if (evolution === "slowking") {
      src = slowkingImg;
      sizeClass = "h-[4rem] w-[4rem]";
    } else if (evolution === "slowbro") {
      src = slowbroImg;
      sizeClass = "h-[3.75rem] w-[3.75rem]";
    } else {
      src = slowpokeImg;
    }
  }

  const showPoke = variant === "slowpoke" && src;
  const clickable = variant === "slowpoke" && evolution === "slowpoke" && typeof onPokeIconClick === "function";

  const padRem = evolution === "slowking" ? 2 : 1.625;
  const spanRem = evolution === "slowking" ? 4 : 3.25;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-spongeDisplay text-lg text-foreground">{label}</span>
        <span className="font-spongeDisplay text-lg text-primary px-3 py-1 bg-primary/20 rounded-full">
          ⭐ {score}
        </span>
      </div>

      <div
        className="relative px-7 pt-1 pb-0"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={label}
      >
        <div className="relative min-h-[4.5rem]">
          {/* Track */}
          <div className="absolute bottom-2 left-0 right-0 h-3 rounded-full bg-muted/90 border-2 border-foreground/15 shadow-inner overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-700 ease-out ${
                variant === "slowpoke"
                  ? evolution === "slowking"
                    ? "bg-gradient-to-r from-amber-200 via-fuchsia-300 to-violet-400"
                    : "bg-gradient-to-r from-pink-200 via-pink-300 to-fuchsia-400"
                  : "bg-primary"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* Marker */}
          <div
            className="absolute bottom-[0.85rem] z-10 flex -translate-x-1/2 items-center justify-center transition-[left] duration-700 ease-out drop-shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
            style={{
              left: `calc(${padRem}rem + (100% - ${spanRem}rem) * ${frac})`,
            }}
          >
            {showPoke ? (
              clickable ? (
                <button
                  type="button"
                  onClick={onPokeIconClick}
                  className={`poke-evolve-hit relative flex items-center justify-center rounded-full border-2 border-transparent bg-primary-foreground/10 p-0.5 transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${sizeClass}`}
                  aria-label="Evolve into Slowbro"
                >
                  <span key={evolution} className="poke-evolve-swap flex h-full w-full items-center justify-center">
                    <img src={src!} alt="" className="max-h-full max-w-full object-contain select-none" draggable={false} />
                  </span>
                </button>
              ) : (
                <div className={`pointer-events-none relative flex items-center justify-center ${sizeClass}`}>
                  <span key={evolution} className="poke-evolve-swap flex h-full w-full items-center justify-center">
                    <img src={src!} alt="" className="max-h-full max-w-full object-contain select-none" draggable={false} />
                  </span>
                </div>
              )
            ) : (
              <div className="pointer-events-none flex h-[3.25rem] w-[3.25rem] items-center justify-center">
                <span className="text-4xl leading-none" aria-hidden>
                  🍍
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
