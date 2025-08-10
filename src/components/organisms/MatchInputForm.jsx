import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import ScoreInput from "@/components/molecules/ScoreInput";
import TeamSelector, { englishTeamsWithLogos } from "@/components/molecules/TeamSelector";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
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
    })),
    exactScores: {
      halfTime: "",
      fullTime: ""
    }
  });

  const [errors, setErrors] = useState({});

  // Get team logo by name
  const getTeamLogo = (teamName) => {
    const team = englishTeamsWithLogos.find(t => t.name === teamName);
    return team ? team.logo : "https://via.placeholder.com/32x32?text=?";
  };

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
        h2hResults: validH2H,
        exactScores: matchData.exactScores
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
})),
      exactScores: {
        halfTime: "",
        fullTime: ""
      }
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
            label={
              <div className="flex items-center gap-2">
                {matchData.teamA && (
                  <img 
                    src={getTeamLogo(matchData.teamA)} 
                    alt={`${matchData.teamA} logo`}
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                Équipe A
              </div>
            }
            required
            error={errors.teamA}
          >
            <TeamSelector
              value={matchData.teamA}
              onChange={(e) => setMatchData({ ...matchData, teamA: e.target.value })}
              placeholder="Sélectionner l'Équipe A"
              error={errors.teamA}
            />
          </FormField>

          <FormField
            label={
              <div className="flex items-center gap-2">
                {matchData.teamB && (
                  <img 
                    src={getTeamLogo(matchData.teamB)} 
                    alt={`${matchData.teamB} logo`}
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                Équipe B
              </div>
            }
            required
            error={errors.teamB}
          >
            <TeamSelector
              value={matchData.teamB}
              onChange={(e) => setMatchData({ ...matchData, teamB: e.target.value })}
              placeholder="Sélectionner l'Équipe B"
              error={errors.teamB}
            />
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

        {/* Exact Scores Section */}
{/* Exact Scores Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-accent/10 border border-accent/30 rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <ApperIcon name="Target" size={20} className="text-accent" />
            <h3 className="text-lg font-semibold text-white">Prédictions Score Exact</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Score Exact Mi-Temps">
              <ScoreInput
                value={matchData.exactScores.halfTime}
                onChange={(value) => setMatchData({
                  ...matchData,
                  exactScores: { ...matchData.exactScores, halfTime: value }
                })}
                placeholder="1-0"
              />
            </FormField>
            
            <FormField label="Score Exact Temps Plein">
              <ScoreInput
                value={matchData.exactScores.fullTime}
                onChange={(value) => setMatchData({
                  ...matchData,
                  exactScores: { ...matchData.exactScores, fullTime: value }
                })}
                placeholder="2-1"
              />
            </FormField>
          </div>
          
          <div className="bg-accent/5 rounded-lg p-3 mt-4">
            <p className="text-xs text-gray-300 flex items-start gap-2">
              <ApperIcon name="Lightbulb" size={12} className="text-accent mt-0.5 flex-shrink-0" />
              <span>
                Saisissez vos prédictions de scores exacts pour améliorer la précision de l'analyse. 
                Ces scores seront comparés aux cotes des bookmakers pour identifier les opportunités de valeur.
              </span>
            </p>
          </div>
        </motion.div>
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