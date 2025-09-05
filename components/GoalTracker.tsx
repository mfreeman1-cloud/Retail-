import React from 'react';
import type { Goal, GameState } from '../types';
import { GoalIcon } from './icons';

interface GoalTrackerProps {
  goal?: Goal;
  gameState: GameState;
}

export const GoalTracker: React.FC<GoalTrackerProps> = ({ goal, gameState }) => {
  if (!goal) {
    return (
      <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold mb-2 text-indigo-300 flex items-center gap-2">
            <GoalIcon className="h-6 w-6 text-indigo-400" />
            All Goals Completed!
        </h2>
        <p className="text-gray-300">You're a true Retail Tycoon! Congratulations!</p>
      </div>
    );
  }

  const currentValue = goal.getCurrentValue(gameState);
  const progress = Math.min(100, (currentValue / goal.target) * 100);

  const formatValue = (value: number) => {
    if (goal.unit === 'money') {
        return `$${Math.floor(value).toLocaleString()}`;
    }
    return Math.floor(value).toLocaleString();
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner">
        <h2 className="text-xl font-bold mb-3 text-indigo-300 flex items-center gap-2">
            <GoalIcon className="h-6 w-6 text-indigo-400" />
            Current Objective
        </h2>
        <p className="text-gray-200 mb-1">{goal.description}</p>
        <p className="text-sm text-yellow-400 mb-3">Reward: ${goal.reward.toLocaleString()}</p>
        
        <div className="w-full bg-gray-700 rounded-full h-4 relative">
            <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
            ></div>
             <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white text-shadow">
                {formatValue(currentValue)} / {formatValue(goal.target)}
            </span>
        </div>
    </div>
  );
};