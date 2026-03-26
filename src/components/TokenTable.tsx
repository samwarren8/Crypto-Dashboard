"use client";

import { useState } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { Token } from "@/lib/types";
import AddTokenModal from "./AddTokenModal";
import EditTokenModal from "./EditTokenModal";

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtPrice(n: number) {
  if (n === 0) return "—";
  if (n < 0.01) return "$" + n.toFixed(6);
  if (n < 1) return "$" + n.toFixed(4);
  return "$" + fmt(n);
}

function fmtUSD(n: number) {
  if (Math.abs(n) >= 1e6) return "$" + fmt(n / 1e6) + "M";
  if (Math.abs(n) >= 1e3) return "$" + fmt(n / 1e3) + "K";
  return "$" + fmt(n);
}

export default function TokenTable() {
  const { wallets, tokens, prices, selectedWalletId, removeToken } = useDashboardStore();
  const [addForWallet, setAddForWallet] = useState<string | null>(null);
  const [editToken, setEditToken] = useState<Token | null>(null);

  const visibleWallets = selectedWalletId
    ? wallets.filter((w) => w.id === selectedWalletId)
    : wallets;

  if (wallets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-4xl mb-4">👛</p>
        <p className="text-white text-lg font-medium mb-1">No wallets yet</p>
        <p className="text-gray-500 text-sm">Add a wallet from the sidebar to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {visibleWallets.map((wallet) => {
          const walletTokens = tokens.filter((t) => t.walletId === wallet.id);

          return (
            <div key={wallet.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {/* Wallet header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: wallet.color }}
                  />
                  <span className="text-white font-medium text-sm">{wallet.name}</span>
                  <span className="text-gray-600 text-xs bg-gray-800 px-2 py-0.5 rounded-full">
                    {wallet.chain}
                  </span>
                  {wallet.address && (
                    <span className="text-gray-600 text-xs font-mono hidden md:inline">
                      {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setAddForWallet(wallet.id)}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                >
                  + Add Token
                </button>
              </div>

              {walletTokens.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-gray-600 text-sm">No tokens yet.</p>
                  <button
                    onClick={() => setAddForWallet(wallet.id)}
                    className="text-indigo-400 hover:text-indigo-300 text-sm mt-1"
                  >
                    Add your first token →
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-500 text-xs uppercase tracking-wide">
                        <th className="text-left px-4 py-2">Token</th>
                        <th className="text-right px-4 py-2">Amount</th>
                        <th className="text-right px-4 py-2">Avg Buy</th>
                        <th className="text-right px-4 py-2">Current</th>
                        <th className="text-right px-4 py-2">Value</th>
                        <th className="text-right px-4 py-2">P&L</th>
                        <th className="text-right px-4 py-2">24h</th>
                        <th className="px-4 py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {walletTokens.map((token) => {
                        const priceData = prices[token.coinId];
                        const currentPrice = priceData?.usd ?? 0;
                        const change24h = priceData?.usd_24h_change ?? 0;
                        const value = currentPrice * token.amount;
                        const cost = token.avgBuyPrice * token.amount;
                        const pnl = value - cost;
                        const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
                        const priceLoaded = currentPrice > 0;

                        return (
                          <tr
                            key={token.id}
                            className="hover:bg-gray-800/50 transition-colors group"
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div>
                                  <p className="text-white font-medium">{token.symbol}</p>
                                  <p className="text-gray-500 text-xs">{token.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-300">
                              {token.amount.toLocaleString("en-US", { maximumFractionDigits: 8 })}
                            </td>
                            <td className="px-4 py-3 text-right text-gray-400">
                              {fmtPrice(token.avgBuyPrice)}
                            </td>
                            <td className="px-4 py-3 text-right text-white">
                              {priceLoaded ? fmtPrice(currentPrice) : <span className="text-gray-600">—</span>}
                            </td>
                            <td className="px-4 py-3 text-right text-white font-medium">
                              {priceLoaded ? fmtUSD(value) : <span className="text-gray-600">—</span>}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {priceLoaded ? (
                                <div>
                                  <p className={pnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                                    {pnl >= 0 ? "+" : ""}{fmtUSD(pnl)}
                                  </p>
                                  <p className={`text-xs ${pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                    {pnlPct >= 0 ? "+" : ""}{fmt(pnlPct)}%
                                  </p>
                                </div>
                              ) : (
                                <span className="text-gray-600">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {priceLoaded ? (
                                <span className={`text-xs font-medium ${change24h >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                  {change24h >= 0 ? "▲" : "▼"} {Math.abs(change24h).toFixed(2)}%
                                </span>
                              ) : (
                                <span className="text-gray-600 text-xs">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setEditToken(token)}
                                  className="text-gray-500 hover:text-indigo-400 text-xs"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Remove ${token.symbol}?`)) removeToken(token.id);
                                  }}
                                  className="text-gray-500 hover:text-red-400 text-xs"
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {addForWallet && (
        <AddTokenModal walletId={addForWallet} onClose={() => setAddForWallet(null)} />
      )}
      {editToken && (
        <EditTokenModal token={editToken} onClose={() => setEditToken(null)} />
      )}
    </>
  );
}
