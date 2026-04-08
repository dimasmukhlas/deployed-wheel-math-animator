import { Triangle, Box, Shapes, Compass, Grip, Sparkles, Scissors, SquareEqual, FlipVertical } from "lucide-react";
import { cn } from "@shape/lib/utils";

interface ShapeTabProps {
  activeTab: "triangle" | "cube" | "flat" | "obtuse" | "rough" | "smooth" | "acute" | "rightangle" | "symmetry";
  onTabChange: (tab: "triangle" | "cube" | "flat" | "obtuse" | "rough" | "smooth" | "acute" | "rightangle" | "symmetry") => void;
}

export const ShapeTab = ({ activeTab, onTabChange }: ShapeTabProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-card rounded-2xl p-2 shadow-lg gap-2 flex-wrap justify-center max-w-5xl">
        <button
          onClick={() => onTabChange("triangle")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all duration-300 text-xs",
            activeTab === "triangle"
              ? "bg-triangle-gradient text-primary-foreground shadow-md scale-105"
              : "text-muted-foreground hover:text-triangle hover:bg-triangle-light"
          )}
        >
          <Triangle className="w-3.5 h-3.5" />
          <span>Segitiga</span>
        </button>
        
        <button
          onClick={() => onTabChange("cube")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all duration-300 text-xs",
            activeTab === "cube"
              ? "bg-cube-gradient text-primary-foreground shadow-md scale-105"
              : "text-muted-foreground hover:text-cube hover:bg-cube-light"
          )}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Kubus</span>
        </button>

        <button
          onClick={() => onTabChange("flat")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all duration-300 text-xs",
            activeTab === "flat"
              ? "bg-flat-gradient text-primary-foreground shadow-md scale-105"
              : "text-muted-foreground hover:text-flat hover:bg-flat-light"
          )}
        >
          <Shapes className="w-3.5 h-3.5" />
          <span>Bangun Datar</span>
        </button>

        <button
          onClick={() => onTabChange("acute")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all duration-300 text-xs",
            activeTab === "acute"
              ? "bg-acute-gradient text-primary-foreground shadow-md scale-105"
              : "text-muted-foreground hover:text-acute hover:bg-acute-light"
          )}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Sudut Lancip</span>
        </button>

        <button
          onClick={() => onTabChange("rightangle")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all duration-300 text-xs",
            activeTab === "rightangle"
              ? "bg-rightangle-gradient text-primary-foreground shadow-md scale-105"
              : "text-muted-foreground hover:text-rightangle hover:bg-rightangle-light"
          )}
        >
          <SquareEqual className="w-3.5 h-3.5" />
          <span>Sudut Siku</span>
        </button>

        <button
          onClick={() => onTabChange("obtuse")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all duration-300 text-xs",
            activeTab === "obtuse"
              ? "bg-obtuse-gradient text-primary-foreground shadow-md scale-105"
              : "text-muted-foreground hover:text-obtuse hover:bg-obtuse-light"
          )}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Sudut Tumpul</span>
        </button>

        <button
          onClick={() => onTabChange("rough")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all duration-300 text-xs",
            activeTab === "rough"
              ? "bg-rough-gradient text-primary-foreground shadow-md scale-105"
              : "text-muted-foreground hover:text-rough hover:bg-rough-light"
          )}
        >
          <Grip className="w-3.5 h-3.5" />
          <span>Kasar</span>
        </button>

        <button
          onClick={() => onTabChange("smooth")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all duration-300 text-xs",
            activeTab === "smooth"
              ? "bg-smooth-gradient text-primary-foreground shadow-md scale-105"
              : "text-muted-foreground hover:text-smooth hover:bg-smooth-light"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Halus</span>
        </button>

        <button
          onClick={() => onTabChange("symmetry")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold transition-all duration-300 text-xs",
            activeTab === "symmetry"
              ? "bg-symmetry-gradient text-primary-foreground shadow-md scale-105"
              : "text-muted-foreground hover:text-symmetry hover:bg-symmetry-light"
          )}
        >
          <FlipVertical className="w-3.5 h-3.5" />
          <span>Simetri</span>
        </button>
      </div>
    </div>
  );
};
