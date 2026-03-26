"use client";

import { useEffect, useRef } from "react";
import { useDashboardStore } from "@/store/dashboardStore";
import { fetchPrices } from "@/lib/coingecko";

const REFRESH_INTERVAL = 60_000; // 60 seconds

export default function PriceFetcher() {
  const { tokens, setPrices } = useDashboardStore();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const coinIds = [...new Set(tokens.map((t) => t.coinId))];
  const coinIdsKey = coinIds.sort().join(",");

  async function refresh(ids: string[]) {
    if (ids.length === 0) return;
    try {
      const data = await fetchPrices(ids);
      setPrices(data);
    } catch {
      // silently ignore transient errors
    }
  }

  useEffect(() => {
    const ids = coinIdsKey ? coinIdsKey.split(",") : [];
    refresh(ids);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => refresh(ids), REFRESH_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinIdsKey]);

  return null;
}
