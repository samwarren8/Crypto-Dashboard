import { PriceData } from "./types";

const BASE = "https://api.coingecko.com/api/v3";

export async function fetchPrices(coinIds: string[]): Promise<PriceData> {
  if (coinIds.length === 0) return {};
  const ids = [...new Set(coinIds)].join(",");
  const res = await fetch(
    `${BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch prices");
  return res.json();
}

export interface CoinSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

export async function searchCoins(query: string): Promise<CoinSearchResult[]> {
  if (!query || query.length < 2) return [];
  const res = await fetch(`${BASE}/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.coins ?? []).slice(0, 10).map((c: { id: string; name: string; symbol: string; thumb: string }) => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol.toUpperCase(),
    thumb: c.thumb,
  }));
}
