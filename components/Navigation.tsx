
import React from 'react';
import { View } from '../types';

interface NavigationProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeView, onViewChange }) => {
  const tabs = [
    { id: View.MAIN, icon: 'school', label: 'Drills' },
    { id: View.TYPES, icon: 'list_alt', label: 'Verbs' },
    { id: View.SETT, icon: 'bar_chart', label: 'Stats' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)] z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              activeView === tab.id ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <span className={`material-symbols-outlined ${activeView === tab.id ? 'fill-1' : ''}`}>
              {tab.icon}
            </span>
            <span className="text-[10px] font-medium mt-1 uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
