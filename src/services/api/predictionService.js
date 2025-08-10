import mockPredictions from "@/services/mockData/predictions.json";
import mockPatterns from "@/services/mockData/patterns.json";

class PredictionService {
  async generatePrediction(data) {
    // Simulate API delay for realistic loading state
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 2000));

    try {
      const { match, odds } = data;

      // Analyze H2H patterns
      const h2hAnalysis = this.analyzeH2HPatterns(match.h2hResults);
      
      // Analyze bookmaker odds
      const oddsAnalysis = this.analyzeBookmakerOdds(odds);
      
      // Generate prediction using advanced algorithms
      const prediction = this.generateAdvancedPrediction(h2hAnalysis, oddsAnalysis, match);

      return prediction;
    } catch (error) {
      throw new Error("Failed to generate prediction: " + error.message);
    }
  }

  async getPatternAnalysis(data) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 1500));

    try {
      const { teamA, teamB, h2hResults } = data;

      // Analyze historical patterns
      const patterns = {
        goalDistribution: [
          { goals: "0-1", count: 2 },
          { goals: "2-3", count: 4 },
          { goals: "4-5", count: 6 },
          { goals: "6-7", count: 3 },
          { goals: "8+", count: 1 }
        ],
        scoreFrequency: [
          { score: "2-1", frequency: 22 },
          { score: "1-1", frequency: 18 },
          { score: "3-2", frequency: 16 },
          { score: "1-0", frequency: 15 },
          { score: "2-2", frequency: 12 },
          { score: "2-0", frequency: 10 },
          { score: "3-1", frequency: 9 },
          { score: "0-0", frequency: 8 }
        ],
        averageGoals: (4.2 + Math.random() * 0.8).toFixed(1),
        halfTimeGoals: Math.floor(55 + Math.random() * 10) + "%",
        drawRate: Math.floor(15 + Math.random() * 8) + "%",
        upsetRate: Math.floor(10 + Math.random() * 6) + "%",
        accuracy: Math.floor(72 + Math.random() * 8) + "%",
        confidence: Math.floor(78 + Math.random() * 8) + "%",
        processedMatches: Math.floor(2500 + Math.random() * 500).toLocaleString()
      };

      return { patterns };
    } catch (error) {
      throw new Error("Failed to analyze patterns: " + error.message);
    }
  }

  analyzeH2HPatterns(h2hResults) {
    const patterns = {
      totalGoals: [],
      halfTimeGoals: [],
      fullTimeGoals: [],
      scoreDifferences: []
    };

    h2hResults.forEach(result => {
      const [htA, htB] = result.halfTimeScore.split("-").map(Number);
      const [ftA, ftB] = result.fullTimeScore.split("-").map(Number);

      patterns.halfTimeGoals.push(htA + htB);
      patterns.fullTimeGoals.push(ftA + ftB);
      patterns.totalGoals.push(ftA + ftB);
      patterns.scoreDifferences.push(Math.abs(ftA - ftB));
    });

    return patterns;
  }

analyzeBookmakerOdds(odds) {
    const analysis = {
      averageOdds: {},
      hiddenValue: [],
      highValueScores: [],
      coefficientRange: { min: 0, max: 0 },
      patterns: []
    };

    if (odds.length === 0) return analysis;

    // Group odds by exact score
    const oddsByScore = {};
    let allCoefficients = [];
    
    odds.forEach(odd => {
      if (!oddsByScore[odd.score]) {
        oddsByScore[odd.score] = [];
      }
      oddsByScore[odd.score].push(parseFloat(odd.coefficient));
      allCoefficients.push(parseFloat(odd.coefficient));
    });

    // Calculate coefficient statistics
    analysis.coefficientRange.min = Math.min(...allCoefficients);
    analysis.coefficientRange.max = Math.max(...allCoefficients);

    // Calculate average odds and detect value opportunities
    Object.entries(oddsByScore).forEach(([score, coefficients]) => {
      const avg = coefficients.reduce((a, b) => a + b, 0) / coefficients.length;
      analysis.averageOdds[score] = avg;

      // Detect high-value exact scores (higher coefficients = better value)
      if (avg >= 4.0) {
        analysis.hiddenValue.push(score);
      }
      
      // Identify premium value scores (very high coefficients)
      if (avg >= 6.0) {
        analysis.highValueScores.push({ score, coefficient: avg });
      }
    });

    return analysis;
  }

