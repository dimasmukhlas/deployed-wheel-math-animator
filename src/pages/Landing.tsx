import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  Circle,
  Shapes,
  PieChart,
  Sparkles,
  BookOpen,
  Calculator,
  Leaf,
  Languages,
} from "lucide-react";
import { PopularQuestionsSection } from "@/components/PopularQuestionsSection";
import { LearningPathsSection } from "@/components/LearningPathsSection";
import { UserAuthButton } from "@/components/auth/UserAuthButton";
import { LoginExperienceNudge } from "@/components/auth/LoginExperienceNudge";
import { RecentRecordsCard } from "@/components/auth/RecentRecordsCard";
import type { LandingLang } from "@/lib/landing-lang";

const LANG_KEY = "cognizo-landing-lang";

type Activity = {
  id: string;
  title: string;
  description: string;
  href: string;
  internal: boolean;
  icon: typeof Circle;
  accent: string;
};

function buildActivities(t: (key: keyof typeof strings.en.activities) => { title: string; description: string }): Activity[] {
  const a = (id: keyof typeof strings.en.activities, href: string, internal: boolean, icon: typeof Circle, accent: string) => ({
    id: String(id),
    ...t(id),
    href,
    internal,
    icon,
    accent,
  });
  return [
    a("wheel", "/wheel", true, Circle, "from-sky-500/20 to-teal-500/10 border-primary/30"),
    a("shape", "/wheel/shape", true, Shapes, "from-violet-500/20 to-fuchsia-500/10 border-accent/30"),
    a("fraction", "/wheel/fraction", true, PieChart, "from-amber-500/20 to-orange-500/10 border-secondary/40"),
    a("spongebob", "/wheel/sponge", true, Languages, "from-cyan-500/20 to-teal-500/10 border-cyan-500/35"),
  ];
}

