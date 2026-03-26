"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Token, Wallet, PriceData } from "@/lib/types";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const WALLET_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
  "#3b82f6", "#ef4444", "#14b8a6", "#f97316", "#84cc16",
];

interface DashboardState {
  wallets: Wallet[];
  tokens: Token[];
  prices: PriceData;
  selectedWalletId: string | null;

  addWallet: (wallet: Omit<Wallet, "id" | "color">) => void;
  removeWallet: (id: string) => void;
  updateWallet: (id: string, updates: Partial<Omit<Wallet, "id">>) => void;

  addToken: (token: Omit<Token, "id">) => void;
  removeToken: (id: string) => void;
  updateToken: (id: string, updates: Partial<Omit<Token, "id">>) => void;

  setPrices: (prices: PriceData) => void;
  setSelectedWallet: (id: string | null) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      wallets: [],
      tokens: [],
      prices: {},
      selectedWalletId: null,

      addWallet: (wallet) => {
        const count = get().wallets.length;
        set((s) => ({
          wallets: [
            ...s.wallets,
            {
              ...wallet,
              id: uid(),
              color: WALLET_COLORS[count % WALLET_COLORS.length],
            },
          ],
        }));
      },

      removeWallet: (id) =>
        set((s) => ({
          wallets: s.wallets.filter((w) => w.id !== id),
          tokens: s.tokens.filter((t) => t.walletId !== id),
          selectedWalletId:
            s.selectedWalletId === id ? null : s.selectedWalletId,
        })),

      updateWallet: (id, updates) =>
        set((s) => ({
          wallets: s.wallets.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),

      addToken: (token) =>
        set((s) => ({
          tokens: [...s.tokens, { ...token, id: uid() }],
        })),

      removeToken: (id) =>
        set((s) => ({ tokens: s.tokens.filter((t) => t.id !== id) })),

      updateToken: (id, updates) =>
        set((s) => ({
          tokens: s.tokens.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      setPrices: (prices) => set({ prices }),
      setSelectedWallet: (id) => set({ selectedWalletId: id }),
    }),
    { name: "crypto-dashboard-v1" }
  )
);
