"use client"

import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { Settings, BarChart2, Shield, RefreshCw, X, Plus, Search, Lock } from 'lucide-react';
import { fetchOneToOnePrice } from "@/service/jupiter-service";
import { useWallet } from "@solana/wallet-adapter-react";
import useSolanaConnection from "@/app/hooks/useSolanaConnect";
import { VersionedTransaction } from "@solana/web3.js";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";

const TokenSelection = ({ onSelect, onClose, availableTokens }) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredTokens = availableTokens.filter(token => 
    token.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg p-4 w-80 max-h-[80vh] overflow-y-auto">
        <h2 className="text-white text-lg font-semibold mb-4">Select Token</h2>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-[#2C2C2C] text-white rounded-md p-2 pl-8"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
        {filteredTokens.map((token) => (
          <div
            key={token.address}
            className="flex items-center p-2 hover:bg-[#2C2C2C] cursor-pointer rounded"
            onClick={() => {
              onSelect(token);
              onClose();
            }}
          >
            <img src={token.logoURI} alt={token.name} width={24} height={24} className="mr-2" />
            <span className="text-white mr-2">{token.symbol}</span>
            <span className="text-gray-400 text-sm">{token.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function NewSwap({ availableTokens }) {
  const [showTokenSelection, setShowTokenSelection] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [fromTokens, setFromTokens] = useState([]);
  const [toTokens, setToTokens] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setIsLoading] = useState(false);
  const [lockedTokens, setLockedTokens] = useState({ from: {}, to: {} });

  const wallet = useWallet();
  const connection = useSolanaConnection();

  const fetchPrice = useCallback(
    debounce(async (fromTokens, toTokens, amount) => {
      if (!fromTokens.length || !toTokens.length || !amount) return;
  
      setIsLoading(true);
      try {
        const results = await Promise.all(
          fromTokens.map(async (fromToken) => {
            return Promise.all(
              toTokens.map(async (toToken) => {
                const price = await fetchOneToOnePrice(fromToken.symbol, toToken.symbol);
                return {
                  ...toToken,
                  value: price * amount * (toToken.percentage / 100),
                  fromToken: fromToken.symbol,
                };
              })
            );
          })
        );
  
        const flattenedResults = results.flat().filter(result => result !== null);
        setToTokens(flattenedResults);
      } catch (error) {
        console.error("Error fetching conversion:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleValueChange = (index, value, direction) => {
    if (direction === "from") {
      const newFromTokens = [...fromTokens];
      newFromTokens[index].amount = value;
      setFromTokens(newFromTokens);
      fetchPrice(fromTokens, toTokens, value);
    } else {
      const newToTokens = [...toTokens];
      newToTokens[index].amount = value;
      setToTokens(newToTokens);
    }
  };

  const handleTokenSelect = (token) => {
    if (activeInput === 'from') {
      if (toTokens.length > 1) {
        setError("You can only select one token when multiple 'to' tokens are selected.");
        setShowTokenSelection(false);
        return;
      }
      const newToken = { ...token, percentage: fromTokens.length === 0 ? 100 : 0 };
      setFromTokens([...fromTokens, newToken]);
    } else if (activeInput === 'to') {
      if (fromTokens.length > 1) {
        setError("You can only select one 'to' token when multiple 'from' tokens are selected.");
        setShowTokenSelection(false);
        return;
      }
      const newToken = { ...token, percentage: toTokens.length === 0 ? 100 : 0 };
      setToTokens([...toTokens, newToken]);
    }
    setShowTokenSelection(false);
    setError(null);
  };

  const handleRemoveToken = (section, index) => {
    if (section === 'from') {
      const newFromTokens = fromTokens.filter((_, i) => i !== index);
      const totalPercentage = newFromTokens.reduce((sum, token) => sum + (token.percentage || 0), 0);
      setFromTokens(newFromTokens.map(token => ({
        ...token,
        percentage: totalPercentage === 0 ? 100 / newFromTokens.length : (token.percentage / totalPercentage) * 100
      })));
    } else {
      const newToTokens = toTokens.filter((_, i) => i !== index);
      const totalPercentage = newToTokens.reduce((sum, token) => sum + (token.percentage || 0), 0);
      setToTokens(newToTokens.map(token => ({
        ...token,
        percentage: totalPercentage === 0 ? 100 / newToTokens.length : (token.percentage / totalPercentage) * 100
      })));
    }
    setError(null);
  };

  const handleAddToken = (section) => {
    if (section === 'from' && toTokens.length > 1) {
      setError("You can't add multiple 'from' tokens when multiple 'to' tokens are selected.");
      return;
    }
    if (section === 'to' && fromTokens.length > 1) {
      setError("You can't add multiple 'to' tokens when multiple 'from' tokens are selected.");
      return;
    }
    setActiveInput(section);
    setShowTokenSelection(true);
    setError(null);
  };

  const handlePercentageChange = (index, percentage, section) => {
    const newTokens = section === 'from' ? [...fromTokens] : [...toTokens];
    const oldPercentage = newTokens[index].percentage || 0;
    const percentageDiff = percentage - oldPercentage;
  
    newTokens[index] = { ...newTokens[index], percentage };
  
    const unlockedTokens = newTokens.filter((_, i) => i !== index && !lockedTokens[section][i]);
    const totalUnlockedPercentage = unlockedTokens.reduce((sum, token) => sum + (token.percentage || 0), 0);
  
    unlockedTokens.forEach((token) => {
      const tokenIndex = newTokens.indexOf(token);
      if (totalUnlockedPercentage > 0) {
        const newTokenPercentage = Math.max(0, (token.percentage / totalUnlockedPercentage) * (totalUnlockedPercentage - percentageDiff));
        newTokens[tokenIndex] = { ...token, percentage: newTokenPercentage };
      } else {
        newTokens[tokenIndex] = { ...token, percentage: 0 };
      }
    });
  
    if (section === 'from') {
      setFromTokens(newTokens);
    } else {
      setToTokens(newTokens);
    }
  };

  const handleLockToggle = (section, index) => {
    setLockedTokens(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [index]: !prev[section][index]
      }
    }));
  };

  const CircularSlider = ({ percentage, onPercentageChange, isLocked }) => {
    const [targetPercentage, setTargetPercentage] = useState(percentage);
  
    // Function to simulate a physical scale movement
    const handleScaleChange = (e) => {
      if (!isLocked) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const newPercentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setTargetPercentage(newPercentage);
        onPercentageChange(newPercentage);
      }
    };
  
    return (
      <div
        className="relative w-full h-8 bg-[#1E1E1E] rounded-lg cursor-pointer overflow-hidden"
        onClick={handleScaleChange} // Change happens on click
      >
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between px-2">
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className={`w-0.5 h-4 bg-white transition-opacity duration-300 ${
                i * 10 <= targetPercentage ? "opacity-100" : "opacity-30"
              }`}
            />
          ))}
        </div>
  
        {/* The blue background to indicate the scale's "fill" */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-[#03e1ff] rounded-lg opacity-30"
          style={{ width: `${targetPercentage}%` }}
          animate={{ width: `${targetPercentage}%` }} // Smoothly animating the fill
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
  
        {/* The moving handle simulating the swinging effect */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center"
          style={{ left: `calc(${targetPercentage}% - 12px)` }}
          animate={{ left: `calc(${targetPercentage}% - 12px)` }} // Animating handle movement
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    );
  };

  const renderTokenSection = (section, tokens) => (
    <div className="space-y-4">
      {tokens.length === 0 ? (
        <div
          className="text-[#878787] cursor-pointer bg-black rounded-[20px] p-4"
          onClick={() => handleAddToken(section)}
        >
          {section === 'from' ? 'Trade this......' : 'to that......'}
        </div>
      ) : (
        tokens.map((token, index) => (
          <div 
            key={index} 
            className="relative bg-black rounded-[20px] p-4"
          >
            <div className="absolute inset-0 rounded-[20px] p-[1px] bg-gradient-to-r from-[#03e1ff] to-[#03e1ff] via-transparent">
              <div className="w-full h-full bg-black rounded-[19px]" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center bg-[#1E1E1E] rounded-full pr-2">
                  <img src={token.logoURI} alt={token.name} width={24} height={24} className="mr-2" />
                  <span className="text-white mr-2">{token.symbol}</span>
                  <button
                    onClick={() => handleRemoveToken(section, index)}
                    className="text-[#03e1ff]"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleLockToggle(section, index)}
                    className={`mr-2 ${lockedTokens[section][index] ? 'text-[#03e1ff]' : 'text-gray-500'}`}
                  >
                    <Lock size={16} />
                  </button>
                  <input
                    type="text"
                    value={token.value}
                    onChange={(e) => handleValueChange(index, e.target.value, section)}
                    className="bg-transparent text-white text-right outline-none w-24"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex justify-end mb-2">
                <input
                  type="text"
                  value={`${token.percentage?.toFixed(2) || 0}%`}
                  onChange={(e) => {
                    const newPercentage = parseFloat(e.target.value);
                    if (!isNaN(newPercentage) && newPercentage >= 0 && newPercentage <= 100) {
                      handlePercentageChange(index, newPercentage, section);
                    }
                  }}
                  className="bg-transparent text-[#878787] text-right outline-none w-16 text-xs"
                  placeholder="0%"
                />
              </div>
              <CircularSlider
                percentage={token.percentage || 0}
                onPercentageChange={(newPercentage) => handlePercentageChange(index, newPercentage, section)}
                isLocked={lockedTokens[section][index]}
              />
            </div>
          </div>
        ))
      )}
      {tokens.length > 0 && (
        <button
          onClick={() => handleAddToken(section)}
          className="text-[#03e1ff] mt-2 flex items-center justify-center w-6 h-6 rounded-full bg-[#1E1E1E] mx-auto"
        >
          <Plus size={16} />
        </button>
      )}
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
          <button className="bg-[#1E1E1E] text-[#03e1ff] text-xs rounded-full px-3 py-1 mr-2">HALF</button>
          <button className="bg-[#1E1E1E] text-[#03e1ff] text-xs rounded-full px-3 py-1">MAX</button>
        </div>

        <div className="space-y-4">
          {renderTokenSection('from', fromTokens)}

          <div className="flex justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="#03e1ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {renderTokenSection('to', toTokens)}
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}

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
          availableTokens={availableTokens}
        />
      )}
    </div>
  );
}