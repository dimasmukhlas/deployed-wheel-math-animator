import { motion } from "framer-motion";

interface FractionBarProps {
  numerator: number;
  denominator: number;
  width?: number;
  height?: number;
  showLabel?: boolean;
}

const FractionBar = ({
  numerator,
  denominator,
  width = 300,
  height = 60,
  showLabel = true,
}: FractionBarProps) => {
  const segmentWidth = width / denominator;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative rounded-xl overflow-hidden border-2 border-border bg-muted"
        style={{ width, height }}
      >
        {Array.from({ length: denominator }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              delay: i * 0.1,
              duration: 0.4,
              type: "spring",
              stiffness: 200,
            }}
            className={`absolute top-0 bottom-0 ${
              i < numerator ? "bg-primary" : "bg-transparent"
            }`}
            style={{
              left: i * segmentWidth,
              width: segmentWidth,
              transformOrigin: "left",
              borderRight:
                i < denominator - 1 ? "2px solid hsl(var(--border))" : "none",
            }}
          />
        ))}
        {/* Segment lines */}
        {Array.from({ length: denominator - 1 }, (_, i) => (
          <div
            key={`line-${i}`}
            className="absolute top-0 bottom-0 w-0.5 bg-border z-10"
            style={{ left: (i + 1) * segmentWidth }}
          />
        ))}
      </div>
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className="text-2xl font-bold text-primary">{numerator}</span>
          <span className="text-2xl text-muted-foreground">/</span>
          <span className="text-2xl font-bold text-foreground">
            {denominator}
          </span>
          <span className="text-lg text-muted-foreground ml-2">
            bagian terisi
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default FractionBar;
