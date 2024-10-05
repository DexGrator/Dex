"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Settings, BarChart2, Shield, RefreshCw, X, Plus } from "lucide-react";

const TokenSelection = ({ onSelect, onClose }) => {
  const tokens = [
    { symbol: "BTC", name: "Bitcoin", logo: "/btc-logo.png", value: "0" },
    { symbol: "ETH", name: "Ethereum", logo: "/eth-logo.png", value: "0" },
    { symbol: "SOL", name: "Solana", logo: "/sol-logo.png", value: "0" },
    { symbol: "USDC", name: "USD Coin", logo: "/usdc-logo.png", value: "0" },
    { symbol: "USDT", name: "Tether", logo: "/usdt-logo.png", value: "0" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg p-4 w-80">
        <h2 className="text-white text-lg font-semibold mb-4">Select Token</h2>
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="flex items-center p-2 hover:bg-[#2C2C2C] cursor-pointer rounded"
            onClick={() => {
              onSelect(token);
              onClose();
            }}
          >
            <Image
              src={token.logo}
              alt={token.name}
              width={24}
              height={24}
              className="mr-2"
            />
            <span className="text-white">{token.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CryptoTrader() {
  const [showTokenSelection, setShowTokenSelection] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [fromTokens, setFromTokens] = useState([]);
  const [toTokens, setToTokens] = useState([]);
  const [error, setError] = useState(null);

  const handleTokenSelect = (token) => {
    if (activeInput === "from") {
      if (toTokens.length > 1) {
        setError(
          "You can only select one token when multiple 'to' tokens are selected."
        );
        setShowTokenSelection(false);
        return;
      }
      setFromTokens([...fromTokens, token]);
    } else if (activeInput === "to") {
      if (fromTokens.length > 1) {
        setError(
          "You can only select one 'to' token when multiple 'from' tokens are selected."
        );
        setShowTokenSelection(false);
        return;
      }
      setToTokens([...toTokens, token]);
    }
    setShowTokenSelection(false);
    setError(null);
  };

  const handleRemoveToken = (section, index) => {
    if (section === "from") {
      setFromTokens(fromTokens.filter((_, i) => i !== index));
    } else {
      setToTokens(toTokens.filter((_, i) => i !== index));
    }
    setError(null);
  };

  const handleAddToken = (section) => {
    if (section === "from" && toTokens.length > 1) {
      setError(
        "You can't add multiple 'from' tokens when multiple 'to' tokens are selected."
      );
      return;
    }
    if (section === "to" && fromTokens.length > 1) {
      setError(
        "You can't add multiple 'to' tokens when multiple 'from' tokens are selected."
      );
      return;
    }
    setActiveInput(section);
    setShowTokenSelection(true);
    setError(null);
  };

  const renderTokenSection = (section, tokens) => (
    <div className="relative">
      <div className="absolute inset-0 rounded-[20px] p-[1px] bg-gradient-to-r from-[#03e1ff] to-[#03e1ff] via-transparent">
        <div className="w-full h-full bg-black rounded-[19px]" />
      </div>
      <div className="relative bg-black rounded-[20px] p-4">
        {tokens.length === 0 ? (
          <div
            className="text-[#878787] cursor-pointer"
            onClick={() => handleAddToken(section)}
          >
            {section === "from" ? "Trade this......" : "to that......"}
          </div>
        ) : (
          tokens.map((token, index) => (
            <div
              key={index}
              className="flex items-center justify-between mb-2 last:mb-0"
            >
              <div className="flex items-center bg-[#1E1E1E] rounded-full pr-2">
                <Image
                  src={token.logo}
                  alt={token.name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span className="text-white mr-2">{token.symbol}</span>
                <button
                  onClick={() => handleRemoveToken(section, index)}
                  className="text-[#03e1ff]"
                >
                  <X size={16} />
                </button>
              </div>
              <input
                type="text"
                value={token.value}
                onChange={(e) => {
                  const newTokens = [...tokens];
                  newTokens[index] = {
                    ...newTokens[index],
                    value: e.target.value,
                  };
                  section === "from"
                    ? setFromTokens(newTokens)
                    : setToTokens(newTokens);
                }}
                className="bg-transparent text-white text-right outline-none w-1/2"
                placeholder="0"
              />
            </div>
          ))
        )}
        {tokens.length > 0 && (
          <button
            onClick={() => handleAddToken(section)}
            className="text-[#03e1ff] mt-2 flex items-center justify-center w-6 h-6 rounded-full bg-[#1E1E1E] absolute bottom-4 right-4"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-[400px] bg-[#11101e] rounded-[30px] p-6 relative">
      <div className="absolute inset-0 rounded-[30px] p-[1px] bg-gradient-to-r from-[#03e1ff] to-[#03e1ff] via-transparent">
        <div className="w-full h-full bg-[#11101e] rounded-[29px]" />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between mb-6">
          <div className="flex space-x-2">
            <button className="text-white bg-black rounded-full p-2">
              <Settings size={16} />
            </button>
            <button className="text-white bg-black rounded-[30px] px-3 py-1 text-xs flex items-center">
              <BarChart2 size={12} className="mr-1" /> Slippage
            </button>
            <button className="text-white bg-black rounded-[30px] px-3 py-1 text-xs flex items-center">
              <Shield size={12} className="mr-1" /> MEV
            </button>
          </div>
          <button className="text-white bg-black rounded-full p-2">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="flex justify-end mb-4">
          <div className="text-white text-sm mr-2">Balance: 1234</div>
          <button className="bg-[#1E1E1E] text-[#03e1ff] text-xs rounded-full px-3 py-1 mr-2">
            HALF
          </button>
          <button className="bg-[#1E1E1E] text-[#03e1ff] text-xs rounded-full px-3 py-1">
            MAX
          </button>
        </div>

        <div className="space-y-4">
          {renderTokenSection("from", fromTokens)}

          <div className="flex justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 10L12 15L17 10"
                stroke="#03e1ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {renderTokenSection("to", toTokens)}
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <div className="relative mt-6">
          <div className="absolute inset-0 rounded-[20px] p-[1px] bg-gradient-to-r from-[#03e1ff] to-[#03e1ff] via-transparent">
            <div className="w-full h-full bg-black rounded-[19px]" />
          </div>
          <button className="relative w-full bg-black text-white font-semibold rounded-[20px] p-3">
            SWAP
          </button>
        </div>
      </div>
      {showTokenSelection && (
        <TokenSelection
          onSelect={handleTokenSelect}
          onClose={() => setShowTokenSelection(false)}
        />
      )}
    </div>
  );
}
