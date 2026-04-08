import React, { useState, useEffect } from "react";
import { cn } from "@shape/lib/utils";
import { 
  Triangle, Box, Circle, Compass, Grip, Sparkles, 
  Target, SquareEqual, FlipVertical, Trophy, Star, 
  RotateCcw, ArrowRight, CheckCircle, XCircle, Sparkle
} from "lucide-react";
import { Button } from "@shape/components/ui/button";
import { useSound } from "@shape/hooks/useSound";

type TabType = "triangle" | "cube" | "flat" | "obtuse" | "rough" | "smooth" | "acute" | "rightangle" | "symmetry";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  category: TabType;
  explanation: string;
}

const allQuestions: Question[] = [
  // Triangle questions
  { question: "Benda apa yang berbentuk segitiga?", options: ["Bola", "Penggaris segitiga", "Kotak pensil", "Botol"], correctAnswer: 1, category: "triangle", explanation: "Penggaris segitiga memiliki bentuk segitiga dengan 3 sisi!" },
  { question: "Berapa jumlah sisi segitiga?", options: ["2 sisi", "3 sisi", "4 sisi", "5 sisi"], correctAnswer: 1, category: "triangle", explanation: "Segitiga memiliki 3 sisi, sesuai namanya!" },
  { question: "Mana yang BUKAN berbentuk segitiga?", options: ["Atap rumah", "Slice pizza", "Bola basket", "Bendera segitiga"], correctAnswer: 2, category: "triangle", explanation: "Bola basket berbentuk bulat, bukan segitiga!" },
  
  // Cube questions
  { question: "Benda apa yang berbentuk kubus?", options: ["Bola", "Dadu", "Pensil", "Topi kerucut"], correctAnswer: 1, category: "cube", explanation: "Dadu adalah contoh sempurna bentuk kubus dengan 6 sisi sama!" },
  { question: "Berapa jumlah sisi kubus?", options: ["4 sisi", "5 sisi", "6 sisi", "8 sisi"], correctAnswer: 2, category: "cube", explanation: "Kubus memiliki 6 sisi yang sama besar!" },
  { question: "Mana yang berbentuk balok?", options: ["Bola tenis", "Kotak sepatu", "Kelereng", "Donat"], correctAnswer: 1, category: "cube", explanation: "Kotak sepatu berbentuk balok dengan sisi persegi panjang!" },
  
  // Flat questions
  { question: "Bentuk apa yang memiliki 4 sisi sama panjang?", options: ["Segitiga", "Persegi", "Lingkaran", "Oval"], correctAnswer: 1, category: "flat", explanation: "Persegi memiliki 4 sisi yang sama panjang!" },
  { question: "Bentuk apa yang tidak memiliki sudut?", options: ["Persegi", "Segitiga", "Lingkaran", "Trapesium"], correctAnswer: 2, category: "flat", explanation: "Lingkaran tidak memiliki sudut karena bentuknya bulat sempurna!" },
  { question: "Koin berbentuk apa?", options: ["Persegi", "Segitiga", "Lingkaran", "Bintang"], correctAnswer: 2, category: "flat", explanation: "Koin berbentuk lingkaran yang datar!" },
  
  // Obtuse angle questions
  { question: "Sudut tumpul lebih besar dari berapa derajat?", options: ["30°", "60°", "90°", "180°"], correctAnswer: 2, category: "obtuse", explanation: "Sudut tumpul lebih besar dari 90° tapi kurang dari 180°!" },
  { question: "Mana yang memiliki sudut tumpul?", options: ["Huruf L", "Kipas terbuka lebar", "Sudut meja", "Pojok buku"], correctAnswer: 1, category: "obtuse", explanation: "Kipas yang terbuka lebar membentuk sudut tumpul!" },
  { question: "Jarum jam menunjuk pukul 10:00, sudutnya adalah?", options: ["Sudut lancip", "Sudut siku-siku", "Sudut tumpul", "Sudut lurus"], correctAnswer: 2, category: "obtuse", explanation: "Pada pukul 10:00, jarum jam membentuk sudut tumpul!" },
  
  // Rough surface questions
  { question: "Mana yang memiliki permukaan kasar?", options: ["Kaca", "Amplas", "Es batu", "Cermin"], correctAnswer: 1, category: "rough", explanation: "Amplas memiliki permukaan yang sangat kasar untuk menghaluskan benda!" },
  { question: "Kulit buah apa yang kasar?", options: ["Apel", "Anggur", "Nanas", "Pisang"], correctAnswer: 2, category: "rough", explanation: "Kulit nanas sangat kasar dengan tekstur berduri!" },
  { question: "Mana yang BUKAN permukaan kasar?", options: ["Batu bata", "Aspal", "Cermin", "Kulit jeruk"], correctAnswer: 2, category: "rough", explanation: "Cermin memiliki permukaan yang sangat halus dan licin!" },
  
  // Smooth surface questions
  { question: "Mana yang memiliki permukaan halus?", options: ["Amplas", "Batu coral", "Kaca", "Kulit nanas"], correctAnswer: 2, category: "smooth", explanation: "Kaca memiliki permukaan yang sangat halus dan licin!" },
  { question: "Benda apa yang paling halus?", options: ["Batu alam", "Sutra", "Amplas", "Kulit kayu"], correctAnswer: 1, category: "smooth", explanation: "Sutra adalah kain yang sangat halus dan lembut!" },
  { question: "Mana yang BUKAN permukaan halus?", options: ["Marmer poles", "Es batu", "Batu bata", "Keramik"], correctAnswer: 2, category: "smooth", explanation: "Batu bata memiliki permukaan yang kasar!" },
  
  // Acute angle questions
  { question: "Sudut lancip lebih kecil dari berapa derajat?", options: ["45°", "60°", "90°", "180°"], correctAnswer: 2, category: "acute", explanation: "Sudut lancip kurang dari 90 derajat!" },
  { question: "Mana yang memiliki sudut lancip?", options: ["Sudut meja", "Ujung pensil runcing", "Pojok buku", "Huruf L"], correctAnswer: 1, category: "acute", explanation: "Ujung pensil yang runcing membentuk sudut lancip!" },
  { question: "Huruf apa yang memiliki sudut lancip?", options: ["O", "L", "A", "D"], correctAnswer: 2, category: "acute", explanation: "Huruf A memiliki sudut lancip di bagian atasnya!" },
  
  // Right angle questions
  { question: "Sudut siku-siku sama dengan berapa derajat?", options: ["45°", "60°", "90°", "180°"], correctAnswer: 2, category: "rightangle", explanation: "Sudut siku-siku tepat 90 derajat!" },
  { question: "Mana yang memiliki sudut siku-siku?", options: ["Ujung pensil", "Pojok meja", "Atap rumah", "Puncak gunung"], correctAnswer: 1, category: "rightangle", explanation: "Pojok meja membentuk sudut siku-siku yang sempurna!" },
  { question: "Huruf apa yang memiliki sudut siku-siku?", options: ["A", "O", "L", "S"], correctAnswer: 2, category: "rightangle", explanation: "Huruf L memiliki sudut siku-siku di pojoknya!" },
  
  // Symmetry questions
  { question: "Berapa sumbu simetri lingkaran?", options: ["1", "4", "8", "Tak terhingga"], correctAnswer: 3, category: "symmetry", explanation: "Lingkaran memiliki sumbu simetri tak terhingga!" },
  { question: "Berapa sumbu simetri persegi?", options: ["2", "4", "6", "8"], correctAnswer: 1, category: "symmetry", explanation: "Persegi memiliki 4 sumbu simetri!" },
  { question: "Mana yang memiliki sumbu simetri?", options: ["Huruf F", "Kupu-kupu", "Huruf G", "Angka 7"], correctAnswer: 1, category: "symmetry", explanation: "Kupu-kupu memiliki sumbu simetri di tengah tubuhnya!" },
];

