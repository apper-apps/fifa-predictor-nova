import React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-surface/50 bg-surface/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={24} className="text-black" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-white">
                  FIFA Predictor
                </h1>
                <p className="text-xs text-gray-400">
                  Advanced Virtual Match Analysis
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-white">FC 24 Championship</div>
                <div className="text-xs text-gray-400">4×4 England Virtual</div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                <ApperIcon name="Crown" size={16} className="text-black" />
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-surface/50 bg-surface/20 backdrop-blur-sm mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              © 2024 FIFA Predictor • Advanced AI Analysis
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <ApperIcon name="Brain" size={12} className="mr-1" />
                AI Powered
              </span>
              <span className="flex items-center">
                <ApperIcon name="Shield" size={12} className="mr-1" />
                Secure Analysis
              </span>
              <span className="flex items-center">
                <ApperIcon name="Zap" size={12} className="mr-1" />
                Real-time Processing
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;