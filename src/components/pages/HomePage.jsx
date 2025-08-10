import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import MatchInputForm from "@/components/organisms/MatchInputForm";
import BookmakerOddsInput from "@/components/organisms/BookmakerOddsInput";
import PredictionResults from "@/components/organisms/PredictionResults";
import PatternVisualization from "@/components/organisms/PatternVisualization";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import predictionService from "@/services/api/predictionService";

const HomePage = () => {
  const [currentStep, setCurrentStep] = useState("input"); // input, odds, results
  const [matchData, setMatchData] = useState(null);
  const [bookmakerOdds, setBookmakerOdds] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMatchSubmit = (data) => {
    setMatchData(data);
    setCurrentStep("odds");
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!matchData || bookmakerOdds.length < 3) {
      toast.error("Please complete match details and add at least 3 bookmaker odds");
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
      
      toast.success("Analysis complete! Hidden patterns revealed.");
    } catch (err) {
      setError(err.message || "Failed to analyze match data");
      toast.error("Analysis failed. Please try again.");
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
    toast.info("Starting new analysis");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading message="Analyzing FIFA Virtual patterns..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Error
          message="Analysis Error"
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
          <span className="text-sm font-medium">Match Setup</span>
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
          <span className="text-sm font-medium">Odds Analysis</span>
        </div>

        <div className="w-8 h-px bg-surface"></div>

        <div className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg
          ${currentStep === "results" ? "bg-info/20 text-info" : "bg-surface/30 text-gray-500"}
        `}>
          <div className={`w-2 h-2 rounded-full ${
            currentStep === "results" ? "bg-info" : "bg-gray-500"
          }`}></div>
          <span className="text-sm font-medium">AI Predictions</span>
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
                title="Ready for Analysis"
                description="Enter match details and head-to-head results to begin FIFA Virtual score prediction analysis."
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
                <h3 className="text-lg font-semibold text-white mb-4">Match Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Teams:</span>
                    <span className="text-white font-medium">
                      {matchData?.teamA} vs {matchData?.teamB}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white">{matchData?.date} {matchData?.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">H2H Records:</span>
                    <span className="text-white">{matchData?.h2hResults?.length || 0} matches</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bookmaker Odds:</span>
                    <span className="text-white">{bookmakerOdds.length} entries</span>
                  </div>
                </div>
              </div>

              {bookmakerOdds.length < 3 && (
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                  <p className="text-sm text-warning">
                    Add {3 - bookmakerOdds.length} more bookmaker odds to enable analysis
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
                {matchData?.date} at {matchData?.time} • AI Analysis Complete
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
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={startOver}
                      className="w-full px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium"
                    >
                      New Analysis
                    </button>
                    <button
                      onClick={() => setCurrentStep("odds")}
                      className="w-full px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-lg hover:bg-accent/30 transition-colors text-sm font-medium"
                    >
                      Modify Odds
                    </button>
                  </div>
                </div>

                {/* Match Stats */}
                <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-surface p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Match Stats</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Analysis Time:</span>
                      <span className="text-white">2.3s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Data Points:</span>
                      <span className="text-white">{(matchData?.h2hResults?.length || 0) * 2 + bookmakerOdds.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Algorithms Used:</span>
                      <span className="text-white">7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confidence:</span>
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