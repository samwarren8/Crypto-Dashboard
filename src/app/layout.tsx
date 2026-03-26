import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CryptoTracker — Portfolio Dashboard",
  description: "Track your crypto wallets, tokens, and average buy prices in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-950 text-white">{children}</body>
    </html>
  );
}
