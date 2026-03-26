"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { Token } from "@/lib/types";

interface Props {
  token: Token;
  onClose: () => void;
}

export default function EditTokenModal({ token, onClose }: Props) {
  const updateToken = useDashboardStore((s) => s.updateToken);
  const [amount, setAmount] = useState(String(token.amount));
  const [avgBuyPrice, setAvgBuyPrice] = useState(String(token.avgBuyPrice));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateToken(token.id, {
      amount: parseFloat(amount),
      avgBuyPrice: parseFloat(avgBuyPrice),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-1">Edit Token</h2>
        <p className="text-gray-500 text-sm mb-4">
          {token.name} <span className="text-gray-600">({token.symbol})</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Amount Held</label>
            <input
              autoFocus
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="any"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Avg Buy Price (USD)</label>
            <input
              type="number"
              value={avgBuyPrice}
              onChange={(e) => setAvgBuyPrice(e.target.value)}
              min="0"
              step="any"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
