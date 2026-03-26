"use client";

import { useState, useEffect, useRef } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { searchCoins, CoinSearchResult } from "@/lib/coingecko";

interface Props {
  walletId: string;
  onClose: () => void;
}

export default function AddTokenModal({ walletId, onClose }: Props) {
  const addToken = useDashboardStore((s) => s.addToken);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CoinSearchResult[]>([]);
  const [selected, setSelected] = useState<CoinSearchResult | null>(null);
  const [amount, setAmount] = useState("");
  const [avgBuyPrice, setAvgBuyPrice] = useState("");
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selected) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (query.length < 2) { setResults([]); return; }
      setSearching(true);
      const res = await searchCoins(query);
      setResults(res);
      setSearching(false);
    }, 400);
  }, [query, selected]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !amount || !avgBuyPrice) return;
    addToken({
      coinId: selected.id,
      symbol: selected.symbol,
      name: selected.name,
      amount: parseFloat(amount),
      avgBuyPrice: parseFloat(avgBuyPrice),
      walletId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-semibold text-white mb-4">Add Token</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Coin search */}
          <div className="relative">
            <label className="text-sm text-gray-400 block mb-1">Search Coin *</label>
            {selected ? (
              <div className="flex items-center gap-2 bg-gray-800 border border-indigo-500 rounded-lg px-3 py-2">
                {selected.thumb && (
                  <img src={selected.thumb} alt="" className="w-5 h-5 rounded-full" />
                )}
                <span className="text-white text-sm flex-1">
                  {selected.name} <span className="text-gray-400">({selected.symbol})</span>
                </span>
                <button
                  type="button"
                  onClick={() => { setSelected(null); setQuery(""); }}
                  className="text-gray-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Bitcoin, Ethereum..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
                />
                {searching && (
                  <p className="text-gray-500 text-xs mt-1">Searching...</p>
                )}
                {results.length > 0 && (
                  <div className="absolute z-10 top-full mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                    {results.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => { setSelected(r); setResults([]); }}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-gray-700 text-sm text-white"
                      >
                        {r.thumb && (
                          <img src={r.thumb} alt="" className="w-5 h-5 rounded-full" />
                        )}
                        <span>{r.name}</span>
                        <span className="text-gray-400 ml-auto">{r.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-1">Amount Held *</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 0.5"
              min="0"
              step="any"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-1">Avg Buy Price (USD) *</label>
            <input
              type="number"
              value={avgBuyPrice}
              onChange={(e) => setAvgBuyPrice(e.target.value)}
              placeholder="e.g. 45000"
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
              disabled={!selected || !amount || !avgBuyPrice}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-colors"
            >
              Add Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
