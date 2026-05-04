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
  { body: string; accent: string; dark: string; belly: string }
> = {
  charmander: { body: "#f97316", accent: "#fbbf24", dark: "#c2410c", belly: "#fef3c7" },
  bulbasaur: { body: "#4ade80", accent: "#86efac", dark: "#166534", belly: "#dcfce7" },
  squirtle: { body: "#38bdf8", accent: "#bae6fd", dark: "#0369a1", belly: "#fef9c3" },
};

type Entity = { kind: "cactus" | "candy"; x: number; y: number; w: number; h: number; collected?: boolean };

function evolutionStage(candy: number): 0 | 1 | 2 {
  if (candy >= 100) return 2;
  if (candy >= 50) return 1;
  return 0;
}

function playerSize(stage: 0 | 1 | 2): { w: number; h: number } {
  if (stage === 0) return { w: 52, h: 42 };
  if (stage === 1) return { w: 58, h: 48 };
  return { w: 68, h: 54 };
}

/** Normalized coords in player box; head faces right (runner direction). */
function drawCharmanderLine(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stage: 0 | 1 | 2,
  p: (typeof PALETTE)["charmander"]
) {
  const X = (t: number) => t * w;
  const Y = (t: number) => t * h;
  const m = Math.min(w, h);

  // Tail (curves behind to the left) + flame tip
  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.moveTo(X(0.38), Y(0.78));
  ctx.quadraticCurveTo(X(0.05), Y(0.62), X(-0.06 - stage * 0.02), Y(0.38));
  ctx.quadraticCurveTo(X(-0.12 - stage * 0.03), Y(0.18), X(0.02), Y(0.08 + stage * 0.02));
  ctx.quadraticCurveTo(X(0.18), Y(0.22), X(0.32), Y(0.52));
  ctx.lineTo(X(0.38), Y(0.78));
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = p.dark;
  ctx.lineWidth = 1.25;
  ctx.stroke();

  const flameR = m * (0.14 + stage * 0.025);
  const grad = ctx.createRadialGradient(X(0.02), Y(0.12), 0, X(0.02), Y(0.12), flameR);
  grad.addColorStop(0, "#fef08a");
  grad.addColorStop(0.45, "#f97316");
  grad.addColorStop(1, "#dc2626");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(X(0.02), Y(0.1 + stage * 0.02), flameR, 0, Math.PI * 2);
  ctx.fill();

  // Belly (cream underside)
  ctx.fillStyle = p.belly;
  ctx.beginPath();
  ctx.ellipse(X(0.4), Y(0.68), w * 0.14, h * 0.12, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.ellipse(X(0.42), Y(0.66), w * 0.2, h * 0.2, 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = p.dark;
  ctx.lineWidth = 1.25;
  ctx.stroke();

  // Wing membrane (Charizard-style) — stage 2
  if (stage >= 2) {
    ctx.fillStyle = "#ea580c";
    ctx.beginPath();
    ctx.moveTo(X(0.28), Y(0.42));
    ctx.quadraticCurveTo(X(-0.02), Y(0.18), X(0.08), Y(0.52));
    ctx.quadraticCurveTo(X(0.22), Y(0.55), X(0.28), Y(0.42));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#9a3412";
    ctx.stroke();
    ctx.fillStyle = "#fdba74";
    ctx.beginPath();
    ctx.moveTo(X(0.26), Y(0.44));
    ctx.lineTo(X(0.06), Y(0.32));
    ctx.lineTo(X(0.14), Y(0.48));
    ctx.closePath();
    ctx.fill();
  }

  // Head (reptile snout)
  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.ellipse(X(0.72), Y(0.38), m * 0.22, m * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = p.dark;
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(X(0.92), Y(0.42), m * 0.12, m * 0.09, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Horn ridge (Charmeleon+)
  if (stage >= 1) {
    ctx.fillStyle = p.dark;
    ctx.beginPath();
    ctx.moveTo(X(0.62), Y(0.22));
    ctx.lineTo(X(0.68 + stage * 0.02), Y(0.12));
    ctx.lineTo(X(0.74), Y(0.24));
    ctx.closePath();
    ctx.fill();
  }

  // Eyes (angry-friendly)
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.ellipse(X(0.82), Y(0.34), 3.2, 3.8, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(X(0.7), Y(0.36), 2.6, 3.2, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(X(0.83), Y(0.32), 1.1, 0, Math.PI * 2);
  ctx.arc(X(0.71), Y(0.34), 0.9, 0, Math.PI * 2);
  ctx.fill();

  // Tooth grin
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(X(0.88), Y(0.46), 4, 0.1, Math.PI - 0.1);
  ctx.stroke();

  // Arms
  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.ellipse(X(0.48), Y(0.58), m * 0.08, m * 0.06, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = p.dark;
  ctx.stroke();
}

function drawBulbasaurLine(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stage: 0 | 1 | 2,
  p: (typeof PALETTE)["bulbasaur"]
) {
  const X = (t: number) => t * w;
  const Y = (t: number) => t * h;
  const m = Math.min(w, h);

  // Back bulb / flower (on top, behind head from side)
  if (stage === 0) {
    ctx.fillStyle = "#86efac";
    ctx.beginPath();
    ctx.moveTo(X(0.22), Y(0.08));
    ctx.quadraticCurveTo(X(0.08), Y(0.28), X(0.18), Y(0.42));
    ctx.quadraticCurveTo(X(0.38), Y(0.38), X(0.42), Y(0.22));
    ctx.quadraticCurveTo(X(0.34), Y(0.06), X(0.22), Y(0.08));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#166534";
    ctx.lineWidth = 1.2;
    ctx.stroke();
  } else if (stage === 1) {
    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.ellipse(X(0.28), Y(0.22), m * 0.2, m * 0.18, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#166534";
    ctx.stroke();
    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    ctx.arc(X(0.26), Y(0.16), m * 0.08, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Venusaur-style flower
    const cx = X(0.26);
    const cy = Y(0.2);
    const pr = m * 0.09;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      ctx.fillStyle = i % 2 === 0 ? "#f9a8d4" : "#fbcfe8";
      ctx.beginPath();
      ctx.ellipse(cx + Math.cos(a) * m * 0.14, cy + Math.sin(a) * m * 0.12, pr * 1.1, pr * 0.85, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#fef08a";
    ctx.beginPath();
    ctx.arc(cx, cy, m * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#166534";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Body (quadruped lump)
  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.ellipse(X(0.48), Y(0.62), w * 0.26, h * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = p.dark;
  ctx.lineWidth = 1.25;
  ctx.stroke();

  // Spots
  ctx.fillStyle = "#15803d";
  for (const [sx, sy, sr] of [
    [0.35, 0.58, 2.2],
    [0.52, 0.7, 2.8],
    [0.4, 0.72, 2],
  ] as const) {
    ctx.beginPath();
    ctx.arc(X(sx), Y(sy), sr + stage * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Belly
  ctx.fillStyle = p.belly;
  ctx.beginPath();
  ctx.ellipse(X(0.55), Y(0.66), w * 0.12, h * 0.1, 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Legs
  ctx.fillStyle = p.body;
  for (const lx of [0.32, 0.44, 0.58, 0.7]) {
    ctx.fillRect(X(lx) - 3, Y(0.78), 6 + stage, h * 0.18);
  }

  // Head
  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.ellipse(X(0.78), Y(0.42), m * 0.2, m * 0.18, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = p.dark;
  ctx.stroke();

  // Ears
  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.moveTo(X(0.66), Y(0.28));
  ctx.lineTo(X(0.62), Y(0.12));
  ctx.lineTo(X(0.74), Y(0.24));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(X(0.82), Y(0.26));
  ctx.lineTo(X(0.88), Y(0.1));
  ctx.lineTo(X(0.9), Y(0.26));
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Eyes (large anime)
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(X(0.84), Y(0.38), 5, 5.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#7c3aed";
  ctx.beginPath();
  ctx.arc(X(0.85), Y(0.39), 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(X(0.86), Y(0.38), 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Mouth / tiny teeth
  ctx.strokeStyle = "#14532d";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(X(0.92), Y(0.48));
  ctx.quadraticCurveTo(X(0.96), Y(0.52), X(0.9), Y(0.54));
  ctx.stroke();
}

function drawSquirtleLine(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stage: 0 | 1 | 2,
  p: (typeof PALETTE)["squirtle"]
) {
  const X = (t: number) => t * w;
  const Y = (t: number) => t * h;
  const m = Math.min(w, h);

  // Shell (brown rounded on back)
  const shellGrad = ctx.createLinearGradient(X(0.15), Y(0.35), X(0.42), Y(0.75));
  shellGrad.addColorStop(0, "#a16207");
  shellGrad.addColorStop(1, "#713f12");
  ctx.fillStyle = shellGrad;
  ctx.beginPath();
  ctx.ellipse(X(0.32), Y(0.55), w * 0.2, h * 0.2, -0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#422006";
  ctx.lineWidth = 1.25;
  ctx.stroke();
  // Shell scutes
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 0.8;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(X(0.26 + i * 0.06), Y(0.48 + i * 0.04), m * 0.06, 0.3, Math.PI - 0.3);
    ctx.stroke();
  }

  // Blastoise cannons
  if (stage >= 2) {
    ctx.fillStyle = "#64748b";
    for (const [cx, cy, ang] of [
      [0.22, 0.42, -0.5],
      [0.34, 0.38, -0.25],
    ] as const) {
      ctx.save();
      ctx.translate(X(cx), Y(cy));
      ctx.rotate(ang);
      ctx.fillRect(0, -4, m * 0.35, 8);
      ctx.strokeStyle = "#334155";
      ctx.strokeRect(0, -4, m * 0.35, 8);
      ctx.restore();
    }
  }

  // Body (blue under shell)
  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.ellipse(X(0.52), Y(0.66), w * 0.18, h * 0.16, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = p.dark;
  ctx.stroke();

  // Belly
  ctx.fillStyle = p.belly;
  ctx.beginPath();
  ctx.ellipse(X(0.58), Y(0.68), w * 0.1, h * 0.09, 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ca8a04";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Legs
  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.ellipse(X(0.4), Y(0.88), 7, 5, 0, 0, Math.PI * 2);
  ctx.ellipse(X(0.62), Y(0.9), 7, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = p.body;
  ctx.beginPath();
  ctx.ellipse(X(0.78), Y(0.42), m * 0.2, m * 0.17, 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = p.dark;
  ctx.stroke();

  // Wartortle ear tufts
  if (stage >= 1) {
    ctx.fillStyle = "#f8fafc";
    ctx.beginPath();
    ctx.moveTo(X(0.62), Y(0.32));
    ctx.quadraticCurveTo(X(0.52), Y(0.08 + (2 - stage) * 0.04), X(0.68), Y(0.28));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#94a3b8";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(X(0.72), Y(0.3));
    ctx.quadraticCurveTo(X(0.78), Y(0.06), X(0.82), Y(0.28));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Swirly tail (Wartortle+)
  if (stage >= 1) {
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(X(0.12), Y(0.72), m * 0.1, 0, Math.PI * 1.5);
    ctx.stroke();
  }

  // Eyes
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.ellipse(X(0.84), Y(0.38), 4.5, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1e3a8a";
  ctx.beginPath();
  ctx.arc(X(0.85), Y(0.39), 2.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#0f172a";
  ctx.beginPath();
  ctx.arc(X(0.86), Y(0.38), 1, 0, Math.PI * 2);
  ctx.fill();

  // Nostrils
  ctx.fillStyle = "#0369a1";
  ctx.beginPath();
  ctx.arc(X(0.94), Y(0.44), 1.2, 0, Math.PI * 2);
  ctx.arc(X(0.97), Y(0.45), 1.2, 0, Math.PI * 2);
  ctx.fill();
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
      if (st === "charmander") drawCharmanderLine(ctx, w, h, stage, p);
      else if (st === "bulbasaur") drawBulbasaurLine(ctx, w, h, stage, p);
      else drawSquirtleLine(ctx, w, h, stage, p);
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
