
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Calendar, Calculator, TrendingUp } from 'lucide-react';

interface SavedResult {
  timestamp: string;
  type: 'quick' | 'full';
  inputs: any;
  results: any;
}

export const DatabasePage = () => {
  const [savedResults, setSavedResults] = useState<SavedResult[]>([]);

  useEffect(() => {
    const results = JSON.parse(localStorage.getItem('roiResults') || '[]');
    setSavedResults(results.reverse()); // Show newest first
  }, []);

  const deleteResult = (index: number) => {
    const updatedResults = savedResults.filter((_, i) => i !== index);
    setSavedResults(updatedResults);
    localStorage.setItem('roiResults', JSON.stringify(updatedResults.reverse()));
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(savedResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'roi-calculator-results.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) => `$${(value / 1_000_000).toFixed(2)}M`;
  const formatDate = (timestamp: string) => new Date(timestamp).toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10" />
      
      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              📊 Saved Results Database
            </h1>
            <p className="text-slate-400 text-lg">View and manage your ROI calculation history</p>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-slate-300">
              Total Results: <span className="font-semibold text-blue-400">{savedResults.length}</span>
            </div>
            <Button onClick={exportResults} variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>

          {/* Results Grid */}
          {savedResults.length === 0 ? (
            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Calculator className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No Results Yet</h3>
                <p className="text-slate-400 mb-6">Start using the calculator to save your results here</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a href="/">Go to Calculator</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {savedResults.map((result, index) => (
                <Card key={index} className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-slate-200 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5" />
                          ROI Calculation Result
                        </CardTitle>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge className={`${result.type === 'quick' ? 'bg-blue-500/20 border-blue-500/30 text-blue-200' : 'bg-green-500/20 border-green-500/30 text-green-200'}`}>
                            {result.type === 'quick' ? 'Quick Calculator' : 'Full Calculator'}
                          </Badge>
                          <div className="flex items-center gap-1 text-slate-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            {formatDate(result.timestamp)}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => deleteResult(index)}
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Inputs */}
                      <div>
                        <h4 className="text-lg font-semibold text-slate-200 mb-3">Inputs</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Annual Revenue:</span>
                            <span className="text-slate-200">{formatCurrency(result.inputs.annualRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Cloud Spend:</span>
                            <span className="text-slate-200">{formatCurrency(result.inputs.annualCloudSpend || result.inputs.annualCloudSpend)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Engineers:</span>
                            <span className="text-slate-200">{result.inputs.numEngineers}</span>
                          </div>
                        </div>
                      </div>

                      {/* Results */}
                      <div>
                        <h4 className="text-lg font-semibold text-slate-200 mb-3">Results</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Annual Gain:</span>
                            <span className="text-green-400 font-semibold">{formatCurrency(result.results.totalAnnualGain)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">ROI Percentage:</span>
                            <span className="text-blue-400 font-semibold">{result.results.roiPercent.toFixed(0)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Payback Period:</span>
                            <span className="text-orange-400 font-semibold">{result.results.paybackMonths.toFixed(1)} months</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
