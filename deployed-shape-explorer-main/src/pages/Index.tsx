import { useState } from "react";
import { Sparkles, BookOpen, Trophy } from "lucide-react";
import { ShapeTab } from "@shape/components/ShapeTab";
import { ShapeHeader } from "@shape/components/ShapeHeader";
import { ShapeCard } from "@shape/components/ShapeCard";
import { triangleObjects, cubeObjects, flatObjects, obtuseObjects, roughObjects, smoothObjects, acuteObjects, rightAngleObjects, symmetryObjects } from "@shape/data/shapes";
import { useSound } from "@shape/hooks/useSound";
import { Button } from "@shape/components/ui/button";
import Quiz from "@shape/components/Quiz";
type TabType = "triangle" | "cube" | "flat" | "obtuse" | "rough" | "smooth" | "acute" | "rightangle" | "symmetry";

const funFacts: Record<TabType, string> = {
  triangle: "Segitiga adalah bentuk geometri dengan 3 sisi dan 3 sudut. Bentuk ini sangat kuat dan sering digunakan dalam konstruksi bangunan!",
  cube: "Kubus memiliki 6 sisi yang sama besar, 12 rusuk, dan 8 titik sudut. Semua sisinya berbentuk persegi!",
  flat: "Bangun datar adalah bentuk 2 dimensi yang hanya memiliki panjang dan lebar. Contohnya lingkaran, persegi, dan persegi panjang!",
  acute: "Sudut lancip adalah sudut yang besarnya kurang dari 90°. Sudut ini terlihat runcing seperti ujung pensil!",
  rightangle: "Sudut siku-siku adalah sudut yang besarnya tepat 90°. Sudut ini membentuk huruf L dan sering ditemukan di sudut benda persegi!",
  obtuse: "Sudut tumpul adalah sudut yang besarnya lebih dari 90° tetapi kurang dari 180°. Banyak benda di rumah memiliki sudut tumpul untuk kenyamanan!",
  rough: "Permukaan kasar memiliki tekstur yang tidak rata. Permukaan ini sering digunakan untuk memberikan gesekan agar tidak licin!",
  smooth: "Permukaan halus terasa licin saat disentuh. Benda dengan permukaan halus biasanya mudah dibersihkan dan mengkilap!",
  symmetry: "Sumbu simetri adalah garis yang membagi bangun datar menjadi dua bagian yang sama persis. Lingkaran memiliki tak terhingga sumbu simetri!"
};

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("triangle");
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const { playSound } = useSound();

  const getObjects = () => {
    switch (activeTab) {
      case "triangle": return triangleObjects;
      case "cube": return cubeObjects;
      case "flat": return flatObjects;
      case "acute": return acuteObjects;
      case "rightangle": return rightAngleObjects;
      case "obtuse": return obtuseObjects;
      case "rough": return roughObjects;
      case "smooth": return smoothObjects;
      case "symmetry": return symmetryObjects;
    }
  };

  const handleTabChange = (tab: TabType) => {
    playSound("switch");
    setActiveTab(tab);
  };

  const handleCardClick = () => {
    playSound("pop");
  };

  const handleQuizOpen = () => {
    playSound("switch");
    setIsQuizOpen(true);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Hero Section */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-bounce-in">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold text-sm">Belajar Bentuk Geometri</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-4">
            Mengenal Bentuk Benda
            <span className="block text-primary mt-2">di Sekitar Rumah 🏡</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" />
            Mari belajar mengenali berbagai bentuk geometri yang ada di rumah!
          </p>

          {/* Quiz Button */}
          <Button
            onClick={handleQuizOpen}
            className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-in"
            style={{ animationDelay: "0.3s" }}
          >
            <Trophy className="w-6 h-6 mr-2" />
            Mulai Quiz! 🎯
          </Button>
        </header>

        {/* Tab Navigation */}
        <ShapeTab activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Shape Header */}
        <ShapeHeader variant={activeTab} key={activeTab} />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {getObjects().map((item, index) => (
            <ShapeCard
              key={`${activeTab}-${index}`}
              icon={item.icon}
              name={item.name}
              description={item.description}
              index={index}
              variant={activeTab}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {/* Fun Fact Section */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-card rounded-3xl p-8 shadow-lg max-w-2xl">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Tahukah Kamu?</h3>
            <p className="text-muted-foreground">{funFacts[activeTab]}</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-muted-foreground text-sm">
          <p>🎓 Belajar sambil bermain! Coba temukan benda-benda ini di rumahmu.</p>
        </footer>
      </div>

      {/* Quiz Modal */}
      <Quiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
};

export default Index;
