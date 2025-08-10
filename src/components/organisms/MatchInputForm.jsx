import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import ScoreInput from "@/components/molecules/ScoreInput";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

// Team data with logos for realistic display
const englishTeamsWithLogos = [
  { name: "Arsenal", logo: "Users" },
  { name: "Chelsea", logo: "Trophy" },
  { name: "Liverpool", logo: "Heart" },
  { name: "Manchester City", logo: "Crown" },
  { name: "Manchester United", logo: "Flame" },
  { name: "Tottenham", logo: "Zap" },
  { name: "Newcastle", logo: "Mountain" },
  { name: "Brighton", logo: "Sun" },
  { name: "West Ham", logo: "Hammer" },
  { name: "Aston Villa", logo: "Home" },
  { name: "Crystal Palace", logo: "Gem" },
  { name: "Fulham", logo: "Flag" },
  { name: "Brentford", logo: "Hexagon" },
  { name: "Wolves", logo: "Moon" },
  { name: "Everton", logo: "Star" },
  { name: "Nottingham Forest", logo: "TreePine" },
  { name: "Leeds United", logo: "Award" },
  { name: "Leicester City", logo: "Medal" },
  { name: "Southampton", logo: "Anchor" },
  { name: "Bournemouth", logo: "Cherry" }
];

const englishTeams = englishTeamsWithLogos.map(team => team.name);

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
    },
    bookmakerScores: {
      score1: "", score2: "", score3: "", score4: "", score5: "",
      score6: "", score7: "", score8: "", score9: "", score10: "",
      score11: "", score12: "", score13: "", score14: "", score15: "",
      score16: "", score17: "", score18: "", score19: "", score20: ""
    },
    bookmakerCoefficients: {
      coeff1: "", coeff2: "", coeff3: "", coeff4: "", coeff5: "",
      coeff6: "", coeff7: "", coeff8: "", coeff9: "", coeff10: "",
      coeff11: "", coeff12: "", coeff13: "", coeff14: "", coeff15: "",
      coeff16: "", coeff17: "", coeff18: "", coeff19: "", coeff20: ""
    }
  });

  const [errors, setErrors] = useState({});

const englishTeams = [
    "Arsenal", "Chelsea", "Liverpool", "Manchester City", "Manchester United",
    "Tottenham", "Newcastle", "Brighton", "Aston Villa", "West Ham",
    "Crystal Palace", "Fulham", "Brentford", "Wolves", "Everton",
    "Nottingham Forest", "Leeds United", "Leicester City", "Southampton", "Bournemouth"
  ];
// Get team logo by name
  const getTeamLogo = (teamName) => {
    const team = englishTeamsWithLogos.find(t => t.name === teamName);
    return team ? team.logo : "Shield";
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
      if (h2h.halfTimeScore && !/^\d{1,2}-\d{1,2}$/.test(h2h.halfTimeScore.trim())) {
        newErrors[`h2h_ht_${index}`] = "Format invalide (ex: 2-1)";
      }
      if (h2h.fullTimeScore && !/^\d{1,2}-\d{1,2}$/.test(h2h.fullTimeScore.trim())) {
        newErrors[`h2h_ft_${index}`] = "Format invalide (ex: 2-1)";
      }
    });

    // Validate exact scores format
