import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "Ready for Analysis", 
  description = "Enter match details and historical data to generate precise FIFA Virtual predictions using advanced algorithms.",
  actionText = "Start New Prediction",
  onAction,
  showAction = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
          <ApperIcon name="TrendingUp" size={48} className="text-primary" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-accent/30 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="Zap" size={16} className="text-accent" />
        </motion.div>
      </motion.div>

      <div className="space-y-3">
        <h3 className="text-2xl font-display text-white">{title}</h3>
        <p className="text-gray-400 max-w-md leading-relaxed">{description}</p>
      </div>

      {showAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          size="lg"
          className="min-w-[180px] group"
        >
          <ApperIcon name="Play" size={16} className="mr-2 group-hover:scale-110 transition-transform" />
          {actionText}
        </Button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-lg">
        <div className="p-4 bg-surface/30 rounded-lg border border-primary/20">
          <ApperIcon name="Users" size={24} className="text-primary mb-2 mx-auto" />
          <p className="text-xs text-gray-400">Team Matchups</p>
        </div>
        <div className="p-4 bg-surface/30 rounded-lg border border-accent/20">
          <ApperIcon name="BarChart3" size={24} className="text-accent mb-2 mx-auto" />
          <p className="text-xs text-gray-400">H2H Analysis</p>
        </div>
        <div className="p-4 bg-surface/30 rounded-lg border border-info/20">
          <ApperIcon name="Target" size={24} className="text-info mb-2 mx-auto" />
          <p className="text-xs text-gray-400">Score Prediction</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;