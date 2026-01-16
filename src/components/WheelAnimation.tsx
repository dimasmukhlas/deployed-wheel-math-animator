import { useEffect, useRef, useState } from "react";
import { CelebrationEffect } from "./CelebrationEffect";

interface WheelAnimationProps {
  radius: number;
  distance: number;
  rotations: number;
  isAnimating: boolean;
  onCycleComplete?: () => void;
  playWheelSound?: () => void;
}

export const WheelAnimation = ({ 
  radius, 
  distance, 
  rotations, 
  isAnimating,
  onCycleComplete,
  playWheelSound
}: WheelAnimationProps) => {
  const wheelRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const soundIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Scale factor for visual representation - wheel grows/shrinks with radius
  // Min radius: 10cm -> 25px, Max radius: 100cm -> 80px
  const visualRadius = 25 + ((radius - 10) / 90) * 55;
  const wheelDiameter = visualRadius * 2;
  
  // Calculate animation duration based on rotations (slower for more rotations)
  const rotationDuration = Math.max(1, rotations * 0.5);
  const moveDuration = rotationDuration;

  // Play wheel sounds at intervals while animating
  useEffect(() => {
    if (isAnimating && playWheelSound) {
      // Calculate sound interval based on rotation speed
      const soundInterval = Math.max(100, (rotationDuration * 1000) / (rotations * 6));
      
      soundIntervalRef.current = setInterval(() => {
        playWheelSound();
      }, soundInterval);

      return () => {
        if (soundIntervalRef.current) {
          clearInterval(soundIntervalRef.current);
        }
      };
    } else {
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    }
  }, [isAnimating, playWheelSound, rotationDuration, rotations]);

  // Trigger celebration when animation cycle completes
  useEffect(() => {
    if (isAnimating) {
      const cycleTimer = setTimeout(() => {
        setShowCelebration(true);
        onCycleComplete?.();
      }, moveDuration * 1000);

      return () => clearTimeout(cycleTimer);
    }
  }, [isAnimating, moveDuration, onCycleComplete]);

  const handleCelebrationComplete = () => {
    setShowCelebration(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-64 overflow-hidden rounded-2xl glass-card"
    >
      {/* Celebration Effect */}
      <CelebrationEffect 
        isActive={showCelebration} 
        onComplete={handleCelebrationComplete}
      />

      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-transparent" />
      
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-emerald-600 to-emerald-500" />
      
      {/* Road */}
      <div className="absolute bottom-12 left-0 right-0 h-8 bg-slate-700">
        {/* Road markings */}
        <div className="absolute top-1/2 left-0 right-0 h-1 flex gap-8 -translate-y-1/2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-12 h-full bg-yellow-400 flex-shrink-0" />
          ))}
        </div>
      </div>
      
      {/* Distance marker */}
      <div className="absolute bottom-24 left-4 right-4 flex items-center">
        <div className="h-0.5 flex-1 bg-primary/50 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-primary rounded" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-primary rounded" />
        </div>
        <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-sm font-medium text-primary bg-card/80 px-2 py-1 rounded">
          {distance} m
        </span>
      </div>
      
      {/* Animated Wheel Container */}
      <div 
        className="absolute left-4 transition-all duration-300 ease-out"
        style={{
          animation: isAnimating ? `wheel-move ${moveDuration}s linear infinite` : 'none',
          width: `calc(100% - 32px)`,
          bottom: `${56 - (visualRadius - 25)}px`, // Adjust bottom position based on wheel size
        }}
      >
        <svg 
          width={wheelDiameter + 20} 
          height={wheelDiameter + 20} 
          viewBox={`0 0 ${wheelDiameter + 20} ${wheelDiameter + 20}`}
          className={`${isAnimating ? 'animate-pulse-glow' : ''} transition-all duration-300 ease-out`}
          style={{ 
            marginBottom: `-${visualRadius}px`, // Keep wheel grounded on road
          }}
        >
          <g 
            ref={wheelRef}
            style={{
              transformOrigin: `${(wheelDiameter + 20) / 2}px ${(wheelDiameter + 20) / 2}px`,
              animation: isAnimating ? `wheel-rotate ${rotationDuration}s linear infinite` : 'none',
            }}
          >
            {/* Wheel outer rim */}
            <circle
              cx={(wheelDiameter + 20) / 2}
              cy={(wheelDiameter + 20) / 2}
              r={visualRadius}
              fill="none"
              stroke="hsl(220 14% 20%)"
              strokeWidth="8"
            />
            
            {/* Tire */}
            <circle
              cx={(wheelDiameter + 20) / 2}
              cy={(wheelDiameter + 20) / 2}
              r={visualRadius - 4}
              fill="hsl(220 14% 30%)"
              stroke="hsl(220 14% 25%)"
              strokeWidth="2"
            />
            
            {/* Wheel rim */}
            <circle
              cx={(wheelDiameter + 20) / 2}
              cy={(wheelDiameter + 20) / 2}
              r={visualRadius * 0.6}
              fill="hsl(199 89% 48%)"
              stroke="hsl(199 89% 40%)"
              strokeWidth="3"
            />
            
            {/* Hub */}
            <circle
              cx={(wheelDiameter + 20) / 2}
              cy={(wheelDiameter + 20) / 2}
              r={visualRadius * 0.2}
              fill="hsl(0 0% 90%)"
              stroke="hsl(199 89% 35%)"
              strokeWidth="2"
            />
            
            {/* Spokes */}
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * 60 * Math.PI) / 180;
              const centerX = (wheelDiameter + 20) / 2;
              const centerY = (wheelDiameter + 20) / 2;
              const innerR = visualRadius * 0.2;
              const outerR = visualRadius * 0.55;
              
              return (
                <line
                  key={i}
                  x1={centerX + innerR * Math.cos(angle)}
                  y1={centerY + innerR * Math.sin(angle)}
                  x2={centerX + outerR * Math.cos(angle)}
                  y2={centerY + outerR * Math.sin(angle)}
                  stroke="hsl(0 0% 95%)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        </svg>
      </div>
      
      {/* Clouds */}
      <div className="absolute top-4 left-8 w-16 h-8 bg-white/70 rounded-full blur-sm" />
      <div className="absolute top-8 left-20 w-12 h-6 bg-white/60 rounded-full blur-sm" />
      <div className="absolute top-6 right-16 w-20 h-10 bg-white/70 rounded-full blur-sm" />
    </div>
  );
};
