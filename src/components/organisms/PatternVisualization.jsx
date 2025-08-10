import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Chart from "react-apexcharts";

const PatternVisualization = ({ data }) => {
  if (!data || !data.patterns) return null;

  const { patterns } = data;

  // Goal distribution chart
  const goalDistribution = {
    series: [{
      name: 'Frequency',
      data: patterns.goalDistribution?.map(item => item.count) || [2, 4, 6, 3, 1]
    }],
    options: {
      chart: {
        type: 'bar',
        background: 'transparent',
        toolbar: { show: false }
      },
      theme: { mode: 'dark' },
      colors: ['#00FF87'],
      xaxis: {
        categories: patterns.goalDistribution?.map(item => `${item.goals} Goals`) || 
                   ['0-1 Goals', '2-3 Goals', '4-5 Goals', '6-7 Goals', '8+ Goals'],
        labels: { style: { colors: '#9ca3af' } }
      },
      yaxis: {
        labels: { style: { colors: '#9ca3af' } }
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 3
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          distributed: false
        }
      },
      dataLabels: { enabled: false }
    }
  };

  // Score frequency heatmap data
  const scoreFrequency = patterns.scoreFrequency || [
    { score: '1-0', frequency: 15 },
    { score: '2-1', frequency: 22 },
    { score: '1-1', frequency: 18 },
    { score: '3-2', frequency: 12 },
    { score: '2-0', frequency: 10 },
    { score: '0-0', frequency: 8 }
  ];

  const getHeatmapColor = (frequency) => {
    if (frequency >= 20) return 'bg-primary/80';
    if (frequency >= 15) return 'bg-accent/60';
    if (frequency >= 10) return 'bg-info/40';
    return 'bg-surface/60';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-6"
    >
      {/* Goal Distribution Chart */}
      <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-primary/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ApperIcon name="BarChart3" size={18} className="mr-2 text-primary" />
          Goal Distribution Patterns
        </h3>

        <div className="h-64">
          <Chart
            options={goalDistribution.options}
            series={goalDistribution.series}
            type="bar"
            height="100%"
          />
        </div>
      </div>

      {/* Score Frequency Heatmap */}
      <div className="bg-surface/50 backdrop-blur-sm rounded-xl border border-accent/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ApperIcon name="Grid3X3" size={18} className="mr-2 text-accent" />
          Most Common Scores
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {scoreFrequency.map((item, index) => (
            <motion.div
              key={item.score}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`
                relative p-4 rounded-lg text-center border border-surface
                ${getHeatmapColor(item.frequency)}
              `}
            >
              <div className="font-mono text-lg font-bold text-white mb-1">
                {item.score}
              </div>
              <div className="text-xs text-gray-300">
                {item.frequency}%
              </div>
              
              {/* Heat indicator */}
              <div className="absolute top-1 right-1">
                {item.frequency >= 20 && (
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pattern Insights */}
      <div className="bg-secondary/50 backdrop-blur-sm rounded-xl border border-info/30 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ApperIcon name="Lightbulb" size={18} className="mr-2 text-info" />
          Key Pattern Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-background/30 rounded-lg">
              <ApperIcon name="TrendingUp" size={20} className="text-primary" />
              <div>
                <div className="font-medium text-white">High-Scoring Matches</div>
                <div className="text-sm text-gray-400">
                  {patterns.averageGoals || '4.2'} goals per match average
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-background/30 rounded-lg">
              <ApperIcon name="Clock" size={20} className="text-accent" />
              <div>
                <div className="font-medium text-white">Half-Time Activity</div>
                <div className="text-sm text-gray-400">
                  {patterns.halfTimeGoals || '60%'} of goals scored before 45'
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-background/30 rounded-lg">
              <ApperIcon name="Target" size={20} className="text-info" />
              <div>
                <div className="font-medium text-white">Draw Probability</div>
                <div className="text-sm text-gray-400">
                  {patterns.drawRate || '18%'} of matches end in draws
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-background/30 rounded-lg">
              <ApperIcon name="Zap" size={20} className="text-warning" />
              <div>
                <div className="font-medium text-white">Upset Factor</div>
                <div className="text-sm text-gray-400">
                  {patterns.upsetRate || '12%'} unexpected results
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Performance */}
      <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-surface p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <ApperIcon name="Cpu" size={18} className="mr-2 text-primary" />
          Algorithm Performance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-surface/30 rounded-lg">
            <div className="text-2xl font-display font-bold text-primary mb-1">
              {patterns.accuracy || '76%'}
            </div>
            <div className="text-sm text-gray-400">Historical Accuracy</div>
          </div>

          <div className="p-4 bg-surface/30 rounded-lg">
            <div className="text-2xl font-display font-bold text-accent mb-1">
              {patterns.confidence || '82%'}
            </div>
            <div className="text-sm text-gray-400">Avg Confidence</div>
          </div>

          <div className="p-4 bg-surface/30 rounded-lg">
            <div className="text-2xl font-display font-bold text-info mb-1">
              {patterns.processedMatches || '2,847'}
            </div>
            <div className="text-sm text-gray-400">Matches Analyzed</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PatternVisualization;