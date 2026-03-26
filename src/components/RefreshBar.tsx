"use client";

import { useEffect, useState } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { fetchPrices } from "@/lib/coingecko";

export default function RefreshBar() {
  const { tokens, prices, setPrices } = useDashboardStore();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const hasPrices = Object.keys(prices).length > 0;

  useEffect(() => {
    if (hasPrices) setLastUpdated(new Date());
  }, [prices]);

  const handleRefresh = async () => {
    if (refreshing) return;
    const ids = [...new Set(tokens.map((t) => t.coinId))];
    if (ids.length === 0) return;
    setRefreshing(true);
    try {
      const data = await fetchPrices(ids);
      setPrices(data);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-2.5 border-b border-gray-800 bg-gray-900">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span
          className={`w-1.5 h-1.5 rounded-full ${refreshing ? "bg-yellow-400 animate-pulse" : hasPrices ? "bg-emerald-400" : "bg-gray-600"}`}
        />
        {refreshing
          ? "Updating prices..."
          : lastUpdated
          ? `Prices updated ${formatTime(lastUpdated)}`
          : "Prices not loaded"}
        <span className="text-gray-700">• Auto-refresh every 60s</span>
      </div>
      <button
        onClick={handleRefresh}
        disabled={refreshing || tokens.length === 0}
        className="text-xs text-indigo-400 hover:text-indigo-300 disabled:text-gray-700 disabled:cursor-not-allowed transition-colors"
      >
        {refreshing ? "Refreshing..." : "↻ Refresh"}
      </button>
    </div>
  );
}

function formatTime(date: Date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return date.toLocaleTimeString();
}
