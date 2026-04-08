import { useState } from "react";
import type { QuizQuestion } from "@sponge/data/quizQuestions";

interface QuizCardProps {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
  questionNumber: number;
}

const optionLabels = ["A", "B", "C", "D"];
const optionColors = [
  "bg-primary hover:brightness-110",
  "bg-secondary hover:brightness-110",
  "bg-accent hover:brightness-110",
  "bg-patrick hover:brightness-110",
];

const QuizCard = ({ question, onAnswer }: QuizCardProps) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);

    setTimeout(() => {
      onAnswer(index === question.correctIndex);
      setSelected(null);
      setShowResult(false);
    }, 1200);
  };

  const getOptionClass = (index: number) => {
    if (!showResult) {
      return `${optionColors[index]} cursor-pointer transform hover:scale-105 active:scale-95`;
    }
    if (index === question.correctIndex) {
      return "bg-correct animate-pop-in cursor-default";
    }
    if (index === selected && index !== question.correctIndex) {
      return "bg-wrong animate-shake cursor-default";
    }
    return `${optionColors[index]} opacity-50 cursor-default`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-bounce-in" key={question.id}>
      <div className="bg-primary rounded-2xl p-6 md:p-8 mb-6 shadow-2xl border-4 border-primary-foreground/20">
        <div className="flex items-start gap-3">
          <span className="font-spongeDisplay text-3xl md:text-4xl">🧽</span>
          <h2 className="font-spongeDisplay text-xl md:text-2xl text-primary-foreground leading-snug">
            {question.question}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(index)}
            disabled={showResult}
            className={`
              ${getOptionClass(index)}
              rounded-xl p-4 md:p-5 text-left
              transition-all duration-200
              shadow-lg border-2 border-foreground/10
              flex items-center gap-3
            `}
          >
            <span className="w-9 h-9 rounded-full bg-foreground/20 flex items-center justify-center font-spongeDisplay text-lg text-foreground shrink-0">
              {optionLabels[index]}
            </span>
            <span className="text-2xl shrink-0">{question.emojis[index]}</span>
            <span className="font-spongeBody font-bold text-base md:text-lg text-foreground">
              {option}
            </span>
            {showResult && index === question.correctIndex && (
              <span className="ml-auto text-2xl">✅</span>
            )}
            {showResult && index === selected && index !== question.correctIndex && (
              <span className="ml-auto text-2xl">❌</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizCard;
