import { useState, useCallback } from "react";
import underwaterBg from "@sponge/assets/underwater-bg.png";
import Bubbles from "@sponge/components/Bubbles";
import StartScreen from "@sponge/components/StartScreen";
import QuizCard from "@sponge/components/QuizCard";
import ProgressBar from "@sponge/components/ProgressBar";
import ResultsScreen from "@sponge/components/ResultsScreen";
import { getQuestions, type QuizCategory, type QuizLevel, type QuizQuestion } from "@sponge/data/quizQuestions";

type Screen = "name" | "menu" | "start" | "quiz" | "results";

interface LevelCardProps {
  level: QuizLevel;
  title: string;
  desc: string;
  emoji: string;
  spongebob?: boolean;
  colorClass: string;
  fgClass: string;
  onClick: () => void;
}

const LevelCard = ({ level, title, desc, emoji, spongebob, colorClass, fgClass, onClick }: LevelCardProps) => (
  <button
    onClick={onClick}
    className={`${colorClass} rounded-2xl p-4 md:p-5 shadow-2xl border-4 border-foreground/10 hover:scale-105 active:scale-95 transition-transform text-left relative overflow-hidden`}
  >
    {spongebob && (
      <div className={`absolute top-2 right-2 text-xs font-spongeDisplay bg-foreground/20 ${fgClass} px-2 py-1 rounded-full`}>🧽 SpongeBob!</div>
    )}
    <div className="flex items-center gap-2 mb-1">
      <span className="text-2xl">{emoji}</span>
      <span className={`font-spongeDisplay ${fgClass} bg-foreground/10 px-2 py-0.5 rounded-full text-xs`}>Level {level}</span>
    </div>
    <h2 className={`font-spongeDisplay text-lg md:text-xl ${fgClass} mb-0.5`}>{title}</h2>
    <p className={`font-spongeBody text-xs ${fgClass} opacity-70`}>{desc}</p>
  </button>
);

