"use client"
import React from 'react';
import Link from 'next/link';
import ConnectWalletButton from './CnnectWalletButton';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-white text-lg font-bold">
            DeFi App
          </Link>
          <Link
            href="/swap"
            className="text-white hover:text-gray-300"
          >
            Swap Tokens
          </Link>
        </div>
        <ConnectWalletButton />
      </div>
    </nav>
  );
};

export default Navbar;