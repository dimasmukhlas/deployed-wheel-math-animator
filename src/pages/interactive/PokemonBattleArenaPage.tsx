import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type PokeType = "fire" | "water" | "grass" | "electric" | "rock" | "fighting";

type MonId =
  | "charmander"
  | "squirtle"
  | "bulbasaur"
  | "pikachu"
  | "geodude"
  | "machop";

type Mon = {
  id: MonId;
  name: string;
  type: PokeType;
  maxHp: number;
  gradient: string;
  ring: string;
};

const ROSTER: Mon[] = [
  {
    id: "charmander",
    name: "Charmander",
    type: "fire",
    maxHp: 95,
    gradient: "from-orange-400 to-red-500",
    ring: "ring-orange-400/50",
  },
  {
    id: "squirtle",
    name: "Squirtle",
    type: "water",
    maxHp: 100,
    gradient: "from-sky-400 to-blue-600",
    ring: "ring-sky-400/50",
  },
  {
    id: "bulbasaur",
    name: "Bulbasaur",
    type: "grass",
    maxHp: 98,
    gradient: "from-lime-400 to-emerald-600",
    ring: "ring-lime-400/50",
  },
  {
    id: "pikachu",
    name: "Pikachu",
    type: "electric",
    maxHp: 90,
    gradient: "from-yellow-300 to-amber-500",
    ring: "ring-yellow-400/50",
  },
  {
    id: "geodude",
    name: "Geodude",
    type: "rock",
    maxHp: 110,
    gradient: "from-stone-400 to-stone-700",
    ring: "ring-stone-500/50",
  },
  {
    id: "machop",
    name: "Machop",
    type: "fighting",
    maxHp: 105,
    gradient: "from-rose-300 to-red-700",
    ring: "ring-rose-400/50",
  },
];

const TYPE_LABEL: Record<PokeType, string> = {
  fire: "Fire",
  water: "Water",
  grass: "Grass",
  electric: "Electric",
  rock: "Rock",
  fighting: "Fighting",
};

const EFFECT: Record<PokeType, Record<PokeType, number>> = {
  fire: { fire: 0.5, water: 0.5, grass: 2, electric: 1, rock: 0.5, fighting: 1 },
  water: { fire: 2, water: 0.5, grass: 0.5, electric: 1, rock: 2, fighting: 1 },
  grass: { fire: 0.5, water: 2, grass: 0.5, electric: 1, rock: 2, fighting: 1 },
  electric: { fire: 1, water: 2, grass: 0.5, electric: 0.5, rock: 1, fighting: 1 },
  rock: { fire: 2, water: 1, grass: 1, electric: 1, rock: 0.5, fighting: 0.5 },
  fighting: { fire: 1, water: 1, grass: 1, electric: 1, rock: 2, fighting: 1 },
};

function typeMultiplier(attacker: PokeType, defender: PokeType): number {
  return EFFECT[attacker][defender] ?? 1;
}

