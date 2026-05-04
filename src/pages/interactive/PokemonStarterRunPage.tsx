import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Starter = "charmander" | "bulbasaur" | "squirtle";

const EVOLUTION_NAMES: Record<Starter, [string, string, string]> = {
  charmander: ["Charmander", "Charmeleon", "Charizard"],
  bulbasaur: ["Bulbasaur", "Ivysaur", "Venusaur"],
  squirtle: ["Squirtle", "Wartortle", "Blastoise"],
};

const PALETTE: Record<
  Starter,
  { body: string; accent: string; dark: string }
> = {
  charmander: { body: "#f97316", accent: "#fbbf24", dark: "#c2410c" },
  bulbasaur: { body: "#22c55e", accent: "#86efac", dark: "#166534" },
  squirtle: { body: "#38bdf8", accent: "#7dd3fc", dark: "#0369a1" },
};

type Entity = { kind: "cactus" | "candy"; x: number; y: number; w: number; h: number; collected?: boolean };

function evolutionStage(candy: number): 0 | 1 | 2 {
  if (candy >= 100) return 2;
  if (candy >= 50) return 1;
  return 0;
}

function playerSize(stage: 0 | 1 | 2): { w: number; h: number } {
  if (stage === 0) return { w: 44, h: 40 };
  if (stage === 1) return { w: 52, h: 46 };
  return { w: 60, h: 52 };
}

