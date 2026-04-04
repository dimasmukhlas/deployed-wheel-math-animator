import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MathExpr } from "@/components/MathExpr";
import { HelpCircle, Map, Play, RotateCcw, Percent, Grid3x3, Calculator, Droplet } from "lucide-react";
import type { LandingLang } from "@/lib/landing-lang";
import { cn } from "@/lib/utils";

const copy = {
  id: {
    sectionTitle: "Soal populer per kelas",
    sectionLead:
      "Ringkasan tipe soal per kelas (SD 1–6, SMP 7–9, SMA 10–12). Contoh terurai kelas 6 (peta, nilai, tumbak, minyak L→kg) dan kelas 10 (logaritma) — dengan LaTeX dan animasi.",
    pickGrade: "Pilih kelas",
    topicsLabel: "Jenis soal yang sering dilatih",
    featuredTitle: "Contoh terurai (Kelas 6)",
    featuredSubtitle: "Pilih tab: skala peta, nilai ujian, tumbak, atau liter minyak ke kg.",
    featuredTabMap: "Skala peta",
    featuredTabScore: "Nilai ujian",
    featuredTabTumbak: "Tumbak",
    featuredTabOil: "Minyak",
    featuredTitleMap: "Skala peta",
    featuredTitleScore: "Nilai dari proporsi benar",
    featuredSubtitleMap: "Soal pilihan ganda — animasi pembahasan.",
    featuredSubtitleScore: "40 soal, 8 salah — berapa nilai jika skala 0–100?",
    featuredTitleTumbak: "Luas tanah dalam tumbak",
    featuredSubtitleTumbak: "5 tumbak setara berapa meter persegi?",
    tumbakQuestionStem: "Sebidang tanah luasnya 5 tumbak. Berapa luas tanah tersebut dalam meter persegi (m²)?",
    tumbakCorrectHint: "Luas = 70 m²",
    tumbakCaption: "Lima petak @ 1 tumbak (ilustrasi)",
    tumbakStepSatuan: "Satuan tumbak",
    tumbakStepDiketahui: "Yang diketahui",
    tumbakStepRumus: "Rumus luas dalam m²",
    tumbakStepHitung: "Perhitungan",
    tumbakStepHasil: "Jawaban",
    tumbakNote:
      "Catatan: di banyak wilayah (mis. Jawa), 1 tumbak sering ditetapkan 14 m² untuk soal sekolah — di daerah lain angka bisa berbeda; selalu ikuti ketentuan soal atau guru.",
    featuredTitleOil: "Liter minyak ke kilogram",
    featuredSubtitleOil: "1 L minyak setara berapa kg?",
    oilQuestionStem: "1 liter minyak sama dengan berapa kilogram?",
    oilCorrectHint: "Massa ≈ 0,92 kg (minyak goreng, ρ ≈ 0,92 kg/L).",
    oilCaption: "1 L botol (isi mengikuti langkah pembahasan)",
    oilStepMengapa: "Liter vs kilogram",
    oilStepRumus: "Hubungan massa, massa jenis, volume",
    oilStepRho: "Massa jenis minyak goreng",
    oilStepSubstitusi: "Substitusi V = 1 L",
    oilStepHasil: "Jawaban",
    oilNote:
      "Catatan: minyak berbeda (zaitun, pelumas, dll.) punya massa jenis beda; suhu juga mempengaruhi. Angka 0,92 kg/L adalah perkiraan umum untuk minyak goreng pada suhu kamar.",
    questionStem:
      "Jarak kota A dan B pada peta adalah 6,5 cm dengan skala 1 : 1.200.000. Jarak sebenarnya adalah …",
    options: [
      { key: "a", text: "68 km" },
      { key: "b", text: "78 km" },
      { key: "c", text: "88 km" },
      { key: "d", text: "98 km" },
    ],
    correctHint: "Jawaban benar: (b) 78 km",
    play: "Putar pembahasan",
    next: "Langkah berikutnya",
    reset: "Ulangi",
    stepIntro: "Arti skala",
    stepFormula: "Rumus jarak sebenarnya",
    stepSubstitute: "Substitusi bilangan",
    stepCm: "Hasil dalam sentimeter",
    stepKm: "Konversi ke kilometer",
    mapCaption: "Garis pada peta (bukan skala sebenarnya)",
    scoreQuestionStem:
      "Ujian terdiri dari 40 soal pilihan ganda. Siswa menjawab salah pada 8 soal. Jika nilai dihitung dari proporsi jawaban benar pada skala 0 sampai 100, berapa nilainya?",
    scoreCorrectHint: "Nilai = 80 (dari skala 0–100)",
    scoreCaption: "Proporsi benar (hijau) dan salah (merah)",
    scoreStepData: "Data yang diketahui",
    scoreStepBenar: "Hitung jawaban benar",
    scoreStepRumus: "Rumus nilai (skala 0–100)",
    scoreStepHitung: "Substitusi dan sederhanakan",
    scoreStepHasil: "Nilai akhir",
    scoreNote:
      "Catatan: beberapa sekolah memakai bobot atau pengurangan berbeda — rumus ini untuk nilai = (benar ÷ total) × 100.",
    featuredTitleLog10: "Contoh terurai (Kelas 10)",
    featuredSubtitleLog10: "Logaritma desimal — hitung nilai numerik.",
    logQuestionStem: "Tentukan nilai dari ekspresi berikut. Anggap log tanpa basis adalah log₁₀.",
    logCorrectHint: "Hasil ≈ 5,87 (2 desimal) — atau ≈ 5,874 (3 desimal).",
    logCaption: "Suku 1 dan suku 3,3·log 30 (ilustrasi)",
    logStepKonvensi: "Konvensi log",
    logStepTulis: "Susun ekspresi",
    logStepNilaiLog: "Nilai \\(\\log 30\\)",
    logStepKali: "Kalikan dengan 3,3",
    logStepJumlah: "Jumlahkan dengan 1",
    logNote:
      "Catatan: di SMA, \\(\\log x\\) tanpa basis biasanya berarti \\(\\log_{10} x\\). Gunakan kalkulator untuk \\(\\log 30\\); pembulatan mengikuti aturan soal.",
    grades: {
      1: ["Penjumlahan dan pengurangan bilangan asli", "Membandingkan panjang / berat sederhana", "Mengenal bangun datar dasar"],
      2: ["Perkalian dan pembagian", "Uang dan sisa", "Mengukur waktu (jam, menit)"],
      3: ["Pecahan sederhana dan perbandingan", "Keliling dan luas persegi / persegi panjang", "Diagram batang sederhana"],
      4: ["Pecahan dan desimal dalam operasi", "Sudut dan jenis segitiga", "Faktor dan kelipatan"],
      5: ["Perbandingan dan proporsi", "Luas bangun datar gabungan", "Volume kubus / balok pengantar"],
      6: [
        "Skala peta dan jarak sebenarnya",
        "Menghitung nilai ujian dari jumlah benar/salah (skala 0–100)",
        "Satuan luas tradisional: tumbak ke meter persegi (m²)",
        "Massa jenis: liter minyak ke kilogram (perlu ρ, contoh minyak goreng)",
        "Operasi pecahan & desimal dalam konteks",
        "Statistik: mean, median, modus; diagram",
        "Bangun ruang: luas permukaan & volume sederhana",
      ],
      7: [
        "Bilangan rasional & operasi aljabar pengantar",
        "Persamaan linear satu variabel; perbandingan berbalik nilai",
        "Segitiga & sudut; teks eksplanasi dan prosedur",
        "IPA: klasifikasi makhluk hidup, gerak lurus",
      ],
      8: [
        "Persamaan garis lurus, gradien, sistem persamaan linear",
        "Lingkaran: unsur, sudut pusat & keliling",
        "Teorema Pythagoras dalam soal kontekstual",
        "IPA: gaya, tekanan, reaksi kimia sederhana",
      ],
      9: [
        "Fungsi linear, barisan, statistik & peluang ujian SMP",
        "Bangun ruang: tabung, kerucut, bola (volume & luas)",
        "Persiapan ASPD: try out & literasi numerasi",
        "IPA terpadu: listrik, asam-basa, sistem organ",
      ],
      10: [
        "Fungsi komposisi & invers; eksponen & logaritma (contoh: 1 + 3,3 log 30)",
        "Trigonometri: identitas dan persamaan dasar",
        "IPA: stoikiometri, listrik arus searah, genetika pengantar",
        "Bahasa Indonesia: teks eksposisi & laporan",
      ],
      11: [
        "Limit & turunan; aplikasi optimasi sederhana",
        "Barisan & deret; peluang & statistik lanjut",
        "Kimia: kesetimbangan; Fisika: gelombang & optik",
        "Persiapan ujian sekolah & pola literasi",
      ],
      12: [
        "Integral & aplikasi; matriks & transformasi",
        "Persiapan kelulusan, try out, dan pola UTBK-SNBT",
        "IPA: elektromagnetik, organik & biokimia (pengantar)",
        "Literasi & penalaran matematika–sains",
      ],
    },
  },
  en: {
    sectionTitle: "Popular question types by grade",
    sectionLead:
      "Topic snapshots by grade (1–12). Grade 6 walkthroughs (map, score, tumbak, oil L→kg) and a Grade 10 logarithm example — LaTeX and animation.",
    pickGrade: "Choose grade",
    topicsLabel: "Common practice topics",
    featuredTitle: "Worked examples (Grade 6)",
    featuredSubtitle: "Choose a tab: map scale, test score, tumbak, or oil litres to kg.",
    featuredTabMap: "Map scale",
    featuredTabScore: "Test score",
    featuredTabTumbak: "Tumbak",
    featuredTabOil: "Oil",
    featuredTitleMap: "Map scale",
    featuredTitleScore: "Score from proportion correct",
    featuredSubtitleMap: "Multiple choice — animated solution.",
    featuredSubtitleScore: "40 items, 8 wrong — what is the score on a 0–100 scale?",
    featuredTitleTumbak: "Land area in tumbak",
    featuredSubtitleTumbak: "How many square metres is 5 tumbak?",
    tumbakQuestionStem:
      "A plot of land has an area of 5 tumbak. What is the area in square metres (m²)?",
    tumbakCorrectHint: "Area = 70 m²",
    tumbakCaption: "Five plots @ 1 tumbak each (illustrative)",
    tumbakStepSatuan: "The tumbak unit",
    tumbakStepDiketahui: "What is given",
    tumbakStepRumus: "Area formula in m²",
    tumbakStepHitung: "Calculation",
    tumbakStepHasil: "Answer",
    tumbakNote:
      "Note: in many regions (e.g. Java), 1 tumbak is often taken as 14 m² in school problems — other regions may differ; follow the problem statement or teacher.",
    featuredTitleOil: "Cooking oil: litres to kilograms",
    featuredSubtitleOil: "How many kilograms is 1 L of oil?",
    oilQuestionStem: "How many kilograms is 1 litre of oil?",
    oilCorrectHint: "Mass ≈ 0.92 kg (typical cooking oil, ρ ≈ 0.92 kg/L).",
    oilCaption: "1 L bottle (fill tracks the solution steps)",
    oilStepMengapa: "Litres vs kilograms",
    oilStepRumus: "Mass, density, and volume",
    oilStepRho: "Density of cooking oil",
    oilStepSubstitusi: "Substitute V = 1 L",
    oilStepHasil: "Answer",
    oilNote:
      "Note: different oils (olive, motor oil, etc.) have different densities; temperature matters too. 0.92 kg/L is a common room-temperature estimate for cooking oil.",
    questionStem:
      "The distance between towns A and B on a map is 6.5 cm at scale 1 : 1,200,000. The actual distance is …",
    options: [
      { key: "a", text: "68 km" },
      { key: "b", text: "78 km" },
      { key: "c", text: "88 km" },
      { key: "d", text: "98 km" },
    ],
    correctHint: "Correct answer: (b) 78 km",
    play: "Play solution",
    next: "Next step",
    reset: "Reset",
    stepIntro: "What the scale means",
    stepFormula: "Formula for real distance",
    stepSubstitute: "Substitute the numbers",
    stepCm: "Result in centimetres",
    stepKm: "Convert to kilometres",
    mapCaption: "Line on the map (illustrative)",
    scoreQuestionStem:
      "A test has 40 multiple-choice questions. A student got 8 questions wrong. If the score is the proportion of correct answers on a 0–100 scale, what is the score?",
    scoreCorrectHint: "Score = 80 (on a 0–100 scale)",
    scoreCaption: "Correct (green) vs wrong (red)",
    scoreStepData: "Given data",
    scoreStepBenar: "Count correct answers",
    scoreStepRumus: "Score formula (0–100 scale)",
    scoreStepHitung: "Substitute and simplify",
    scoreStepHasil: "Final score",
    scoreNote:
      "Note: some schools use different weighting or penalties — this uses score = (correct ÷ total) × 100.",
    featuredTitleLog10: "Worked example (Grade 10)",
    featuredSubtitleLog10: "Decimal logarithms — numeric evaluation.",
    logQuestionStem: "Evaluate the expression below. Take log without a base to mean log base 10.",
    logCorrectHint: "Result ≈ 5.87 (2 d.p.) — or ≈ 5.874 (3 d.p.).",
    logCaption: "Term 1 and term 3.3·log 30 (illustrative)",
    logStepKonvensi: "Log convention",
    logStepTulis: "Write the expression",
    logStepNilaiLog: "Value of \\(\\log 30\\)",
    logStepKali: "Multiply by 3.3",
    logStepJumlah: "Add 1",
    logNote:
      "Note: in many curricula, \\(\\log x\\) without a base means \\(\\log_{10} x\\). Use a calculator for \\(\\log 30\\); rounding follows the problem.",
    grades: {
      1: ["Addition and subtraction of whole numbers", "Comparing length / mass in simple units", "Basic plane shapes"],
      2: ["Multiplication and division", "Money and change", "Telling time (hours, minutes)"],
      3: ["Simple fractions and comparison", "Perimeter and area of square / rectangle", "Simple bar charts"],
      4: ["Fractions and decimals in operations", "Angles and types of triangles", "Factors and multiples"],
      5: ["Ratios and proportion", "Area of composite figures", "Intro to volume of cube / cuboid"],
      6: [
        "Map scale and real distance",
        "Test score from counts of correct/wrong (0–100 scale)",
        "Traditional area units: tumbak to square metres (m²)",
        "Density: litres of oil to kilograms (needs ρ; e.g. cooking oil)",
        "Fraction & decimal word problems",
        "Statistics: mean, median, mode; charts",
        "3D figures: surface area & simple volume",
      ],
      7: [
        "Rational numbers & intro algebra",
        "Linear equations in one variable; inverse proportion",
        "Triangles & angles; explanatory & procedural texts",
        "Science: classification of life, linear motion",
      ],
      8: [
        "Straight-line graphs, gradients, systems of linear equations",
        "Circles: elements, central angles, circumference",
        "Pythagoras in contextual problems",
        "Science: forces, pressure, simple chemical reactions",
      ],
      9: [
        "Linear functions, sequences, statistics & probability for junior-high exams",
        "3D solids: cylinders, cones, spheres (volume & surface area)",
        "ASPD-style prep: drills & literacy/numeracy practice",
        "Integrated science: electricity, acids & bases, organ systems",
      ],
      10: [
        "Function composition & inverse; exponentials & logarithms (e.g. 1 + 3.3 log 30)",
        "Trigonometry: identities and basic equations",
        "Science: stoichiometry, DC circuits, intro genetics",
        "Indonesian: expository & report texts",
      ],
      11: [
        "Limits & derivatives; basic optimization",
        "Sequences & series; probability & statistics",
        "Chemistry: equilibrium; Physics: waves & optics",
        "School-exam prep & literacy-style items",
      ],
      12: [
        "Integrals & applications; matrices & transformations",
        "Graduation prep, try-outs, and UTBK-SNBT-style reasoning",
        "Science: electromagnetism, organic & biochemistry (intro)",
        "Literacy & mathematical–scientific reasoning practice",
      ],
    },
  },
} as const;

