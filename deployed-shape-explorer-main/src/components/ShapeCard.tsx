import { LucideIcon } from "lucide-react";
import { cn } from "@shape/lib/utils";

interface ShapeCardProps {
  icon: LucideIcon;
  name: string;
  description: string;
  index: number;
  variant: "triangle" | "cube" | "flat" | "obtuse" | "rough" | "smooth" | "acute" | "rightangle" | "symmetry";
  onClick?: () => void;
}

const variantStyles = {
  triangle: {
    shadow: "hover:shadow-triangle/20",
    gradient: "bg-triangle-gradient",
    badge: "bg-triangle-light text-triangle"
  },
  cube: {
    shadow: "hover:shadow-cube/20",
    gradient: "bg-cube-gradient",
    badge: "bg-cube-light text-cube"
  },
  flat: {
    shadow: "hover:shadow-flat/20",
    gradient: "bg-flat-gradient",
    badge: "bg-flat-light text-flat"
  },
  acute: {
    shadow: "hover:shadow-acute/20",
    gradient: "bg-acute-gradient",
    badge: "bg-acute-light text-acute"
  },
  rightangle: {
    shadow: "hover:shadow-rightangle/20",
    gradient: "bg-rightangle-gradient",
    badge: "bg-rightangle-light text-rightangle"
  },
  obtuse: {
    shadow: "hover:shadow-obtuse/20",
    gradient: "bg-obtuse-gradient",
    badge: "bg-obtuse-light text-obtuse"
  },
  rough: {
    shadow: "hover:shadow-rough/20",
    gradient: "bg-rough-gradient",
    badge: "bg-rough-light text-rough"
  },
  smooth: {
    shadow: "hover:shadow-smooth/20",
    gradient: "bg-smooth-gradient",
    badge: "bg-smooth-light text-smooth"
  },
  symmetry: {
    shadow: "hover:shadow-symmetry/20",
    gradient: "bg-symmetry-gradient",
    badge: "bg-symmetry-light text-symmetry"
  }
};

export const ShapeCard = ({ icon: Icon, name, description, index, variant, onClick }: ShapeCardProps) => {
  const styles = variantStyles[variant];
  
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 shadow-lg transition-all duration-300",
        "hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]",
        "animate-fade-up bg-card cursor-pointer active:scale-95",
        styles.shadow
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background decoration */}
      <div
        className={cn(
          "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-20 transition-transform duration-300 group-hover:scale-150",
          styles.gradient
        )}
      />
      
      {/* Number badge */}
      <div
        className={cn(
          "absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
          styles.badge
        )}
      >
        {index + 1}
      </div>

      {/* Symmetry line - only for symmetry variant */}
      {variant === "symmetry" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-symmetry to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mt-6 transition-all duration-300",
          "group-hover:animate-wiggle",
          styles.gradient
        )}
      >
        <Icon className="w-8 h-8 text-primary-foreground" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>

      {/* Hover indicator */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100",
          styles.gradient
        )}
      />
    </div>
  );
};
