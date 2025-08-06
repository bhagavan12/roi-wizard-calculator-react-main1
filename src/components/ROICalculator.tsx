import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SmoothSlider } from "./SmoothSlider";
import { ROIChart } from "./ROIChart";
import { MetricCard } from "./MetricCard";
import { Badge } from "@/components/ui/badge";
import { Cloud, Users, Zap, Shield, Database } from "lucide-react";

export const ROICalculator = () => {
  // Business inputs
  const [annualRevenue, setAnnualRevenue] = useState(100_000_000);
  const [grossMargin, setGrossMargin] = useState(80);
  const [containerAppFraction, setContainerAppFraction] = useState(90);
  const [annualCloudSpend, setAnnualCloudSpend] = useState(10_000_000);
  const [computeSpendFraction, setComputeSpendFraction] = useState(60);
  const [costSensitiveFraction, setCostSensitiveFraction] = useState(50);

  // Productivity inputs
  const [numEngineers, setNumEngineers] = useState(100);
  const [engineerCostPerYear, setEngineerCostPerYear] = useState(150_000);
  const [opsTimeFraction, setOpsTimeFraction] = useState(15);
  const [opsToilFraction, setOpsToilFraction] = useState(50);
  const [toilReductionFraction] = useState(45);

  // Performance inputs
  const [avgResponseTimeSec, setAvgResponseTimeSec] = useState(2);
  const [execTimeInfluenceFraction] = useState(33);
  const [latRedContainer] = useState(28);
  const [latRedServerless] = useState(50);
  const [revenueLiftPer100ms, setRevenueLiftPer100ms] = useState(1);

  // Availability inputs
  const [currentFCIFraction, setCurrentFCIFraction] = useState(2);
  const [fciReductionFraction] = useState(75);
  const [costPer1PctFCI, setCostPer1PctFCI] = useState(1);

  const calculations = useMemo(() => {
    const computeSpend = annualCloudSpend * (computeSpendFraction / 100);
    const costSensitiveSpend = computeSpend * (costSensitiveFraction / 100);
    const cloudSavings =
      costSensitiveSpend *
      ((containerAppFraction / 100) * 0.5 +
        (1 - containerAppFraction / 100) * 0.2);

    const productivityGain =
      numEngineers *
      engineerCostPerYear *
      (opsTimeFraction / 100) *
      (opsToilFraction / 100) *
      (toilReductionFraction / 100);

    const weightedLatRed =
      (containerAppFraction / 100) * (latRedContainer / 100) +
      (1 - containerAppFraction / 100) * (latRedServerless / 100);
    const timeSavedSec = avgResponseTimeSec * weightedLatRed;
    const revGainPct = (timeSavedSec / 0.1) * (revenueLiftPer100ms / 100);
    const performanceGain =
      annualRevenue *
      revGainPct *
      (grossMargin / 100) *
      (execTimeInfluenceFraction / 100);

    const fciCostFraction =
      (costPer1PctFCI / 100) * (currentFCIFraction / 100 / 0.01);
    const fciCost = annualRevenue * fciCostFraction * (grossMargin / 100);
    const availabilityGain = fciCost * (fciReductionFraction / 100);

    const totalAnnualGain =
      cloudSavings + productivityGain + performanceGain + availabilityGain;
    // const estimatedCost = totalAnnualGain / 10;
    const estimatedCost = Math.max(
      annualCloudSpend * 0.1,
      numEngineers * engineerCostPerYear * 0.05,
      annualRevenue * 0.005
    );
    const roiPercent = (totalAnnualGain / estimatedCost) * 100;
    const paybackMonths = (12 * estimatedCost) / totalAnnualGain;

    return {
      cloudSavings,
      productivityGain,
      performanceGain,
      availabilityGain,
      totalAnnualGain,
      roiPercent,
      paybackMonths,
    };
  }, [
    annualRevenue,
    grossMargin,
    containerAppFraction,
    annualCloudSpend,
    computeSpendFraction,
    costSensitiveFraction,
    numEngineers,
    engineerCostPerYear,
    opsTimeFraction,
    opsToilFraction,
    avgResponseTimeSec,
    revenueLiftPer100ms,
    currentFCIFraction,
    costPer1PctFCI,
  ]);

  const formatCurrency = (value: number) =>
    `$${(value / 1_000_000).toFixed(2)}M`;

  const saveResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      type: "full",
      inputs: {
        annualRevenue,
        grossMargin,
        containerAppFraction,
        annualCloudSpend,
        computeSpendFraction,
        costSensitiveFraction,
        numEngineers,
        engineerCostPerYear,
        opsTimeFraction,
        opsToilFraction,
        avgResponseTimeSec,
        revenueLiftPer100ms,
        currentFCIFraction,
        costPer1PctFCI,
      },
      results: calculations,
    };

    const savedResults = JSON.parse(localStorage.getItem("roiResults") || "[]");
    savedResults.push(results);
    localStorage.setItem("roiResults", JSON.stringify(savedResults));

    alert("Results saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center py-6 px-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            🚀 Full ROI Calculator
          </h1>
          <p className="text-slate-400 text-lg">
            Comprehensive analysis with detailed inputs and outputs
          </p>
        </div>

        {/* Main Content - Split Layout */}
        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Scrollable Inputs */}
          <div className="w-1/2 border-r border-slate-700/50">
            <ScrollArea className="h-full">
              <div className="p-6 space-y-4">
                <Accordion
                  type="multiple"
                  defaultValue={["business", "productivity"]}
                  className="space-y-4"
                >
                  <AccordionItem
                    value="business"
                    className="border border-slate-700/50 rounded-lg bg-slate-900/30 backdrop-blur-sm"
                  >
                    <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-slate-200 hover:text-blue-400 transition-colors">
                      💼 Business & Technology Drivers
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-4">
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
                        label="Gross Margin"
                        value={grossMargin}
                        onChange={setGrossMargin}
                        min={0}
                        max={100}
                        step={1}
                        isPercentage
                        icon="📊"
                        showRange
                      />
                      <SmoothSlider
                        label="Container App Fraction"
                        value={containerAppFraction}
                        onChange={setContainerAppFraction}
                        min={0}
                        max={100}
                        step={1}
                        isPercentage
                        icon="📦"
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
                        label="Compute Spend Fraction"
                        value={computeSpendFraction}
                        onChange={setComputeSpendFraction}
                        min={0}
                        max={100}
                        step={1}
                        isPercentage
                        icon="💻"
                        showRange
                      />
                      <SmoothSlider
                        label="Cost Sensitive Fraction"
                        value={costSensitiveFraction}
                        onChange={setCostSensitiveFraction}
                        min={0}
                        max={100}
                        step={1}
                        isPercentage
                        icon="💸"
                        showRange
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="productivity"
                    className="border border-slate-700/50 rounded-lg bg-slate-900/30 backdrop-blur-sm"
                  >
                    <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-slate-200 hover:text-green-400 transition-colors">
                      👨‍💻 Productivity Inputs
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-4">
                      <SmoothSlider
                        label="Number of Engineers"
                        value={numEngineers}
                        onChange={setNumEngineers}
                        min={1}
                        max={1000}
                        step={1}
                        icon="👥"
                      />
                      <SmoothSlider
                        label="Engineer Cost Per Year"
                        value={engineerCostPerYear}
                        onChange={setEngineerCostPerYear}
                        min={50_000}
                        max={500_000}
                        step={5_000}
                        isCurrency
                        icon="💵"
                      />
                      <SmoothSlider
                        label="Ops Time Fraction"
                        value={opsTimeFraction}
                        onChange={setOpsTimeFraction}
                        min={0}
                        max={100}
                        step={1}
                        isPercentage
                        icon="⚙️"
                      />
                      <SmoothSlider
                        label="Ops Toil Fraction"
                        value={opsToilFraction}
                        onChange={setOpsToilFraction}
                        min={0}
                        max={100}
                        step={1}
                        isPercentage
                        icon="🔧"
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="performance"
                    className="border border-slate-700/50 rounded-lg bg-slate-900/30 backdrop-blur-sm"
                  >
                    <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-slate-200 hover:text-orange-400 transition-colors">
                      🚀 Performance Inputs
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-4">
                      <SmoothSlider
                        label="Average Response Time (seconds)"
                        value={avgResponseTimeSec}
                        onChange={setAvgResponseTimeSec}
                        min={0.1}
                        max={10}
                        step={0.1}
                        icon="⏱️"
                      />
                      <SmoothSlider
                        label="Revenue Lift per 100ms"
                        value={revenueLiftPer100ms}
                        onChange={setRevenueLiftPer100ms}
                        min={0}
                        max={10}
                        step={0.1}
                        isPercentage
                        icon="📈"
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="availability"
                    className="border border-slate-700/50 rounded-lg bg-slate-900/30 backdrop-blur-sm"
                  >
                    <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-slate-200 hover:text-purple-400 transition-colors">
                      🛡️ Availability Inputs
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 space-y-4">
                      <SmoothSlider
                        label="Current FCI Fraction"
                        value={currentFCIFraction}
                        onChange={setCurrentFCIFraction}
                        min={0}
                        max={10}
                        step={0.1}
                        isPercentage
                        icon="❌"
                      />
                      <SmoothSlider
                        label="Cost per 1% FCI"
                        value={costPer1PctFCI}
                        onChange={setCostPer1PctFCI}
                        min={0}
                        max={10}
                        step={0.1}
                        isPercentage
                        icon="💰"
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Fixed Output */}
          <div className="w-1/2 flex flex-col">
            <div className="p-6 space-y-6 flex-1 overflow-auto">
              {/* Save Button */}
              <Button
                onClick={saveResults}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Database className="w-4 h-4 mr-2" />
                Save Results to Database
              </Button>

              {/* Main ROI Chart */}
              <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    💎 Total Annual ROI:{" "}
                    {formatCurrency(calculations.totalAnnualGain)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ROIChart data={calculations} />
                </CardContent>
              </Card>

              {/* ROI Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <Badge className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-200 justify-center">
                  <Cloud className="w-4 h-4 mr-2" />
                  Cloud: {formatCurrency(calculations.cloudSavings)}
                </Badge>
                <Badge className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-200 justify-center">
                  <Users className="w-4 h-4 mr-2" />
                  Productivity: {formatCurrency(calculations.productivityGain)}
                </Badge>
                <Badge className="p-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-orange-200 justify-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Performance: {formatCurrency(calculations.performanceGain)}
                </Badge>
                <Badge className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-200 justify-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Availability: {formatCurrency(calculations.availabilityGain)}
                </Badge>
              </div>

              {/* Executive Summary */}
              <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 gap-4">
                    <MetricCard
                      title="ROI Percentage"
                      value={`${calculations.roiPercent.toFixed(0)}%`}
                      icon="📊"
                      gradient="from-blue-400 to-cyan-400"
                    />
                    <MetricCard
                      title="Payback Period"
                      value={`${calculations.paybackMonths.toFixed(1)} mo`}
                      icon="⏰"
                      gradient="from-green-400 to-emerald-400"
                    />
                    <MetricCard
                      title="Time to Value"
                      value="14 days"
                      icon="🚀"
                      gradient="from-orange-400 to-yellow-400"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
