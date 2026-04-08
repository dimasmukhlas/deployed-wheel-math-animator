import { motion } from "framer-motion";
import { BookOpen, Divide, Equal, Scale, Layers, Calculator } from "lucide-react";
import LessonCard from "./LessonCard";

const LessonsSection = () => {
  const lessons = [
    {
      title: "Apa itu Pecahan?",
      description: "Pelajari dasar-dasar pecahan dan cara membacanya dengan benar",
      icon: BookOpen,
      color: "hsl(174, 72%, 40%)",
      progress: 100,
    },
    {
      title: "Pembilang dan Penyebut",
      description: "Memahami bagian atas dan bawah dari sebuah pecahan",
      icon: Layers,
      color: "hsl(200, 80%, 50%)",
      progress: 75,
    },
    {
      title: "Membandingkan Pecahan",
      description: "Belajar cara membandingkan dua pecahan berbeda",
      icon: Scale,
      color: "hsl(280, 65%, 55%)",
      progress: 50,
    },
    {
      title: "Pecahan Senilai",
      description: "Temukan pecahan yang memiliki nilai sama",
      icon: Equal,
      color: "hsl(16, 85%, 60%)",
      progress: 25,
    },
    {
      title: "Penjumlahan Pecahan",
      description: "Menjumlahkan pecahan dengan penyebut sama dan berbeda",
      icon: Calculator,
      color: "hsl(38, 92%, 50%)",
      progress: 0,
    },
    {
      title: "Pembagian Pecahan",
      description: "Teknik membagi pecahan dengan mudah",
      icon: Divide,
      color: "hsl(152, 69%, 45%)",
      progress: 0,
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Materi Pembelajaran
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pelajari pecahan langkah demi langkah dengan materi yang terstruktur
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.title}
              {...lesson}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LessonsSection;
