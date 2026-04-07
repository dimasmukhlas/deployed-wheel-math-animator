interface ProgressBarProps {
  current: number;
  total: number;
  score: number;
}

const ProgressBar = ({ current, total, score }: ProgressBarProps) => {
  const progress = ((current) / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="font-display text-lg text-foreground">
          Question {current + 1} of {total}
        </span>
        <span className="font-display text-lg text-primary px-3 py-1 bg-primary/20 rounded-full">
          ⭐ {score}
        </span>
      </div>
      <div className="w-full h-4 bg-muted rounded-full overflow-hidden border-2 border-foreground/20">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