const Index = () => {
  const [screen, setScreen] = useState<Screen>("name");
  const [studentName, setStudentName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [category, setCategory] = useState<QuizCategory>("english");
  const [level, setLevel] = useState<QuizLevel>(1);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const handleNameSubmit = useCallback(() => {
    if (nameInput.trim()) {
      setStudentName(nameInput.trim());
      setScreen("menu");
    }
  }, [nameInput]);

  const handlePickQuiz = useCallback((cat: QuizCategory, lvl: QuizLevel) => {
    setCategory(cat);
    setLevel(lvl);
    setScreen("start");
  }, []);

  const handleStart = useCallback(() => {
    setQuestions(getQuestions(category, level));
    setScreen("quiz");
    setCurrentQuestion(0);
    setScore(0);
  }, [category, level]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (correct) setScore((s) => s + 1);
      if (currentQuestion + 1 >= questions.length) {
        setTimeout(() => setScreen("results"), 300);
      } else {
        setCurrentQuestion((q) => q + 1);
      }
    },
    [currentQuestion, questions.length]
  );

  const handleBackToMenu = useCallback(() => {
    setScreen("menu");
    setCurrentQuestion(0);
    setScore(0);
  }, []);

  const pri = "bg-primary";
  const priFg = "text-primary-foreground";
  const acc = "bg-accent";
  const accFg = "text-accent-foreground";
  const san = "bg-sandy";
  const sanFg = "text-primary-foreground";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${underwaterBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-background/40 z-0" />
      <Bubbles />

      <div className="relative z-10 w-full flex flex-col items-center justify-center py-8">
        {/* Name Entry Screen */}
        {screen === "name" && (
          <div className="w-full max-w-md mx-auto text-center animate-bounce-in">
            <div className="bg-primary rounded-3xl p-8 md:p-10 shadow-2xl border-4 border-primary-foreground/20">
              <div className="text-7xl mb-4">🧽</div>
              <h1 className="font-spongeDisplay text-3xl md:text-4xl text-primary-foreground mb-2">
                Ahoy there!
              </h1>
              <p className="font-spongeBody text-base text-primary-foreground/70 mb-6">
                What's your name, captain?
              </p>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                placeholder="Type your name..."
                className="w-full px-5 py-4 rounded-xl text-lg font-spongeBody font-bold text-center bg-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 border-2 border-primary-foreground/20 focus:border-primary-foreground/50 focus:outline-none mb-4"
                autoFocus
              />
              <button
                onClick={handleNameSubmit}
                disabled={!nameInput.trim()}
                className="bg-accent text-accent-foreground font-spongeDisplay text-xl px-10 py-4 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-transform border-2 border-foreground/10 disabled:opacity-50 disabled:hover:scale-100"
              >
                🚀 Let's Go!
              </button>
            </div>
          </div>
        )}

        {screen === "menu" && (
          <div className="w-full max-w-4xl mx-auto text-center animate-bounce-in">
            <div className="text-5xl mb-2">🧽</div>
            <h1 className="font-spongeDisplay text-2xl md:text-4xl text-foreground mb-1 drop-shadow-lg">
              Welcome, {studentName}! 🌟
            </h1>
            <p className="font-spongeBody text-base text-foreground/80 mb-6 drop-shadow">
              Choose your quiz adventure!
            </p>

            {/* Toddler Section */}
            <div className="mb-5">
              <h3 className="font-spongeDisplay text-lg text-foreground mb-2 drop-shadow flex items-center justify-center gap-2">
                🍼 Toddler <span className="text-sm font-spongeBody opacity-70">(Age 3)</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                <LevelCard level={1} title="Shapes & Colors" desc="Circles, squares, colors & counting" emoji="🔷" colorClass="bg-ocean-light" fgClass="text-foreground" onClick={() => handlePickQuiz("toddler", 1)} />
                <LevelCard level={2} title="SpongeBob Shapes" desc="Shapes & colors with SpongeBob!" emoji="🍍" spongebob colorClass="bg-ocean-light" fgClass="text-foreground" onClick={() => handlePickQuiz("toddler", 2)} />
              </div>
            </div>

            {/* Pre-School Section */}
            <div className="mb-5">
              <h3 className="font-spongeDisplay text-lg text-foreground mb-2 drop-shadow flex items-center justify-center gap-2">
                👶 Pre-School <span className="text-sm font-spongeBody opacity-70">(Age 4+)</span>
              </h3>
              <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
                <LevelCard level={1} title="Basics" desc="Colors, shapes, animals & counting" emoji="🧸" colorClass={san} fgClass={sanFg} onClick={() => handlePickQuiz("preschool", 1)} />
                <LevelCard level={2} title="SpongeBob Basics" desc="Easy SpongeBob questions!" emoji="🍍" spongebob colorClass={san} fgClass={sanFg} onClick={() => handlePickQuiz("preschool", 2)} />
              </div>
            </div>

            {/* English Section */}
            <div className="mb-5">
              <h3 className="font-spongeDisplay text-lg text-foreground mb-2 drop-shadow flex items-center justify-center gap-2">
                🇬🇧 English <span className="text-sm font-spongeBody opacity-70">(2nd Grade)</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <LevelCard level={1} title="Basic" desc="Vocabulary & grammar" emoji="📚" colorClass={pri} fgClass={priFg} onClick={() => handlePickQuiz("english", 1)} />
                <LevelCard level={2} title="SpongeBob" desc="English with Bikini Bottom" emoji="🍍" spongebob colorClass={pri} fgClass={priFg} onClick={() => handlePickQuiz("english", 2)} />
                <LevelCard level={3} title="Advanced" desc="Complex grammar & writing" emoji="🎓" spongebob colorClass={pri} fgClass={priFg} onClick={() => handlePickQuiz("english", 3)} />
                <LevelCard level={4} title="Expert" desc="Literary devices & analysis" emoji="🏆" spongebob colorClass={pri} fgClass={priFg} onClick={() => handlePickQuiz("english", 4)} />
                <LevelCard level={5} title="Scholar" desc="Rhetoric & vocabulary" emoji="🔥" spongebob colorClass={pri} fgClass={priFg} onClick={() => handlePickQuiz("english", 5)} />
                <LevelCard level={6} title="Master" desc="Literary criticism" emoji="👑" spongebob colorClass={pri} fgClass={priFg} onClick={() => handlePickQuiz("english", 6)} />
              </div>
            </div>

            {/* Indonesian Section */}
            <div>
              <h3 className="font-spongeDisplay text-lg text-foreground mb-2 drop-shadow flex items-center justify-center gap-2">
                🇮🇩 Indonesian <span className="text-sm font-spongeBody opacity-70">(Bahasa)</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <LevelCard level={1} title="Dasar" desc="Basic words & phrases" emoji="🌴" colorClass={acc} fgClass={accFg} onClick={() => handlePickQuiz("indonesian", 1)} />
                <LevelCard level={2} title="SpongeBob" desc="Bahasa di Bikini Bottom" emoji="🍍" spongebob colorClass={acc} fgClass={accFg} onClick={() => handlePickQuiz("indonesian", 2)} />
                <LevelCard level={3} title="Lanjutan" desc="Affixes & sentences" emoji="🎓" spongebob colorClass={acc} fgClass={accFg} onClick={() => handlePickQuiz("indonesian", 3)} />
                <LevelCard level={4} title="Mahir" desc="Proverbs & literature" emoji="🏆" spongebob colorClass={acc} fgClass={accFg} onClick={() => handlePickQuiz("indonesian", 4)} />
                <LevelCard level={5} title="Cendekia" desc="Literary analysis" emoji="🔥" spongebob colorClass={acc} fgClass={accFg} onClick={() => handlePickQuiz("indonesian", 5)} />
                <LevelCard level={6} title="Master" desc="Cultural criticism" emoji="👑" spongebob colorClass={acc} fgClass={accFg} onClick={() => handlePickQuiz("indonesian", 6)} />
              </div>
            </div>

            {/* Spanish Section */}
            <div className="mb-5">
              <h3 className="font-spongeDisplay text-lg text-foreground mb-2 drop-shadow flex items-center justify-center gap-2">
                🇪🇸 Spanish <span className="text-sm font-spongeBody opacity-70">(Español)</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <LevelCard level={1} title="Básico" desc="Basic words & phrases" emoji="🌮" colorClass="bg-sandy" fgClass="text-primary-foreground" onClick={() => handlePickQuiz("spanish", 1)} />
                <LevelCard level={2} title="SpongeBob" desc="Español en Bikini Bottom" emoji="🍍" spongebob colorClass="bg-sandy" fgClass="text-primary-foreground" onClick={() => handlePickQuiz("spanish", 2)} />
                <LevelCard level={3} title="Intermedio" desc="Grammar & conjugation" emoji="🎓" spongebob colorClass="bg-sandy" fgClass="text-primary-foreground" onClick={() => handlePickQuiz("spanish", 3)} />
                <LevelCard level={4} title="Avanzado" desc="Literary devices & analysis" emoji="🏆" spongebob colorClass="bg-sandy" fgClass="text-primary-foreground" onClick={() => handlePickQuiz("spanish", 4)} />
                <LevelCard level={5} title="Erudito" desc="Rhetoric & criticism" emoji="🔥" spongebob colorClass="bg-sandy" fgClass="text-primary-foreground" onClick={() => handlePickQuiz("spanish", 5)} />
                <LevelCard level={6} title="Maestro" desc="Philosophy & culture" emoji="👑" spongebob colorClass="bg-sandy" fgClass="text-primary-foreground" onClick={() => handlePickQuiz("spanish", 6)} />
              </div>
            </div>
          </div>
        )}

        {screen === "start" && (
          <StartScreen onStart={handleStart} category={category} level={level} onBack={handleBackToMenu} studentName={studentName} />
        )}

        {screen === "quiz" && questions.length > 0 && (
          <>
            <ProgressBar current={currentQuestion} total={questions.length} score={score} />
            <QuizCard
              key={`${category}-${level}-${currentQuestion}`}
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
              questionNumber={currentQuestion + 1}
            />
          </>
        )}

        {screen === "results" && (
          <ResultsScreen score={score} total={questions.length} onRestart={handleStart} onBackToMenu={handleBackToMenu} studentName={studentName} />
        )}
      </div>
    </div>
  );
};

export default Index;
