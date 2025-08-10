import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Analyzing match data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <motion.div
        className="relative"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="w-16 h-16 border-4 border-surface border-t-primary rounded-full"></div>
      </motion.div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-white">{message}</h3>
        <p className="text-gray-400">Processing algorithms and patterns...</p>
      </div>

      <div className="flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full pattern-dot"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Skeleton for prediction results */}
      <div className="w-full max-w-md space-y-4 mt-8">
        <div className="animate-pulse">
          <div className="h-4 bg-surface rounded mb-2"></div>
          <div className="h-8 bg-surface rounded mb-4"></div>
          <div className="h-4 bg-surface rounded mb-2"></div>
          <div className="h-6 bg-surface rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;