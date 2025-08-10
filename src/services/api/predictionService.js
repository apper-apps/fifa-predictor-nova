import mockPredictions from "@/services/mockData/predictions.json";
import mockPatterns from "@/services/mockData/patterns.json";
class PredictionService {
async generatePrediction(data) {
    // Simulate API delay for realistic loading state
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 2000));

    try {
      const { match, odds } = data;

      // Get user's weight preferences
      const savedWeights = localStorage.getItem('predictionWeights');
      const weights = savedWeights ? JSON.parse(savedWeights) : {
        historicalData: 25,
        bookmakerOdds: 30,
        exactScores: 20,
        patternRecognition: 15,
        hiddenValue: 10
      };

      // Analyze H2H patterns
      const h2hAnalysis = this.analyzeH2HPatterns(match.h2hResults);
      
      // Analyze bookmaker odds
      const oddsAnalysis = this.analyzeBookmakerOdds(odds);
      
      // Generate prediction using advanced algorithms with custom weights
      const prediction = this.generateAdvancedPrediction(h2hAnalysis, oddsAnalysis, match, weights);

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

generateAdvancedPrediction(h2hAnalysis, oddsAnalysis, match, weights = {}) {
    // Default weights if not provided
    const defaultWeights = {
      historicalData: 25,
      bookmakerOdds: 30,
      exactScores: 20,
      patternRecognition: 15,
      hiddenValue: 10
    };
    const finalWeights = { ...defaultWeights, ...weights };

    // Get base prediction from mock data
    const basePredictions = mockPredictions.predictions;
    const randomBase = basePredictions[Math.floor(Math.random() * basePredictions.length)];

    // Calculate weighted analysis components
    const avgGoals = h2hAnalysis.totalGoals.length > 0 
      ? h2hAnalysis.totalGoals.reduce((a, b) => a + b, 0) / h2hAnalysis.totalGoals.length
      : 4.2;

    // Apply weights to influence score selection
    let selectedFullTime = randomBase.fullTimeScore;
    let selectedHalfTime = randomBase.halfTimeScore;

    // Score selection priority based on weights
    if (match.exactScores && match.exactScores.fullTime && finalWeights.exactScores > 15) {
      // Higher exact score weight prioritizes user input
      selectedFullTime = match.exactScores.fullTime;
    } else if (oddsAnalysis.highValueScores.length > 0 && finalWeights.bookmakerOdds > 25) {
      // Higher bookmaker odds weight uses premium odds analysis
      const bestValue = oddsAnalysis.highValueScores.sort((a, b) => b.coefficient - a.coefficient)[0];
      selectedFullTime = bestValue.score;
    } else if (oddsAnalysis.hiddenValue.length > 0 && finalWeights.hiddenValue > 8) {
      // Higher hidden value weight uses undervalued scores
      selectedFullTime = oddsAnalysis.hiddenValue[Math.floor(Math.random() * oddsAnalysis.hiddenValue.length)];
    } else if (finalWeights.historicalData > 20 && h2hAnalysis.commonScores.length > 0) {
      // Higher historical data weight uses H2H patterns
      selectedFullTime = h2hAnalysis.commonScores[Math.floor(Math.random() * h2hAnalysis.commonScores.length)];
    }

    // Half-time score generation with weight influence
    if (match.exactScores && match.exactScores.halfTime && finalWeights.exactScores > 15) {
      selectedHalfTime = match.exactScores.halfTime;
    } else {
      const [ftA, ftB] = selectedFullTime.split("-").map(Number);
      // Pattern recognition weight influences half-time calculation
      const patternInfluence = finalWeights.patternRecognition / 100;
      const htA = Math.floor(ftA * (0.3 + (patternInfluence * 0.5) + Math.random() * 0.3));
      const htB = Math.floor(ftB * (0.3 + (patternInfluence * 0.5) + Math.random() * 0.3));
      selectedHalfTime = `${htA}-${htB}`;
    }

    // Calculate weighted confidence
    const dataPoints = match.h2hResults.length + Object.keys(oddsAnalysis.averageOdds).length;
    let baseConfidence = Math.min(95, 50 + (dataPoints * 1.5));
    
    // Weight-based confidence adjustments
    if (finalWeights.historicalData > 20) {
      baseConfidence += Math.min(15, finalWeights.historicalData * 0.3);
    }
    
    if (finalWeights.bookmakerOdds > 25 && oddsAnalysis.highValueScores.length > 0) {
      baseConfidence += Math.min(12, finalWeights.bookmakerOdds * 0.2);
    }
    
    if (finalWeights.exactScores > 15 && match.exactScores && 
        (match.exactScores.halfTime || match.exactScores.fullTime)) {
      baseConfidence += Math.min(18, finalWeights.exactScores * 0.4);
    }
    
    if (finalWeights.patternRecognition > 10) {
      baseConfidence += Math.min(8, finalWeights.patternRecognition * 0.3);
    }
    
    if (finalWeights.hiddenValue > 8 && oddsAnalysis.hiddenValue.length > 0) {
      baseConfidence += Math.min(10, finalWeights.hiddenValue * 0.4);
    }

    const confidence = Math.min(98, Math.floor(baseConfidence + Math.random() * 3));

    // Generate factor descriptions based on weights
    const getWeightedDescription = (baseDesc, weight, threshold, enhancedDesc) => {
      return weight > threshold ? enhancedDesc : baseDesc;
    };

    return {
      halfTimeScore: selectedHalfTime,
      fullTimeScore: selectedFullTime,
      confidence: confidence,
      factors: {
        h2hPattern: getWeightedDescription(
          avgGoals > 4 ? "High-Scoring" : "Moderate",
          finalWeights.historicalData,
          25,
          avgGoals > 4 ? "Heavily Weighted High-Scoring Pattern" : "Weighted Historical Analysis"
        ),
        goalFrequency: finalWeights.patternRecognition > 12 ? "AI-Enhanced Pattern Detection" : "Standard Analysis",
        exactScores: getWeightedDescription(
          match.exactScores && (match.exactScores.halfTime || match.exactScores.fullTime) ? "User Provided" : "Generated",
          finalWeights.exactScores,
          18,
          "High Priority User Input"
        ),
        oddsAnalysis: getWeightedDescription(
          oddsAnalysis.highValueScores.length > 0 ? "Premium Value Found" : oddsAnalysis.hiddenValue.length > 0 ? "Value Detected" : "Standard",
          finalWeights.bookmakerOdds,
          28,
          "Premium Weighted Odds Analysis"
        ),
        coefficientRange: oddsAnalysis.coefficientRange.max > 0 ? `${oddsAnalysis.coefficientRange.min.toFixed(1)}-${oddsAnalysis.coefficientRange.max.toFixed(1)}` : "No odds data",
        hiddenValue: getWeightedDescription(
          oddsAnalysis.hiddenValue.length > 0 ? "Found" : "Limited",
          finalWeights.hiddenValue,
          12,
          "Enhanced Value Detection"
        ),
        hiddenOdds: oddsAnalysis.highValueScores.length > 0 ? "premium value" : oddsAnalysis.hiddenValue.length > 0 ? "undervalued" : "fairly valued",
        customWeights: `H:${finalWeights.historicalData}% B:${finalWeights.bookmakerOdds}% E:${finalWeights.exactScores}% P:${finalWeights.patternRecognition}% V:${finalWeights.hiddenValue}%`
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

  // Export functionality
  exportToCSV(prediction, matchData, bookmakerOdds) {
    const data = this.prepareExportData(prediction, matchData, bookmakerOdds);
    
    const csvContent = [
      // Header
      ['Match', 'Date', 'Time', 'Half-Time Score', 'Full-Time Score', 'Confidence', 'H2H Pattern', 'Goal Frequency', 'Odds Analysis', 'Hidden Value'],
      // Data row
      [
        `${data.teamA} vs ${data.teamB}`,
        data.date,
        data.time,
        data.halfTimeScore,
        data.fullTimeScore,
        `${data.confidence}%`,
        data.factors.h2hPattern,
        data.factors.goalFrequency,
        data.factors.oddsAnalysis,
        data.factors.hiddenValue
      ]
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    this.downloadFile(csvContent, `prediction_${data.teamA}_vs_${data.teamB}.csv`, 'text/csv');
    return true;
  }

  exportToExcel(prediction, matchData, bookmakerOdds) {
    try {
      // Dynamic import for xlsx
      import('xlsx').then(XLSX => {
        const data = this.prepareExportData(prediction, matchData, bookmakerOdds);
        
        const workbook = XLSX.utils.book_new();
        
        // Main prediction sheet
        const mainData = [
          ['Match Information', ''],
          ['Teams', `${data.teamA} vs ${data.teamB}`],
          ['Date', data.date],
          ['Time', data.time],
          ['', ''],
          ['Predictions', ''],
          ['Half-Time Score', data.halfTimeScore],
          ['Full-Time Score', data.fullTimeScore],
          ['Confidence', `${data.confidence}%`],
          ['', ''],
          ['Analysis Factors', ''],
          ['H2H Pattern', data.factors.h2hPattern],
          ['Goal Frequency', data.factors.goalFrequency],
          ['Exact Scores', data.factors.exactScores],
          ['Odds Analysis', data.factors.oddsAnalysis],
          ['Hidden Value', data.factors.hiddenValue],
          ['Hidden Odds', data.factors.hiddenOdds]
        ];
        
        const mainSheet = XLSX.utils.aoa_to_sheet(mainData);
        XLSX.utils.book_append_sheet(workbook, mainSheet, 'Prediction');
        
        // Bookmaker odds sheet if available
        if (bookmakerOdds && bookmakerOdds.length > 0) {
          const oddsData = [
            ['Bookmaker', 'Score', 'Coefficient'],
            ...bookmakerOdds.map(odd => [odd.bookmaker, odd.score, odd.coefficient])
          ];
          const oddsSheet = XLSX.utils.aoa_to_sheet(oddsData);
          XLSX.utils.book_append_sheet(workbook, oddsSheet, 'Bookmaker Odds');
        }
        
        // H2H Results sheet if available
        if (matchData?.h2hResults && matchData.h2hResults.length > 0) {
          const h2hData = [
            ['Date', 'Half-Time', 'Full-Time', 'Competition'],
            ...matchData.h2hResults.map(result => [
              result.date,
              result.halfTimeScore,
              result.fullTimeScore,
              result.competition
            ])
          ];
          const h2hSheet = XLSX.utils.aoa_to_sheet(h2hData);
          XLSX.utils.book_append_sheet(workbook, h2hSheet, 'H2H History');
        }
        
        XLSX.writeFile(workbook, `prediction_${data.teamA}_vs_${data.teamB}.xlsx`);
      }).catch(error => {
        console.error('Excel export error:', error);
        throw new Error('Failed to export Excel file');
      });
      return true;
    } catch (error) {
      throw new Error('Excel export failed: ' + error.message);
    }
  }

  exportToJSON(prediction, matchData, bookmakerOdds) {
    const data = this.prepareExportData(prediction, matchData, bookmakerOdds);
    
    const exportData = {
      match: {
        teams: `${data.teamA} vs ${data.teamB}`,
        teamA: data.teamA,
        teamB: data.teamB,
        date: data.date,
        time: data.time
      },
      prediction: {
        halfTimeScore: data.halfTimeScore,
        fullTimeScore: data.fullTimeScore,
        confidence: data.confidence,
        factors: data.factors
      },
      bookmakerOdds: bookmakerOdds || [],
      h2hHistory: matchData?.h2hResults || [],
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    
    const jsonContent = JSON.stringify(exportData, null, 2);
    this.downloadFile(jsonContent, `prediction_${data.teamA}_vs_${data.teamB}.json`, 'application/json');
    return true;
  }

  exportToPDF(prediction, matchData, bookmakerOdds) {
    try {
      // Dynamic import for jsPDF
      import('jspdf').then(({ jsPDF }) => {
        const data = this.prepareExportData(prediction, matchData, bookmakerOdds);
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.text('FIFA Virtual Prediction Report', 20, 20);
        
        doc.setFontSize(16);
        doc.text(`${data.teamA} vs ${data.teamB}`, 20, 35);
        
        doc.setFontSize(12);
        doc.text(`Date: ${data.date} at ${data.time}`, 20, 45);
        
        // Predictions
        doc.setFontSize(14);
        doc.text('Predictions', 20, 60);
        
        doc.setFontSize(12);
        doc.text(`Half-Time Score: ${data.halfTimeScore}`, 25, 70);
        doc.text(`Full-Time Score: ${data.fullTimeScore}`, 25, 80);
        doc.text(`Confidence: ${data.confidence}%`, 25, 90);
        
        // Analysis Factors
        doc.setFontSize(14);
        doc.text('Analysis Factors', 20, 105);
        
        doc.setFontSize(12);
        let yPos = 115;
        doc.text(`H2H Pattern: ${data.factors.h2hPattern}`, 25, yPos);
        doc.text(`Goal Frequency: ${data.factors.goalFrequency}`, 25, yPos + 10);
        doc.text(`Exact Scores: ${data.factors.exactScores}`, 25, yPos + 20);
        doc.text(`Odds Analysis: ${data.factors.oddsAnalysis}`, 25, yPos + 30);
        doc.text(`Hidden Value: ${data.factors.hiddenValue}`, 25, yPos + 40);
        
        // Bookmaker Odds
        if (bookmakerOdds && bookmakerOdds.length > 0) {
          yPos += 60;
          doc.setFontSize(14);
          doc.text('Bookmaker Odds', 20, yPos);
          
          doc.setFontSize(10);
          yPos += 10;
          bookmakerOdds.slice(0, 10).forEach((odd, index) => {
            doc.text(`${odd.bookmaker}: ${odd.score} @ ${odd.coefficient}`, 25, yPos + (index * 8));
          });
        }
        
        // Footer
        doc.setFontSize(8);
        doc.text(`Generated on ${new Date().toLocaleString()}`, 20, 280);
        doc.text('FIFA Virtual Predictor - AI Analysis', 20, 285);
        
        doc.save(`prediction_${data.teamA}_vs_${data.teamB}.pdf`);
      }).catch(error => {
        console.error('PDF export error:', error);
        throw new Error('Failed to export PDF file');
      });
      return true;
    } catch (error) {
      throw new Error('PDF export failed: ' + error.message);
    }
  }

  prepareExportData(prediction, matchData, bookmakerOdds) {
    return {
      teamA: matchData?.teamA || 'Team A',
      teamB: matchData?.teamB || 'Team B',
      date: matchData?.date || new Date().toLocaleDateString(),
      time: matchData?.time || new Date().toLocaleTimeString(),
      halfTimeScore: prediction?.halfTimeScore || 'N/A',
      fullTimeScore: prediction?.fullTimeScore || 'N/A',
      confidence: prediction?.confidence || 0,
      factors: {
        h2hPattern: prediction?.factors?.h2hPattern || 'N/A',
        goalFrequency: prediction?.factors?.goalFrequency || 'N/A',
        exactScores: prediction?.factors?.exactScores || 'N/A',
        oddsAnalysis: prediction?.factors?.oddsAnalysis || 'N/A',
        hiddenValue: prediction?.factors?.hiddenValue || 'N/A',
        hiddenOdds: prediction?.factors?.hiddenOdds || 'N/A'
      }
    };
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export default new PredictionService();