const MAX_STEP_MAP = 5;
const MAX_STEP_SCORE = 5;
const MAX_STEP_TUMBAK = 5;
const MAX_STEP_OIL = 5;
const MAX_STEP_LOG = 5;
/** Banyak soal sekolah memakai 1 tumbak = 14 m² (umum di Jawa). */
const M2_PER_TUMBAK = 14;
/** Untuk tampilan pembahasan: log₁₀(30) dibulatkan; hasil akhir ≈ 5,8745. */
const LOG30_APPROX = 1.4771;
const LOG_PRODUCT_APPROX = 3.3 * LOG30_APPROX;
const LOG_SUM_APPROX = 1 + LOG_PRODUCT_APPROX;
/** Minyak goreng pada suhu kamar: perkiraan umum untuk soal kontekstual (kg/L). */
const OIL_RHO_KG_PER_L = 0.92;

function MapScaleVisual({ progress, caption }: { progress: number; caption: string }) {
  const p = Math.min(1, Math.max(0, progress));
  return (
    <div className="relative rounded-xl border border-primary/20 bg-gradient-to-b from-sky-50/80 to-amber-50/40 dark:from-sky-950/30 dark:to-amber-950/20 p-4 md:p-5 overflow-hidden">
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-3">
        <span className="flex items-center gap-1.5">
          <Map className="w-3.5 h-3.5" /> A
        </span>
        <span className="flex items-center gap-1.5">
          B <Map className="w-3.5 h-3.5" />
        </span>
      </div>
      <div className="relative h-14 flex items-center">
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-border rounded" />
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary to-secondary shadow-soft origin-left transition-all duration-700 ease-out"
          style={{ width: `${p * 100}%` }}
        />
        <span
          className={cn(
            "absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-primary transition-opacity duration-500",
            p > 0.85 ? "opacity-100" : "opacity-0"
          )}
        >
          6,5 cm
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-7 italic">{caption}</p>
    </div>
  );
}

