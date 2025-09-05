
import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from './Modal';
import { getBusinessAdvice } from '../services/geminiService';
import type { GameState } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  maxInventory: number;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, gameState, maxInventory }) => {
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdvice = useCallback(async () => {
    setIsLoading(true);
    setAdvice('');
    const newAdvice = await getBusinessAdvice(gameState, maxInventory);
    setAdvice(newAdvice);
    setIsLoading(false);
  }, [gameState, maxInventory]);

  useEffect(() => {
    if (isOpen) {
      fetchAdvice();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Business Advisor">
        <div className="flex flex-col items-center text-center">
            {isLoading && (
                <div className="space-y-4">
                    <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400">Your AI advisor is analyzing your business...</p>
                </div>
            )}
            {!isLoading && advice && (
                 <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-700">
                    <p className="text-lg leading-relaxed text-indigo-200">"{advice}"</p>
                </div>
            )}
            <button
                onClick={fetchAdvice}
                disabled={isLoading}
                className="mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-colors"
            >
                {isLoading ? 'Thinking...' : 'Get New Advice'}
            </button>
        </div>
    </Modal>
  );
};