generateAdvancedPrediction(h2hAnalysis, oddsAnalysis, match) {
    // Get base prediction from mock data
    const basePredictions = mockPredictions.predictions;
    const randomBase = basePredictions[Math.floor(Math.random() * basePredictions.length)];

    // Enhance with actual analysis
    const avgGoals = h2hAnalysis.totalGoals.length > 0 
      ? h2hAnalysis.totalGoals.reduce((a, b) => a + b, 0) / h2hAnalysis.totalGoals.length
      : 4.2;

    // Use user's exact score predictions if provided
    let selectedFullTime = randomBase.fullTimeScore;
    let selectedHalfTime = randomBase.halfTimeScore;

    // Prioritize user's exact score inputs
    if (match.exactScores && match.exactScores.fullTime) {
      selectedFullTime = match.exactScores.fullTime;
    } else if (oddsAnalysis.highValueScores.length > 0) {
      // Use highest value exact score from bookmaker odds
      const bestValue = oddsAnalysis.highValueScores.sort((a, b) => b.coefficient - a.coefficient)[0];
      selectedFullTime = bestValue.score;
    } else if (oddsAnalysis.hiddenValue.length > 0) {
      selectedFullTime = oddsAnalysis.hiddenValue[Math.floor(Math.random() * oddsAnalysis.hiddenValue.length)];
    }

    // Use user's half-time prediction or generate based on full-time
    if (match.exactScores && match.exactScores.halfTime) {
      selectedHalfTime = match.exactScores.halfTime;
    } else {
      const [ftA, ftB] = selectedFullTime.split("-").map(Number);
      const htA = Math.floor(ftA * (0.4 + Math.random() * 0.4)); // 40-80% of full time
      const htB = Math.floor(ftB * (0.4 + Math.random() * 0.4));
      selectedHalfTime = `${htA}-${htB}`;
    }

    // Calculate confidence based on data quality and exact scores
    const dataPoints = match.h2hResults.length + Object.keys(oddsAnalysis.averageOdds).length;
    let baseConfidence = Math.min(95, 60 + (dataPoints * 2));
    
    // Boost confidence if exact scores provided
    if (match.exactScores && (match.exactScores.halfTime || match.exactScores.fullTime)) {
      baseConfidence += 15;
    }
    
    // Boost confidence for high-value odds
    if (oddsAnalysis.highValueScores.length > 0) {
      baseConfidence += 10;
    }

    const confidence = Math.min(98, Math.floor(baseConfidence + Math.random() * 5));

    return {
      halfTimeScore: selectedHalfTime,
      fullTimeScore: selectedFullTime,
      confidence: confidence,
      factors: {
        h2hPattern: avgGoals > 4 ? "High-Scoring" : "Moderate",
        goalFrequency: "Very High",
        exactScores: match.exactScores && (match.exactScores.halfTime || match.exactScores.fullTime) ? "User Provided" : "Generated",
        oddsAnalysis: oddsAnalysis.highValueScores.length > 0 ? "Premium Value Found" : oddsAnalysis.hiddenValue.length > 0 ? "Value Detected" : "Standard",
        coefficientRange: oddsAnalysis.coefficientRange.max > 0 ? `${oddsAnalysis.coefficientRange.min.toFixed(1)}-${oddsAnalysis.coefficientRange.max.toFixed(1)}` : "No odds data",
        hiddenValue: oddsAnalysis.hiddenValue.length > 0 ? "Found" : "Limited",
        hiddenOdds: oddsAnalysis.highValueScores.length > 0 ? "premium value" : oddsAnalysis.hiddenValue.length > 0 ? "undervalued" : "fairly valued"
      }
    };
  }

  generateHighScoringOptions(avgGoals) {
    // FIFA Virtual matches typically have more goals
    const highScoringScores = [
      "2-1", "3-1", "2-2", "3-2", "4-1", "3-3", "4-2", "5-1", "4-3", "5-2",
      "1-2", "1-3", "2-4", "1-4", "2-5", "3-4", "1-0", "0-1", "2-0", "0-2"
    ];

    return avgGoals > 4 
      ? highScoringScores.filter(score => {
          const [a, b] = score.split("-").map(Number);
          return (a + b) >= 3;
        })
      : highScoringScores;
  }
}

export default new PredictionService();