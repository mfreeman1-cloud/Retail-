
import React from 'react';

export const GameOverScreen: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white flex-col p-4 text-center">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-red-500/50">
                <h1 className="text-6xl font-bold text-red-500 mb-4">Game Over</h1>
                <p className="text-xl text-gray-300 mb-8">
                    Your store has gone bankrupt. Better luck next time!
                </p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
};
