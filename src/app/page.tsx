"use client";

import Sidebar from "@/components/Sidebar";
import PortfolioStats from "@/components/PortfolioStats";
import TokenTable from "@/components/TokenTable";
import PriceFetcher from "@/components/PriceFetcher";
import RefreshBar from "@/components/RefreshBar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <PriceFetcher />
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <RefreshBar />
        <div className="flex-1 p-6 overflow-auto">
          <PortfolioStats />
          <TokenTable />
        </div>
      </main>
    </div>
  );
}
