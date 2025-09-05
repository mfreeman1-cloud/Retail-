
import React from 'react';
import type { Product } from '../types';
import { CartIcon, PromotionIcon } from './icons';

interface ProductCardProps {
  product: Product;
  stock: number;
  maxStock: number;
  onRestockClick: () => void;
  isSpecialOffer: boolean;
  displayPrice: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, stock, maxStock, onRestockClick, isSpecialOffer, displayPrice }) => {
  const stockPercentage = (stock / maxStock) * 100;
  const stockColor = stockPercentage > 50 ? 'bg-green-500' : stockPercentage > 20 ? 'bg-yellow-500' : 'bg-red-500';

  const cardClasses = `bg-gray-800 rounded-lg p-4 flex flex-col justify-between shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300 relative ${isSpecialOffer ? 'border-yellow-400 shadow-lg shadow-yellow-500/30' : ''}`;

  return (
    <div className={cardClasses}>
      {isSpecialOffer && (
        <div className="absolute top-2 right-2 text-yellow-400 animate-pulse">
            <PromotionIcon className="h-6 w-6" />
        </div>
      )}
      <div>
        <div className="text-5xl text-center mb-2">{product.emoji}</div>
        <h3 className="font-bold text-center text-lg">{product.name}</h3>
        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>Cost: ${product.cost}</span>
          <span className={isSpecialOffer ? 'text-yellow-300 font-bold' : ''}>
            Price: ${displayPrice.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-center font-semibold mb-2">
            Stock: {stock} / {maxStock}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div className={`${stockColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${stockPercentage}%` }}></div>
        </div>
        <button 
            onClick={onRestockClick} 
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
        >
            <CartIcon className="h-5 w-5 mr-2"/>
            Restock
        </button>
      </div>
    </div>
  );
};