const strings = {
  en: {
    badge: "Cognizo — learn through play",
    heroTitle: "Sharpen kids’ thinking",
    heroLead:
      "Interactive activities for math, shapes, and logical reasoning — in a way that feels like play.",
    heroSub: "Choose a language and start with the games — learning paths sit just below.",
    langLabel: "Language",
    langId: "Indonesian",
    langEn: "English",
    start: "Start",
    examSectionTitle: "Grade 6 — paths toward national-style exams",
    examSectionLead:
      "These study paths follow core SD (elementary) goals used in school exams and assessments (e.g. literacy/numeracy and subject tests). Use them as a checklist — not a guarantee of scores.",
    examGrade6Eyebrow: "Elementary · Grade 6",
    examGrade9Eyebrow: "Junior high · Grade 9",
    examSectionTitleK9: "Grade 9 — paths toward junior-high exams",
    examSectionLeadK9:
      "These tracks mirror core SMP (grades 7–9) outcomes in Kurikulum Merdeka — useful for semester tests, school exams, and ASPD-style preparation. A guide, not a score promise.",
    examGrade12Eyebrow: "Senior high · Grade 12",
    examSectionTitleK12: "Grade 12 — paths toward graduation & selection exams",
    examSectionLeadK12:
      "These tracks align with SMA (senior high) capaian pembelajaran and typical preparation for school finals, UTBK-SNBT-style reasoning, and literacy/numeracy expectations. A guide, not a score promise.",
    examSubjects: {
      bi: {
        title: "Indonesian language",
        intro: "Build reading, writing, and speaking so you can handle exam-style texts and tasks.",
        steps: [
          "Reading: narrative, informational, and persuasive texts — main idea, implied meaning, and vocabulary in context.",
          "Writing: short paragraphs, letters, and simple stories with clear beginning–middle–end.",
          "Grammar & spelling: effective sentences, connectors, punctuation, and standard spelling.",
          "Listening & speaking: retell content, ask/answer politely, and present ideas briefly.",
        ],
      },
      math: {
        title: "Mathematics",
        intro: "Strengthen numbers, fractions, geometry, and data — typical pillars of SD math exams.",
        steps: [
          "Whole numbers & operations; order of operations in word problems.",
          "Fractions & decimals: meaning, comparison, and operations in real contexts.",
          "Ratio & proportion; simple percentages where relevant.",
          "Geometry & measurement: perimeter, area, volume (intro), angles, and properties of shapes.",
          "Data: tables, bar/line plots; mean/median/mode in simple cases; number patterns.",
        ],
      },
      ipa: {
        title: "Natural science (IPA)",
        intro: "Connect concepts about matter, energy, living things, Earth, and simple technology.",
        steps: [
          "Matter & change: states of matter, mixtures, and simple physical/chemical changes.",
          "Energy & motion: forces, heat, light, sound, and energy in everyday life.",
          "Living things & environment: adaptation, food chains, human body systems at SD level.",
          "Earth & space: water cycle, weather, and Earth–Moon–Sun basics.",
          "Technology & safety: simple tools and safe practices in experiments.",
        ],
      },
    },
    examSubjectsK9: {
      bi: {
        title: "Indonesian language",
        intro: "Handle longer texts and structured writing expected in SMP exams.",
        steps: [
          "Reading: imaginative, informational, persuasive, and argumentative texts — main ideas, stance, and implied meaning.",
          "Literary basics: characters, setting, conflict; simple poetry devices.",
          "Writing: narrative, procedure, analytical exposition, and short speeches.",
          "Grammar & spelling: complex sentences, effective paragraphs, standard spelling.",
          "Speaking & listening: discussions, presentations, and polite debate.",
        ],
      },
      math: {
        title: "Mathematics",
        intro: "Algebra, geometry, statistics, and probability typical of SMP end-of-level tests.",
        steps: [
          "Numbers & algebra: exponents, roots, linear equations and inequalities, ratios.",
          "Sequences, functions, and graphs of straight lines (gradient, intercepts).",
          "Geometry: Pythagoras, congruence & similarity, circles, angles.",
          "Solid geometry: prisms, pyramids, cylinders, cones, spheres (surface area & volume).",
          "Statistics & probability: data displays, mean/median/mode, simple probability.",
        ],
      },
      ipa: {
        title: "Natural science (IPA)",
        intro: "Physics, chemistry, and biology concepts at integrated SMP level.",
        steps: [
          "Physics: motion, forces, work–energy, pressure, heat, sound, light, simple electricity.",
          "Chemistry: atomic structure, periodic table, chemical bonds, simple reactions, acids & bases (intro).",
          "Biology: cells, human organ systems, reproduction & heredity (intro), ecosystems & environment.",
          "Earth & space: plate basics, weather & climate, solar system overview.",
          "Lab skills: measurement, safety, and interpreting simple experiments.",
        ],
      },
    },
    examSubjectsK12: {
      bi: {
        title: "Indonesian language",
        intro: "Advanced reading, academic writing, and argumentation for SMA-level exams.",
        steps: [
          "Reading: long informational, analytical, and argumentative texts — thesis, evidence, and bias.",
          "Literature & language: figures of speech, intertextuality, and short critical responses.",
          "Writing: essays, formal letters, proposals, and structured reviews.",
          "Grammar & style: clarity, cohesion, standard Indonesian, and citation basics.",
          "Speaking & listening: academic discussion, panels, and structured presentations.",
        ],
      },
      math: {
        title: "Mathematics",
        intro: "Core and advanced topics common in SMA exams and reasoning tests (incl. SNBT-style numeracy).",
        steps: [
          "Functions & graphs: composition, inverse, transformations, exponentials & logarithms.",
          "Trigonometry: identities, equations, and applications.",
          "Calculus intro: limits, derivatives, and integrals in standard problems.",
          "Matrices, vectors, sequences & series; logic and proof sketches.",
          "Statistics & probability: distributions, inference basics, and data interpretation.",
        ],
      },
      ipa: {
        title: "Natural science (IPA)",
        intro: "Integrated physics, chemistry, and biology at SMA depth for science tracks.",
        steps: [
          "Physics: mechanics, waves, thermodynamics, electricity & magnetism, optics (intro).",
          "Chemistry: stoichiometry, equilibrium, electrochemistry, organic patterns (intro).",
          "Biology: molecular genetics, evolution, ecology, and human physiology at advanced level.",
          "Earth & environment: geoscience basics, climate, sustainability links.",
          "Scientific skills: experiments, graphs, error thinking, and reading research excerpts.",
        ],
      },
    },
    activities: {
      wheel: {
        title: "Wheel rotations",
        description: "Distance, circumference, and how many turns — builds number sense and measurement.",
      },
      shape: {
        title: "Cognizo Shape",
        description: "Shapes, angles, and symmetry through everyday objects — visual reasoning.",
      },
      fraction: {
        title: "Fraction fun",
        description: "Fractions with animations and quizzes — parts, wholes, and proportion.",
      },
      spongebob: {
        title: "SpongeBob English",
        description:
          "English and Indonesian language practice — Bikini Bottom quizzes and interactive simulations.",
      },
    },
  },
  id: {
    badge: "Cognizo — belajar sambil bermain",
    heroTitle: "Asah kognitif anak",
    heroLead:
      "Aktivitas interaktif untuk melatih matematika, bentuk geometri, dan berpikir logis dengan cara menyenangkan.",
    heroSub: "Pilih bahasa dan mulai dari permainan — jalur belajar ada tepat di bawahnya.",
    langLabel: "Bahasa",
    langId: "Indonesia",
    langEn: "English",
    start: "Mulai",
    examSectionTitle: "Kelas 6 — jalur menuju ujian / asesmen",
    examSectionLead:
      "Jalur ini mengacu pada capaian pembelajaran SD (Kurikulum Merdeka) yang biasa diuji di ujian sekolah, asesmen, atau persiapan kelas lanjutan. Gunakan sebagai panduan belajar — bukan jaminan nilai.",
    examGrade6Eyebrow: "SD · Kelas 6",
    examGrade9Eyebrow: "SMP · Kelas 9",
    examSectionTitleK9: "Kelas 9 — jalur menuju ujian SMP",
    examSectionLeadK9:
      "Jalur ini mengacu pada capaian pembelajaran SMP (kelas 7–9) dalam Kurikulum Merdeka — relevan untuk PTS/PAS, ujian sekolah, dan persiapan ASPD. Gunakan sebagai panduan — bukan jaminan nilai.",
    examGrade12Eyebrow: "SMA · Kelas 12",
    examSectionTitleK12: "Kelas 12 — jalur menuju ujian kelulusan & seleksi",
    examSectionLeadK12:
      "Jalur ini mengacu pada capaian pembelajaran SMA (Kurikulum Merdeka) dan persiapan umum ujian sekolah, literasi–numerasi, serta pola penalaran seperti UTBK-SNBT. Gunakan sebagai panduan — bukan jaminan nilai.",
    examSubjects: {
      bi: {
        title: "Bahasa Indonesia",
        intro: "Membaca, menulis, dan berbicara agar siap dengan teks dan soal bergaya ujian.",
        steps: [
          "Membaca pemahaman: teks narasi, informasi, dan persuasi — ide pokok, informasi tersirat, dan kosakata kontekstual.",
          "Menulis: paragraf, surat, dan cerita pendek dengan struktur jelas (awal–tengah–akhir).",
          "Tata bahasa & ejaan: kalimat efektif, kata hubung, tanda baca, dan ejaan baku.",
          "Menyimak & berbicara: ringkas isi teks, tanya-jawab sopan, dan presentasi singkat.",
        ],
      },
      math: {
        title: "Matematika",
        intro: "Bilangan, pecahan, geometri, dan data — pilar umum matematika SD untuk ujian.",
        steps: [
          "Bilangan bulat dan operasinya; urutan operasi dalam soal cerita.",
          "Pecahan & desimal: makna, perbandingan, dan operasi dalam konteks nyata.",
          "Perbandingan & proporsi; persentase sederhana bila relevan.",
          "Geometri & pengukuran: keliling, luas, volume pengantar, sudut, dan sifat bangun datar.",
          "Data: tabel, diagram batang/garis; mean/median/modus sederhana; pola bilangan.",
        ],
      },
      ipa: {
        title: "Ilmu Pengetahuan Alam (IPA)",
        intro: "Menghubungkan konsep materi, energi, makhluk hidup, bumi, dan teknologi sederhana.",
        steps: [
          "Materi & perubahan: wujud zat, campuran, dan perubahan fisika/kimia sederhana.",
          "Energi & gerak: gaya, kalor, cahaya, bunyi, serta energi dalam kehidupan sehari-hari.",
          "Makhluk hidup & lingkungan: adaptasi, rantai makanan, organ tubuh manusia tingkat SD.",
          "Bumi & antariksa: siklus air, cuaca, dan hubungan Bumi–Bulan–Matahari.",
          "Teknologi & keselamatan: alat sederhana dan tata tertib praktikum.",
        ],
      },
    },
    examSubjectsK9: {
      bi: {
        title: "Bahasa Indonesia",
        intro: "Membaca teks panjang dan menulis terstruktur sesuai standar SMP.",
        steps: [
          "Membaca pemahaman: teks imajinatif, informasi, persuasi, dan argumentasi — ide pokok, sikap penulis, makna tersirat.",
          "Sastra ringan: unsur intrinsik, puisi sederhana, membandingkan teks.",
          "Menulis: narasi, prosedur, teks analitis, pidato singkat, dan surat resmi.",
          "Tata bahasa & ejaan: kalimat kompleks, paragraf koheren, ejaan baku.",
          "Berbicara & menyimak: diskusi, presentasi, dan argumentasi sopan.",
        ],
      },
      math: {
        title: "Matematika",
        intro: "Aljabar, geometri, statistika, dan peluang pada tingkat ujian SMP.",
        steps: [
          "Bilangan: berpangkat, bentuk akar, persamaan & pertidaksamaan linear, perbandingan.",
          "Barisan, fungsi, dan grafik garis lurus (gradien, persamaan garis).",
          "Geometri: Pythagoras, kongruensi & kesebangunan, lingkaran, sudut.",
          "Bangun ruang: prisma, limas, tabung, kerucut, bola (luas permukaan & volume).",
          "Statistik & peluang: penyajian data, mean/median/modus, peluang sederhana.",
        ],
      },
      ipa: {
        title: "Ilmu Pengetahuan Alam (IPA)",
        intro: "Konsep terpadu fisika, kimia, dan biologi untuk jenjang SMP.",
        steps: [
          "Fisika: gerak, gaya, usaha–energi, tekanan, kalor, bunyi, cahaya, listrik sederhana.",
          "Kimia: atom & ion, sistem periodik, ikatan, reaksi dasar, asam–basa (pengantar).",
          "Biologi: sel, sistem organ manusia, pewarisan sederhana, ekosistem & lingkungan.",
          "Bumi & antariksa: lempeng, cuaca–iklim, tata surya (gambaran umum).",
          "Keterampilan lab: pengukuran, keselamatan, dan interpretasi data percobaan.",
        ],
      },
    },
    examSubjectsK12: {
      bi: {
        title: "Bahasa Indonesia",
        intro: "Membaca teks panjang, menulis akademik, dan berargumentasi tingkat SMA.",
        steps: [
          "Membaca kritis: teks informasi, analitis, argumentatif — tesis, bukti, dan bias penulis.",
          "Bahasa & sastra: gaya bahasa, intertekstualitas, resensi singkat.",
          "Menulis: esai, surat resmi, proposal, dan laporan terstruktur.",
          "Tata bahasa & gaya: kohesi, kejelasan, ejaan baku, pengutipan sederhana.",
          "Berbicara & mendengarkan: diskusi akademik, panel, presentasi terstruktur.",
        ],
      },
      math: {
        title: "Matematika",
        intro: "Materi inti dan lanjutan untuk ujian SMA serta literasi numerasi (pola SNBT).",
        steps: [
          "Fungsi & grafik: komposisi, invers, transformasi, eksponen & logaritma.",
          "Trigonometri: identitas, persamaan, dan aplikasi.",
          "Kalkulus pengantar: limit, turunan, integral pada soal standar.",
          "Matriks, vektor, barisan & deret; logika dan pembuktian sederhana.",
          "Statistik & peluang: penyajian data, inferensi dasar, interpretasi grafik.",
        ],
      },
      ipa: {
        title: "Ilmu Pengetahuan Alam (IPA)",
        intro: "Fisika, kimia, dan biologi terintegrasi untuk lintas minat sains SMA.",
        steps: [
          "Fisika: mekanika, gelombang, termodinamika, listrik–magnet, optik (pengantar).",
          "Kimia: stoikiometri, kesetimbangan, elektrokimia, pola organik (pengantar).",
          "Biologi: genetika molekuler, evolusi, ekologi, fisiologi manusia lanjut.",
          "Bumi & lingkungan: geosains, iklim, keberlanjutan.",
          "Keterampilan sains: percobaan, grafik, ketidakpastian, membaca kutipan penelitian.",
        ],
      },
    },
    activities: {
      wheel: {
        title: "Putaran Roda",
        description: "Jarak, keliling, dan banyak putaran — melatih bilangan dan pengukuran.",
      },
      shape: {
        title: "Cognizo Shape",
        description: "Bentuk, sudut, dan simetri lewat benda di sekitar — penalaran visual.",
      },
      fraction: {
        title: "Pecahan Seru",
        description: "Pecahan dengan animasi dan kuis — bagian, keseluruhan, dan perbandingan.",
      },
      spongebob: {
        title: "SpongeBob English",
        description:
          "Latihan bahasa Inggris dan Indonesia — kuis interaktif bertema Bikini Bottom.",
      },
    },
  },
} as const;