if (matchData.exactScores.halfTime && !/^\d{1,2}-\d{1,2}$/.test(matchData.exactScores.halfTime.trim())) {
      newErrors.exactHalfTime = "Format invalide (ex: 1-0)";
    }
    if (matchData.exactScores.fullTime && !/^\d{1,2}-\d{1,2}$/.test(matchData.exactScores.fullTime.trim())) {
      newErrors.exactFullTime = "Format invalide (ex: 2-1)";
    }

    // Validate bookmaker scores and coefficients format
    Object.keys(matchData.bookmakerScores).forEach(key => {
      const score = matchData.bookmakerScores[key];
      if (score && !/^\d{1,2}-\d{1,2}$/.test(score.trim())) {
        newErrors[`bookmaker_${key}`] = "Format score invalide (ex: 2-1)";
      }
    });

    // Validate coefficients format
    Object.keys(matchData.bookmakerCoefficients).forEach(key => {
      const coeff = matchData.bookmakerCoefficients[key];
      if (coeff && (isNaN(parseFloat(coeff)) || parseFloat(coeff) <= 0)) {
        newErrors[`coefficient_${key}`] = "Coefficient invalide (ex: 1.85)";
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

      // Clean bookmaker scores
const cleanBookmakerScores = Object.keys(matchData.bookmakerScores).reduce((acc, key) => {
        if (matchData.bookmakerScores[key].trim()) {
          acc[key] = matchData.bookmakerScores[key].trim();
        }
        return acc;
      }, {});

      const cleanBookmakerCoefficients = Object.keys(matchData.bookmakerCoefficients).reduce((acc, key) => {
        if (matchData.bookmakerCoefficients[key].trim()) {
          acc[key] = parseFloat(matchData.bookmakerCoefficients[key].trim());
        }
        return acc;
      }, {});

      onSubmit({
        ...matchData,
        h2hResults: validH2H,
        exactScores: {
          halfTime: matchData.exactScores.halfTime.trim(),
          fullTime: matchData.exactScores.fullTime.trim()
        },
        bookmakerScores: cleanBookmakerScores,
        bookmakerCoefficients: cleanBookmakerCoefficients
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
      },
      bookmakerScores: {
        score1: "", score2: "", score3: "", score4: "", score5: "",
        score6: "", score7: "", score8: "", score9: "", score10: "",
        score11: "", score12: "", score13: "", score14: "", score15: "",
        score16: "", score17: "", score18: "", score19: "", score20: ""
      },
      bookmakerCoefficients: {
        coeff1: "", coeff2: "", coeff3: "", coeff4: "", coeff5: "",
        coeff6: "", coeff7: "", coeff8: "", coeff9: "", coeff10: "",
        coeff11: "", coeff12: "", coeff13: "", coeff14: "", coeff15: "",
        coeff16: "", coeff17: "", coeff18: "", coeff19: "", coeff20: ""
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
                  <ApperIcon name={getTeamLogo(matchData.teamA)} size={16} className="text-primary" />
                )}
                Team A
              </div>
            }
            required
            error={errors.teamA}
          >
            <Select
              value={matchData.teamA}
              onChange={(e) => setMatchData({ ...matchData, teamA: e.target.value })}
              placeholder="Select Team A"
              error={errors.teamA}
            >
              {englishTeamsWithLogos.map(team => (
                <option key={team.name} value={team.name}>
                  {team.name}
                </option>
              ))}
            </Select>
          </FormField>

<FormField
            label={
              <div className="flex items-center gap-2">
                {matchData.teamB && (
                  <ApperIcon name={getTeamLogo(matchData.teamB)} size={16} className="text-primary" />
                )}
                Team B
              </div>
            }
            required
            error={errors.teamB}
          >
            <Select
              value={matchData.teamB}
              onChange={(e) => setMatchData({ ...matchData, teamB: e.target.value })}
              placeholder="Select Team B"
              error={errors.teamB}
            >
              {englishTeamsWithLogos.map(team => (
                <option key={team.name} value={team.name}>
                  {team.name}
                </option>
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

        {/* Exact Scores Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface/30 rounded-xl p-6 border border-primary/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <ApperIcon name="Target" size={20} className="text-accent" />
            <h3 className="text-lg font-semibold text-white">Exact Score Predictions</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField label="Half-Time Exact Score">
              <ScoreInput
                value={matchData.exactScores.halfTime}
                onChange={(value) => setMatchData({
                  ...matchData,
                  exactScores: { ...matchData.exactScores, halfTime: value }
                })}
                placeholder="1-0"
                error={errors.exactHalfTime}
              />
            </FormField>
            
            <FormField label="Full-Time Exact Score">
              <ScoreInput
                value={matchData.exactScores.fullTime}
                onChange={(value) => setMatchData({
                  ...matchData,
                  exactScores: { ...matchData.exactScores, fullTime: value }
                })}
                placeholder="2-1"
                error={errors.exactFullTime}
              />
            </FormField>
          </div>
          
          <p className="text-xs text-gray-400 mt-3">
            <ApperIcon name="Info" size={12} className="inline mr-1" />
            Enter your predicted exact scores to enhance prediction accuracy
          </p>
</motion.div>

{/* Bookmaker Exact Scores Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-gradient-to-br from-surface/40 to-secondary/20 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Target" size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Scores Exacts des Bookmakers (20 Options)</h3>
              <p className="text-sm text-gray-400">Saisissez les scores et coefficients que les bookmakers proposent</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 20 }, (_, index) => {
              const scoreKey = `score${index + 1}`;
              const coeffKey = `coeff${index + 1}`;
              return (
                <div key={index} className="space-y-2">
                  <div className="text-xs font-medium text-primary flex items-center gap-1">
                    <ApperIcon name="Hash" size={12} />
                    Option {index + 1}
                  </div>
                  
                  <FormField
                    label={`Score ${index + 1}`}
                    error={errors[`bookmaker_${scoreKey}`]}
                    required={false}
                    className="mb-2"
                  >
                    <ScoreInput
                      value={matchData.bookmakerScores[scoreKey]}
                      onChange={(value) => setMatchData(prev => ({
                        ...prev,
                        bookmakerScores: { ...prev.bookmakerScores, [scoreKey]: value }
                      }))}
                      placeholder="2-1"
                      className={cn(
                        "bg-surface/50 border-gray-600 text-sm h-9",
                        errors[`bookmaker_${scoreKey}`] && "border-error"
                      )}
                    />
                  </FormField>
                  
                  <FormField
                    label={`Coefficient ${index + 1}`}
                    error={errors[`coefficient_${coeffKey}`]}
                    required={false}
                  >
                    <Input
                      type="text"
                      value={matchData.bookmakerCoefficients[coeffKey]}
                      onChange={(e) => setMatchData(prev => ({
                        ...prev,
                        bookmakerCoefficients: { ...prev.bookmakerCoefficients, [coeffKey]: e.target.value }
                      }))}
                      placeholder="1.85"
                      className={cn(
                        "bg-surface/50 border-gray-600 text-sm h-9",
                        errors[`coefficient_${coeffKey}`] && "border-error"
                      )}
                    />
                  </FormField>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 bg-info/10 rounded-lg border border-info/20">
            <div className="flex items-start gap-2">
              <ApperIcon name="Info" size={16} className="text-info mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="font-medium text-info mb-1">Comment utiliser:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Saisissez le score exact (ex: 2-1, 0-0, 3-2)</li>
                  <li>• Ajoutez le coefficient proposé par le bookmaker (ex: 1.85, 2.50)</li>
                  <li>• Plus vous remplissez d'options, plus la prédiction sera précise</li>
                  <li>• Les scores avec les meilleurs coefficients seront priorisés</li>
                </ul>
              </div>
</div>
          </div>
          
          <div className="mt-4 p-3 bg-info/10 border border-info/20 rounded-lg">
            <p className="text-sm text-info flex items-start gap-2">
              <ApperIcon name="Info" size={16} className="mt-0.5" />
              Saisissez les scores exacts proposés par les bookmakers. Ces valeurs seront prioritaires dans les prédictions.
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