"use client";

import { useDashboardStore } from "@/store/dashboardStore";

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtUSD(n: number) {
  if (Math.abs(n) >= 1e6) return "$" + fmt(n / 1e6) + "M";
  if (Math.abs(n) >= 1e3) return "$" + fmt(n / 1e3) + "K";
  return "$" + fmt(n);
}

export default function PortfolioStats() {
  const { wallets, tokens, prices, selectedWalletId } = useDashboardStore();

  const visibleTokens = selectedWalletId
    ? tokens.filter((t) => t.walletId === selectedWalletId)
    : tokens;

  let totalValue = 0;
  let totalCost = 0;

  for (const t of visibleTokens) {
    const price = prices[t.coinId]?.usd ?? 0;
    totalValue += price * t.amount;
    totalCost += t.avgBuyPrice * t.amount;
  }

  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;
  const walletLabel = selectedWalletId
    ? wallets.find((w) => w.id === selectedWalletId)?.name ?? "Wallet"
    : "All Wallets";

  const statCard = (label: string, value: string, sub?: string, color?: string) => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color ?? "text-white"}`}>{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
    </div>
  );

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-white mb-3">{walletLabel}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCard("Portfolio Value", fmtUSD(totalValue), `${visibleTokens.length} token${visibleTokens.length !== 1 ? "s" : ""}`)}
        {statCard("Total Cost Basis", fmtUSD(totalCost))}
        {statCard(
          "Total P&L",
          (totalPnl >= 0 ? "+" : "") + fmtUSD(totalPnl),
          (totalPnlPct >= 0 ? "+" : "") + fmt(totalPnlPct) + "%",
          totalPnl >= 0 ? "text-emerald-400" : "text-red-400"
        )}
        {statCard("Wallets", String(selectedWalletId ? 1 : wallets.length), selectedWalletId ? "1 wallet selected" : "total")}
      </div>
    </div>
  );
}