const Landing = () => {
  const [lang, setLang] = useState<LandingLang>("id");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY) as LandingLang | null;
    if (saved === "id" || saved === "en") setLang(saved);
  }, []);

  const setLanguage = (next: LandingLang) => {
    setLang(next);
    localStorage.setItem(LANG_KEY, next);
  };

  const t = strings[lang];
  const activities = buildActivities((key) => strings[lang].activities[key]);

  const examIcons = [BookOpen, Calculator, Leaf] as const;
  const examKeys = ["bi", "math", "ipa"] as const;

  const learningSubjects = examKeys.map((key, i) => ({
    id: key,
    Icon: examIcons[i],
    title: t.examSubjects[key].title,
    intro: t.examSubjects[key].intro,
    steps: t.examSubjects[key].steps,
  }));

  const learningSubjectsK9 = examKeys.map((key, i) => ({
    id: `k9-${key}`,
    Icon: examIcons[i],
    title: t.examSubjectsK9[key].title,
    intro: t.examSubjectsK9[key].intro,
    steps: t.examSubjectsK9[key].steps,
  }));

  const learningSubjectsK12 = examKeys.map((key, i) => ({
    id: `k12-${key}`,
    Icon: examIcons[i],
    title: t.examSubjectsK12[key].title,
    intro: t.examSubjectsK12[key].intro,
    steps: t.examSubjectsK12[key].steps,
  }));

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-5xl mx-auto flex justify-end pt-4 md:pt-6">
        <UserAuthButton lang={lang} />
      </div>
      <header className="pt-4 md:pt-8 pb-8 text-center max-w-3xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-sm text-muted-foreground font-medium">{t.langLabel}</span>
          <Tabs value={lang} onValueChange={(v) => setLanguage(v as LandingLang)}>
            <TabsList className="h-10 grid grid-cols-2 w-full max-w-[280px] sm:w-auto">
              <TabsTrigger value="id" className="gap-1.5 px-4 text-xs sm:text-sm">
                {t.langId}
              </TabsTrigger>
              <TabsTrigger value="en" className="gap-1.5 px-4 text-xs sm:text-sm">
                {t.langEn}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Brain className="w-4 h-4" />
          {t.badge}
        </div>
        <h1 className="text-3xl md:text-5xl font-bold">
          <span className="text-gradient">{t.heroTitle}</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">{t.heroLead}</p>
        <p className="text-muted-foreground/85 text-sm max-w-xl mx-auto">
          <Sparkles className="inline w-4 h-4 mr-1 text-muted-foreground align-text-bottom opacity-80" />
          {t.heroSub}
        </p>
      </header>

      <RecentRecordsCard lang={lang} />

      {/* Interactive games — first for a clean, focused top */}
      <section id="games" className="max-w-4xl mx-auto mb-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            {lang === "id" ? "Permainan interaktif" : "Interactive games"}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            {lang === "id"
              ? "Tap a card — latihan visual yang menyenangkan."
              : "Tap a card — quick, visual practice."}
          </p>
        </div>

        <div className="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id}>
              <Card
                className={`h-full glass-card overflow-hidden border bg-gradient-to-br ${item.accent} transition-transform duration-200 hover:-translate-y-1 hover:shadow-card`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-3">
                    <div className="rounded-2xl bg-background/80 p-3 shadow-soft">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-center font-bold">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-center text-sm leading-relaxed text-muted-foreground min-h-[4rem]">
                    {item.description}
                  </CardDescription>
                  <Button
                    asChild
                    className="w-full gap-2 bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-soft"
                    size="lg"
                  >
                    {item.internal ? (
                      <Link to={item.href}>{t.start}</Link>
                    ) : (
                      <a
                        href={item.href}
                        {...(item.href.startsWith("http://") || item.href.startsWith("https://")
                          ? { target: "_blank" as const, rel: "noopener noreferrer" }
                          : {})}
                      >
                        {t.start}
                      </a>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        })}
        </div>
      </section>

      <LearningPathsSection
        lang={lang}
        headingId="learning-paths-kelas-6"
        eyebrow={t.examGrade6Eyebrow}
        title={t.examSectionTitle}
        lead={t.examSectionLead}
        subjects={learningSubjects}
      />

      <LearningPathsSection
        lang={lang}
        headingId="learning-paths-kelas-9"
        eyebrow={t.examGrade9Eyebrow}
        title={t.examSectionTitleK9}
        lead={t.examSectionLeadK9}
        subjects={learningSubjectsK9}
      />

      <LearningPathsSection
        lang={lang}
        headingId="learning-paths-kelas-12"
        eyebrow={t.examGrade12Eyebrow}
        title={t.examSectionTitleK12}
        lead={t.examSectionLeadK12}
        subjects={learningSubjectsK12}
      />

      <div className="max-w-5xl mx-auto mt-6 border-t border-border/40 pt-10">
        <PopularQuestionsSection lang={lang} />
      </div>

      <LoginExperienceNudge lang={lang} />
    </div>
  );
};

export default Landing;
