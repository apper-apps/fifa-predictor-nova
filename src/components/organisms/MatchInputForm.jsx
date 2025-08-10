import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ScoreInput from "@/components/molecules/ScoreInput";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MatchInputForm = ({ onSubmit, loading }) => {
  const [matchData, setMatchData] = useState({
    teamA: "",
    teamB: "",
    date: "",
    time: "",
    h2hResults: Array(6).fill().map(() => ({
      halfTimeScore: "",
      fullTimeScore: "",
      date: ""
    }))
  });

  const [errors, setErrors] = useState({});

  const englishTeams = [
    "Arsenal", "Chelsea", "Liverpool", "Manchester City", "Manchester United",
    "Tottenham", "Newcastle", "Brighton", "Aston Villa", "West Ham",
    "Crystal Palace", "Fulham", "Brentford", "Wolves", "Everton",
    "Nottingham Forest", "Sheffield United", "Burnley", "Luton Town", "Bournemouth"
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!matchData.teamA) newErrors.teamA = "Team A is required";
    if (!matchData.teamB) newErrors.teamB = "Team B is required";
    if (matchData.teamA === matchData.teamB) {
      newErrors.teamB = "Teams must be different";
    }
    if (!matchData.date) newErrors.date = "Match date is required";
    if (!matchData.time) newErrors.time = "Match time is required";

    // Validate H2H results
    const validH2HCount = matchData.h2hResults.filter(h2h => 
      h2h.halfTimeScore && h2h.fullTimeScore && h2h.date
    ).length;

    if (validH2HCount < 3) {
      newErrors.h2h = "At least 3 complete H2H results are required";
    }

    // Validate score formats
    matchData.h2hResults.forEach((h2h, index) => {
      if (h2h.halfTimeScore && !/^\d{1,2}-\d{1,2}$/.test(h2h.halfTimeScore)) {
        newErrors[`h2h_ht_${index}`] = "Invalid score format (e.g., 2-1)";
      }
      if (h2h.fullTimeScore && !/^\d{1,2}-\d{1,2}$/.test(h2h.fullTimeScore)) {
        newErrors[`h2h_ft_${index}`] = "Invalid score format (e.g., 2-1)";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const validH2H = matchData.h2hResults.filter(h2h => 
        h2h.halfTimeScore && h2h.fullTimeScore && h2h.date
      );

      onSubmit({
        ...matchData,
        h2hResults: validH2H
      });
      
      toast.success(`Analysis started for ${matchData.teamA} vs ${matchData.teamB}`);
    } else {
      toast.error("Please fix the form errors before submitting");
    }
  };

  const updateH2HResult = (index, field, value) => {
    const newResults = [...matchData.h2hResults];
    newResults[index] = { ...newResults[index], [field]: value };
    setMatchData({ ...matchData, h2hResults: newResults });
  };

  const clearForm = () => {
    setMatchData({
      teamA: "",
      teamB: "",
      date: "",
      time: "",
      h2hResults: Array(6).fill().map(() => ({
        halfTimeScore: "",
        fullTimeScore: "",
        date: ""
      }))
    });
    setErrors({});
    toast.info("Form cleared");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface/80 backdrop-blur-sm rounded-xl border border-primary/30 p-6 glow-border"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-white flex items-center">
          <ApperIcon name="Settings" size={20} className="mr-2 text-primary" />
          Match Configuration
        </h2>
        <Button variant="ghost" size="sm" onClick={clearForm}>
          <ApperIcon name="RotateCcw" size={16} className="mr-1" />
          Clear
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Team A"
            required
            error={errors.teamA}
          >
            <Select
              value={matchData.teamA}
              onChange={(e) => setMatchData({ ...matchData, teamA: e.target.value })}
              placeholder="Select Team A"
              error={errors.teamA}
            >
              {englishTeams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Team B"
            required
            error={errors.teamB}
          >
            <Select
              value={matchData.teamB}
              onChange={(e) => setMatchData({ ...matchData, teamB: e.target.value })}
              placeholder="Select Team B"
              error={errors.teamB}
            >
              {englishTeams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </Select>
          </FormField>
        </div>

        {/* Match Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Match Date"
            required
            error={errors.date}
          >
            <Input
              type="date"
              value={matchData.date}
              onChange={(e) => setMatchData({ ...matchData, date: e.target.value })}
              error={errors.date}
            />
          </FormField>

          <FormField
            label="Match Time"
            required
            error={errors.time}
          >
            <Input
              type="time"
              value={matchData.time}
              onChange={(e) => setMatchData({ ...matchData, time: e.target.value })}
              error={errors.time}
            />
          </FormField>
        </div>

        {/* Head-to-Head Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Head-to-Head Results</h3>
            <span className="text-sm text-gray-400">
              (Minimum 3 required)
            </span>
          </div>
          
          {errors.h2h && (
            <p className="text-sm text-error">{errors.h2h}</p>
          )}

          <div className="space-y-3">
            {matchData.h2hResults.map((h2h, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-background/50 rounded-lg border border-surface",
                  (h2h.halfTimeScore && h2h.fullTimeScore && h2h.date) && "border-primary/30"
                )}
              >
                <div className="md:col-span-1">
                  <FormField label={`H2H #${index + 1} Date`}>
                    <Input
                      type="date"
                      value={h2h.date}
                      onChange={(e) => updateH2HResult(index, "date", e.target.value)}
                      placeholder="Match date"
                    />
                  </FormField>
                </div>
                
                <div>
                  <FormField 
                    label="Half-Time Score"
                    error={errors[`h2h_ht_${index}`]}
                  >
                    <ScoreInput
                      value={h2h.halfTimeScore}
                      onChange={(value) => updateH2HResult(index, "halfTimeScore", value)}
                      placeholder="0-0"
                      error={errors[`h2h_ht_${index}`]}
                    />
                  </FormField>
                </div>
                
                <div>
                  <FormField 
                    label="Full-Time Score"
                    error={errors[`h2h_ft_${index}`]}
                  >
                    <ScoreInput
                      value={h2h.fullTimeScore}
                      onChange={(value) => updateH2HResult(index, "fullTimeScore", value)}
                      placeholder="0-0"
                      error={errors[`h2h_ft_${index}`]}
                    />
                  </FormField>
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newResults = [...matchData.h2hResults];
                      newResults[index] = { halfTimeScore: "", fullTimeScore: "", date: "" };
                      setMatchData({ ...matchData, h2hResults: newResults });
                    }}
                    className="w-full"
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <ApperIcon name="Play" size={16} className="mr-2" />
              Generate Predictions
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default MatchInputForm;