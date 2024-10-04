"use client"

import React, { useCallback, useEffect, useState, useRef } from "react";
import Image from 'next/image';
import { Settings, BarChart2, Shield, RefreshCw, X, Plus, Search, Lock } from 'lucide-react';
import { fetchOneToOnePrice } from "@/service/jupiter-service";
import { useWallet } from "@solana/wallet-adapter-react";
import useSolanaConnection from "@/app/hooks/useSolanaConnect";
import { TransactionExpiredBlockheightExceededError, VersionedTransaction } from "@solana/web3.js";
import debounce from "lodash.debounce";
import { motion, AnimatePresence } from "framer-motion";
import SettingsPopup from './SettingsPopup'
import SlippagePopup from './SlippagePopup'
import MEVPopup from './MEVPopup'
import TokenSelection from "./TokenSelection";
import Slider from "./Slider";



export default function NewSwap({ availableTokens }) {
  const [showTokenSelection, setShowTokenSelection] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [fromTokens, setFromTokens] = useState([]);
  const [toTokens, setToTokens] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lockedTokens, setLockedTokens] = useState({ from: {}, to: {} });
  const [showSettings, setShowSettings] = useState(false);
  const [showSlippage, setShowSlippage] = useState(false);
  const [showMEV, setShowMEV] = useState(false);
  const [balance, setBalance] = useState(0);

  const wallet = useWallet();
  const connection = useSolanaConnection();

  useEffect(() => {
    const fetchBalance = async () => {
      if (wallet.publicKey) {
        try {
          const walletBalance = await connection.getBalance(wallet.publicKey);
          setBalance(walletBalance / 1e9); 
        } catch (error) {
          console.error('Error fetching balance:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBalance();
  }, [wallet.publicKey, connection]);

  const [settings, setSettings] = useState({
    gasPrice: 50,
    gasPreset: 'normal',
    deadline: 30,
    expertMode: false,
  });

  const [slippage, setSlippage] = useState('auto');
  const [mevProtection, setMEVProtection] = useState(true);

  const handleSettingsChange = (newSettings) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  const handleSlippageChange = (newSlippage) => {
    setSlippage(newSlippage);
  };

  const handleMEVProtectionChange = (enabled) => {
    setMEVProtection(enabled);
  };

  const getAllSelectedTokenAddresses = () => {
    const fromAddresses = fromTokens.map(token => token.address);
    const toAddresses = toTokens.map(token => token.address);
    return [...fromAddresses, ...toAddresses];
  };

  const fetchPrice = useCallback(
    debounce(async (fromTokens, toTokens) => {
      console.log({fromTokens, toTokens})
      if ((!fromTokens.length && !toTokens.length)) return;
  
      setIsLoading(true);
      try {
        let results = [];
        let totalSolReceived = 0; // Variable to track total SOL received
  
        // Case 1: Multiple fromTokens and a single toToken (e.g., SOL)
        if (fromTokens.length > 1 && toTokens.length === 1) {
          const toToken = toTokens[0]; // This should be SOL
          
          // For each fromToken, calculate the value and sum it up
          const totalValue = await Promise.all(
            fromTokens.map(async (fromToken) => {
              const price = await fetchOneToOnePrice(fromToken.symbol, toToken.symbol); // Fetch price fromToken to SOL
              const solAmount = price * (fromToken.amount || 0); // Amount of SOL for each fromToken
              totalSolReceived += solAmount; // Add up the SOL amounts
              return solAmount;
            })
          );
  
          // Set the single toToken's value based on the total of fromTokens
          results = [
            {
              ...toToken,
              value: parseFloat(totalSolReceived.toFixed(toToken.decimals)), // Adjust decimals as per toToken's requirement
            },
          ];
  
          console.log(`Total SOL received: ${totalSolReceived}`);
        }
  
        // Case 2: Single fromToken and multiple toTokens
        else if (fromTokens.length === 1 && toTokens.length > 1) {
          const fromToken = fromTokens[0];
  
          results = await Promise.all(
            toTokens.map(async (toToken) => {
              const price = await fetchOneToOnePrice(fromToken.symbol, toToken.symbol);
              
              // Calculate the value of each toToken based on its percentage
              const value = price * fromToken.amount * ((toToken.percentage || 100) / 100);
              
              return {
                ...toToken,
                value: parseFloat(value.toFixed(toToken.decimals)), // Adjust decimals as per toToken's requirement
              };
            })
          );
        }
  
        // Case 3: One fromToken and one toToken (direct 1:1 swap)
        else if (fromTokens.length === 1 && toTokens.length === 1) {
          const fromToken = fromTokens[0];
          const toToken = toTokens[0];
  
          // Fetch the price from fromToken to toToken
          const price = await fetchOneToOnePrice(fromToken.symbol, toToken.symbol);
  
          // Calculate the final amount for the swap
          const finalValue = price * amount;
  
          // Set the result with decimals handled
          results = [
            {
              ...toToken,
              value: parseFloat(finalValue.toFixed(toToken.decimals)), // Adjust to appropriate decimals
            },
          ];
  
          console.log(`Final value of ${toToken.symbol} received: ${finalValue}`);
        }
  
        // Only update toTokens if results were generated
        if (results.length > 0) {
          setToTokens(results);
        }
      } catch (error) {
        console.error("Error fetching conversion:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const atomicSwap = async () => {
    if (!wallet.connected || !wallet.signTransaction) {
      console.error("Wallet is not connected or does not support signing transactions");
      return;
    }
  
    console.log("Swap initiated", { fromTokens, toTokens });
  
    // Map new toTokens with correct address from availableTokens
    const newToTokens = toTokens.map((token) => {
      const availToken = availableTokens.find((tkn) => tkn.symbol === token.symbol);
      return {
        ...token,
        address: availToken.address,
      };
    });
  
    console.log({ fromTokens, newToTokens });
  
    // Fetch transactions from the backend API
    fetch("/api/swapv2", {
      method: "POST",
      body: JSON.stringify({
        fromTokens: fromTokens,
        toTokens: newToTokens,
        publicKey: wallet.publicKey?.toString(),
      }),
    })
      .then(async (res) => {
        try {
          // Response contains the swap transactions
          const { swapTransactions } = await res.json();
          console.log({ swapTransactions });
  
          // Sign and serialize transactions
          const signedTransactions = await Promise.all(
            swapTransactions.map(async ({ transaction }) => {
              const swapTransactionBuf = Buffer.from(transaction.swapTransaction, 'base64');
              const transact = VersionedTransaction.deserialize(swapTransactionBuf);
              const signedTransaction = await wallet.signTransaction(transact);
              return signedTransaction.serialize();
            })
          );
  
          // Helper function to confirm transaction
          const confirmTransaction = async (transactionId) => {
            const latestBlockHash = await connection.getLatestBlockhash();
            await connection.confirmTransaction(
              {
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: transactionId,
              },
              "confirmed"
            );
            console.log(`https://solscan.io/tx/${transactionId}`)

          };
  
          // Send and confirm transactions
          let transactionIds = await Promise.all(
            signedTransactions.map(async (rawTransaction, index) => {
              try {
                const transactionId = await connection.sendRawTransaction(rawTransaction, {
                  skipPreflight: true,
                  maxRetries: 2,
                });
                console.log(`https://solscan.io/tx/${transactionId}`);
                await confirmTransaction(transactionId);
                return { success: true, transactionId };
              } catch (error) {
                console.error(`Failed to send transaction ${index + 1}:`, error);
                return { success: false, index, error };
              }
            })
          );
  
          // Identify failed transactions and ask for user confirmation to retry
          const failedTransactions = transactionIds.filter((t) => !t.success);
          if (failedTransactions.length) {
            const ans = confirm(
              `${failedTransactions.length} transaction(s) failed. Do you want to retry?`
            );
  
            if (ans) {
              for (const { index } of failedTransactions) {
                try {
                  const retryTransactionId = await connection.sendRawTransaction(
                    signedTransactions[index],
                    {
                      skipPreflight: true,
                      maxRetries: 2,
                    }
                  );
                  console.log(`Retried transaction: https://solscan.io/tx/${retryTransactionId}`);
                  await confirmTransaction(retryTransactionId);
                } catch (retryError) {
                  console.error(`Retry for transaction ${index + 1} failed:`, retryError);
                }
              }
            }
          }
  
          // Notify success or partial success
          if (failedTransactions.length === 0) {
            alert("Multi-Token Swap Successful!");
          } else {
            alert(
              `Swap partially successful! ${failedTransactions.length} transaction(s) failed. Check console for details.`
            );
          }
        } catch (e) {
          console.error("Failed to sign or send transactions: ", e);
        }
      });
  };

  const handleValueChange = (index, value, direction) => {
    if (direction === "from") {
        const newFromTokens = [...fromTokens];
        newFromTokens[index].amount = value;
      console.log({newFromTokens});
      setFromTokens(newFromTokens);
      console.log({fromTokens});
      fetchPrice(fromTokens, toTokens);
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
    fetchPrice(fromTokens, toTokens);
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
    fetchPrice(fromTokens, toTokens);
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
    fetchPrice(fromTokens, toTokens)
    setError(null);
  };


  const handlePercentageChange = (index, newPercentage, section) => {
    let newTokens = section === 'from' ? [...fromTokens] : [...toTokens];
    
    // Handle negative percentages by setting to 0
    newPercentage = Math.max(0, newPercentage);
  
    // Calculate the total percentage of locked tokens
    const lockedPercentage = newTokens.reduce((sum, token, i) => 
      sum + (lockedTokens[section][i] ? token.percentage : 0), 0);
  
    // If the current token is locked, unlock it
    if (lockedTokens[section][index]) {
      setLockedTokens(prev => ({
        ...prev,
        [section]: { ...prev[section], [index]: false }
      }));
    }
  
    // Set the new percentage for the current token
    newTokens[index].percentage = newPercentage;
  
    // Calculate the remaining percentage to distribute
    let remainingPercentage = 100 - lockedPercentage - newPercentage;
  
    // Get unlocked tokens excluding the current one
    const unlockedTokens = newTokens.filter((_, i) => i !== index && !lockedTokens[section][i]);
  
    if (unlockedTokens.length > 0) {
      // Distribute the remaining percentage proportionally among unlocked tokens
      const totalUnlockedPercentage = unlockedTokens.reduce((sum, token) => sum + token.percentage, 0);
  
      unlockedTokens.forEach((token) => {
        const tokenIndex = newTokens.indexOf(token);
        if (totalUnlockedPercentage > 0) {
          const adjustedPercentage = (token.percentage / totalUnlockedPercentage) * remainingPercentage;
          newTokens[tokenIndex].percentage = Math.max(0, adjustedPercentage);
        } else {
          // If all unlocked tokens were at 0%, distribute evenly
          newTokens[tokenIndex].percentage = Math.max(0, remainingPercentage / unlockedTokens.length);
        }
      });
    }
  
    // Ensure the total is exactly 100%
    const total = newTokens.reduce((sum, token) => sum + token.percentage, 0);
    if (total !== 100) {
      const diff = 100 - total;
      // Distribute the difference among unlocked tokens
      const unlockedIndices = newTokens.map((_, i) => i).filter(i => !lockedTokens[section][i]);
      if (unlockedIndices.length > 0) {
        const adjustmentPerToken = diff / unlockedIndices.length;
        unlockedIndices.forEach(i => {
          newTokens[i].percentage = Math.max(0, newTokens[i].percentage + adjustmentPerToken);
        });
      }
    }
  
    // Round percentages to two decimal places
    newTokens.forEach(token => {
      token.percentage = Math.round(token.percentage * 100) / 100;
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
                  type="number"
                  value={token.percentage}
                  onChange={(e) => {
                    const newPercentage = parseFloat(e.target.value);
                    if (!isNaN(newPercentage)) {
                      handlePercentageChange(index, newPercentage, section);
                    }
                  }}
                  className="bg-transparent text-[#878787] text-right outline-none w-16 text-xs"
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <span className="text-[#878787] text-xs ml-0.5">%</span>
              </div>
              <Slider
                percentage={token.percentage || 0}
                onPercentageChange={(newPercentage) => handlePercentageChange(index, newPercentage, section)}
                isLocked={lockedTokens[section][index]}
                isDisabled={tokens.length === 1 || lockedTokens[section][index]}
              />
            </div>
          </div>
        ))
      )}
      {tokens.length > 0 && tokens.length < 5 && (
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
          <button onClick={() => setShowSettings(true)} className="text-white bg-black rounded-full p-2">
              <Settings size={16} />
            </button>
            <button onClick={() => setShowSlippage(true)} className="text-white bg-black rounded-[30px] px-3 py-1 text-xs flex items-center">
              <BarChart2 size={12} className="mr-1" /> Slippage
            </button>
            <button onClick={() => setShowMEV(true)} className="text-white bg-black rounded-[30px] px-3 py-1 text-xs flex items-center">
              <Shield size={12} className="mr-1" /> MEV
            </button>
          </div>
          <button className="text-white bg-black rounded-full p-2">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="flex justify-end mb-4">
            {loading ? (
            <div className="text-white text-sm mr-2">Loading balance...</div>
          ) : (
            <div className="text-white text-sm mr-2">Balance: {balance.toFixed(5)}</div>
          )}
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
          <button 
          onClick={atomicSwap}
          className="relative w-full bg-black text-white font-semibold rounded-[20px] p-3">
            SWAP
          </button>
        </div>
        
        
      </div>
      
      {showTokenSelection && (
        <TokenSelection 
          onSelect={handleTokenSelect} 
          onClose={() => setShowTokenSelection(false)} 
          availableTokens={availableTokens}
          selectedTokens={getAllSelectedTokenAddresses()}
        />
      )}
      {showSettings && (
        <SettingsPopup
          onClose={() => setShowSettings(false)}
          onSettingsChange={handleSettingsChange}
        />
      )}
      {showSlippage && (
        <SlippagePopup
          onClose={() => setShowSlippage(false)}
          onSlippageChange={handleSlippageChange}
        />
      )}
      {showMEV && (
        <MEVPopup
          onClose={() => setShowMEV(false)}
          onMEVProtectionChange={handleMEVProtectionChange}
        />
      )}
    </div>
  );
}
