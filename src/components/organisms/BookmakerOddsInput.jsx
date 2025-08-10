import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BookmakerOddsInput = ({ odds, onOddsChange, onAnalyze, loading }) => {
  const [newOdd, setNewOdd] = useState({
    score: "",
    coefficient: "",
    bookmaker: "Bet365"
  });

  const bookmakers = [
    "Bet365", "William Hill", "Paddy Power", "Betfair", "Ladbrokes",
    "Coral", "Sky Bet", "Betway", "888Sport", "Unibet"
  ];

  const addOdd = () => {
    if (!newOdd.score || !newOdd.coefficient) {
      toast.error("Please enter both score and coefficient");
      return;
    }

    // Validate score format
    if (!/^\d{1,2}-\d{1,2}$/.test(newOdd.score)) {
      toast.error("Score must be in format like 2-1, 0-0");
      return;
    }

    // Validate coefficient
    const coeff = parseFloat(newOdd.coefficient);
    if (isNaN(coeff) || coeff <= 1) {
      toast.error("Coefficient must be a number greater than 1");
      return;
    }

    const oddWithId = {
      ...newOdd,
      id: Date.now(),
      coefficient: coeff
    };

    onOddsChange([...odds, oddWithId]);
    setNewOdd({ score: "", coefficient: "", bookmaker: "Bet365" });
    toast.success("Bookmaker odd added");
  };

  const removeOdd = (id) => {
    onOddsChange(odds.filter(odd => odd.id !== id));
    toast.info("Odd removed");
  };

  const clearAllOdds = () => {
    onOddsChange([]);
    toast.info("All odds cleared");
  };

  const getOddColor = (coefficient) => {
    if (coefficient <= 2) return "text-error"; // Low odds - high probability
    if (coefficient <= 5) return "text-warning"; // Medium odds
    return "text-success"; // High odds - low probability
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface/80 backdrop-blur-sm rounded-xl border border-accent/30 p-6 glow-border"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-white flex items-center">
          <ApperIcon name="TrendingUp" size={20} className="mr-2 text-accent" />
          Bookmaker Odds
        </h2>
        <Button variant="ghost" size="sm" onClick={clearAllOdds}>
          <ApperIcon name="Trash2" size={16} className="mr-1" />
          Clear All
        </Button>
      </div>

      {/* Add New Odd Form */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <FormField label="Score">
            <Input
              value={newOdd.score}
              onChange={(e) => setNewOdd({ ...newOdd, score: e.target.value })}
              placeholder="2-1"
              className="text-center font-mono"
            />
          </FormField>

          <FormField label="Coefficient">
            <Input
              type="number"
              step="0.01"
              min="1.01"
              value={newOdd.coefficient}
              onChange={(e) => setNewOdd({ ...newOdd, coefficient: e.target.value })}
              placeholder="2.50"
              className="text-center"
            />
          </FormField>

          <FormField label="Bookmaker">
            <select
              value={newOdd.bookmaker}
              onChange={(e) => setNewOdd({ ...newOdd, bookmaker: e.target.value })}
              className="flex h-10 w-full rounded-lg border border-surface bg-secondary/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
            >
              {bookmakers.map(bookmaker => (
                <option key={bookmaker} value={bookmaker}>{bookmaker}</option>
              ))}
            </select>
          </FormField>

          <div className="flex items-end">
            <Button
              type="button"
              variant="accent"
              size="md"
              onClick={addOdd}
              className="w-full"
            >
              <ApperIcon name="Plus" size={16} className="mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {/* Odds List */}
      <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
        {odds.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ApperIcon name="Plus" size={32} className="mx-auto mb-2 opacity-50" />
            <p>No bookmaker odds added yet</p>
            <p className="text-sm">Add odds to enable analysis</p>
          </div>
        ) : (
          odds.map((odd, index) => (
            <motion.div
              key={odd.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-surface group hover:border-accent/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="font-mono text-lg font-bold text-white">{odd.score}</div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
                
                <div className="text-center">
                  <div className={cn("text-lg font-bold", getOddColor(odd.coefficient))}>
                    {odd.coefficient.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-400">Coeff</div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-gray-300">{odd.bookmaker}</div>
                  <div className="text-xs text-gray-400">Bookmaker</div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeOdd(odd.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-error hover:text-error"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </motion.div>
          ))
        )}
      </div>

      {/* Analyze Button */}
      <Button
        variant="accent"
        size="lg"
        onClick={onAnalyze}
        disabled={loading || odds.length < 3}
        className="w-full"
      >
        {loading ? (
          <>
            <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
            Analyzing Patterns...
          </>
        ) : (
          <>
            <ApperIcon name="Zap" size={16} className="mr-2" />
            Analyze Hidden Patterns
            {odds.length < 3 && ` (${3 - odds.length} more needed)`}
          </>
        )}
      </Button>

      {odds.length > 0 && (
        <p className="text-xs text-gray-400 text-center mt-2">
          {odds.length} odds ready • Minimum 3 required for analysis
        </p>
      )}
    </motion.div>
  );
};

export default BookmakerOddsInput;