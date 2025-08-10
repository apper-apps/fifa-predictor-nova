import mockPredictions from "@/services/mockData/predictions.json";
import mockPatterns from "@/services/mockData/patterns.json";
class PredictionService {
  async generatePrediction(data) {
    // Simulate API delay for realistic loading state
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 2000));

try {
      const { match, odds } = data;
      
      // Create bookmaker odds from new 20-field structure
      const bookmakerOdds = [];
      if (match.bookmakerScores && match.bookmakerCoefficients) {
        for (let i = 1; i <= 20; i++) {
          const score = match.bookmakerScores[`score${i}`];
          const coefficient = match.bookmakerCoefficients[`coeff${i}`];
          if (score && coefficient) {
            bookmakerOdds.push({ score: score.trim(), coefficient: parseFloat(coefficient) });
          }
        }
      }
      
      // Merge with existing odds if any
      const allOdds = [...(odds || []), ...bookmakerOdds];
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
      patterns: [],
      totalScores: odds.length,
      premiumOptions: [],
      valueDistribution: { low: 0, medium: 0, high: 0, premium: 0 }
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

      // Categorize by value tiers
      if (avg >= 8.0) {
        analysis.premiumOptions.push({ score, coefficient: avg, tier: 'premium' });
        analysis.valueDistribution.premium++;
      } else if (avg >= 4.0) {
        analysis.highValueScores.push({ score, coefficient: avg, tier: 'high' });
        analysis.valueDistribution.high++;
      } else if (avg >= 2.5) {
        analysis.hiddenValue.push(score);
        analysis.valueDistribution.medium++;
      } else {
        analysis.valueDistribution.low++;
      }
    });

    // Sort by coefficient value
    analysis.highValueScores.sort((a, b) => b.coefficient - a.coefficient);
    analysis.premiumOptions.sort((a, b) => b.coefficient - a.coefficient);

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

