export interface Product {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  price: number;
}

export interface Upgrade {
  id:string;
  name: string;
  description: (level: number) => string;
  cost: (level: number) => number;
  effect: (level: number) => number;
}

export interface Goal {
  description: string;
  reward: number;
  target: number;
  getCurrentValue: (state: GameState) => number;
  isCompleted: (state: GameState) => boolean;
  unit?: 'money' | 'items';
}

export interface GameState {
  cash: number;
  inventory: Record<string, number>;
  upgrades: Record<string, number>;
  isGameOver: boolean;
  specialOffer: {
    productId: string | null;
    expiresAt: number | null;
  };
  offerCooldownUntil: number | null;
  stats: {
    totalItemsSold: number;
    totalCashEarned: number;
  };
  currentGoalIndex: number;
}

export type GameAction =
  | { type: 'SELL_ITEM'; payload: { productId: string; salePrice: number } }
  | { type: 'BUY_STOCK'; payload: { productId: string; quantity: number; cost: number } }
  | { type: 'BUY_UPGRADE'; payload: { upgradeId: string; cost: number } }
  | { type: 'SET_GAME_OVER' }
  | { type: 'START_SPECIAL_OFFER'; payload: { productId: string; cost: number; expiresAt: number; cooldownUntil: number } }
  | { type: 'END_SPECIAL_OFFER' }
  | { type: 'COMPLETE_GOAL'; payload: { reward: number } };


export interface CustomerLog {
  id: number;
  message: string;
}