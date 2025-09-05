
import { GoogleGenAI } from '@google/genai';
import type { GameState } from '../types';
import { PRODUCTS, UPGRADES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getBusinessAdvice = async (gameState: GameState, maxInventory: number): Promise<string> => {
  const inventoryList = Object.keys(PRODUCTS)
    .map(id => `- ${PRODUCTS[id]?.name || 'Unknown Item'}: ${gameState.inventory[id] || 0} / ${maxInventory} units`)
    .join('\n');
    
  const upgradesList = Object.entries(gameState.upgrades)
    .map(([id, level]) => `- ${UPGRADES[id]?.name || 'Unknown Upgrade'}: Level ${level}`)
    .join('\n');

  const prompt = `
    You are a friendly and encouraging retail business consultant AI for a simulation game.
    Your goal is to help a player succeed.
    Based on the following game state, provide a concise, actionable tip for the player.
    The tip should be 2-3 sentences long.
    Focus on one key area for improvement:
    1.  Suggest a specific product to stock up on, especially if it's at zero.
    2.  Suggest an upgrade to purchase if they have enough cash and it makes sense.
    3.  Give a general strategy if inventory looks good but they could be more profitable.
    Do not just state the facts, give a strategic recommendation.

    Current Game State:
    - Cash: $${gameState.cash.toFixed(2)}
    - Max Inventory Per Item: ${maxInventory}
    - Current Inventory:
    ${inventoryList}
    - Upgrades Owned:
    ${upgradesList}
    
    Your concise and friendly advice:
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            temperature: 0.8,
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Looks like your business advisor is on a coffee break. Please try again in a moment!";
  }
};
