import { Slider } from "@/components/ui/slider";

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
  icon: React.ReactNode;
  color: "primary" | "secondary";
}

export const SliderControl = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  icon,
  color,
}: SliderControlProps) => {
  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${color === "primary" ? "bg-gradient-primary" : "bg-gradient-accent"}`}>
            {icon}
          </div>
          <span className="font-semibold text-foreground">{label}</span>
        </div>
        <div className={`px-4 py-2 rounded-xl font-mono font-bold text-xl ${
          color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
        }`}>
          {value} <span className="text-sm font-normal">{unit}</span>
        </div>
      </div>
      
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0])}
        className={color === "primary" ? "slider-primary" : "slider-accent"}
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};
