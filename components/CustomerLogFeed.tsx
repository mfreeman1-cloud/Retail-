
import React from 'react';
import type { CustomerLog } from '../types';

interface CustomerLogFeedProps {
  logs: CustomerLog[];
}

export const CustomerLogFeed: React.FC<CustomerLogFeedProps> = ({ logs }) => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg shadow-inner h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 text-indigo-300">Activity Feed</h2>
      <div className="flex-grow overflow-y-auto space-y-2 pr-2">
        {logs.length === 0 && <p className="text-gray-400">Your store is quiet... for now.</p>}
        {logs.map((log) => (
          <p key={log.id} className="text-sm text-gray-300 bg-gray-700/50 p-2 rounded-md animate-fade-in">
            {log.message}
          </p>
        ))}
      </div>
    </div>
  );
};