function ScaleSolutionSteps({ lang, step }: { lang: LandingLang; step: number }) {
  const t = copy[lang];
  const show = (n: number) => step >= n;

  const texScaleMeaning =
    lang === "id"
      ? String.raw`1\text{ cm pada peta} : 1\,200\,000\text{ cm di lapangan} \;\Rightarrow\; 1\,200\,000\text{ cm} = 12\text{ km}`
      : String.raw`1\text{ cm on map} : 1\,200\,000\text{ cm in reality} \;\Rightarrow\; 1\,200\,000\text{ cm} = 12\text{ km}`;

  const texFormula =
    lang === "id"
      ? String.raw`d_{\text{sebenarnya}} = d_{\text{peta}} \times \text{penyebut skala}`
      : String.raw`d_{\text{actual}} = d_{\text{map}} \times \text{(scale denominator)}`;

  return (
    <div className="space-y-4 text-left">
      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(1) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.stepIntro}</p>
        <MathExpr block tex={texScaleMeaning} />
        <p className="text-xs text-muted-foreground mt-2">
          {lang === "id"
            ? "Setiap 1 cm di peta mewakili 1.200.000 cm di lapangan; 1.200.000 cm = 12 km."
            : "Each 1 cm on the map represents 1,200,000 cm on the ground; 1,200,000 cm = 12 km."}
        </p>
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(2) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.stepFormula}</p>
        <MathExpr block tex={texFormula} />
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(3) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.stepSubstitute}</p>
        <MathExpr
          block
          tex="d_{\text{sebenarnya}} = 6{,}5 \times 1\,200\,000"
        />
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(4) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.stepCm}</p>
        <MathExpr block tex="= 7\,800\,000 \text{ cm}" />
      </div>

      <div
        className={cn(
          "rounded-lg border bg-primary/10 p-3 transition-all duration-500",
          show(5) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.stepKm}</p>
        <MathExpr
          block
          tex="7\,800\,000 \text{ cm} = \frac{7\,800\,000}{100\,000}\text{ km} = 78\text{ km}"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {lang === "id"
            ? "Pembagi 100.000 mengubah cm ke km (÷100 ke meter, ÷1000 ke km)."
            : "Dividing by 100,000 converts cm to km (÷100 to m, ÷1000 to km)."}
        </p>
        <p className="mt-3 text-sm font-bold text-primary">{t.correctHint}</p>
      </div>
    </div>
  );
}

