"use client"

import Link from "next/link";
import { useState } from "react";
import Image from 'next/image';

export default function Hero() {
  const [loading, setLoading] = useState(false);

  const handleSwapClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // You can redirect here if needed, or just let Link handle it
    }, 1000);
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12 text-white">
      <div className="max-w-2xl mb-8 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
          The Multi-Swap <br />DEX is Here
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Power Your Trades with Solana's First Multi-Swap DEX effortless token swaps with MEV protection
        </p>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            <p className="ml-4 text-gray-300">Loading...</p>
          </div>
        ) : (
          <Link href="/swap" className="inline-block">
            <button 
              onClick={handleSwapClick} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg px-8 py-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition duration-300 ease-in-out"
            >
              Swap Now
            </button>
          </Link>
        )}
        <div className="flex items-center space-x-6 mt-8">
          <div className="flex -space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-black"></div>
            ))}
          </div>
          <div>
            <p className="text-3xl font-bold text-white">5M+</p>
            <p className="text-sm text-gray-400">Tokens Available</p>
          </div>
        </div>
      </div>
      <div className="relative w-full md:w-1/2 h-[300px] md:h-[560px]">
        <Image
          src="/1.png"
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
        
      </div>
    </section>
  );
}