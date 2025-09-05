
import React from 'react';
import { PRODUCTS, SPECIAL_OFFER_PRICE_MULTIPLIER } from '../constants';
import { ProductCard } from './ProductCard';
import type { GameState } from '../types';

interface StoreGridProps {
  inventory: Record<string, number>;
  maxInventory: number;
  onRestockClick: () => void;
  specialOffer: GameState['specialOffer'];
}

export const StoreGrid: React.FC<StoreGridProps> = ({ inventory, maxInventory, onRestockClick, specialOffer }) => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner">
        <h2 className="text-2xl font-bold mb-4 text-indigo-300">Your Shelves</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.values(PRODUCTS).map(product => {
            const isSpecialOffer = specialOffer.productId === product.id;
            const displayPrice = isSpecialOffer ? product.price * SPECIAL_OFFER_PRICE_MULTIPLIER : product.price;

            return (
              <ProductCard
                key={product.id}
                product={product}
                stock={inventory[product.id] || 0}
                maxStock={maxInventory}
                onRestockClick={onRestockClick}
                isSpecialOffer={isSpecialOffer}
                displayPrice={displayPrice}
              />
            );
        })}
        </div>
    </div>
  );
};
