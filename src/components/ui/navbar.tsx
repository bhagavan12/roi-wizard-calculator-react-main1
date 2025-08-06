
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, Calculator, Home } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🚀 ROI Calculator
          </h1>
          <div className="flex items-center space-x-4">
            <NavLink to="/" className={({ isActive }) => 
              `flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-blue-500/20 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`
            }>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </NavLink>
            <NavLink to="/calculator" className={({ isActive }) => 
              `flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-blue-500/20 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`
            }>
              <Calculator className="w-4 h-4" />
              <span>Calculator</span>
            </NavLink>
            <NavLink to="/database" className={({ isActive }) => 
              `flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                isActive ? 'bg-blue-500/20 text-blue-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`
            }>
              <Database className="w-4 h-4" />
              <span>Database</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
