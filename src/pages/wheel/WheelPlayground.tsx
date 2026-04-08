import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { WheelAnimation } from "@/components/WheelAnimation";
import { FormulaCard } from "@/components/FormulaCard";
import { SliderControl } from "@/components/SliderControl";
import { Button } from "@/components/ui/button";
import { Circle, Route, Play, Pause, RotateCcw, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginExperienceNudge } from "@/components/auth/LoginExperienceNudge";
import { saveWheelRecord } from "@/lib/records";
import { incrementGuestWheelSessions } from "@/lib/guest-progress";
import type { LandingLang } from "@/lib/landing-lang";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const explanations = {
  en: {
    title: "💡 Explanation",
    step1Title: "Step 1: Find the Circumference",
    step1Content: "The circumference (K) is the distance around the wheel. We calculate it using the formula:",
    step1Formula: "K = 2 × π × r",
    step1Note: "where π ≈ 3.14159 and r is the radius.",
    step2Title: "Step 2: Calculate Rotations",
    step2Content: "To find how many times the wheel rotates, divide the total distance by the circumference:",
    step2Formula: "Rotations = Distance ÷ Circumference",
    step2Note: "Make sure both values use the same unit (cm or m).",
    conclusionTitle: "✅ Conclusion",
    conclusionContent:
      "The number of rotations tells us how many complete turns the wheel makes to travel the given distance. A larger radius means fewer rotations, while a smaller radius means more rotations for the same distance.",
  },
  id: {
    title: "💡 Penjelasan",
    step1Title: "Langkah 1: Hitung Keliling Roda",
    step1Content: "Keliling (K) adalah jarak mengelilingi roda. Kita menghitungnya dengan rumus:",
    step1Formula: "K = 2 × π × r",
    step1Note: "di mana π ≈ 3.14159 dan r adalah jari-jari.",
    step2Title: "Langkah 2: Hitung Jumlah Putaran",
    step2Content: "Untuk mengetahui berapa kali roda berputar, bagi jarak total dengan keliling:",
    step2Formula: "Putaran = Jarak ÷ Keliling",
    step2Note: "Pastikan kedua nilai menggunakan satuan yang sama (cm atau m).",
    conclusionTitle: "✅ Kesimpulan",
    conclusionContent:
      "Jumlah putaran menunjukkan berapa kali roda berputar penuh untuk menempuh jarak tertentu. Jari-jari yang lebih besar berarti putaran lebih sedikit, sedangkan jari-jari yang lebih kecil berarti putaran lebih banyak untuk jarak yang sama.",
  },
};

const wheelPresets = [
  { name: "🚲 Sepeda", nameEn: "🚲 Bicycle", radius: 33, description: "Roda sepeda standar" },
  { name: "🛵 Motor", nameEn: "🛵 Motorcycle", radius: 25, description: "Roda motor matic" },
  { name: "🚗 Mobil", nameEn: "🚗 Car", radius: 35, description: "Roda mobil sedan" },
  { name: "🚌 Bus", nameEn: "🚌 Bus", radius: 50, description: "Roda bus besar" },
  { name: "🚚 Truk", nameEn: "🚚 Truck", radius: 55, description: "Roda truk kontainer" },
];

