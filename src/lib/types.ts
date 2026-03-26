export interface Token {
  id: string;           // unique id (uuid)
  coinId: string;       // CoinGecko coin id (e.g. "bitcoin")
  symbol: string;       // e.g. "BTC"
  name: string;         // e.g. "Bitcoin"
  amount: number;       // how many tokens held
  avgBuyPrice: number;  // USD price paid on average
  walletId: string;
}

export interface Wallet {
  id: string;
  name: string;
  address?: string;     // optional on-chain address
  chain: string;        // e.g. "Ethereum", "BSC", "Solana", etc.
  color: string;        // accent color for UI
}

export interface PriceData {
  [coinId: string]: {
    usd: number;
    usd_24h_change: number;
  };
}
