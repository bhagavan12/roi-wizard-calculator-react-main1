
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SmoothSlider } from './SmoothSlider';
import { MetricCard } from './MetricCard';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Users, Cloud, Database } from 'lucide-react';

export const QuickCalculator = () => {
  const [annualRevenue, setAnnualRevenue] = useState(100_000_000);
  const [annualCloudSpend, setAnnualCloudSpend] = useState(10_000_000);
  const [numEngineers, setNumEngineers] = useState(100);

  const quickCalculations = useMemo(() => {
    // Default values for inputs not shown in quick calculator
    const grossMargin = 80;
    const containerAppFraction = 90;
    const computeSpendFraction = 60;
    const costSensitiveFraction = 50;
    const engineerCostPerYear = 150_000;
    const opsTimeFraction = 15;
    const opsToilFraction = 50;
    const toilReductionFraction = 45;
    const avgResponseTimeSec = 2;
    const execTimeInfluenceFraction = 33;
    const latRedContainer = 28;
    const latRedServerless = 50;
    const revenueLiftPer100ms = 1;
    const currentFCIFraction = 2;
    const fciReductionFraction = 75;
    const costPer1PctFCI = 1;

    // Use the same formulas as the full calculator
    const computeSpend = annualCloudSpend * (computeSpendFraction / 100);
    const costSensitiveSpend = computeSpend * (costSensitiveFraction / 100);
    const cloudSavings = costSensitiveSpend * ((containerAppFraction / 100) * 0.5 + (1 - containerAppFraction / 100) * 0.2);

    const productivityGain = numEngineers * engineerCostPerYear * (opsTimeFraction / 100) * (opsToilFraction / 100) * (toilReductionFraction / 100);

    const weightedLatRed = (containerAppFraction / 100) * (latRedContainer / 100) + (1 - containerAppFraction / 100) * (latRedServerless / 100);
    const timeSavedSec = avgResponseTimeSec * weightedLatRed;
    const revGainPct = (timeSavedSec / 0.1) * (revenueLiftPer100ms / 100);
    const performanceGain = annualRevenue * revGainPct * (grossMargin / 100) * (execTimeInfluenceFraction / 100);

    const fciCostFraction = (costPer1PctFCI / 100) * ((currentFCIFraction / 100) / 0.01);
    const fciCost = annualRevenue * fciCostFraction * (grossMargin / 100);
    const availabilityGain = fciCost * (fciReductionFraction / 100);

    const totalAnnualGain = cloudSavings + productivityGain + performanceGain + availabilityGain;
    const estimatedCost = totalAnnualGain / 10;
    const roiPercent = (totalAnnualGain / estimatedCost) * 100;
    const paybackMonths = (12 * estimatedCost) / totalAnnualGain;

    return { cloudSavings, productivityGain, performanceGain, availabilityGain, totalAnnualGain, roiPercent, paybackMonths };
  }, [annualRevenue, annualCloudSpend, numEngineers]);

  const formatCurrency = (value: number) => `$${(value / 1_000_000).toFixed(2)}M`;

  const saveResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      type: 'quick',
      inputs: { annualRevenue, annualCloudSpend, numEngineers },
      results: quickCalculations
    };
    
    const savedResults = JSON.parse(localStorage.getItem('roiResults') || '[]');
    savedResults.push(results);
    localStorage.setItem('roiResults', JSON.stringify(savedResults));
    
    alert('Results saved successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Quick ROI Calculator
        </h2>
        <p className="text-slate-400 text-lg">Get instant estimates with just 3 key inputs</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Quick Inputs */}
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Quick Inputs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SmoothSlider
              label="Annual Revenue"
              value={annualRevenue}
              onChange={setAnnualRevenue}
              min={1_000_000}
              max={1_000_000_000}
              step={1_000_000}
              isCurrency
              icon="💰"
              showRange
            />
            <SmoothSlider
              label="Annual Cloud Spend"
              value={annualCloudSpend}
              onChange={setAnnualCloudSpend}
              min={100_000}
              max={100_000_000}
              step={100_000}
              isCurrency
              icon="☁️"
              showRange
            />
            <SmoothSlider
              label="Number of Engineers"
              value={numEngineers}
              onChange={setNumEngineers}
              min={1}
              max={1000}
              step={1}
              icon="👥"
              showRange
            />
          </CardContent>
        </Card>

        {/* Quick Results */}
        <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Quick Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {formatCurrency(quickCalculations.totalAnnualGain)}
              </div>
              <p className="text-slate-400 mt-1">Total Annual Savings</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <MetricCard
                title="ROI"
                value={`${quickCalculations.roiPercent.toFixed(0)}%`}
                icon="📊"
                gradient="from-blue-400 to-cyan-400"
              />
              <MetricCard
                title="Payback"
                value={`${quickCalculations.paybackMonths.toFixed(1)}mo`}
                icon="⏰"
                gradient="from-green-400 to-emerald-400"
              />
              <MetricCard
                title="Cloud Savings"
                value={formatCurrency(quickCalculations.cloudSavings)}
                icon="☁️"
                gradient="from-orange-400 to-yellow-400"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={saveResults} className="w-full bg-blue-600 hover:bg-blue-700">
                <Database className="w-4 h-4 mr-2" />
                Save Results
              </Button>
              <Link to="/calculator" className="w-full">
                <Button variant="outline" className="w-full border-slate-600 text-slate-200 hover:bg-slate-800">
                  <Calculator className="w-4 h-4 mr-2" />
                  Open Full Calculator
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
