import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import BookmakerOddsInput from "@/components/organisms/BookmakerOddsInput";
import MatchInputForm from "@/components/organisms/MatchInputForm";
import PatternVisualization from "@/components/organisms/PatternVisualization";
import PredictionResults from "@/components/organisms/PredictionResults";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import predictionsData from "@/services/mockData/predictions.json";
import patternsData from "@/services/mockData/patterns.json";
import predictionService from "@/services/api/predictionService";

const HomePage = () => {
  const [currentStep, setCurrentStep] = useState("input"); // input, odds, results
  const [matchData, setMatchData] = useState(null);
  const [bookmakerOdds, setBookmakerOdds] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const handleMatchSubmit = (data) => {
    setMatchData(data);
    setCurrentStep("odds");
    setError(null);
  };

const handleExport = async (format) => {
    setShowExportDropdown(false);
    
    if (!prediction || !matchData) {
      toast.error("Aucune donnée de prédiction disponible pour l'export");
      return;
    }

    try {
      let success = false;
      const teamNames = `${matchData.teamA} vs ${matchData.teamB}`;
      
      switch (format) {
        case 'csv':
          success = await predictionService.exportToCSV(prediction, matchData, bookmakerOdds);
          toast.success(`Export CSV réussi - ${teamNames}`);
          break;
        case 'excel':
          success = await predictionService.exportToExcel(prediction, matchData, bookmakerOdds);
          toast.success(`Export Excel réussi - ${teamNames}`);
          break;
        case 'json':
          success = await predictionService.exportToJSON(prediction, matchData, bookmakerOdds);
          toast.success(`Export JSON réussi - ${teamNames}`);
          break;
        case 'pdf':
          success = await predictionService.exportToPDF(prediction, matchData, bookmakerOdds);
          toast.success(`Export PDF réussi - ${teamNames}`);
          break;
        default:
          toast.error("Format d'export non supporté");
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Erreur lors de l'export ${format.toUpperCase()}: ${error.message}`);
    }
  };

  const handleAnalyze = async () => {
    if (!matchData || bookmakerOdds.length < 3) {
      toast.error("Veuillez compléter les détails du match et ajouter au moins 3 cotes bookmaker");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Generate prediction
      const predictionResult = await predictionService.generatePrediction({
        match: matchData,
        odds: bookmakerOdds
      });

      // Get pattern analysis
      const patternResult = await predictionService.getPatternAnalysis({
        teamA: matchData.teamA,
        teamB: matchData.teamB,
        h2hResults: matchData.h2hResults
      });

      setPrediction(predictionResult);
      setPatterns(patternResult);
      setCurrentStep("results");
      
toast.success("Analyse terminée ! Patterns cachés révélés.");
    } catch (err) {
      setError(err.message || "Failed to analyze match data");
toast.error("Échec de l'analyse. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    handleAnalyze();
  };

  const startOver = () => {
    setCurrentStep("input");
    setMatchData(null);
    setBookmakerOdds([]);
    setPrediction(null);
    setPatterns(null);
    setError(null);
toast.info("Démarrage d'une nouvelle analyse");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<Loading message="Analyse des patterns FIFA Virtual..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<Error
          message="Erreur d'Analyse"
          description={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center space-x-4 mb-8"
      >
        <div className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg
          ${currentStep === "input" ? "bg-primary/20 text-primary" : 
            matchData ? "bg-surface/50 text-green-400" : "bg-surface/30 text-gray-500"}
        `}>
          <div className={`w-2 h-2 rounded-full ${
            matchData ? "bg-green-400" : currentStep === "input" ? "bg-primary" : "bg-gray-500"
          }`}></div>
<span className="text-sm font-medium">Configuration Match</span>
        </div>

        <div className="w-8 h-px bg-surface"></div>

        <div className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg
          ${currentStep === "odds" ? "bg-accent/20 text-accent" : 
            bookmakerOdds.length >= 3 ? "bg-surface/50 text-green-400" : "bg-surface/30 text-gray-500"}
        `}>
          <div className={`w-2 h-2 rounded-full ${
            bookmakerOdds.length >= 3 ? "bg-green-400" : currentStep === "odds" ? "bg-accent" : "bg-gray-500"
          }`}></div>
<span className="text-sm font-medium">Analyse Cotes</span>
        </div>

        <div className="w-8 h-px bg-surface"></div>

        <div className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg
          ${currentStep === "results" ? "bg-info/20 text-info" : "bg-surface/30 text-gray-500"}
        `}>
          <div className={`w-2 h-2 rounded-full ${
            currentStep === "results" ? "bg-info" : "bg-gray-500"
          }`}></div>
<span className="text-sm font-medium">Prédictions IA</span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {currentStep === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <MatchInputForm 
              onSubmit={handleMatchSubmit}
              loading={loading}
            />
            
            <div className="lg:sticky lg:top-8 lg:h-fit">
<Empty 
                title="Prêt pour l'Analyse"
                description="Saisissez les détails du match et les résultats face-à-face pour commencer l'analyse de prédiction de score FIFA Virtual."
                showAction={false}
              />
            </div>
          </motion.div>
        )}

        {currentStep === "odds" && (
          <motion.div
            key="odds"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <BookmakerOddsInput
              odds={bookmakerOdds}
              onOddsChange={setBookmakerOdds}
              onAnalyze={handleAnalyze}
              loading={loading}
            />

            <div className="lg:sticky lg:top-8 lg:h-fit space-y-6">
              {/* Match Summary */}
              <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-primary/30 p-6">
<h3 className="text-lg font-semibold text-white mb-4">Résumé du Match</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
<span className="text-gray-400">Équipes:</span>
                    <span className="text-white font-medium">
                      {matchData?.teamA} vs {matchData?.teamB}
                    </span>
                  </div>
                  <div className="flex justify-between">
<span className="text-gray-400">Date:</span>
                    <span className="text-white">{matchData?.date} {matchData?.time}</span>
                  </div>
                  <div className="flex justify-between">
<span className="text-gray-400">Historiques H2H:</span>
<span className="text-white">{matchData?.h2hResults?.length || 0} matchs</span>
                  </div>
                  <div className="flex justify-between">
<span className="text-gray-400">Cotes Bookmaker:</span>
<span className="text-white">{bookmakerOdds.length} entrées</span>
                  </div>
                </div>
              </div>

              {bookmakerOdds.length < 3 && (
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
<p className="text-sm text-warning">
                    Ajoutez {3 - bookmakerOdds.length} cotes bookmaker supplémentaires pour activer l'analyse
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {currentStep === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="space-y-8"
          >
{/* Results Header */}
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                {matchData?.teamA} vs {matchData?.teamB}
              </h2>
              <p className="text-gray-400">
                {matchData?.date} à {matchData?.time} • Analyse IA Terminée
              </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Prediction Results */}
              <div className="xl:col-span-2">
                <PredictionResults prediction={prediction} />
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-surface p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Actions Rapides</h3>
                  <div className="space-y-3">
                    <button
                      onClick={startOver}
                      className="w-full px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium"
                    >
                      Nouvelle Analyse
                    </button>
                    <button
                      onClick={() => setCurrentStep("odds")}
                      className="w-full px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-lg hover:bg-accent/30 transition-colors text-sm font-medium"
                    >
                      Modifier Cotes
                    </button>
                    
                    {/* Export Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowExportDropdown(!showExportDropdown)}
                        className="w-full px-4 py-2 bg-info/20 text-info border border-info/30 rounded-lg hover:bg-info/30 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <ApperIcon name="Download" size={16} />
                        <span>Exporter Résultats</span>
                        <ApperIcon name={showExportDropdown ? "ChevronUp" : "ChevronDown"} size={14} />
                      </button>
                      
                      {showExportDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full mt-2 w-full bg-surface/95 backdrop-blur-sm border border-info/30 rounded-lg shadow-lg z-50"
                        >
                          <div className="p-2 space-y-1">
                            <button
                              onClick={() => handleExport('csv')}
                              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-primary/20 hover:text-primary rounded-md transition-colors flex items-center space-x-2"
                            >
                              <ApperIcon name="FileSpreadsheet" size={14} />
                              <span>Export CSV</span>
                            </button>
                            <button
                              onClick={() => handleExport('excel')}
                              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-primary/20 hover:text-primary rounded-md transition-colors flex items-center space-x-2"
                            >
                              <ApperIcon name="FileSpreadsheet" size={14} />
                              <span>Export Excel</span>
                            </button>
                            <button
                              onClick={() => handleExport('json')}
                              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-primary/20 hover:text-primary rounded-md transition-colors flex items-center space-x-2"
                            >
                              <ApperIcon name="FileCode" size={14} />
                              <span>Export JSON</span>
                            </button>
                            <button
                              onClick={() => handleExport('pdf')}
                              className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-primary/20 hover:text-primary rounded-md transition-colors flex items-center space-x-2"
                            >
                              <ApperIcon name="FileText" size={14} />
                              <span>Export PDF</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Stats */}
                <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-surface p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Stats du Match</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Temps d'Analyse:</span>
                      <span className="text-white">2.3s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Points de Données:</span>
                      <span className="text-white">{(matchData?.h2hResults?.length || 0) * 2 + bookmakerOdds.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Algorithmes Utilisés:</span>
                      <span className="text-white">7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confiance:</span>
                      <span className="text-primary font-medium">{prediction?.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Visualization */}
            <PatternVisualization data={patterns} />
</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;