import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ConfidenceBar from "@/components/molecules/ConfidenceBar";
import { cn } from "@/utils/cn";

const PredictionResults = ({ prediction }) => {
  if (!prediction) return null;

  const getConfidenceColor = (conf) => {
    if (conf >= 80) return "text-primary";
    if (conf >= 60) return "text-accent";
    return "text-warning";
  };

const getConfidenceLabel = (conf) => {
    if (conf >= 80) return "Confiance Élevée";
    if (conf >= 60) return "Confiance Moyenne";
    return "Confiance Faible";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Main Predictions */}
      <div className="bg-gradient-to-br from-surface/80 to-secondary/50 backdrop-blur-sm rounded-xl border border-primary/30 p-6 glow-border">
        <div className="flex items-center justify-between mb-6">
<h2 className="text-xl font-display text-white flex items-center">
          <ApperIcon name="Target" size={20} className="mr-2 text-primary" />
          Prédictions IA
          </h2>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            prediction.confidence >= 80 ? "bg-primary/20 text-primary" :
            prediction.confidence >= 60 ? "bg-accent/20 text-accent" :
            "bg-warning/20 text-warning"
          )}>
            {getConfidenceLabel(prediction.confidence)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Half-Time Prediction */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center p-6 bg-background/50 rounded-lg border border-accent/30"
          >
<div className="flex items-center justify-center mb-2">
              <ApperIcon name="Clock" size={16} className="text-accent mr-2" />
              <span className="text-sm font-medium text-gray-300">Score Mi-Temps</span>
            </div>
            <div className="text-3xl font-display font-bold text-accent mb-2">
              {prediction.halfTimeScore}
            </div>
<div className="text-xs text-gray-400">Prédiction 45'</div>
          </motion.div>

          {/* Full-Time Prediction */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "text-center p-6 bg-background/50 rounded-lg border",
              prediction.confidence >= 80 
                ? "border-primary/50 high-confidence" 
                : "border-primary/30"
            )}
          >
<div className="flex items-center justify-center mb-2">
              <ApperIcon name="Flag" size={16} className="text-primary mr-2" />
              <span className="text-sm font-medium text-gray-300">Score Temps Plein</span>
            </div>
            <div className="text-4xl font-display font-bold text-primary mb-2">
              {prediction.fullTimeScore}
            </div>
<div className="text-xs text-gray-400">Score Final 90'</div>
          </motion.div>
        </div>

        {/* Confidence Meter */}
<ConfidenceBar 
          confidence={prediction.confidence}
          label="Confiance de la Prédiction"
          className="mb-4"
        />
      </div>

      {/* Analysis Factors */}
      <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-info/30 p-6">
<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ApperIcon name="Brain" size={18} className="mr-2 text-info" />
          Facteurs d'Analyse
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background/30 rounded-lg">
            <ApperIcon name="Users" size={24} className="text-primary mx-auto mb-2" />
<div className="text-sm text-gray-300 mb-1">Pattern H2H</div>
            <div className="text-lg font-bold text-white">
              {prediction.factors?.h2hPattern || "Fort"}
            </div>
          </div>

          <div className="text-center p-4 bg-background/30 rounded-lg">
            <ApperIcon name="TrendingUp" size={24} className="text-accent mx-auto mb-2" />
<div className="text-sm text-gray-300 mb-1">Fréquence Buts</div>
            <div className="text-lg font-bold text-white">
              {prediction.factors?.goalFrequency || "Élevée"}
            </div>
          </div>

          <div className="text-center p-4 bg-background/30 rounded-lg">
            <ApperIcon name="BarChart3" size={24} className="text-info mx-auto mb-2" />
<div className="text-sm text-gray-300 mb-1">Analyse Cotes</div>
            <div className="text-lg font-bold text-white">
              {prediction.factors?.oddsAnalysis || "Favorable"}
            </div>
          </div>

          <div className="text-center p-4 bg-background/30 rounded-lg">
            <ApperIcon name="Zap" size={24} className="text-warning mx-auto mb-2" />
<div className="text-sm text-gray-300 mb-1">Valeur Cachée</div>
            <div className="text-lg font-bold text-white">
              {prediction.factors?.hiddenValue || "Détectée"}
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Insights */}
      <div className="bg-secondary/50 backdrop-blur-sm rounded-xl border border-surface p-6">
<h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ApperIcon name="Cpu" size={18} className="mr-2 text-primary" />
          Insights Algorithme
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <ApperIcon name="CheckCircle" size={16} className="text-primary mt-0.5 flex-shrink-0" />
<p className="text-gray-300">
              L'algorithme de reconnaissance de patterns a identifié des tendances de score récurrentes dans les matchs H2H
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <ApperIcon name="CheckCircle" size={16} className="text-primary mt-0.5 flex-shrink-0" />
<p className="text-gray-300">
              L'analyse mi-temps montre des patterns de buts cohérents dans les 45 premières minutes
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <ApperIcon name="CheckCircle" size={16} className="text-primary mt-0.5 flex-shrink-0" />
<p className="text-gray-300">
              L'analyse des coefficients bookmaker révèle des opportunités de paris {prediction.factors?.hiddenOdds || "sous-évaluées"}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <ApperIcon name="CheckCircle" size={16} className="text-primary mt-0.5 flex-shrink-0" />
<p className="text-gray-300">
              La nature hautement offensive du championnat virtuel a été prise en compte dans la prédiction finale
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictionResults;