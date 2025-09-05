
import React, { useState } from 'react';
import { Modal } from './Modal';
import { PRODUCTS } from '../constants';
import type { Product } from '../types';

interface BuyStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  cash: number;
  inventory: Record<string, number>;
  maxInventory: number;
  onBuy: (productId: string, quantity: number) => void;
}

const BuyItemRow: React.FC<{
  product: Product;
  currentStock: number;
  maxStock: number;
  cash: number;
  onBuy: (productId: string, quantity: number) => void;
}> = ({ product, currentStock, maxStock, cash, onBuy }) => {
  const [quantity, setQuantity] = useState(1);
  const totalCost = product.cost * quantity;
  const canAfford = cash >= totalCost;
  const hasSpace = currentStock + quantity <= maxStock;

  const handleBuy = () => {
    if (canAfford && hasSpace && quantity > 0) {
      onBuy(product.id, quantity);
      setQuantity(1);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 py-3 border-b border-gray-700">
      <div className="md:col-span-2 flex items-center gap-4">
        <span className="text-3xl">{product.emoji}</span>
        <div>
          <p className="font-bold">{product.name}</p>
          <p className="text-sm text-gray-400">Cost: ${product.cost}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max={maxStock - currentStock}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-20 bg-gray-900 border border-gray-600 rounded p-2 text-center"
        />
        <span className="text-gray-400">/ {maxStock - currentStock}</span>
      </div>
      <p className="font-semibold text-lg text-green-400">${totalCost.toFixed(2)}</p>
      <button
        onClick={handleBuy}
        disabled={!canAfford || !hasSpace || quantity <= 0}
        className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Buy
      </button>
    </div>
  );
};

export const BuyStockModal: React.FC<BuyStockModalProps> = ({ isOpen, onClose, cash, inventory, maxInventory, onBuy }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Purchase Inventory">
        <div className="space-y-2">
            {Object.values(PRODUCTS).map(product => (
                <BuyItemRow 
                    key={product.id}
                    product={product}
                    currentStock={inventory[product.id] || 0}
                    maxStock={maxInventory}
                    cash={cash}
                    onBuy={onBuy}
                />
            ))}
        </div>
    </Modal>
  );
};
