import localFont from "next/font/local";
import "./globals.css";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletConnectProvider } from "./providers/WalletConnectProvider";
import AppWalletProvider from "@/components/AppWalletProvider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Dexgartor",
  description: "Solana Multiswap Platfrom",
};

export default function RootLayout({ children }) {

  const network = WalletAdapterNetwork.Mainnet;
// Use "mainnet-beta" for the main Solana network

  // Define the wallet adapters

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-700`}
      >
          <AppWalletProvider>
          {children}
        </AppWalletProvider>
      </body>
    </html>
  );
}
