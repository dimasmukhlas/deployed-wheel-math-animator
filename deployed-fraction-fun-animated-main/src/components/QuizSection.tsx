import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, RotateCcw, ArrowRight } from "lucide-react";
import QuizQuestion from "./QuizQuestion";

const quizData = [
  {
    question: "Pecahan mana yang ditunjukkan gambar berikut?",
    numerator: 1,
    denominator: 4,
    options: ["1/2", "1/4", "3/4", "1/3"],
    correctAnswer: 1,
  },
  {
    question: "Berapa bagian yang terisi?",
    numerator: 2,
    denominator: 3,
    options: ["1/3", "2/3", "1/2", "3/3"],
    correctAnswer: 1,
  },
  {
    question: "Pecahan apa yang terlihat pada gambar?",
    numerator: 5,
    denominator: 8,
    options: ["3/8", "4/8", "5/8", "6/8"],
    correctAnswer: 2,
  },
  {
    question: "Tentukan pecahan yang ditampilkan!",
    numerator: 3,
    denominator: 6,
    options: ["1/2", "2/3", "3/6", "1/3"],
    correctAnswer: 2,
  },
];

const QuizSection = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
      } else {
        setQuizComplete(true);
      }
    }, 500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setQuizComplete(false);
    setQuizStarted(false);
  };

  if (!quizStarted) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-8 max-w-xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Uji Pemahamanmu!
            </h2>
            <p className="text-muted-foreground mb-6">
              Jawab {quizData.length} soal pecahan dan lihat seberapa baik pemahamanmu!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setQuizStarted(true)}
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-full font-bold text-lg shadow-accent"
            >
              Mulai Quiz
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / quizData.length) * 100);
    const getMessage = () => {
      if (percentage === 100) return "Sempurna! Kamu sangat menguasai pecahan! 🌟";
      if (percentage >= 75) return "Hebat! Kamu sudah sangat paham! 🎉";
      if (percentage >= 50) return "Bagus! Terus berlatih ya! 💪";
      return "Jangan menyerah! Coba pelajari lagi! 📚";
    };

    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-elevated p-8 max-w-xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Trophy className="w-12 h-12 text-success" />
            </motion.div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              Quiz Selesai!
            </h2>

            <div className="text-6xl font-bold gradient-text my-4">
              {score}/{quizData.length}
            </div>

            <p className="text-lg text-muted-foreground mb-6">
              {getMessage()}
            </p>

            <div className="w-full bg-muted rounded-full h-3 mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-success rounded-full"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Coba Lagi
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Progress indicator */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Soal {currentQuestion + 1} dari {quizData.length}</span>
            <span>Skor: {score}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              animate={{
                width: `${((currentQuestion + 1) / quizData.length) * 100}%`,
              }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <QuizQuestion
            key={currentQuestion}
            {...quizData[currentQuestion]}
            onAnswer={handleAnswer}
          />
        </AnimatePresence>
      </div>
    </section>
  );
};

export default QuizSection;