function monById(id: MonId): Mon {
  const m = ROSTER.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown mon ${id}`);
  return m;
}

function randomEnemyId(exclude: MonId): MonId {
  const pool = ROSTER.filter((m) => m.id !== exclude).map((m) => m.id);
  return pool[Math.floor(Math.random() * pool.length)]!;
}

type MoveKind = "quick" | "power" | "guard" | "recover";

function applyDamage(raw: number, guarding: boolean): number {
  const g = guarding ? 0.32 : 1;
  return Math.max(1, Math.round(raw * g));
}

export default function PokemonBattleArenaPage() {
  const [phase, setPhase] = useState<"pick" | "battle" | "won" | "lost">("pick");
  const [playerId, setPlayerId] = useState<MonId | null>(null);
  const [enemyId, setEnemyId] = useState<MonId | null>(null);
  const [playerHp, setPlayerHp] = useState(0);
  const [enemyHp, setEnemyHp] = useState(0);
  const [playerMax, setPlayerMax] = useState(0);
  const [enemyMax, setEnemyMax] = useState(0);
  const [playerGuard, setPlayerGuard] = useState(false);
  const [enemyGuard, setEnemyGuard] = useState(false);
  const [playerHealLeft, setPlayerHealLeft] = useState(1);
  const [enemyHealLeft, setEnemyHealLeft] = useState(1);
  const [playerPowerLeft, setPlayerPowerLeft] = useState(2);
  const [enemyPowerLeft, setEnemyPowerLeft] = useState(2);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const pushLog = useCallback((line: string) => {
    setLog((prev) => [...prev.slice(-5), line]);
  }, []);

  const startBattle = (id: MonId) => {
    const p = monById(id);
    const eid = randomEnemyId(id);
    const e = monById(eid);
    setPlayerId(id);
    setEnemyId(eid);
    setPlayerMax(p.maxHp);
    setEnemyMax(e.maxHp);
    setPlayerHp(p.maxHp);
    setEnemyHp(e.maxHp);
    setPlayerGuard(false);
    setEnemyGuard(false);
    setPlayerHealLeft(1);
    setEnemyHealLeft(1);
    setPlayerPowerLeft(2);
    setEnemyPowerLeft(2);
    setLog([`You sent out ${p.name}!`, `Wild ${e.name} appeared!`]);
    setPhase("battle");
    setBusy(false);
  };

  const reset = () => {
    setPhase("pick");
    setPlayerId(null);
    setEnemyId(null);
    setLog([]);
    setBusy(false);
  };

  const playerMon = useMemo(() => (playerId ? monById(playerId) : null), [playerId]);
  const enemyMon = useMemo(() => (enemyId ? monById(enemyId) : null), [enemyId]);

  const runEnemyTurn = useCallback(
    (opts: {
      pHp: number;
      eHp: number;
      pGuard: boolean;
      eGuard: boolean;
      pHeal: number;
      eHeal: number;
      pPow: number;
      ePow: number;
    }) => {
      let {
        pHp,
        eHp,
        pGuard,
        eGuard,
        pHeal,
        eHeal,
        pPow,
        ePow,
      } = opts;
      if (!playerMon || !enemyMon) return;

      const choices: MoveKind[] = [];
      const weights: number[] = [];

      const add = (m: MoveKind, w: number) => {
        choices.push(m);
        weights.push(w);
      };

      add("quick", 38);
      if (ePow > 0) add("power", eHp < 35 ? 28 : 18);
      if (eHeal > 0 && eHp < enemyMon.maxHp * 0.42) add("recover", 22);
      else if (eHeal > 0) add("recover", 6);
      if (eHp < 40 && !eGuard) add("guard", 16);
      else add("guard", 8);

      const totalW = weights.reduce((a, b) => a + b, 0);
      let r = Math.random() * totalW;
      let pick: MoveKind = choices[0]!;
      let acc = 0;
      for (let i = 0; i < choices.length; i++) {
        acc += weights[i]!;
        if (r < acc) {
          pick = choices[i]!;
          break;
        }
      }

      let nextPGuard = pGuard;
      let nextEGuard = eGuard;
      let nextEHeal = eHeal;
      let nextEPow = ePow;

      if (pick === "guard") {
        nextEGuard = true;
        pushLog(`${enemyMon.name} braced for impact!`);
      } else if (pick === "recover" && eHeal > 0) {
        const heal = 34;
        eHp = Math.min(enemyMon.maxHp, eHp + heal);
        nextEHeal = 0;
        pushLog(`${enemyMon.name} recovered ${heal} HP!`);
      } else if (pick === "power" && ePow > 0) {
        const mult = typeMultiplier(enemyMon.type, playerMon.type);
        const raw = 26 * mult;
        const dmg = applyDamage(raw, nextPGuard);
        pHp = Math.max(0, pHp - dmg);
        nextEPow = ePow - 1;
        nextPGuard = false;
        pushLog(
          `${enemyMon.name} used a strong hit for ${dmg} dmg${mult > 1 ? " — super effective!" : mult < 1 ? " — not very effective…" : ""}.`
        );
      } else {
        const mult = typeMultiplier(enemyMon.type, playerMon.type);
        const raw = 15 * mult * 0.85;
        const dmg = applyDamage(raw, nextPGuard);
        pHp = Math.max(0, pHp - dmg);
        nextPGuard = false;
        pushLog(
          `${enemyMon.name} used a quick strike (${dmg})${mult > 1 ? " — super effective!" : mult < 1 ? " — not very effective…" : ""}.`
        );
      }

      setPlayerHp(pHp);
      setEnemyHp(eHp);
      setPlayerGuard(nextPGuard);
      setEnemyGuard(nextEGuard);
      setEnemyHealLeft(nextEHeal);
      setEnemyPowerLeft(nextEPow);

      if (pHp <= 0) {
        setPhase("lost");
        pushLog(`${playerMon.name} fainted…`);
      }
      setBusy(false);
    },
    [enemyMon, playerMon, pushLog]
  );

  const onPlayerMove = (move: MoveKind) => {
    if (phase !== "battle" || busy || !playerMon || !enemyMon) return;
    setBusy(true);

    let pHp = playerHp;
    let eHp = enemyHp;
    let pGuard = playerGuard;
    let eGuard = enemyGuard;
    let pHeal = playerHealLeft;
    let eHeal = enemyHealLeft;
    let pPow = playerPowerLeft;
    let ePow = enemyPowerLeft;

    if (move === "guard") {
      pGuard = true;
      pushLog(`${playerMon.name} raised its guard!`);
      setPlayerGuard(true);
      setTimeout(() => {
        runEnemyTurn({ pHp, eHp, pGuard, eGuard, pHeal, eHeal, pPow, ePow });
      }, 320);
      return;
    }

    if (move === "recover") {
      if (pHeal <= 0) {
        setBusy(false);
        return;
      }
      const heal = 36;
      pHp = Math.min(playerMon.maxHp, pHp + heal);
      pHeal = 0;
      pushLog(`${playerMon.name} recovered ${heal} HP!`);
      setPlayerHp(pHp);
      setPlayerHealLeft(0);
      setTimeout(() => {
        runEnemyTurn({ pHp, eHp, pGuard, eGuard, pHeal, eHeal, pPow, ePow });
      }, 320);
      return;
    }

    if (move === "power") {
      if (pPow <= 0) {
        setBusy(false);
        return;
      }
      const mult = typeMultiplier(playerMon.type, enemyMon.type);
      const raw = 28 * mult;
      const dmg = applyDamage(raw, eGuard);
      eHp = Math.max(0, eHp - dmg);
      pPow -= 1;
      eGuard = false;
      pushLog(
        `${playerMon.name} unleashed a strong hit! ${dmg} dmg${mult > 1 ? " — super effective!" : mult < 1 ? " — not very effective…" : ""}.`
      );
    } else {
      const mult = typeMultiplier(playerMon.type, enemyMon.type);
      const raw = 16 * mult * 0.9;
      const dmg = applyDamage(raw, eGuard);
      eHp = Math.max(0, eHp - dmg);
      eGuard = false;
      pushLog(
        `${playerMon.name} used a quick strike (${dmg})${mult > 1 ? " — super effective!" : mult < 1 ? " — not very effective…" : ""}.`
      );
    }

    setEnemyHp(eHp);
    setEnemyGuard(eGuard);
    setPlayerPowerLeft(pPow);
    setPlayerGuard(false);

    if (eHp <= 0) {
      setPhase("won");
      pushLog(`${enemyMon.name} fainted! You win!`);
      setBusy(false);
      return;
    }

    setTimeout(() => {
      runEnemyTurn({ pHp, eHp, pGuard: false, eGuard, pHeal, eHeal, pPow, ePow });
    }, 380);
  };

  return (
    <div className="min-h-screen px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" asChild>
            <Link to="/">← Home</Link>
          </Button>
          <p className="text-xs text-muted-foreground text-right max-w-[14rem]">
            Fan mini-game — not affiliated with Pokémon.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pokémon-style battle</CardTitle>
            <CardDescription>
              Choose your fighter, then take turns against a wild opponent. Types matter: fire melts grass, water
              douses fire, and so on. Guard weakens the next hit; Recover heals once; you have two strong attacks per
              battle.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {phase === "pick" && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Pick your Pokémon</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ROSTER.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => startBattle(m.id)}
                      className={`text-left rounded-xl border-2 bg-gradient-to-br ${m.gradient} p-3 text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98] ring-2 ${m.ring}`}
                    >
                      <p className="font-bold text-sm drop-shadow-sm">{m.name}</p>
                      <Badge variant="secondary" className="mt-1 text-[10px] bg-white/25 text-white border-0">
                        {TYPE_LABEL[m.type]}
                      </Badge>
                      <p className="text-[10px] opacity-90 mt-1">HP {m.maxHp}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(phase === "battle" || phase === "won" || phase === "lost") && playerMon && enemyMon && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl border bg-gradient-to-br ${playerMon.gradient} p-3 text-white`}>
                    <p className="text-xs opacity-90">You</p>
                    <p className="font-bold">{playerMon.name}</p>
                    <Badge className="mt-1 bg-black/25 text-white border-0 text-[10px]">{TYPE_LABEL[playerMon.type]}</Badge>
                    <div className="mt-2 space-y-1">
                      <Progress value={(playerHp / playerMax) * 100} className="h-2 bg-black/20" />
                      <p className="text-xs tabular-nums">
                        {playerHp} / {playerMax} HP
                      </p>
                    </div>
                  </div>
                  <div className={`rounded-xl border bg-gradient-to-br ${enemyMon.gradient} p-3 text-white`}>
                    <p className="text-xs opacity-90">Wild</p>
                    <p className="font-bold">{enemyMon.name}</p>
                    <Badge className="mt-1 bg-black/25 text-white border-0 text-[10px]">{TYPE_LABEL[enemyMon.type]}</Badge>
                    <div className="mt-2 space-y-1">
                      <Progress value={(enemyHp / enemyMax) * 100} className="h-2 bg-black/20" />
                      <p className="text-xs tabular-nums">
                        {enemyHp} / {enemyMax} HP
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="rounded-md border bg-muted/40 p-3 min-h-[5.5rem]">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Battle log</p>
                  <ul className="text-sm space-y-1">
                    {log.map((line, i) => (
                      <li key={`${i}-${line.slice(0, 12)}`}>{line}</li>
                    ))}
                  </ul>
                </div>

                {phase === "battle" && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button disabled={busy} variant="secondary" onClick={() => onPlayerMove("quick")}>
                      Quick strike
                    </Button>
                    <Button disabled={busy || playerPowerLeft <= 0} onClick={() => onPlayerMove("power")}>
                      Strong hit ({playerPowerLeft} left)
                    </Button>
                    <Button disabled={busy} variant="outline" onClick={() => onPlayerMove("guard")}>
                      Guard
                    </Button>
                    <Button disabled={busy || playerHealLeft <= 0} variant="outline" onClick={() => onPlayerMove("recover")}>
                      Recover (once)
                    </Button>
                  </div>
                )}

                {(phase === "won" || phase === "lost") && (
                  <div
                    className={`rounded-lg border p-4 text-center ${phase === "won" ? "bg-emerald-500/10 border-emerald-500/30" : "bg-destructive/10 border-destructive/30"}`}
                  >
                    <p className="font-semibold text-lg">{phase === "won" ? "You won!" : "You lost"}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {phase === "won"
                        ? `${enemyMon.name} fainted. Great battle!`
                        : `${playerMon.name} fainted. Try another type or move order!`}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      <Button onClick={() => playerId && startBattle(playerId)}>Rematch (same pick)</Button>
                      <Button variant="outline" onClick={reset}>
                        Choose Pokémon
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
