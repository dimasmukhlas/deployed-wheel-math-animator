interface FormulaCardProps {
  radius: number;
  distance: number;
  rotations: number;
  circumference: number;
}

export const FormulaCard = ({ radius, distance, rotations, circumference }: FormulaCardProps) => {
  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <h3 className="text-xl font-bold text-gradient">Rumus & Perhitungan</h3>
      
      <div className="space-y-3">
        {/* Circumference formula */}
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Keliling Roda (K)</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-lg font-semibold">K = 2 × π × r</span>
            <span className="text-muted-foreground">=</span>
            <span className="font-mono text-lg">2 × 3.14 × {radius}</span>
            <span className="text-muted-foreground">=</span>
            <span className="font-mono text-lg font-bold text-primary">{circumference.toFixed(2)} cm</span>
          </div>
        </div>
        
        {/* Rotations formula */}
        <div className="bg-muted/50 rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Jumlah Putaran (n)</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-lg font-semibold">n = Jarak ÷ K</span>
            <span className="text-muted-foreground">=</span>
            <span className="font-mono text-lg">{distance * 100} ÷ {circumference.toFixed(2)}</span>
            <span className="text-muted-foreground">=</span>
            <span className="font-mono text-xl font-bold text-secondary">{rotations.toFixed(2)} putaran</span>
          </div>
        </div>
      </div>
      
      {/* Result highlight */}
      <div className="bg-gradient-primary rounded-xl p-4 text-center">
        <p className="text-primary-foreground/80 text-sm mb-1">Roda berputar sebanyak</p>
        <p className="text-4xl font-bold text-primary-foreground">{rotations.toFixed(2)}</p>
        <p className="text-primary-foreground/80 text-sm">kali</p>
      </div>
    </div>
  );
};
