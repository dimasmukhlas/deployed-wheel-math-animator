import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Navigation from "@fraction/components/Navigation";
import HeroSection from "@fraction/components/HeroSection";
import InteractiveFractionExplorer from "@fraction/components/InteractiveFractionExplorer";
import LessonsSection from "@fraction/components/LessonsSection";
import QuizSection from "@fraction/components/QuizSection";

export type FractionIndexProps = { embed?: boolean };

const Index = ({ embed }: FractionIndexProps) => {
  const [activeSection, setActiveSection] = useState("home");

  const exploreRef = useRef<HTMLDivElement>(null);
  const lessonsRef = useRef<HTMLDivElement>(null);
  const quizRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    
    const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    switch (section) {
      case "home":
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "explore":
        scrollToRef(exploreRef);
        break;
      case "lessons":
        scrollToRef(lessonsRef);
        break;
      case "quiz":
        scrollToRef(quizRef);
        break;
    }
  };

  const handleStartLearning = () => {
    handleNavigate("explore");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} onNavigate={handleNavigate} embed={embed} />

      {/* Hero Section */}
      <div className={embed ? "pt-44" : "pt-16"}>
        <HeroSection onStartLearning={handleStartLearning} />
      </div>

      {/* Interactive Explorer Section */}
      <motion.div
        ref={exploreRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-16 bg-secondary/30"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Coba Sendiri! 🎮
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ubah pembilang dan penyebut untuk melihat bagaimana pecahan berubah
            </p>
          </motion.div>
          <InteractiveFractionExplorer />
        </div>
      </motion.div>

      {/* Lessons Section */}
      <div ref={lessonsRef}>
        <LessonsSection />
      </div>

      {/* Quiz Section */}
      <div ref={quizRef} className="bg-secondary/30">
        <QuizSection />
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Dibuat dengan ❤️ untuk membantu belajar matematika
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
