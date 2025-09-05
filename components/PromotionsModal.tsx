
import React from 'react';
import { Modal } from './Modal';
import { PRODUCTS, SPECIAL_OFFER_COST, SPECIAL_OFFER_DURATION, SPECIAL_OFFER_PRICE_MULTIPLIER } from '../constants';
import { PromotionIcon } from './icons';
import type { GameState } from '../types';

interface PromotionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onStartPromotion: (productId: string) => void;
}

const PromotionItemRow: React.FC<{
    product: typeof PRODUCTS[string];
    onStart: () => void;
    disabled: boolean;
}> = ({ product, onStart, disabled }) => {
    const offerPrice = product.price * SPECIAL_OFFER_PRICE_MULTIPLIER;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 py-3 border-b border-gray-700">
            <div className="md:col-span-2 flex items-center gap-4">
                <span className="text-3xl">{product.emoji}</span>
                <div>
                    <p className="font-bold text-lg">{product.name}</p>
                    <p className="text-sm text-gray-400">Current Price: ${product.price.toFixed(2)}</p>
                </div>
            </div>
            <p className="font-semibold text-lg text-yellow-400">
                Offer Price: ${offerPrice.toFixed(2)}
            </p>
            <button
                onClick={onStart}
                disabled={disabled}
                className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
            >
                <PromotionIcon className="h-5 w-5" />
                Start Offer
            </button>
        </div>
    );
};


export const PromotionsModal: React.FC<PromotionsModalProps> = ({ isOpen, onClose, gameState, onStartPromotion }) => {
    const canStartPromotion = gameState.cash >= SPECIAL_OFFER_COST && !gameState.specialOffer.productId && (!gameState.offerCooldownUntil || Date.now() > gameState.offerCooldownUntil);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Start a Promotion">
            <div className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                    <p className="text-gray-300">
                        Start a special offer to sell a product for <span className="font-bold text-yellow-400">50% more</span> for <span className="font-bold text-white">{SPECIAL_OFFER_DURATION / 1000} seconds</span>.
                    </p>
                    <p className="font-bold text-xl text-indigo-300 mt-2">
                        Cost: ${SPECIAL_OFFER_COST}
                    </p>
                </div>

                {!canStartPromotion && (
                     <div className="bg-red-900/50 border border-red-500/50 text-red-300 p-3 rounded-lg text-center">
                        {gameState.cash < SPECIAL_OFFER_COST && <p>Not enough cash to start a promotion.</p>}
                        {gameState.specialOffer.productId && <p>An offer is already active.</p>}
                        {gameState.offerCooldownUntil && Date.now() < gameState.offerCooldownUntil && !gameState.specialOffer.productId && <p>Promotions are on cooldown.</p>}
                    </div>
                )}

                <div className="space-y-2">
                    {Object.values(PRODUCTS).map(product => (
                        <PromotionItemRow
                            key={product.id}
                            product={product}
                            onStart={() => onStartPromotion(product.id)}
                            disabled={!canStartPromotion}
                        />
                    ))}
                </div>
            </div>
        </Modal>
    );
};