function ScoreVisual({ step, caption, lang }: { step: number; caption: string; lang: LandingLang }) {
  const p = step === 0 ? 0 : Math.min(1, step / MAX_STEP_SCORE);
  const showSplit = step >= 3;
  const previewWidth = p * 80;

  return (
    <div className="relative rounded-xl border border-primary/20 bg-gradient-to-b from-emerald-50/60 to-rose-50/40 dark:from-emerald-950/25 dark:to-rose-950/20 p-4 md:p-5 overflow-hidden">
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
        <Percent className="w-4 h-4 text-primary" />
        <span>{lang === "id" ? "40 soal" : "40 items"}</span>
      </div>
      <div className="h-12 w-full rounded-lg border bg-muted/50 overflow-hidden flex">
        {showSplit ? (
          <>
            <div
              className="h-full bg-gradient-to-b from-emerald-500 to-emerald-600 transition-all duration-700 ease-out"
              style={{ width: `${(32 / 40) * 100}%` }}
            />
            <div
              className="h-full bg-gradient-to-b from-rose-400 to-rose-500 transition-all duration-700 ease-out"
              style={{ width: `${(8 / 40) * 100}%` }}
            />
          </>
        ) : (
          <div
            className="h-full bg-gradient-to-b from-emerald-500 to-emerald-600 transition-all duration-700 ease-out"
            style={{ width: `${previewWidth}%` }}
          />
        )}
      </div>
      <div className="flex justify-between text-[11px] font-medium mt-2 text-muted-foreground">
        <span className={step >= 2 ? "text-emerald-700 dark:text-emerald-400" : ""}>
          {step >= 2 ? (lang === "id" ? "32 benar" : "32 correct") : "…"}
        </span>
        <span className={step >= 2 ? "text-rose-700 dark:text-rose-400" : ""}>
          {step >= 2 ? (lang === "id" ? "8 salah" : "8 wrong") : "…"}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-3 italic">{caption}</p>
    </div>
  );
}

