import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ConfidenceBar = ({ 
  confidence, 
  label = "Confidence", 
  showPercentage = true,
  className 
}) => {
  const getColorByConfidence = (conf) => {
    if (conf >= 80) return "from-primary to-primary/80";
    if (conf >= 60) return "from-accent to-accent/80";
    return "from-warning to-warning/80";
  };

  const getGlowClass = (conf) => {
    return conf >= 80 ? "high-confidence" : "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        {showPercentage && (
          <span className="text-sm font-bold text-white">{confidence}%</span>
        )}
      </div>
      
      <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
        <motion.div
          className={cn(
            "h-full bg-gradient-to-r rounded-full",
            getColorByConfidence(confidence),
            getGlowClass(confidence)
          )}
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ConfidenceBar;