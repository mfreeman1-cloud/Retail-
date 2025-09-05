import React, { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { StoreGrid } from './components/StoreGrid';
import { ControlPanel } from './components/ControlPanel';
import { BuyStockModal } from './components/BuyStockModal';
import { UpgradesModal } from './components/UpgradesModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { PromotionsModal } from './components/PromotionsModal';
import { CustomerLogFeed } from './components/CustomerLogFeed';
import { GameOverScreen } from './components/GameOverScreen';
import { GoalTracker } from './components/GoalTracker';
import { INITIAL_CASH, PRODUCTS, UPGRADES, SPECIAL_OFFER_COST, SPECIAL_OFFER_DURATION, SPECIAL_OFFER_COOLDOWN, SPECIAL_OFFER_PRICE_MULTIPLIER, GOALS } from './constants';
import type { GameState, GameAction, CustomerLog } from './types';

const initialGameState: GameState = {
  cash: INITIAL_CASH,
  inventory: {},
  upgrades: { 'storage': 1, 'marketing': 1 },
  isGameOver: false,
  specialOffer: { productId: null, expiresAt: null },
  offerCooldownUntil: null,
  stats: { totalItemsSold: 0, totalCashEarned: 0 },
  currentGoalIndex: 0,
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SELL_ITEM': {
      const { productId, salePrice } = action.payload;
      const product = PRODUCTS[productId];
      if (!product || !state.inventory[productId] || state.inventory[productId] <= 0) {
        return state;
      }
      
      return {
        ...state,
        cash: state.cash + salePrice,
        inventory: {
          ...state.inventory,
          [productId]: state.inventory[productId] - 1,
        },
        stats: {
            ...state.stats,
            totalItemsSold: state.stats.totalItemsSold + 1,
            totalCashEarned: state.stats.totalCashEarned + salePrice,
        }
      };
    }
    case 'BUY_STOCK': {
      const { productId, quantity, cost } = action.payload;
      if (state.cash < cost) return state;
      return {
        ...state,
        cash: state.cash - cost,
        inventory: {
          ...state.inventory,
          [productId]: (state.inventory[productId] || 0) + quantity,
        },
      };
    }
    case 'BUY_UPGRADE': {
      const { upgradeId, cost } = action.payload;
      if (state.cash < cost) return state;
      return {
        ...state,
        cash: state.cash - cost,
        upgrades: {
          ...state.upgrades,
          [upgradeId]: (state.upgrades[upgradeId] || 1) + 1,
        },
      };
    }
    case 'START_SPECIAL_OFFER': {
        const { cost, productId, expiresAt, cooldownUntil } = action.payload;
        if (state.cash < cost) return state;
        return {
            ...state,
            cash: state.cash - cost,
            specialOffer: { productId, expiresAt },
            offerCooldownUntil: cooldownUntil
        };
    }
    case 'END_SPECIAL_OFFER': {
        return {...state, specialOffer: { productId: null, expiresAt: null }};
    }
    case 'COMPLETE_GOAL': {
        return {
            ...state,
            cash: state.cash + action.payload.reward,
            currentGoalIndex: state.currentGoalIndex + 1,
        };
    }
    case 'SET_GAME_OVER': {
        return { ...state, isGameOver: true };
    }
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [isBuyStockOpen, setBuyStockOpen] = useState(false);
  const [isUpgradesOpen, setUpgradesOpen] = useState(false);
  const [isAIOpen, setAIOpen] = useState(false);
  const [isPromotionsOpen, setPromotionsOpen] = useState(false);
  const [customerLogs, setCustomerLogs] = useState<CustomerLog[]>([]);

  const maxInventory = useMemo(() => UPGRADES.storage.effect(gameState.upgrades.storage), [gameState.upgrades.storage]);
  const customerSpeed = useMemo(() => UPGRADES.marketing.effect(gameState.upgrades.marketing), [gameState.upgrades.marketing]);
  const currentGoal = useMemo(() => GOALS[gameState.currentGoalIndex], [gameState.currentGoalIndex]);

  const addLog = useCallback((message: string) => {
    setCustomerLogs(prevLogs => [{ id: Date.now(), message }, ...prevLogs.slice(0, 19)]);
  }, []);

  const handleCustomerArrival = useCallback(() => {
    if (gameState.isGameOver) return;

    const productIds = Object.keys(PRODUCTS);
    const desiredProductId = productIds[Math.floor(Math.random() * productIds.length)];
    const desiredProduct = PRODUCTS[desiredProductId];

    if (gameState.inventory[desiredProductId] > 0) {
      const isSpecial = gameState.specialOffer.productId === desiredProductId;
      const salePrice = isSpecial ? desiredProduct.price * SPECIAL_OFFER_PRICE_MULTIPLIER : desiredProduct.price;
      
      dispatch({ type: 'SELL_ITEM', payload: { productId: desiredProductId, salePrice } });
      
      if (isSpecial) {
        addLog(`A customer bought ${desiredProduct.name} on SALE for $${salePrice.toFixed(2)}! 🤑`);
      } else {
        addLog(`A customer bought ${desiredProduct.name} for $${salePrice.toFixed(2)}! ${desiredProduct.emoji}`);
      }
    } else {
      addLog(`A customer wanted ${desiredProduct.name}, but it was out of stock! 😩`);
    }
  }, [gameState.inventory, addLog, gameState.isGameOver, gameState.specialOffer.productId]);

  // Main Game Loop
  useEffect(() => {
    const customerTimer = setInterval(handleCustomerArrival, customerSpeed);
    
    const offerTimer = setInterval(() => {
        if (gameState.specialOffer.expiresAt && Date.now() > gameState.specialOffer.expiresAt) {
            const productName = PRODUCTS[gameState.specialOffer.productId!]?.name || 'the item';
            dispatch({ type: 'END_SPECIAL_OFFER' });
            addLog(`The special offer on ${productName} has ended.`);
        }
    }, 1000);

    return () => {
        clearInterval(customerTimer);
        clearInterval(offerTimer);
    };
  }, [handleCustomerArrival, customerSpeed, gameState.specialOffer, addLog]);

  // Goal Completion Check
  useEffect(() => {
    if (currentGoal && currentGoal.isCompleted(gameState)) {
        addLog(`🏆 Goal Achieved: ${currentGoal.description}! Reward: $${currentGoal.reward}`);
        dispatch({ type: 'COMPLETE_GOAL', payload: { reward: currentGoal.reward } });
    }
  }, [gameState, currentGoal, addLog]);


  // Game Over check
  useEffect(() => {
    const canAffordAnything = Object.values(PRODUCTS).some(p => p.cost <= gameState.cash);
    const hasStock = Object.values(gameState.inventory).some((qty: number) => qty > 0);
    if (gameState.cash <= 0 && !hasStock && !canAffordAnything) {
        dispatch({type: 'SET_GAME_OVER'});
    }
  }, [gameState.cash, gameState.inventory]);
  
  const handleBuyStock = (productId: string, quantity: number) => {
    const product = PRODUCTS[productId];
    const totalCost = product.cost * quantity;
    if (gameState.cash >= totalCost) {
      dispatch({ type: 'BUY_STOCK', payload: { productId, quantity, cost: totalCost } });
    } else {
      addLog("Not enough cash to buy stock!");
    }
  };

  const handleBuyUpgrade = (upgradeId: string) => {
    const upgrade = UPGRADES[upgradeId];
    const currentLevel = gameState.upgrades[upgradeId] || 1;
    const cost = upgrade.cost(currentLevel);
    if (gameState.cash >= cost) {
      dispatch({ type: 'BUY_UPGRADE', payload: { upgradeId, cost } });
    } else {
      addLog("Not enough cash for this upgrade!");
    }
  };

  const handleStartPromotion = (productId: string) => {
      const now = Date.now();
      dispatch({
        type: 'START_SPECIAL_OFFER',
        payload: {
            productId,
            cost: SPECIAL_OFFER_COST,
            expiresAt: now + SPECIAL_OFFER_DURATION,
            cooldownUntil: now + SPECIAL_OFFER_DURATION + SPECIAL_OFFER_COOLDOWN,
        }
      });
      addLog(`Special offer started for ${PRODUCTS[productId].name}!`);
      setPromotionsOpen(false);
  };
  
  if (gameState.isGameOver) {
      return <GameOverScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans">
      <Header cash={gameState.cash} specialOffer={gameState.specialOffer} offerCooldownUntil={gameState.offerCooldownUntil} />
      
      <main className="flex-grow container mx-auto p-4 flex flex-col lg:flex-row gap-4">
        <div className="lg:w-3/4">
            <StoreGrid inventory={gameState.inventory} maxInventory={maxInventory} onRestockClick={() => setBuyStockOpen(true)} specialOffer={gameState.specialOffer} />
        </div>
        <aside className="lg:w-1/4 flex flex-col gap-4">
            <GoalTracker gameState={gameState} goal={currentGoal} />
            <CustomerLogFeed logs={customerLogs} />
        </aside>
      </main>
      
      <ControlPanel
        onBuyStockClick={() => setBuyStockOpen(true)}
        onUpgradesClick={() => setUpgradesOpen(true)}
        onPromotionsClick={() => setPromotionsOpen(true)}
        onAIClick={() => setAIOpen(true)}
      />

      <BuyStockModal
        isOpen={isBuyStockOpen}
        onClose={() => setBuyStockOpen(false)}
        cash={gameState.cash}
        inventory={gameState.inventory}
        maxInventory={maxInventory}
        onBuy={handleBuyStock}
      />

      <UpgradesModal
        isOpen={isUpgradesOpen}
        onClose={() => setUpgradesOpen(false)}
        cash={gameState.cash}
        upgrades={gameState.upgrades}
        onBuy={handleBuyUpgrade}
      />

      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setAIOpen(false)}
        gameState={gameState}
        maxInventory={maxInventory}
      />
        
      <PromotionsModal
        isOpen={isPromotionsOpen}
        onClose={() => setPromotionsOpen(false)}
        gameState={gameState}
        onStartPromotion={handleStartPromotion}
      />
    </div>
  );
};

export default App;