function ScoreSolutionSteps({ lang, step }: { lang: LandingLang; step: number }) {
  const t = copy[lang];
  const show = (n: number) => step >= n;

  return (
    <div className="space-y-4 text-left">
      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(1) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.scoreStepData}</p>
        <p className="text-sm text-foreground/90">
          {lang === "id"
            ? "Jumlah soal (total) = 40. Banyak salah = 8."
            : "Total questions = 40. Number wrong = 8."}
        </p>
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(2) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.scoreStepBenar}</p>
        <MathExpr block tex="\text{benar} = 40 - 8 = 32" />
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(3) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.scoreStepRumus}</p>
        <MathExpr
          block
          tex="\text{Nilai} = \frac{\text{benar}}{\text{total}} \times 100"
        />
        <p className="text-xs text-muted-foreground mt-2">
          {lang === "id"
            ? "Setiap jawaban benar dibanding total soal, lalu dikalikan 100 untuk skala 0–100."
            : "Correct answers divided by total, times 100 for a 0–100 scale."}
        </p>
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(4) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.scoreStepHitung}</p>
        <MathExpr block tex="= \frac{32}{40} \times 100 = \frac{4}{5} \times 100" />
      </div>

      <div
        className={cn(
          "rounded-lg border bg-primary/10 p-3 transition-all duration-500",
          show(5) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.scoreStepHasil}</p>
        <MathExpr block tex="= 80" />
        <p className="text-xs text-muted-foreground mt-2">{t.scoreNote}</p>
        <p className="mt-3 text-sm font-bold text-primary">{t.scoreCorrectHint}</p>
      </div>
    </div>
  );
}

function TumbakVisual({ step, caption, lang }: { step: number; caption: string; lang: LandingLang }) {
  const filledBoxes = step === 0 ? 0 : Math.min(step, MAX_STEP_TUMBAK);

  return (
    <div className="relative rounded-xl border border-primary/20 bg-gradient-to-b from-amber-50/70 to-emerald-50/50 dark:from-amber-950/25 dark:to-emerald-950/20 p-4 md:p-5 overflow-hidden">
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
        <Grid3x3 className="w-4 h-4 text-primary" />
        <span>{lang === "id" ? `${M2_PER_TUMBAK} m² per tumbak` : `${M2_PER_TUMBAK} m² per tumbak`}</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "aspect-square rounded-lg border-2 transition-all duration-500 flex items-center justify-center text-[10px] font-bold",
              i < filledBoxes
                ? "border-emerald-500 bg-emerald-500/85 text-white shadow-soft"
                : "border-dashed border-muted-foreground/30 bg-muted/40 text-muted-foreground"
            )}
          >
            {i < filledBoxes ? (lang === "id" ? `${i + 1}` : `${i + 1}`) : ""}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-3 italic">{caption}</p>
    </div>
  );
}

function TumbakSolutionSteps({ lang, step }: { lang: LandingLang; step: number }) {
  const t = copy[lang];
  const show = (n: number) => step >= n;

  return (
    <div className="space-y-4 text-left">
      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(1) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.tumbakStepSatuan}</p>
        <MathExpr block tex={`1\\text{ tumbak} = ${M2_PER_TUMBAK}\\text{ m}^2`} />
        <p className="text-xs text-muted-foreground mt-2">{t.tumbakNote}</p>
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(2) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.tumbakStepDiketahui}</p>
        <p className="text-sm text-foreground/90">
          {lang === "id" ? "Luas tanah = 5 tumbak." : "Land area = 5 tumbak."}
        </p>
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(3) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.tumbakStepRumus}</p>
        <MathExpr block tex="L\text{ (m}^2\text{)} = (\text{banyak tumbak}) \times (\text{m}^2\text{ per tumbak})" />
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(4) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.tumbakStepHitung}</p>
        <MathExpr block tex={`L = 5 \\times ${M2_PER_TUMBAK} = 70`} />
      </div>

      <div
        className={cn(
          "rounded-lg border bg-primary/10 p-3 transition-all duration-500",
          show(5) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.tumbakStepHasil}</p>
        <MathExpr block tex="L = 70\text{ m}^2" />
        <p className="mt-3 text-sm font-bold text-primary">{t.tumbakCorrectHint}</p>
      </div>
    </div>
  );
}

function OilVisual({ step, caption }: { step: number; caption: string }) {
  const fillPct = step === 0 ? 0 : Math.min(100, (step / MAX_STEP_OIL) * 100);

  return (
    <div className="relative rounded-xl border border-primary/20 bg-gradient-to-b from-amber-50/80 to-amber-100/40 dark:from-amber-950/30 dark:to-amber-950/15 p-4 md:p-5 overflow-hidden">
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
        <Droplet className="w-4 h-4 text-amber-600" />
        <span>1 L</span>
      </div>
      <div className="h-40 w-28 mx-auto rounded-b-3xl rounded-t-md border-2 border-amber-900/35 bg-muted/20 relative overflow-hidden flex flex-col justify-end shadow-inner">
        <div
          className="w-full bg-gradient-to-t from-amber-700 via-amber-500 to-amber-300 transition-all duration-700 ease-out"
          style={{ height: `${fillPct}%`, minHeight: step > 0 ? "8px" : 0 }}
        />
        <span className="pointer-events-none absolute bottom-2 inset-x-0 text-center text-[10px] font-bold text-white drop-shadow-sm">
          {fillPct > 15 ? "1 L" : ""}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-3 italic">{caption}</p>
    </div>
  );
}

