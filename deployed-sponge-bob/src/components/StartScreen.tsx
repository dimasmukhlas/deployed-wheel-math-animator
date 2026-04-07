import type { QuizCategory, QuizLevel } from "@/data/quizQuestions";

interface StartScreenProps {
  onStart: () => void;
  category: QuizCategory;
  level: QuizLevel;
  onBack: () => void;
  studentName: string;
}

const config: Record<QuizCategory, Partial<Record<QuizLevel, { emoji: string; title: string; desc: string }>>> = {
  toddler: {
    1: { emoji: "🔷", title: "Shapes & Colors", desc: "Learn shapes, colors & counting! Super easy! 🌈" },
    2: { emoji: "🍍", title: "SpongeBob Shapes", desc: "Shapes & colors with SpongeBob! 🧽" },
  },
  preschool: {
    1: { emoji: "🧸", title: "Pre-School Basics", desc: "Colors, shapes, animals & counting for little learners! 🌈" },
    2: { emoji: "🍍", title: "SpongeBob Pre-School", desc: "Easy SpongeBob questions for little fans! 🧽" },
  },
  english: {
    1: { emoji: "📚", title: "Basic English", desc: "25 questions on vocabulary, grammar & spelling! 🌊" },
    2: { emoji: "🍍", title: "SpongeBob English", desc: "Learn English with SpongeBob & friends! 🧽" },
    3: { emoji: "🎓", title: "Advanced English", desc: "Complex grammar, literary devices & SpongeBob! 📖" },
    4: { emoji: "🏆", title: "Expert English", desc: "Master-level language arts with Bikini Bottom! 🌟" },
    5: { emoji: "🔥", title: "Scholar English", desc: "Advanced vocabulary & rhetorical analysis! 🧠" },
    6: { emoji: "👑", title: "Master English", desc: "Literary criticism & cultural analysis! 🏛️" },
  },
  indonesian: {
    1: { emoji: "🌴", title: "Bahasa Dasar", desc: "25 questions to learn Bahasa Indonesia! 🇮🇩" },
    2: { emoji: "🍍", title: "SpongeBob Indonesian", desc: "Belajar Bahasa Indonesia di Bikini Bottom! 🧽" },
    3: { emoji: "🎓", title: "Bahasa Lanjutan", desc: "Affixes, sentences & SpongeBob stories! 📖" },
    4: { emoji: "🏆", title: "Bahasa Mahir", desc: "Proverbs, literature & advanced grammar! 🌟" },
    5: { emoji: "🔥", title: "Bahasa Cendekia", desc: "Complex affixes & literary analysis! 🧠" },
    6: { emoji: "👑", title: "Bahasa Master", desc: "Cultural criticism & academic Indonesian! 🏛️" },
  },
  spanish: {
    1: { emoji: "🌮", title: "Español Básico", desc: "Basic Spanish words & phrases! 🇪🇸" },
    2: { emoji: "🍍", title: "SpongeBob Español", desc: "Learn Spanish with SpongeBob! 🧽" },
    3: { emoji: "🎓", title: "Español Intermedio", desc: "Grammar, conjugation & SpongeBob! 📖" },
    4: { emoji: "🏆", title: "Español Avanzado", desc: "Literary devices & subjunctive mood! 🌟" },
    5: { emoji: "🔥", title: "Español Erudito", desc: "Rhetoric & critical literary analysis! 🧠" },
    6: { emoji: "👑", title: "Español Maestro", desc: "Philosophy & cultural criticism! 🏛️" },
  },
};

const StartScreen = ({ onStart, category, level, onBack, studentName }: StartScreenProps) => {
  const c = config[category]?.[level] || { emoji: "🧽", title: "Quiz", desc: "Test your knowledge!" };

  return (
    <div className="w-full max-w-lg mx-auto text-center animate-bounce-in">
      <div className="bg-primary rounded-3xl p-8 md:p-10 shadow-2xl border-4 border-primary-foreground/20">
        <div className="text-7xl mb-4">🧽</div>
        <p className="font-display text-lg text-primary-foreground/70 mb-1">Ready, {studentName}?</p>
        <div className="font-display text-sm text-primary-foreground/60 bg-primary-foreground/10 inline-block px-3 py-1 rounded-full mb-3">
          Level {level}
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-primary-foreground mb-1">
          {c.emoji} {c.title}
        </h1>
        <p className="font-body text-base text-primary-foreground/70 mb-6">{c.desc}</p>

        <div className="flex justify-center gap-4 mb-6 text-4xl">
          {["⭐", "🐙", "⭐", "🦀", "⭐"].map((e, i) => (
            <span key={i} className="animate-pop-in" style={{ animationDelay: `${i * 0.1}s` }}>{e}</span>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onStart}
            className="bg-accent text-accent-foreground font-display text-2xl px-10 py-5 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-foreground/10"
          >
            🎮 Start Quiz!
          </button>
          <button onClick={onBack} className="font-body text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors">
            ← Back to menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
