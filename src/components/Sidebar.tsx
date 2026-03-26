"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { useState } from "react";
import AddWalletModal from "./AddWalletModal";

export default function Sidebar() {
  const { wallets, selectedWalletId, setSelectedWallet, removeWallet } =
    useDashboardStore();
  const [showAdd, setShowAdd] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <>
      <aside className="w-64 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen">
        <div className="p-5 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white tracking-tight">
            🪙 CryptoTracker
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">Portfolio Dashboard</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => setSelectedWallet(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedWalletId === null
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <span className="mr-2">📊</span> All Wallets
          </button>

          <div className="pt-3 pb-1">
            <p className="text-gray-600 text-xs uppercase tracking-widest px-3 mb-1">
              Wallets
            </p>
          </div>

          {wallets.length === 0 && (
            <p className="text-gray-600 text-xs px-3 italic">
              No wallets yet
            </p>
          )}

          {wallets.map((w) => (
            <div
              key={w.id}
              className="relative"
              onMouseEnter={() => setHoveredId(w.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                onClick={() => setSelectedWallet(w.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  selectedWalletId === w.id
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: w.color }}
                />
                <span className="truncate flex-1">{w.name}</span>
                <span className="text-gray-600 text-xs">{w.chain}</span>
              </button>
              {hoveredId === w.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Remove wallet "${w.name}"?`))
                      removeWallet(w.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-400 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <button
            onClick={() => setShowAdd(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
          >
            + Add Wallet
          </button>
        </div>
      </aside>

      {showAdd && <AddWalletModal onClose={() => setShowAdd(false)} />}
    </>
  );
}
