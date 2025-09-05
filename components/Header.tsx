
import React, { useState, useEffect } from 'react';
import { CashIcon, PromotionIcon } from './icons';
import type { GameState } from '../types';
import { PRODUCTS } from '../constants';

interface HeaderProps {
  cash: number;
  specialOffer: GameState['specialOffer'];
  offerCooldownUntil: GameState['offerCooldownUntil'];
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

export const Header: React.FC<HeaderProps> = ({ cash, specialOffer, offerCooldownUntil }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remainingOfferTime = specialOffer.expiresAt ? Math.max(0, Math.round((specialOffer.expiresAt - now) / 1000)) : 0;
  const remainingCooldownTime = offerCooldownUntil ? Math.max(0, Math.round((offerCooldownUntil - now) / 1000)) : 0;
  const productName = specialOffer.productId ? PRODUCTS[specialOffer.productId]?.name : '';

  const renderStatus = () => {
    if (remainingOfferTime > 0) {
      return (
         <div className="flex items-center space-x-2 text-yellow-300">
          <PromotionIcon className="h-5 w-5 text-yellow-400" />
          <span>Offer on {productName}: <strong>{formatTime(remainingOfferTime)}</strong></span>
        </div>
      );
    }
    if (remainingCooldownTime > 0) {
      return (
        <div className="flex items-center space-x-2 text-gray-400">
          <PromotionIcon className="h-5 w-5" />
          <span>Promotions ready in: <strong>{formatTime(remainingCooldownTime)}</strong></span>
        </div>
      );
    }
    return (
        <div className="flex items-center space-x-2 text-green-400">
            <PromotionIcon className="h-5 w-5" />
            <span>Promotions available!</span>
        </div>
    );
  };

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-xl md:text-3xl font-bold text-indigo-400 tracking-wider">
          Retail Tycoon AI
        </h1>
        <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm bg-gray-900 px-3 py-1 rounded-lg border border-indigo-500/50">
                {renderStatus()}
            </div>
            <div className="flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-lg border border-indigo-500/50">
                <CashIcon className="h-6 w-6 text-green-400" />
                <span className="text-lg md:text-xl font-semibold text-green-300">
                    ${cash.toFixed(2)}
                </span>
            </div>
        </div>
      </div>
    </header>
  );
};
