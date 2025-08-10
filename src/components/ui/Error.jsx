import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Error analyzing match data", 
  description = "There was an issue processing your prediction request. Please check your input data and try again.",
  onRetry,
  showRetry = true 
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
        transition={{ delay: 0.2 }}
        className="w-20 h-20 bg-error/20 rounded-full flex items-center justify-center"
      >
        <ApperIcon name="AlertTriangle" size={40} className="text-error" />
      </motion.div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{message}</h3>
        <p className="text-gray-400 max-w-md">{description}</p>
      </div>

      {showRetry && (
        <div className="space-y-3">
          <Button 
            onClick={onRetry}
            variant="primary"
            className="min-w-[140px]"
          >
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Try Again
          </Button>
          
          <p className="text-sm text-gray-500">
            Or refresh the page to start over
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-surface/50 rounded-lg border border-error/30">
        <h4 className="text-sm font-medium text-white mb-2">Troubleshooting Tips:</h4>
        <ul className="text-xs text-gray-400 space-y-1 text-left">
          <li>• Ensure all team names are entered correctly</li>
          <li>• Check that H2H results have valid scores (e.g., 2-1, 0-0)</li>
          <li>• Verify bookmaker odds are numeric values</li>
          <li>• Make sure date and time are properly formatted</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Error;