/** Wheel rotation lesson (embedded in Cognizo hub). */
const WheelPlayground = () => {
  const [radius, setRadius] = useState(35);
  const [distance, setDistance] = useState(10);
  const [isAnimating, setIsAnimating] = useState(false);
  const [language, setLanguage] = useState<"en" | "id">("id");
  const { user } = useAuth();
  const lastRecordSaveAt = useRef(0);
  const lastGuestSessionAt = useRef(0);
  const { playWheelSound, playCelebrationSound, playStartSound } = useSoundEffects();

  const circumference = 2 * Math.PI * radius;
  const distanceInCm = distance * 100;
  const rotations = distanceInCm / circumference;

  const handleStartAnimation = () => {
    if (!isAnimating) {
      playStartSound();
    }
    setIsAnimating(!isAnimating);
  };

  const handleCycleComplete = useCallback(() => {
    playCelebrationSound();
    const now = Date.now();
    if (user) {
      if (now - lastRecordSaveAt.current < 4000) return;
      lastRecordSaveAt.current = now;
      void saveWheelRecord(user.uid, {
        radiusCm: radius,
        distanceM: distance,
        rotations,
        language: language as LandingLang,
      }).catch(() => {
        toast.error(language === "id" ? "Gagal menyimpan riwayat" : "Could not save record");
      });
    } else {
      if (now - lastGuestSessionAt.current < 4000) return;
      lastGuestSessionAt.current = now;
      incrementGuestWheelSessions();
    }
  }, [playCelebrationSound, user, radius, distance, rotations, language]);

  const handleReset = () => {
    setRadius(35);
    setDistance(10);
    setIsAnimating(false);
  };

  const t = explanations[language];

  return (
    <div className="pb-12">
      <header className="pt-6 pb-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Circle className="w-4 h-4" />
            Pembelajaran Interaktif
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            <span className="text-gradient">Putaran Roda</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Menentukan berapa kali roda berputar jika diketahui jari-jari dan jaraknya
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 space-y-6">
        <section>
          <WheelAnimation
            radius={radius}
            distance={distance}
            rotations={rotations}
            isAnimating={isAnimating}
            onCycleComplete={handleCycleComplete}
            playWheelSound={playWheelSound}
          />

          <div className="flex justify-center gap-3 mt-4">
            <Button
              onClick={handleStartAnimation}
              className="gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-soft"
              size="lg"
            >
              {isAnimating ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Jalankan Animasi
                </>
              )}
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg" className="gap-2">
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            {language === "id" ? "🎯 Pilih Jenis Roda:" : "🎯 Select Wheel Type:"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {wheelPresets.map((preset) => (
              <Button
                key={preset.name}
                variant={radius === preset.radius ? "default" : "outline"}
                size="sm"
                onClick={() => setRadius(preset.radius)}
                className={`transition-all duration-200 hover:scale-105 ${
                  radius === preset.radius ? "bg-gradient-primary text-primary-foreground shadow-soft" : ""
                }`}
              >
                {language === "id" ? preset.name : preset.nameEn}
                <span className="ml-1.5 text-xs opacity-70">({preset.radius}cm)</span>
              </Button>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <SliderControl
            label="Jari-jari Roda (r)"
            value={radius}
            min={10}
            max={100}
            step={1}
            unit="cm"
            onChange={setRadius}
            icon={<Circle className="w-5 h-5 text-primary-foreground" />}
            color="primary"
          />
          <SliderControl
            label="Jarak Tempuh"
            value={distance}
            min={1}
            max={100}
            step={1}
            unit="m"
            onChange={setDistance}
            icon={<Route className="w-5 h-5 text-accent-foreground" />}
            color="secondary"
          />
        </section>

        <section>
          <FormulaCard
            radius={radius}
            distance={distance}
            rotations={rotations}
            circumference={circumference}
          />
        </section>

        <section className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{t.title}</h3>
            <Tabs value={language} onValueChange={(v) => setLanguage(v as "en" | "id")}>
              <TabsList className="h-9">
                <TabsTrigger value="id" className="gap-1.5 text-xs px-3">
                  <Globe className="w-3.5 h-3.5" />
                  ID
                </TabsTrigger>
                <TabsTrigger value="en" className="gap-1.5 text-xs px-3">
                  <Globe className="w-3.5 h-3.5" />
                  EN
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-5">
            <div className="bg-muted/40 rounded-xl p-4 border-l-4 border-primary">
              <h4 className="font-semibold text-foreground mb-2">{t.step1Title}</h4>
              <p className="text-muted-foreground text-sm mb-2">{t.step1Content}</p>
              <code className="bg-muted px-3 py-1.5 rounded text-sm font-mono block w-fit">{t.step1Formula}</code>
              <p className="text-muted-foreground text-xs mt-2 italic">{t.step1Note}</p>
            </div>

            <div className="bg-muted/40 rounded-xl p-4 border-l-4 border-secondary">
              <h4 className="font-semibold text-foreground mb-2">{t.step2Title}</h4>
              <p className="text-muted-foreground text-sm mb-2">{t.step2Content}</p>
              <code className="bg-muted px-3 py-1.5 rounded text-sm font-mono block w-fit">{t.step2Formula}</code>
              <p className="text-muted-foreground text-xs mt-2 italic">{t.step2Note}</p>
            </div>

            <div className="bg-gradient-primary/10 rounded-xl p-4 border border-primary/20">
              <h4 className="font-semibold text-foreground mb-2">{t.conclusionTitle}</h4>
              <p className="text-muted-foreground text-sm">{t.conclusionContent}</p>
            </div>
          </div>
        </section>
      </main>

      <LoginExperienceNudge lang={language as LandingLang} />
    </div>
  );
};

export default WheelPlayground;
