import { motion } from "framer-motion";

interface FractionPieChartProps {
  numerator: number;
  denominator: number;
  size?: number;
  animated?: boolean;
  showLabel?: boolean;
}

const FractionPieChart = ({
  numerator,
  denominator,
  size = 200,
  animated = true,
  showLabel = true,
}: FractionPieChartProps) => {
  const radius = size / 2 - 10;
  const center = size / 2;

  const createSlicePath = (index: number, total: number) => {
    const angle = (2 * Math.PI) / total;
    const startAngle = index * angle - Math.PI / 2;
    const endAngle = (index + 1) * angle - Math.PI / 2;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArc = angle > Math.PI ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const slices = Array.from({ length: denominator }, (_, i) => ({
    path: createSlicePath(i, denominator),
    filled: i < numerator,
  }));

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} className="drop-shadow-lg">
        {slices.map((slice, index) => (
          <motion.path
            key={index}
            d={slice.path}
            initial={animated ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: animated ? index * 0.1 : 0,
              duration: 0.4,
              type: "spring",
              stiffness: 200,
            }}
            className={`fraction-piece ${
              slice.filled
                ? "fill-primary stroke-primary-foreground"
                : "fill-muted stroke-border"
            }`}
            strokeWidth={2}
            style={{ transformOrigin: `${center}px ${center}px` }}
          />
        ))}
        <circle
          cx={center}
          cy={center}
          r={radius + 5}
          fill="none"
          className="stroke-border"
          strokeWidth={2}
        />
      </svg>
      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <span className="text-3xl font-bold text-foreground">
            {numerator}
          </span>
          <div className="w-12 h-0.5 bg-foreground mx-auto my-1" />
          <span className="text-3xl font-bold text-foreground">
            {denominator}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default FractionPieChart;
