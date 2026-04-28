/**
 * Decorative background: stylized slow, pink water-creature silhouettes + soft motion.
 * Original artwork (not official Pokémon assets).
 */
const SlowpokeBackdrop = () => (
  <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none select-none" aria-hidden>
    {/* Ambient blobs */}
    <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-fuchsia-300/25 blur-3xl animate-slowpoke-glow" />
    <div className="absolute top-1/3 -right-16 h-64 w-64 rounded-full bg-sky-300/30 blur-3xl animate-slowpoke-glow-delayed" />
    <div className="absolute bottom-1/4 left-1/4 h-48 w-48 rounded-full bg-pink-200/20 blur-2xl animate-slowpoke-glow" style={{ animationDelay: "-4s" }} />

    {/* Large center creature */}
    <svg
      className="absolute bottom-[-4%] left-1/2 h-[min(52vh,420px)] w-[min(96vw,560px)] opacity-[0.38] animate-slowpoke-drift drop-shadow-[0_8px_32px_rgba(168,85,160,0.35)]"
      viewBox="0 0 320 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="slowpoke-body" x1="160" y1="40" x2="160" y2="240" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5b8d4" />
          <stop offset="0.45" stopColor="#e89ec4" />
          <stop offset="1" stopColor="#d878ae" />
        </linearGradient>
        <linearGradient id="slowpoke-tail" x1="40" y1="120" x2="120" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ebb0cc" />
          <stop offset="1" stopColor="#c96b9a" />
        </linearGradient>
      </defs>
      {/* Tail / shell lump */}
      <ellipse cx="52" cy="155" rx="38" ry="52" fill="url(#slowpoke-tail)" transform="rotate(-18 52 155)" />
      <ellipse cx="58" cy="148" rx="14" ry="20" fill="#f9d6e6" opacity="0.5" transform="rotate(-18 58 148)" />
      {/* Main body */}
      <ellipse cx="175" cy="150" rx="108" ry="88" fill="url(#slowpoke-body)" />
      {/* Belly highlight */}
      <ellipse cx="195" cy="165" rx="52" ry="42" fill="#fde8f2" opacity="0.45" />
      {/* Head */}
      <ellipse cx="185" cy="78" rx="72" ry="58" fill="url(#slowpoke-body)" />
      {/* Ears */}
      <ellipse cx="118" cy="38" rx="28" ry="36" fill="#e89ec4" transform="rotate(-25 118 38)" />
      <ellipse cx="252" cy="42" rx="28" ry="36" fill="#e89ec4" transform="rotate(25 252 42)" />
      <ellipse cx="118" cy="38" rx="12" ry="18" fill="#fce4ee" opacity="0.7" transform="rotate(-25 118 38)" />
      <ellipse cx="252" cy="42" rx="12" ry="18" fill="#fce4ee" opacity="0.7" transform="rotate(25 252 42)" />
      {/* Sleepy eyes */}
      <path
        d="M148 72c0 8-10 14-18 14s-18-6-18-14c0-4 8-6 18-6s18 2 18 6z"
        fill="#5c3d52"
        opacity="0.85"
      />
      <path
        d="M218 72c0 8-10 14-18 14s-18-6-18-14c0-4 8-6 18-6s18 2 18 6z"
        fill="#5c3d52"
        opacity="0.85"
      />
      <ellipse cx="142" cy="78" rx="5" ry="3" fill="#fff" opacity="0.35" />
      <ellipse cx="212" cy="78" rx="5" ry="3" fill="#fff" opacity="0.35" />
      {/* Simple smile */}
      <path d="M168 102c12 8 28 8 40 0" stroke="#a8557a" strokeWidth="4" strokeLinecap="round" opacity="0.55" />
    </svg>

    {/* Smaller distant silhouette */}
    <svg
      className="absolute top-[6%] right-[3%] h-28 w-36 opacity-[0.22] animate-slowpoke-drift-delayed md:h-36 md:w-44"
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="100" cy="95" rx="72" ry="58" fill="#e89ec4" opacity="0.9" />
      <ellipse cx="100" cy="45" rx="48" ry="38" fill="#ebb0cc" />
      <ellipse cx="58" cy="28" rx="18" ry="24" fill="#e89ec4" transform="rotate(-20 58 28)" />
      <ellipse cx="142" cy="28" rx="18" ry="24" fill="#e89ec4" transform="rotate(20 142 28)" />
      <ellipse cx="82" cy="42" rx="14" ry="5" fill="#5c3d52" opacity="0.6" />
      <ellipse cx="118" cy="42" rx="14" ry="5" fill="#5c3d52" opacity="0.6" />
    </svg>

    {/* Tiny left accent */}
    <svg
      className="absolute bottom-[18%] left-[2%] h-20 w-24 opacity-[0.18] animate-slowpoke-drift-side md:h-28 md:w-32"
      style={{ animationDelay: "-3s" }}
      viewBox="0 0 160 140"
      fill="none"
    >
      <ellipse cx="80" cy="78" rx="62" ry="50" fill="#f0a8c8" />
      <ellipse cx="80" cy="38" rx="44" ry="34" fill="#f5b8d4" />
    </svg>

    {/* Floating sparkles */}
    {[
      { left: 10, delay: 0, dur: 18 },
      { left: 24, delay: 3, dur: 22 },
      { left: 41, delay: 1.5, dur: 20 },
      { left: 58, delay: 5, dur: 24 },
      { left: 73, delay: 2, dur: 19 },
      { left: 88, delay: 7, dur: 21 },
      { left: 33, delay: 9, dur: 23 },
      { left: 67, delay: 4, dur: 17 },
    ].map((s, i) => (
      <span
        key={i}
        className="absolute bottom-[5%] text-base text-white/45 animate-slowpoke-sparkle md:text-lg"
        style={{
          left: `${s.left}%`,
          animationDelay: `${s.delay}s`,
          animationDuration: `${s.dur}s`,
        }}
      >
        ✦
      </span>
    ))}
  </div>
);

export default SlowpokeBackdrop;
