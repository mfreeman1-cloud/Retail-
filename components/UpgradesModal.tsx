
import React from 'react';
import { Modal } from './Modal';
import { UPGRADES } from '../constants';

interface UpgradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  cash: number;
  upgrades: Record<string, number>;
  onBuy: (upgradeId: string) => void;
}

export const UpgradesModal: React.FC<UpgradesModalProps> = ({ isOpen, onClose, cash, upgrades, onBuy }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Store Upgrades">
        <div className="space-y-6">
            {Object.values(UPGRADES).map(upgrade => {
                const currentLevel = upgrades[upgrade.id] || 1;
                const cost = upgrade.cost(currentLevel);
                const canAfford = cash >= cost;
                return (
                    <div key={upgrade.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-900/50 p-4 rounded-lg">
                        <div>
                            <h3 className="text-xl font-bold text-indigo-300">{upgrade.name} <span className="text-sm text-gray-400">(Level {currentLevel})</span></h3>
                            <p className="text-gray-400 mt-1">{upgrade.description(currentLevel + 1)}</p>
                        </div>
                        <div className="flex-shrink-0 w-full md:w-auto">
                            <button
                                onClick={() => onBuy(upgrade.id)}
                                disabled={!canAfford}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded transition-colors"
                            >
                                Upgrade for ${cost.toFixed(0)}
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    </Modal>
  );
};
