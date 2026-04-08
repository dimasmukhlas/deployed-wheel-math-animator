import { motion } from "framer-motion";
import { Play, Sparkles } from "lucide-react";
import FractionPieChart from "./FractionPieChart";

interface HeroSectionProps {
  onStartLearning: () => void;
}

const HeroSection = ({ onStartLearning }: HeroSectionProps) => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-secondary-foreground">
                Belajar Matematika Jadi Menyenangkan!
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              Pahami{" "}
              <span className="gradient-text">Pecahan</span>
              <br />
              dengan Animasi Interaktif
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Pelajari konsep pecahan dengan cara yang visual dan menyenangkan.
              Lihat bagaimana pecahan bekerja melalui animasi yang mudah dipahami.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStartLearning}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-glow transition-shadow"
              >
                <Play className="w-5 h-5" />
                Mulai Belajar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-secondary/80 transition-colors"
              >
                Lihat Pelajaran
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12">
              {[
                { value: "5+", label: "Pelajaran" },
                { value: "20+", label: "Latihan Soal" },
                { value: "100%", label: "Gratis" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="relative">
              {/* Floating elements */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -left-8 card-elevated p-4 rounded-2xl shadow-lg"
              >
                <span className="text-2xl font-bold text-primary">1/2</span>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-8 card-elevated p-4 rounded-2xl shadow-lg"
              >
                <span className="text-2xl font-bold text-accent">3/4</span>
              </motion.div>

              <motion.div
                animate={{ y: [-5, 15, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 -right-16 card-elevated p-3 rounded-xl shadow-lg"
              >
                <span className="text-xl font-bold text-success">✓</span>
              </motion.div>

              {/* Main pie chart */}
              <div className="relative z-10 bg-card p-8 rounded-3xl shadow-xl">
                <FractionPieChart
                  numerator={3}
                  denominator={4}
                  size={280}
                  animated={true}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
