
import React from 'react';
import { CartIcon, UpgradeIcon, AIIcon, PromotionIcon } from './icons';

interface ControlPanelProps {
  onBuyStockClick: () => void;
  onUpgradesClick: () => void;
  onAIClick: () => void;
  onPromotionsClick: () => void;
}

const ControlButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string }> = ({ onClick, icon, label }) => (
    <button onClick={onClick} className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-indigo-500/50">
        {icon}
        <span className="text-sm sm:text-base">{label}</span>
    </button>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({ onBuyStockClick, onUpgradesClick, onAIClick, onPromotionsClick }) => {
  return (
    <footer className="bg-gray-800/50 backdrop-blur-sm sticky bottom-0 z-10 p-2 shadow-t-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center space-x-2 md:space-x-4">
            <ControlButton onClick={onBuyStockClick} icon={<CartIcon />} label="Buy Stock" />
            <ControlButton onClick={onUpgradesClick} icon={<UpgradeIcon />} label="Upgrades" />
            <ControlButton onClick={onPromotionsClick} icon={<PromotionIcon />} label="Promotions" />
            <ControlButton onClick={onAIClick} icon={<AIIcon />} label="AI Advisor" />
        </div>
      </div>
    </footer>
  );
};