function OilSolutionSteps({ lang, step }: { lang: LandingLang; step: number }) {
  const t = copy[lang];
  const show = (n: number) => step >= n;
  const rhoTex = lang === "id" ? "0{,}92" : OIL_RHO_KG_PER_L.toFixed(2);

  return (
    <div className="space-y-4 text-left">
      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(1) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.oilStepMengapa}</p>
        <p className="text-sm text-foreground/90">
          {lang === "id"
            ? "Liter mengukur volume, kilogram mengukur massa. Tidak otomatis 1 L = 1 kg — kecuali zat dengan massa jenis tertentu (air murni ≈ 1 kg/L). Minyak lebih ringan dari air."
            : "Litres measure volume; kilograms measure mass. 1 L is not automatically 1 kg — unless the substance has that density (pure water ≈ 1 kg/L). Oil is less dense than water."}
        </p>
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(2) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.oilStepRumus}</p>
        <MathExpr block tex="m = \rho \cdot V" />
        <p className="text-xs text-muted-foreground mt-2">
          {lang === "id" ? "dengan m massa, ρ massa jenis, V volume." : "where m is mass, ρ density, V volume."}
        </p>
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(3) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.oilStepRho}</p>
        <MathExpr
          block
          tex={
            lang === "id"
              ? `\\rho_{\\text{minyak goreng}} \\approx ${rhoTex} \\text{ kg/L}`
              : `\\rho_{\\text{cooking oil}} \\approx ${rhoTex} \\text{ kg/L}`
          }
        />
        <p className="text-xs text-muted-foreground mt-2">
          {lang === "id"
            ? "Nilai ini perkiraan pada suhu kamar; ikuti data pada soal jika ada."
            : "This is a typical room-temperature estimate; use the problem’s data if given."}
        </p>
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(4) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.oilStepSubstitusi}</p>
        <MathExpr block tex={`m = ${rhoTex} \\times 1\\text{ L}`} />
      </div>

      <div
        className={cn(
          "rounded-lg border bg-primary/10 p-3 transition-all duration-500",
          show(5) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.oilStepHasil}</p>
        <MathExpr block tex={`m \\approx ${rhoTex} \\text{ kg}`} />
        <p className="text-xs text-muted-foreground mt-2">{t.oilNote}</p>
        <p className="mt-3 text-sm font-bold text-primary">{t.oilCorrectHint}</p>
      </div>
    </div>
  );
}

function LogVisual({ step, caption, lang }: { step: number; caption: string; lang: LandingLang }) {
  const total = LOG_SUM_APPROX;
  const pct1 = (1 / total) * 100;
  const pct2 = (LOG_PRODUCT_APPROX / total) * 100;
  const showBar = step >= 3;
  const dec = lang === "id" ? "3,3" : "3.3";

  return (
    <div className="relative rounded-xl border border-primary/20 bg-gradient-to-b from-sky-50/70 to-violet-50/50 dark:from-sky-950/25 dark:to-violet-950/20 p-4 md:p-5 overflow-hidden">
      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground mb-3">
        <Calculator className="w-4 h-4 text-primary" />
        <span>
          1 + {dec} · log 30
        </span>
      </div>
      <div
        className={cn(
          "h-12 w-full rounded-lg border bg-muted/40 overflow-hidden flex transition-opacity duration-500",
          showBar ? "opacity-100" : "opacity-35"
        )}
      >
        {showBar ? (
          <>
            <div
              className="h-full bg-gradient-to-b from-sky-500 to-sky-600 flex items-center justify-center text-[10px] font-bold text-white px-1"
              style={{ width: `${pct1}%` }}
            >
              +1
            </div>
            <div
              className="h-full bg-gradient-to-b from-violet-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white px-1 text-center leading-tight"
              style={{ width: `${pct2}%` }}
            >
              {dec}·log30
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[11px] text-muted-foreground italic">…</div>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground text-center mt-3 italic">{caption}</p>
    </div>
  );
}

function LogSolutionSteps({ lang, step }: { lang: LandingLang; step: number }) {
  const t = copy[lang];
  const show = (n: number) => step >= n;
  const k = lang === "id" ? "3{,}3" : "3.3";

  return (
    <div className="space-y-4 text-left">
      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(1) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.logStepKonvensi}</p>
        <MathExpr
          block
          tex={
            lang === "id"
              ? String.raw`\log x = \log_{10} x \quad\text{(log biasa / Briggs)}`
              : String.raw`\log x = \log_{10} x \quad\text{(common log)}`
          }
        />
        <p className="text-xs text-muted-foreground mt-2">
          {lang === "id"
            ? "Tanpa menulis basis, soal SMA umumnya memakai log₁₀."
            : "If no base is written, log usually means base 10."}
        </p>
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(2) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.logStepTulis}</p>
        <MathExpr block tex={`1 + ${k} \\log 30`} />
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(3) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.logStepNilaiLog}</p>
        <MathExpr block tex={`\\log_{10} 30 \\approx ${LOG30_APPROX}`} />
      </div>

      <div
        className={cn(
          "rounded-lg border bg-muted/30 p-3 transition-all duration-500",
          show(4) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.logStepKali}</p>
        <MathExpr block tex={`${k} \\times ${LOG30_APPROX} \\approx ${LOG_PRODUCT_APPROX.toFixed(3)}`} />
      </div>

      <div
        className={cn(
          "rounded-lg border bg-primary/10 p-3 transition-all duration-500",
          show(5) ? "opacity-100 translate-y-0" : "opacity-40 translate-y-1"
        )}
      >
        <p className="text-xs font-semibold text-primary mb-1">{t.logStepJumlah}</p>
        <MathExpr
          block
          tex={
            lang === "id"
              ? `1 + ${LOG_PRODUCT_APPROX.toFixed(3)} = ${LOG_SUM_APPROX.toFixed(4)} \\approx 5{,}87`
              : `1 + ${LOG_PRODUCT_APPROX.toFixed(3)} = ${LOG_SUM_APPROX.toFixed(4)} \\approx 5.87`
          }
        />
        <p className="text-xs text-muted-foreground mt-2">{t.logNote}</p>
        <p className="mt-3 text-sm font-bold text-primary">{t.logCorrectHint}</p>
      </div>
    </div>
  );
}

