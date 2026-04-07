import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ResultsScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
  onBackToMenu: () => void;
  studentName: string;
}

const ResultsScreen = ({ score, total, onRestart, onBackToMenu, studentName }: ResultsScreenProps) => {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: ["#FFD700", "#00BFFF", "#FF69B4", "#32CD32"] });
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: ["#FFD700", "#00BFFF", "#FF69B4", "#32CD32"] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const percentage = Math.round((score / total) * 100);
  const getMessage = () => {
    if (percentage === 100) return { emoji: "🏆", text: `PERFECT score, ${studentName}! You're a genius!` };
    if (percentage >= 80) return { emoji: "🌟", text: `Amazing job, ${studentName}! SpongeBob is so proud of you!` };
    if (percentage >= 60) return { emoji: "😊", text: `Great work, ${studentName}! Keep learning and you'll be even better!` };
    if (percentage >= 40) return { emoji: "💪", text: `Good try, ${studentName}! Practice more and you'll get there!` };
    return { emoji: "🧽", text: `Keep trying, ${studentName}! SpongeBob believes in you!` };
  };
  const msg = getMessage();

  return (
    <div className="w-full max-w-lg mx-auto text-center animate-bounce-in">
      <div className="bg-primary rounded-3xl p-8 md:p-10 shadow-2xl border-4 border-primary-foreground/20">
        <div className="text-7xl mb-4">{msg.emoji}</div>
        <h1 className="font-display text-3xl md:text-4xl text-primary-foreground mb-1">
          Congrats, {studentName}! 🎉
        </h1>
        <p className="font-body text-lg text-primary-foreground/80 mb-6">{msg.text}</p>

        <div className="w-36 h-36 mx-auto rounded-full bg-primary-foreground/20 flex flex-col items-center justify-center mb-6 border-4 border-primary-foreground/30">
          <span className="font-display text-5xl text-primary-foreground">{score}</span>
          <span className="font-body text-sm text-primary-foreground/70">out of {total}</span>
        </div>

        <div className="flex justify-center gap-1 mb-6 text-3xl">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className="animate-pop-in" style={{ animationDelay: `${i * 0.15}s` }}>
              {i < Math.ceil((score / total) * 5) ? "⭐" : "☆"}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={onRestart} className="bg-accent text-accent-foreground font-display text-xl px-8 py-4 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform border-2 border-foreground/10">
            🔄 Play Again!
          </button>
          <button onClick={onBackToMenu} className="font-body text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
            ← Back to menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
