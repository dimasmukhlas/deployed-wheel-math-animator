import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import FractionPieChart from "./FractionPieChart";

interface QuizQuestionProps {
  question: string;
  numerator: number;
  denominator: number;
  options: string[];
  correctAnswer: number;
  onAnswer: (isCorrect: boolean) => void;
}

const QuizQuestion = ({
  question,
  numerator,
  denominator,
  options,
  correctAnswer,
  onAnswer,
}: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);
    setTimeout(() => {
      onAnswer(index === correctAnswer);
    }, 1500);
  };

  const getButtonClass = (index: number) => {
    if (!showResult) {
      return "bg-card border-2 border-border hover:border-primary hover:bg-secondary";
    }
    if (index === correctAnswer) {
      return "bg-success/10 border-2 border-success";
    }
    if (index === selectedAnswer && index !== correctAnswer) {
      return "bg-destructive/10 border-2 border-destructive";
    }
    return "bg-muted border-2 border-border opacity-50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card-elevated p-8 max-w-xl mx-auto"
    >
      <h3 className="text-xl font-bold text-center mb-6 text-foreground">
        {question}
      </h3>

      <div className="flex justify-center mb-8">
        <FractionPieChart
          numerator={numerator}
          denominator={denominator}
          size={160}
          showLabel={false}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={!showResult ? { scale: 1.02 } : {}}
            whileTap={!showResult ? { scale: 0.98 } : {}}
            onClick={() => handleAnswer(index)}
            className={`p-4 rounded-xl font-bold text-lg transition-all relative ${getButtonClass(
              index
            )}`}
            disabled={showResult}
          >
            {option}
            <AnimatePresence>
              {showResult && index === correctAnswer && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-success-foreground" />
                </motion.div>
              )}
              {showResult &&
                index === selectedAnswer &&
                index !== correctAnswer && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-destructive-foreground" />
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 p-4 rounded-xl text-center ${
              selectedAnswer === correctAnswer
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {selectedAnswer === correctAnswer ? (
              <p className="font-bold">🎉 Benar! Kamu hebat!</p>
            ) : (
              <p className="font-bold">
                Belum tepat. Jawaban yang benar adalah {options[correctAnswer]}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuizQuestion;
