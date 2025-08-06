
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SmoothSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  isPercentage?: boolean;
  isCurrency?: boolean;
  icon?: string;
  showRange?: boolean;
}

export const SmoothSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  isPercentage = false,
  isCurrency = false,
  icon = "",
  showRange = false
}: SmoothSliderProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    if (val === '' || val === '-' || val === '.') return;

    const num = parseFloat(val);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };

  const formatDisplayValue = (val: number) => {
    if (isCurrency) {
      return `$${val.toLocaleString()}`;
    }
    if (isPercentage) {
      return `${val.toFixed(1)}%`;
    }
    return val.toString();
  };

  const formatRangeValue = (val: number) => {
    if (isCurrency) {
      if (val >= 1_000_000) {
        return `$${(val / 1_000_000).toFixed(0)}M`;
      } else if (val >= 1_000) {
        return `$${(val / 1_000).toFixed(0)}K`;
      }
      return `$${val.toLocaleString()}`;
    }
    if (isPercentage) {
      return `${val}%`;
    }
    return val.toString();
  };

  return (
    <div className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-slate-200 flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {label}
        </Label>
        <span className="text-sm font-semibold text-blue-400">
          {formatDisplayValue(value)}
        </span>
      </div>
      
      <div className="space-y-2">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={min}
          max={max}
          step={step}
          className="w-full slider-smooth"
        />
        
        {showRange && (
          <div className="flex justify-between text-xs text-slate-400">
            <span>{formatRangeValue(min)}</span>
            <span>{formatRangeValue(max)}</span>
          </div>
        )}
        
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="h-8 text-sm bg-slate-800/50 border-slate-600/50 focus:border-blue-500/50 transition-all duration-200 text-slate-200 placeholder:text-slate-500"
          placeholder={formatDisplayValue(value)}
        />
      </div>
    </div>
  );
};
