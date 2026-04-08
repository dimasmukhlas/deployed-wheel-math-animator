import { Triangle, Box, Shapes, Compass, Grip, Sparkles, Scissors, SquareEqual, FlipVertical } from "lucide-react";
import { cn } from "@shape/lib/utils";

interface ShapeHeaderProps {
  variant: "triangle" | "cube" | "flat" | "obtuse" | "rough" | "smooth" | "acute" | "rightangle" | "symmetry";
}

const headerConfig = {
  triangle: {
    icon: Triangle,
    gradient: "bg-triangle-gradient",
    textColor: "text-triangle",
    title: "10 Benda Berbentuk Segitiga",
    subtitle: "Temukan benda-benda segitiga yang ada di sekitar rumahmu! 🏠"
  },
  cube: {
    icon: Box,
    gradient: "bg-cube-gradient",
    textColor: "text-cube",
    title: "10 Benda Berbentuk Kubus",
    subtitle: "Cari tahu benda-benda kubus yang sering kamu lihat di rumah! 📦"
  },
  flat: {
    icon: Shapes,
    gradient: "bg-flat-gradient",
    textColor: "text-flat",
    title: "10 Benda Bangun Datar",
    subtitle: "Kenali berbagai bentuk datar seperti lingkaran dan persegi! ⭕"
  },
  acute: {
    icon: Scissors,
    gradient: "bg-acute-gradient",
    textColor: "text-acute",
    title: "10 Contoh Sudut Lancip",
    subtitle: "Pelajari benda dengan sudut kurang dari 90°! ✂️"
  },
  rightangle: {
    icon: SquareEqual,
    gradient: "bg-rightangle-gradient",
    textColor: "text-rightangle",
    title: "10 Contoh Sudut Siku-Siku",
    subtitle: "Temukan benda dengan sudut tepat 90 derajat! 📏"
  },
  obtuse: {
    icon: Compass,
    gradient: "bg-obtuse-gradient",
    textColor: "text-obtuse",
    title: "10 Contoh Sudut Tumpul",
    subtitle: "Pelajari benda-benda dengan sudut lebih dari 90°! 📐"
  },
  rough: {
    icon: Grip,
    gradient: "bg-rough-gradient",
    textColor: "text-rough",
    title: "10 Contoh Permukaan Kasar",
    subtitle: "Kenali benda-benda dengan tekstur kasar di sekitarmu! 🪨"
  },
  smooth: {
    icon: Sparkles,
    gradient: "bg-smooth-gradient",
    textColor: "text-smooth",
    title: "10 Contoh Permukaan Halus",
    subtitle: "Temukan benda-benda dengan permukaan licin dan halus! ✨"
  },
  symmetry: {
    icon: FlipVertical,
    gradient: "bg-symmetry-gradient",
    textColor: "text-symmetry",
    title: "10 Contoh Sumbu Simetri",
    subtitle: "Pelajari bangun datar dan jumlah sumbu simetrinya! 🦋"
  }
};

export const ShapeHeader = ({ variant }: ShapeHeaderProps) => {
  const config = headerConfig[variant];
  const Icon = config.icon;
  
  return (
    <div className="text-center mb-12">
      {/* Animated shape icon */}
      <div
        className={cn(
          "inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6 animate-float",
          config.gradient
        )}
      >
        <Icon className="w-12 h-12 text-primary-foreground" />
      </div>

      {/* Title */}
      <h2
        className={cn(
          "text-3xl md:text-4xl font-extrabold mb-3",
          config.textColor
        )}
      >
        {config.title}
      </h2>
      
      {/* Subtitle */}
      <p className="text-muted-foreground text-lg max-w-md mx-auto">
        {config.subtitle}
      </p>
    </div>
  );
};