const categoryInfo: Record<TabType, { name: string; icon: React.ElementType; color: string }> = {
  triangle: { name: "Segitiga", icon: Triangle, color: "text-triangle" },
  cube: { name: "Kubus", icon: Box, color: "text-cube" },
  flat: { name: "Bangun Datar", icon: Circle, color: "text-flat" },
  obtuse: { name: "Sudut Tumpul", icon: Compass, color: "text-obtuse" },
  rough: { name: "Permukaan Kasar", icon: Grip, color: "text-rough" },
  smooth: { name: "Permukaan Halus", icon: Sparkles, color: "text-smooth" },
  acute: { name: "Sudut Lancip", icon: Target, color: "text-acute" },
  rightangle: { name: "Sudut Siku", icon: SquareEqual, color: "text-rightangle" },
  symmetry: { name: "Simetri", icon: FlipVertical, color: "text-symmetry" },
};

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
}

const Quiz: React.FC<QuizProps> = ({ isOpen, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const { playSound } = useSound();

  const totalQuestions = 10;

  useEffect(() => {
    if (isOpen) {
      startNewQuiz();
    }
  }, [isOpen]);

  const startNewQuiz = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, totalQuestions));
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsAnswered(false);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowExplanation(true);
    
    if (answerIndex === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      playSound("success");
    } else {
      playSound("error");
    }
  };

  const handleNextQuestion = () => {
    playSound("click");
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return { message: "SEMPURNA! Kamu jenius! 🎉", emoji: "🏆" };
    if (percentage >= 80) return { message: "Luar biasa! Hampir sempurna! 🌟", emoji: "⭐" };
    if (percentage >= 60) return { message: "Bagus sekali! Terus belajar! 💪", emoji: "👍" };
    if (percentage >= 40) return { message: "Cukup baik! Ayo coba lagi! 📚", emoji: "📖" };
    return { message: "Jangan menyerah! Belajar lagi ya! 💕", emoji: "🌈" };
  };

  if (!isOpen) return null;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const CategoryIcon = currentQuestion ? categoryInfo[currentQuestion.category].icon : Triangle;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-secondary to-accent p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Quiz Geometri</h2>
                <p className="text-white/80 text-sm">Uji pengetahuanmu!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {!showResult ? (
          <div className="p-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
                </span>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-primary">{score} Poin</span>
                </div>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Category Badge */}
            {currentQuestion && (
              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4",
                "bg-gradient-to-r from-primary/10 to-secondary/10"
              )}>
                <CategoryIcon className={cn("w-4 h-4", categoryInfo[currentQuestion.category].color)} />
                <span className={cn("text-sm font-medium", categoryInfo[currentQuestion.category].color)}>
                  {categoryInfo[currentQuestion.category].name}
                </span>
              </div>
            )}

            {/* Question */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-foreground leading-relaxed">
                {currentQuestion?.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuestion?.options.map((option, index) => {
                const isCorrect = index === currentQuestion.correctAnswer;
                const isSelected = index === selectedAnswer;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className={cn(
                      "w-full p-4 rounded-2xl text-left transition-all duration-300",
                      "border-2 flex items-center gap-4",
                      !isAnswered && "hover:scale-[1.02] hover:shadow-lg cursor-pointer",
                      isAnswered && isCorrect && "bg-green-100 border-green-500",
                      isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-500",
                      !isAnswered && "bg-muted/50 border-transparent hover:border-primary/30",
                      isAnswered && !isSelected && !isCorrect && "opacity-50"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg",
                      isAnswered && isCorrect ? "bg-green-500 text-white" :
                      isAnswered && isSelected && !isCorrect ? "bg-red-500 text-white" :
                      "bg-primary/10 text-primary"
                    )}>
                      {isAnswered && isCorrect ? <CheckCircle className="w-5 h-5" /> :
                       isAnswered && isSelected && !isCorrect ? <XCircle className="w-5 h-5" /> :
                       String.fromCharCode(65 + index)}
                    </div>
                    <span className={cn(
                      "font-medium text-lg",
                      isAnswered && isCorrect && "text-green-700",
                      isAnswered && isSelected && !isCorrect && "text-red-700"
                    )}>
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className={cn(
                "p-4 rounded-2xl mb-6 animate-fade-in",
                selectedAnswer === currentQuestion?.correctAnswer 
                  ? "bg-green-50 border border-green-200" 
                  : "bg-blue-50 border border-blue-200"
              )}>
                <p className={cn(
                  "font-medium",
                  selectedAnswer === currentQuestion?.correctAnswer ? "text-green-700" : "text-blue-700"
                )}>
                  💡 {currentQuestion?.explanation}
                </p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <Button
                onClick={handleNextQuestion}
                className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              >
                {currentQuestionIndex < quizQuestions.length - 1 ? (
                  <>
                    Lanjut <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Lihat Hasil <Trophy className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          /* Result Screen */
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="text-8xl mb-4">{getScoreMessage().emoji}</div>
              <h3 className="text-3xl font-bold text-foreground mb-2">
                {getScoreMessage().message}
              </h3>
              <p className="text-muted-foreground text-lg">
                Kamu menjawab benar {score} dari {totalQuestions} pertanyaan
              </p>
            </div>

            {/* Score Circle */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * score) / totalQuestions}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <span className="text-4xl font-bold text-primary">{score}</span>
                  <span className="text-xl text-muted-foreground">/{totalQuestions}</span>
                </div>
              </div>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-8 h-8 transition-all duration-300",
                    i < Math.ceil((score / totalQuestions) * 5)
                      ? "text-yellow-500 fill-yellow-500 scale-100"
                      : "text-gray-300 scale-75"
                  )}
                  style={{ transitionDelay: `${i * 100}ms` }}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={startNewQuiz}
                className="flex-1 h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-secondary"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Main Lagi
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-14 text-lg font-bold rounded-2xl"
              >
                Selesai
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
