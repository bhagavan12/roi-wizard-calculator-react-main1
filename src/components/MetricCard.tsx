
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: string;
  gradient: string;
}

export const MetricCard = ({ title, value, subtitle, icon, gradient }: MetricCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-slate-600/50">
      <CardContent className="p-4 text-center">
        {icon && <div className="text-2xl mb-2">{icon}</div>}
        <div className="text-xs text-slate-400 mb-1">{title}</div>
        <div className={`text-xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
          {value}
        </div>
        {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
};
