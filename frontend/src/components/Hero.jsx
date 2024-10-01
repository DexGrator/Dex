"use client"
import Link from "next/link";
import { useState } from "react";

export default function Hero() {
  const [loading, setLoading] = useState(false);

  const handleSwapClick = () => {
    setLoading(true);
    setTimeout(() => {
      // You can redirect here if needed, or just let Link handle it
    }, 1000);
  };

  return (
    <section className="text-white pt-20  h-[85vh] flex items-center">
      <div className="container mx-auto flex flex-col items-center text-center">
        <h1 className="text-5xl font-bold mb-6">
          The Multi-Swap <br />
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">DEX is Here</span>
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Power Your Trades with Solana's First Multi-Swap DEX effortless token swaps with MEV protection
        </p>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            <p className="ml-4">Loading...</p>
          </div>
        ) : (
          <Link href="/swap">
            <button onClick={handleSwapClick} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg px-8 py-3">
              Swap Now
            </button>
          </Link>
        )}
        <div className="mt-12 flex items-center space-x-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-gray-300"></div>
            ))}
          </div>
          <span className="text-2xl font-bold">5M+</span>
          <span className="text-gray-400">Tokens Available</span>
        </div>
      </div>
    </section>
  );
}
