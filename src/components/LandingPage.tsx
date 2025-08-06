
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuickCalculator } from './QuickCalculator';
import { Link } from 'react-router-dom';
import { Calculator, Zap, TrendingUp, Shield, Users, Cloud } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="text-center py-16 px-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            🚀 ROI Calculator
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Calculate your technology investment returns with precision. Get instant insights into cloud savings, productivity gains, and performance improvements.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Cloud className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Cloud Savings</h3>
                <p className="text-slate-300 text-sm">Optimize cloud infrastructure costs</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-700 mb-2">Productivity</h3>
                <p className="text-slate-300 text-sm">Reduce operational overhead</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-orange-500/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-orange-700 mb-2">Performance</h3>
                <p className="text-slate-300 text-sm">Boost application speed</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-purple-700 mb-2">Reliability</h3>
                <p className="text-slate-300 text-sm">Improve system availability</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Calculator Section */}
        <div className="px-4 pb-16">
          <div className="max-w-6xl mx-auto">
            <QuickCalculator />
          </div>
        </div>
      </div>
    </div>
  );
};
