"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/dashboardStore";

const CHAINS = ["Ethereum", "BSC", "Solana", "Polygon", "Arbitrum", "Base", "Avalanche", "Other"];

interface Props {
  onClose: () => void;
}

export default function AddWalletModal({ onClose }: Props) {
  const addWallet = useDashboardStore((s) => s.addWallet);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("Ethereum");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addWallet({ name: name.trim(), address: address.trim() || undefined, chain });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Add Wallet</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Wallet Name *</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Main ETH Wallet"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Chain</label>
            <select
              value={chain}
              onChange={(e) => setChain(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
            >
              {CHAINS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">
              Wallet Address <span className="text-gray-600">(optional)</span>
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500 font-mono"
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
              Add Wallet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
