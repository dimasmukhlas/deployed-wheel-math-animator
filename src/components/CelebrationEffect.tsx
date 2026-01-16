import { useEffect, useState } from "react";

interface CelebrationEffectProps {
  isActive: boolean;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#A855F7",
  "#F97316",
];

export const CelebrationEffect = ({ isActive, onComplete }: CelebrationEffectProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Generate confetti particles
      const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
      setShowBanner(true);

      // Clear after animation
      const timer = setTimeout(() => {
        setParticles([]);
        setShowBanner(false);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive && particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {/* Confetti particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${particle.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}

      {/* Success banner */}
      {showBanner && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-bounce-in bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-4 rounded-2xl shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div className="text-center">
                <p className="text-xl font-bold">Selesai!</p>
                <p className="text-sm opacity-90">Roda telah berputar</p>
              </div>
              <span className="text-3xl">🏆</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
