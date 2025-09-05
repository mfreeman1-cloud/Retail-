import { Product, Upgrade, Goal, GameState } from './types';

export const INITIAL_CASH = 500;
export const MAX_INVENTORY_BASE = 50;
export const CUSTOMER_ARRIVAL_BASE_SPEED = 5000; // ms

export const PRODUCTS: Record<string, Product> = {
  'apple': { id: 'apple', name: 'Apples', emoji: '🍎', cost: 1, price: 2 },
  'bread': { id: 'bread', name: 'Bread', emoji: '🍞', cost: 2, price: 4 },
  'milk': { id: 'milk', name: 'Milk', emoji: '🥛', cost: 3, price: 5 },
  'cheese': { id: 'cheese', name: 'Cheese', emoji: '🧀', cost: 5, price: 8 },
  'chicken': { id: 'chicken', name: 'Chicken', emoji: '🍗', cost: 8, price: 13 },
  'sushi': { id: 'sushi', name: 'Sushi', emoji: '🍣', cost: 12, price: 20 },
};

export const UPGRADES: Record<string, Upgrade> = {
  'storage': {
    id: 'storage',
    name: 'Bigger Storage',
    description: (level) => `Increases max inventory per item by 15. Next: +${level * 15}`,
    cost: (level) => 100 * Math.pow(2, level - 1),
    effect: (level) => MAX_INVENTORY_BASE + (level - 1) * 15,
  },
  'marketing': {
    id: 'marketing',
    name: 'Better Marketing',
    description: (level) => `Attracts customers ${((1 - (1 / Math.pow(1.2, level))) * 100).toFixed(0)}% faster.`,
    cost: (level) => 250 * Math.pow(2.5, level - 1),
    effect: (level) => CUSTOMER_ARRIVAL_BASE_SPEED / Math.pow(1.2, level - 1),
  },
};

// --- Special Offer Constants ---
export const SPECIAL_OFFER_COST = 200;
export const SPECIAL_OFFER_DURATION = 30000; // 30 seconds
export const SPECIAL_OFFER_COOLDOWN = 60000; // 60 seconds
export const SPECIAL_OFFER_PRICE_MULTIPLIER = 1.5;

// --- Sales Goals ---
export const GOALS: Goal[] = [
  {
    description: "Earn your first $1,000",
    reward: 250,
    target: 1000,
    getCurrentValue: (state: GameState) => state.stats.totalCashEarned,
    isCompleted: (state: GameState) => state.stats.totalCashEarned >= 1000,
    unit: 'money',
  },
  {
    description: "Sell 50 total items",
    reward: 500,
    target: 50,
    getCurrentValue: (state: GameState) => state.stats.totalItemsSold,
    isCompleted: (state: GameState) => state.stats.totalItemsSold >= 50,
    unit: 'items',
  },
  {
    description: "Purchase your first Marketing upgrade",
    reward: 750,
    target: 2,
    getCurrentValue: (state: GameState) => state.upgrades.marketing,
    isCompleted: (state: GameState) => state.upgrades.marketing >= 2,
    unit: 'items'
  },
  {
    description: "Reach $5,000 cash on hand",
    reward: 1000,
    target: 5000,
    getCurrentValue: (state: GameState) => state.cash,
    isCompleted: (state: GameState) => state.cash >= 5000,
    unit: 'money',
  },
   {
    description: "Sell 250 total items",
    reward: 1500,
    target: 250,
    getCurrentValue: (state: GameState) => state.stats.totalItemsSold,
    isCompleted: (state: GameState) => state.stats.totalItemsSold >= 250,
    unit: 'items',
  },
  {
    description: "Become a Tycoon (Reach $20,000 cash)",
    reward: 5000,
    target: 20000,
    getCurrentValue: (state: GameState) => state.cash,
    isCompleted: (state: GameState) => state.cash >= 20000,
    unit: 'money',
  }
];