import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import FractionPieChart from "./FractionPieChart";
import FractionBar from "./FractionBar";

const InteractiveFractionExplorer = () => {
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(4);
  const [visualType, setVisualType] = useState<"pie" | "bar">("pie");

  const handleNumeratorChange = (delta: number) => {
    const newValue = numerator + delta;
    if (newValue >= 0 && newValue <= denominator) {
      setNumerator(newValue);
    }
  };

  const handleDenominatorChange = (delta: number) => {
    const newValue = denominator + delta;
    if (newValue >= 1 && newValue <= 12) {
      setDenominator(newValue);
      if (numerator > newValue) {
        setNumerator(newValue);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-8 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
        Jelajahi Pecahan
      </h2>

      {/* Visual Type Toggle */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setVisualType("pie")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            visualType === "pie"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-secondary"
          }`}
        >
          Lingkaran
        </button>
        <button
          onClick={() => setVisualType("bar")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            visualType === "bar"
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-secondary"
          }`}
        >
          Batang
        </button>
      </div>

      {/* Visualization */}
      <div className="flex justify-center mb-8" key={`${numerator}-${denominator}-${visualType}`}>
        {visualType === "pie" ? (
          <FractionPieChart
            numerator={numerator}
            denominator={denominator}
            size={220}
          />
        ) : (
          <FractionBar
            numerator={numerator}
            denominator={denominator}
            width={320}
            height={60}
          />
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-8">
        {/* Numerator Control */}
        <div className="text-center">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Pembilang
          </label>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNumeratorChange(-1)}
              disabled={numerator <= 0}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center disabled:opacity-30 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Minus className="w-5 h-5" />
            </motion.button>
            <span className="text-4xl font-bold text-primary w-12 text-center">
              {numerator}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNumeratorChange(1)}
              disabled={numerator >= denominator}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center disabled:opacity-30 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Denominator Control */}
        <div className="text-center">
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Penyebut
          </label>
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDenominatorChange(-1)}
              disabled={denominator <= 1}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center disabled:opacity-30 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Minus className="w-5 h-5" />
            </motion.button>
            <span className="text-4xl font-bold text-foreground w-12 text-center">
              {denominator}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDenominatorChange(1)}
              disabled={denominator >= 12}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center disabled:opacity-30 hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <motion.div
        key={`${numerator}/${denominator}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 p-4 bg-secondary/50 rounded-xl text-center"
      >
        <p className="text-foreground">
          <span className="font-bold text-primary">{numerator}/{denominator}</span> artinya{" "}
          <span className="font-semibold">{numerator} bagian</span> dari{" "}
          <span className="font-semibold">{denominator} bagian total</span>
        </p>
        {numerator === denominator && (
          <p className="text-success font-medium mt-2">
            ✨ Ini sama dengan 1 utuh!
          </p>
        )}
        {numerator === 0 && (
          <p className="text-muted-foreground mt-2">
            Belum ada bagian yang terisi
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InteractiveFractionExplorer;