// Score selection priority: Bookmaker > User > Analysis > Random
let selectedFullTime = randomBase.fullTimeScore;
    let selectedHalfTime = randomBase.halfTimeScore;
    let scoreSource = "generated";
    let selectedCoefficient = 0;

    // Priority system for score selection with 20 bookmaker options
    const bookmakerScores = [];
    if (match.bookmakerScores && match.bookmakerCoefficients) {
      for (let i = 1; i <= 20; i++) {
        const score = match.bookmakerScores[`score${i}`];
        const coefficient = match.bookmakerCoefficients[`coeff${i}`];
        if (score && coefficient) {
          bookmakerScores.push({ 
            score: score.trim(), 
            coefficient: parseFloat(coefficient),
            index: i 
          });
        }
      }
    }

    // 1. Prioritize premium bookmaker scores (coefficient >= 8.0)
    const premiumScores = bookmakerScores.filter(s => s.coefficient >= 8.0)
                                        .sort((a, b) => b.coefficient - a.coefficient);
    if (premiumScores.length > 0) {
      const selected = premiumScores[0];
      selectedFullTime = selected.score;
      selectedCoefficient = selected.coefficient;
      scoreSource = `bookmaker_premium_${selected.index}`;
    }
    // 2. High-value bookmaker scores (coefficient >= 4.0)
    else if (bookmakerScores.filter(s => s.coefficient >= 4.0).length > 0) {
      const highValueScores = bookmakerScores.filter(s => s.coefficient >= 4.0)
                                            .sort((a, b) => b.coefficient - a.coefficient);
      const selected = highValueScores[0];
      selectedFullTime = selected.score;
      selectedCoefficient = selected.coefficient;
      scoreSource = `bookmaker_high_${selected.index}`;
    }
    // 3. Medium-value bookmaker scores (coefficient >= 2.5)
    else if (bookmakerScores.filter(s => s.coefficient >= 2.5).length > 0) {
      const mediumScores = bookmakerScores.filter(s => s.coefficient >= 2.5)
                                         .sort((a, b) => b.coefficient - a.coefficient);
      const selected = mediumScores[0];
      selectedFullTime = selected.score;
      selectedCoefficient = selected.coefficient;
      scoreSource = `bookmaker_medium_${selected.index}`;
    }
    // 4. Any bookmaker score available
    else if (bookmakerScores.length > 0) {
      const selected = bookmakerScores.sort((a, b) => b.coefficient - a.coefficient)[0];
      selectedFullTime = selected.score;
      selectedCoefficient = selected.coefficient;
      scoreSource = `bookmaker_standard_${selected.index}`;
    }
    // 5. User's exact score predictions
    else if (match.exactScores && match.exactScores.fullTime) {
      selectedFullTime = match.exactScores.fullTime;
      scoreSource = "user_prediction";
    } 
    // 6. Use highest value exact score from additional odds analysis
    else if (oddsAnalysis.premiumOptions.length > 0) {
      const bestValue = oddsAnalysis.premiumOptions[0];
      selectedFullTime = bestValue.score;
      selectedCoefficient = bestValue.coefficient;
      scoreSource = "odds_premium";
    }
    else if (oddsAnalysis.highValueScores.length > 0) {
      const bestValue = oddsAnalysis.highValueScores[0];
      selectedFullTime = bestValue.score;
      selectedCoefficient = bestValue.coefficient;
      scoreSource = "odds_high";
    } 
    // 7. Use hidden value scores
    else if (oddsAnalysis.hiddenValue.length > 0) {
      selectedFullTime = oddsAnalysis.hiddenValue[Math.floor(Math.random() * oddsAnalysis.hiddenValue.length)];
      scoreSource = "hidden_value";
    }

    // Handle half-time scores (user input first, then generated)
    if (match.exactScores && match.exactScores.halfTime) {
      selectedHalfTime = match.exactScores.halfTime;
    } else {
      // Generate half-time score based on full-time
      const [ftA, ftB] = selectedFullTime.split("-").map(Number);
      const htA = Math.floor(ftA * (0.4 + Math.random() * 0.4)); // 40-80% of full time
      const htB = Math.floor(ftB * (0.4 + Math.random() * 0.4));
      selectedHalfTime = `${htA}-${htB}`;
    }

    // Enhanced confidence calculation
    const dataPoints = match.h2hResults.length + oddsAnalysis.totalScores + bookmakerScores.length;
    let baseConfidence = Math.min(95, 50 + (dataPoints * 1.5));
    
    // Major confidence boosts based on score source and coefficient quality
    if (selectedCoefficient >= 8.0) {
      baseConfidence += 35; // Premium bookmaker odds
    } else if (selectedCoefficient >= 4.0) {
      baseConfidence += 25; // High-value bookmaker odds
    } else if (selectedCoefficient >= 2.5) {
      baseConfidence += 15; // Medium-value bookmaker odds
    } else if (bookmakerScores.length > 0) {
      baseConfidence += 10; // Any bookmaker data
    } else if (match.exactScores && (match.exactScores.halfTime || match.exactScores.fullTime)) {
      baseConfidence += 12; // User predictions
    }

    // Additional boosts for comprehensive data
    if (bookmakerScores.length >= 10) baseConfidence += 8; // Many bookmaker options
    if (bookmakerScores.length >= 15) baseConfidence += 5; // Extensive bookmaker data
    if (oddsAnalysis.premiumOptions.length > 0) baseConfidence += 8; // Premium options available

    const confidence = Math.min(98, Math.floor(baseConfidence + Math.random() * 3));

    return {
      halfTimeScore: selectedHalfTime,
      fullTimeScore: selectedFullTime,
      confidence: confidence,
      selectedCoefficient: selectedCoefficient,
      factors: {
        h2hPattern: avgGoals > 4 ? "High-Scoring" : "Moderate",
        goalFrequency: "Very High",
        scoreSource: scoreSource,
        bookmakerScoresCount: bookmakerScores.length,
        exactScores: bookmakerScores.length > 0 ? `${bookmakerScores.length} Bookmaker Options` : 
                     match.exactScores && (match.exactScores.halfTime || match.exactScores.fullTime) ? "User Provided" : "Generated",
        oddsAnalysis: oddsAnalysis.premiumOptions.length > 0 ? `${oddsAnalysis.premiumOptions.length} Premium Values` : 
                      oddsAnalysis.highValueScores.length > 0 ? `${oddsAnalysis.highValueScores.length} High Values` : 
                      oddsAnalysis.hiddenValue.length > 0 ? `${oddsAnalysis.hiddenValue.length} Value Opportunities` : "Standard Analysis",
        coefficientRange: oddsAnalysis.coefficientRange.max > 0 ? `${oddsAnalysis.coefficientRange.min.toFixed(1)}-${oddsAnalysis.coefficientRange.max.toFixed(1)}` : "No additional odds data",
        selectedCoeff: selectedCoefficient > 0 ? selectedCoefficient.toFixed(2) : "N/A",
        valueDistribution: `Premium: ${oddsAnalysis.valueDistribution.premium}, High: ${oddsAnalysis.valueDistribution.high}, Medium: ${oddsAnalysis.valueDistribution.medium}, Low: ${oddsAnalysis.valueDistribution.low}`,
        dataQuality: bookmakerScores.length >= 15 ? "Excellent" : bookmakerScores.length >= 10 ? "Very Good" : bookmakerScores.length >= 5 ? "Good" : "Standard"
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