export function PopularQuestionsSection({ lang }: { lang: LandingLang }) {
  const t = copy[lang];
  const [grade, setGrade] = useState<string>("6");
  const [exampleTab, setExampleTab] = useState<"map" | "score" | "tumbak" | "oil">("map");
  const [stepMap, setStepMap] = useState(0);
  const [stepScore, setStepScore] = useState(0);
  const [stepTumbak, setStepTumbak] = useState(0);
  const [stepOil, setStepOil] = useState(0);
  const [stepLog, setStepLog] = useState(0);

  useEffect(() => {
    setStepMap(0);
    setStepScore(0);
    setStepTumbak(0);
    setStepOil(0);
    setStepLog(0);
  }, [lang]);

  const mapProgress = stepMap === 0 ? 0 : Math.min(1, stepMap / MAX_STEP_MAP);

  const handlePlayMap = () => {
    if (stepMap === 0) setStepMap(1);
    else if (stepMap < MAX_STEP_MAP) setStepMap((s) => s + 1);
  };

  const handleResetMap = () => setStepMap(0);

  const handlePlayScore = () => {
    if (stepScore === 0) setStepScore(1);
    else if (stepScore < MAX_STEP_SCORE) setStepScore((s) => s + 1);
  };

  const handleResetScore = () => setStepScore(0);

  const handlePlayTumbak = () => {
    if (stepTumbak === 0) setStepTumbak(1);
    else if (stepTumbak < MAX_STEP_TUMBAK) setStepTumbak((s) => s + 1);
  };

  const handleResetTumbak = () => setStepTumbak(0);

  const handlePlayOil = () => {
    if (stepOil === 0) setStepOil(1);
    else if (stepOil < MAX_STEP_OIL) setStepOil((s) => s + 1);
  };

  const handleResetOil = () => setStepOil(0);

  const handlePlayLog = () => {
    if (stepLog === 0) setStepLog(1);
    else if (stepLog < MAX_STEP_LOG) setStepLog((s) => s + 1);
  };

  const handleResetLog = () => setStepLog(0);

  const gradeNum = Number(grade) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  const topics = t.grades[gradeNum];

  return (
    <section className="max-w-5xl mx-auto mb-12 md:mb-14 px-0">
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-primary mb-2">
          <HelpCircle className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wide">FAQ</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t.sectionTitle}</h2>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{t.sectionLead}</p>
      </div>

      <Card className="glass-card border shadow-card mb-8">
        <CardHeader>
          <CardTitle className="text-lg">{t.pickGrade}</CardTitle>
          <CardDescription>{t.topicsLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={grade} onValueChange={setGrade} className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 h-auto gap-1 bg-muted/50 p-1">
              {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((g) => (
                <TabsTrigger key={g} value={String(g)} className="text-xs sm:text-sm px-1.5">
                  {lang === "id" ? `Kelas ${g}` : `G${g}`}
                </TabsTrigger>
              ))}
            </TabsList>
            {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((g) => (
              <TabsContent key={g} value={String(g)} className="mt-4">
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground text-left">
                  {t.grades[g].map((line, i) => (
                    <li key={i} className="text-foreground/90">
                      {line}
                    </li>
                  ))}
                </ul>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Grade 6 featured: map scale + test score */}
      <Card className="glass-card border-2 border-primary/20 shadow-card overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardTitle className="text-xl md:text-2xl">{t.featuredTitle}</CardTitle>
          <CardDescription className="text-base">{t.featuredSubtitle}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={exampleTab} onValueChange={(v) => setExampleTab(v as "map" | "score" | "tumbak" | "oil")} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 sm:grid-cols-4 h-auto min-h-10 mb-6 gap-1">
              <TabsTrigger value="map" className="text-xs sm:text-sm px-2">
                {t.featuredTabMap}
              </TabsTrigger>
              <TabsTrigger value="score" className="text-xs sm:text-sm px-2">
                {t.featuredTabScore}
              </TabsTrigger>
              <TabsTrigger value="tumbak" className="text-xs sm:text-sm px-2">
                {t.featuredTabTumbak}
              </TabsTrigger>
              <TabsTrigger value="oil" className="text-xs sm:text-sm px-2">
                {t.featuredTabOil}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="map" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-center mb-1">{t.featuredTitleMap}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">{t.featuredSubtitleMap}</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-left">
                <p className="text-sm md:text-base font-medium leading-relaxed mb-4">{t.questionStem}</p>
                <ol className="space-y-2 text-sm">
                  {t.options.map((o) => (
                    <li
                      key={o.key}
                      className={cn(
                        "flex gap-2 rounded-lg px-3 py-2 border transition-colors",
                        o.key === "b" && stepMap >= MAX_STEP_MAP
                          ? "border-primary bg-primary/10 font-semibold"
                          : "border-transparent bg-muted/40"
                      )}
                    >
                      <span className="font-mono w-6 shrink-0">{o.key}.</span>
                      <span>{o.text}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div>
                  <MapScaleVisual progress={mapProgress} caption={t.mapCaption} />
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2"
                      onClick={handlePlayMap}
                      disabled={stepMap >= MAX_STEP_MAP}
                    >
                      <Play className="w-4 h-4" />
                      {stepMap === 0 ? t.play : t.next}
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="gap-2" onClick={handleResetMap}>
                      <RotateCcw className="w-4 h-4" />
                      {t.reset}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {lang === "id"
                      ? `Langkah ${Math.min(stepMap, MAX_STEP_MAP)} / ${MAX_STEP_MAP}`
                      : `Step ${Math.min(stepMap, MAX_STEP_MAP)} / ${MAX_STEP_MAP}`}
                  </p>
                </div>
                <div className="min-w-0">
                  {stepMap >= 1 ? (
                    <ScaleSolutionSteps lang={lang} step={stepMap} />
                  ) : (
                    <p className="text-sm text-muted-foreground italic text-center py-8">
                      {lang === "id"
                        ? 'Tekan "Putar pembahasan" untuk melihat rumus dan langkah dengan LaTeX.'
                        : 'Press "Play solution" to reveal the LaTeX steps.'}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="score" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-center mb-1">{t.featuredTitleScore}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">{t.featuredSubtitleScore}</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-left">
                <p className="text-sm md:text-base font-medium leading-relaxed">{t.scoreQuestionStem}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div>
                  <ScoreVisual step={stepScore} caption={t.scoreCaption} lang={lang} />
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2"
                      onClick={handlePlayScore}
                      disabled={stepScore >= MAX_STEP_SCORE}
                    >
                      <Play className="w-4 h-4" />
                      {stepScore === 0 ? t.play : t.next}
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="gap-2" onClick={handleResetScore}>
                      <RotateCcw className="w-4 h-4" />
                      {t.reset}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {lang === "id"
                      ? `Langkah ${Math.min(stepScore, MAX_STEP_SCORE)} / ${MAX_STEP_SCORE}`
                      : `Step ${Math.min(stepScore, MAX_STEP_SCORE)} / ${MAX_STEP_SCORE}`}
                  </p>
                </div>
                <div className="min-w-0">
                  {stepScore >= 1 ? (
                    <ScoreSolutionSteps lang={lang} step={stepScore} />
                  ) : (
                    <p className="text-sm text-muted-foreground italic text-center py-8">
                      {lang === "id"
                        ? 'Tekan "Putar pembahasan" untuk melihat perhitungan nilai dengan LaTeX.'
                        : 'Press "Play solution" to reveal the LaTeX steps.'}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tumbak" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-center mb-1">{t.featuredTitleTumbak}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">{t.featuredSubtitleTumbak}</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-left">
                <p className="text-sm md:text-base font-medium leading-relaxed">{t.tumbakQuestionStem}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div>
                  <TumbakVisual step={stepTumbak} caption={t.tumbakCaption} lang={lang} />
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2"
                      onClick={handlePlayTumbak}
                      disabled={stepTumbak >= MAX_STEP_TUMBAK}
                    >
                      <Play className="w-4 h-4" />
                      {stepTumbak === 0 ? t.play : t.next}
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="gap-2" onClick={handleResetTumbak}>
                      <RotateCcw className="w-4 h-4" />
                      {t.reset}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {lang === "id"
                      ? `Langkah ${Math.min(stepTumbak, MAX_STEP_TUMBAK)} / ${MAX_STEP_TUMBAK}`
                      : `Step ${Math.min(stepTumbak, MAX_STEP_TUMBAK)} / ${MAX_STEP_TUMBAK}`}
                  </p>
                </div>
                <div className="min-w-0">
                  {stepTumbak >= 1 ? (
                    <TumbakSolutionSteps lang={lang} step={stepTumbak} />
                  ) : (
                    <p className="text-sm text-muted-foreground italic text-center py-8">
                      {lang === "id"
                        ? 'Tekan "Putar pembahasan" untuk melihat konversi tumbak ke m² dengan LaTeX.'
                        : 'Press "Play solution" for the LaTeX steps.'}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="oil" className="mt-0 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-center mb-1">{t.featuredTitleOil}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">{t.featuredSubtitleOil}</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-left">
                <p className="text-sm md:text-base font-medium leading-relaxed">{t.oilQuestionStem}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div>
                  <OilVisual step={stepOil} caption={t.oilCaption} />
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button
                      type="button"
                      size="sm"
                      className="gap-2"
                      onClick={handlePlayOil}
                      disabled={stepOil >= MAX_STEP_OIL}
                    >
                      <Play className="w-4 h-4" />
                      {stepOil === 0 ? t.play : t.next}
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="gap-2" onClick={handleResetOil}>
                      <RotateCcw className="w-4 h-4" />
                      {t.reset}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {lang === "id"
                      ? `Langkah ${Math.min(stepOil, MAX_STEP_OIL)} / ${MAX_STEP_OIL}`
                      : `Step ${Math.min(stepOil, MAX_STEP_OIL)} / ${MAX_STEP_OIL}`}
                  </p>
                </div>
                <div className="min-w-0">
                  {stepOil >= 1 ? (
                    <OilSolutionSteps lang={lang} step={stepOil} />
                  ) : (
                    <p className="text-sm text-muted-foreground italic text-center py-8">
                      {lang === "id"
                        ? 'Tekan "Putar pembahasan" untuk menghubungkan liter dan kg dengan massa jenis.'
                        : 'Press "Play solution" to connect litres and kg using density.'}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Grade 10 featured: log expression */}
      <Card className="glass-card border-2 border-secondary/25 shadow-card overflow-hidden mt-8">
        <CardHeader className="bg-gradient-to-r from-secondary/5 to-primary/5">
          <CardTitle className="text-xl md:text-2xl">{t.featuredTitleLog10}</CardTitle>
          <CardDescription className="text-base">{t.featuredSubtitleLog10}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="rounded-xl border bg-card p-4 text-left space-y-3">
            <p className="text-sm md:text-base font-medium leading-relaxed">{t.logQuestionStem}</p>
            <MathExpr block tex={lang === "id" ? "1 + 3{,}3 \\log 30" : "1 + 3.3 \\log 30"} />
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div>
              <LogVisual step={stepLog} caption={t.logCaption} lang={lang} />
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  type="button"
                  size="sm"
                  className="gap-2"
                  onClick={handlePlayLog}
                  disabled={stepLog >= MAX_STEP_LOG}
                >
                  <Play className="w-4 h-4" />
                  {stepLog === 0 ? t.play : t.next}
                </Button>
                <Button type="button" size="sm" variant="outline" className="gap-2" onClick={handleResetLog}>
                  <RotateCcw className="w-4 h-4" />
                  {t.reset}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {lang === "id"
                  ? `Langkah ${Math.min(stepLog, MAX_STEP_LOG)} / ${MAX_STEP_LOG}`
                  : `Step ${Math.min(stepLog, MAX_STEP_LOG)} / ${MAX_STEP_LOG}`}
              </p>
            </div>
            <div className="min-w-0">
              {stepLog >= 1 ? (
                <LogSolutionSteps lang={lang} step={stepLog} />
              ) : (
                <p className="text-sm text-muted-foreground italic text-center py-8">
                  {lang === "id"
                    ? 'Tekan "Putar pembahasan" untuk melihat perhitungan log dengan LaTeX.'
                    : 'Press "Play solution" for the LaTeX steps.'}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