export default function PokemonStarterRunPage() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [starter, setStarter] = useState<Starter | null>(null);
  const [uiPhase, setUiPhase] = useState<"pick" | "playing" | "over">("pick");
  const [candyCount, setCandyCount] = useState(0);
  const [bestCandy, setBestCandy] = useState(0);

  const gameRef = useRef({
    starter: null as Starter | null,
    candy: 0,
    vy: 0,
    py: 0,
    groundY: 0,
    entities: [] as Entity[],
    spawnTimer: 0,
    nextSpawn: 90,
    speed: 5.5,
    running: false,
    width: 800,
    height: 280,
    prevStage: 0 as 0 | 1 | 2,
  });

  const drawPlayer = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      st: Starter,
      stage: 0 | 1 | 2
    ) => {
      const { w, h } = playerSize(stage);
      const p = PALETTE[st];
      ctx.save();
      ctx.translate(x, y);

      // body
      ctx.fillStyle = p.body;
      const r = 10;
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(w - r, 0);
      ctx.quadraticCurveTo(w, 0, w, r);
      ctx.lineTo(w, h - r);
      ctx.quadraticCurveTo(w, h, w - r, h);
      ctx.lineTo(r, h);
      ctx.quadraticCurveTo(0, h, 0, h - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = p.dark;
      ctx.lineWidth = 2;
      ctx.stroke();

      // simple face
      ctx.fillStyle = "#1e293b";
      const eyeY = h * 0.35;
      ctx.fillRect(w * 0.22, eyeY, 6, 6);
      ctx.fillRect(w * 0.62, eyeY, 6, 6);
      ctx.fillStyle = p.accent;
      if (st === "charmander") {
        ctx.beginPath();
        ctx.moveTo(w + 4, h * 0.25);
        ctx.lineTo(w + 18 + stage * 4, h * 0.45);
        ctx.lineTo(w + 4, h * 0.55);
        ctx.fill();
      } else if (st === "bulbasaur") {
        ctx.beginPath();
        ctx.arc(w * 0.5, -6 - stage * 2, 10 + stage * 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = p.dark;
        const sx = -4 - stage;
        const sy = h * 0.35;
        const sw = 8 + stage;
        const sh = 14 + stage * 2;
        ctx.fillRect(sx, sy, sw, sh);
      }

      ctx.restore();
    },
    []
  );

  const drawCactus = (ctx: CanvasRenderingContext2D, e: Entity) => {
    const { x, y, w, h } = e;
    ctx.fillStyle = "#15803d";
    ctx.fillRect(x + w * 0.4, y, w * 0.2, h);
    ctx.fillRect(x, y + h * 0.35, w * 0.35, h * 0.2);
    ctx.fillRect(x + w * 0.65, y + h * 0.25, w * 0.35, h * 0.18);
    ctx.fillStyle = "#166534";
    ctx.strokeRect(x + w * 0.4, y, w * 0.2, h);
  };

  const drawCandy = (ctx: CanvasRenderingContext2D, e: Entity) => {
    const cx = e.x + e.w / 2;
    const cy = e.y + e.h / 2;
    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.arc(cx - 8, cy, 10, 0, Math.PI * 2);
    ctx.arc(cx + 8, cy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fce7f3";
    ctx.fillRect(cx - 4, cy - 12, 8, 24);
  };

  useEffect(() => {
    if (!starter || uiPhase !== "playing") return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const g = gameRef.current;
    g.starter = starter;
    g.candy = 0;
    g.vy = 0;
    g.entities = [];
    g.spawnTimer = 0;
    g.nextSpawn = 70;
    g.speed = 5.5;
    g.running = true;
    g.prevStage = 0;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(320, Math.floor(rect.width));
      const h = 280;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.width = w;
      g.height = h;
      g.groundY = h - 56;
      g.py = g.groundY - playerSize(0).h;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const gravity = 0.65;
    const jumpV = -12.5;
    const px = 72;

    const rectsOverlap = (
      ax: number,
      ay: number,
      aw: number,
      ah: number,
      bx: number,
      by: number,
      bw: number,
      bh: number
    ) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

    const spawnEntity = () => {
      const roll = Math.random();
      if (roll < 0.42) {
        const ch = 22 + Math.random() * 10;
        const cw = 18;
        const lift = 55 + Math.random() * 55;
        g.entities.push({
          kind: "candy",
          x: g.width + 20,
          y: g.groundY - lift - ch,
          w: cw,
          h: ch,
        });
      } else {
        const ch = 48 + Math.random() * 18;
        const cw = 26 + Math.random() * 10;
        g.entities.push({
          kind: "cactus",
          x: g.width + 16,
          y: g.groundY - ch,
          w: cw,
          h: ch,
        });
      }
    };

    const jump = () => {
      if (!g.running) return;
      const st = evolutionStage(g.candy);
      const { h } = playerSize(st);
      if (g.py >= g.groundY - h - 1) g.vy = jumpV;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", onPointerDown, { passive: false });

    let raf = 0;
    let frame = 0;
    const loop = () => {
      if (!g.running) return;
      frame++;

      const stage = evolutionStage(g.candy);
      const { w: pw, h: ph } = playerSize(stage);

      if (stage !== g.prevStage) {
        g.prevStage = stage;
        const nh = playerSize(stage).h;
        if (g.py + nh > g.groundY) g.py = g.groundY - nh;
      }

      g.vy += gravity;
      g.py += g.vy;
      if (g.py + ph > g.groundY) {
        g.py = g.groundY - ph;
        g.vy = 0;
      }

      g.spawnTimer++;
      if (g.spawnTimer >= g.nextSpawn) {
        g.spawnTimer = 0;
        g.nextSpawn = 55 + Math.random() * 55;
        spawnEntity();
      }

      g.speed = Math.min(11, 5.5 + g.candy * 0.012);

      for (const e of g.entities) {
        e.x -= g.speed;
      }
      g.entities = g.entities.filter((e) => e.x + e.w > -20);

      const playerY = g.py;
      for (const e of g.entities) {
        if (e.kind === "cactus") {
          if (rectsOverlap(px, playerY, pw, ph, e.x, e.y, e.w, e.h)) {
            g.running = false;
            setCandyCount(g.candy);
            setBestCandy((b) => Math.max(b, g.candy));
            setUiPhase("over");
            return;
          }
        } else if (!e.collected && rectsOverlap(px, playerY, pw, ph, e.x, e.y, e.w, e.h)) {
          e.collected = true;
          g.candy += 1;
          setCandyCount(g.candy);
        }
      }

      ctx.clearRect(0, 0, g.width, g.height);
      const sky = ctx.createLinearGradient(0, 0, 0, g.groundY);
      sky.addColorStop(0, "#bae6fd");
      sky.addColorStop(1, "#e0f2fe");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, g.width, g.groundY);

      ctx.fillStyle = "#cbd5e1";
      ctx.fillRect(0, g.groundY, g.width, g.height - g.groundY);
      ctx.strokeStyle = "#94a3b8";
      ctx.beginPath();
      ctx.moveTo(0, g.groundY);
      ctx.lineTo(g.width, g.groundY);
      ctx.stroke();

      for (const e of g.entities) {
        if (e.kind === "cactus") drawCactus(ctx, e);
        else if (!e.collected) drawCandy(ctx, e);
      }

      if (g.starter) drawPlayer(ctx, px, g.py, g.starter, evolutionStage(g.candy));

      ctx.fillStyle = "rgba(15,23,42,0.75)";
      ctx.font = "600 14px system-ui, sans-serif";
      ctx.fillText(`Candy: ${g.candy}`, 12, 22);
      const name = g.starter ? EVOLUTION_NAMES[g.starter][evolutionStage(g.candy)] : "";
      ctx.fillText(name, 12, 42);
      ctx.font = "500 12px system-ui, sans-serif";
      ctx.fillText("Space / ↑ / tap / click to jump", g.width - 200, 22);

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      g.running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  }, [starter, uiPhase, drawPlayer]);

  const startWith = (s: Starter) => {
    setStarter(s);
    setCandyCount(0);
    setUiPhase("playing");
  };

  const restart = () => {
    setStarter(null);
    setUiPhase("pick");
    setCandyCount(0);
  };

  const playAgainSame = () => {
    if (!starter) return;
    setUiPhase("playing");
    setCandyCount(0);
  };

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" asChild>
            <Link to="/">← Home</Link>
          </Button>
          <p className="text-sm text-muted-foreground">Inspired by the classic browser runner — fan tribute, not affiliated.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Starter run</CardTitle>
            <CardDescription>
              Pick Charmander, Bulbasaur, or Squirtle. Jump over cacti and grab candy. At{" "}
              <strong>50 candy</strong> you evolve once; at <strong>100 candy</strong> you reach the final form.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uiPhase === "pick" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Choose your starter:</p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => startWith("charmander")}
                  >
                    Charmander
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => startWith("bulbasaur")}
                  >
                    Bulbasaur
                  </Button>
                  <Button
                    className="bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => startWith("squirtle")}
                  >
                    Squirtle
                  </Button>
                </div>
                {bestCandy > 0 && (
                  <p className="text-sm text-muted-foreground">Best run: {bestCandy} candy</p>
                )}
              </div>
            )}

            {(uiPhase === "playing" || uiPhase === "over") && starter && (
              <div ref={wrapRef} className="rounded-lg border bg-muted/30 overflow-hidden">
                <canvas ref={canvasRef} className="block w-full touch-none cursor-pointer" />
              </div>
            )}

            {uiPhase === "playing" && starter && (
              <p className="text-sm text-muted-foreground text-center">
                Candy: <strong>{candyCount}</strong>
                {" · "}
                {EVOLUTION_NAMES[starter][evolutionStage(candyCount)]}
                {candyCount < 50 && ` — evolve at 50 (${50 - candyCount} to go)`}
                {candyCount >= 50 && candyCount < 100 && ` — final evolution at 100 (${100 - candyCount} to go)`}
                {candyCount >= 100 && " — fully evolved!"}
              </p>
            )}

            {uiPhase === "over" && starter && (
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between rounded-md border p-4 bg-destructive/5">
                <div>
                  <p className="font-semibold">Game over</p>
                  <p className="text-sm text-muted-foreground">
                    You collected <strong>{candyCount}</strong> candy as{" "}
                    {EVOLUTION_NAMES[starter][evolutionStage(candyCount)]}.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={playAgainSame}>Play again</Button>
                  <Button variant="outline" onClick={restart}>
                    Pick starter
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
