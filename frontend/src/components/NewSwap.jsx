"use client"
import React ,{ useCallback, useEffect, useState } from "react";
import Image from 'next/image';
import { Settings, BarChart2, Shield, RefreshCw, X, Plus, Search ,Lock} from 'lucide-react';
import { fetchOneToOnePrice } from "@/service/jupiter-service"; // Your price fetching logic
import { useWallet } from "@solana/wallet-adapter-react";
import useSolanaConnection from "@/app/hooks/useSolanaConnect";
import { TransactionExpiredBlockheightExceededError, VersionedTransaction } from "@solana/web3.js";
import debounce from "lodash.debounce";

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

  const wallet = useWallet();
  const connection = useSolanaConnection();


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
      console.log("HELLO WORLD")
      setFromTokens([...fromTokens, token]); 
    } else if (activeInput === 'to') {
      if (fromTokens.length > 1) {
        setError("You can only select one 'to' token when multiple 'from' tokens are selected.");
        setShowTokenSelection(false);
        return;
      }
      setToTokens([...toTokens, token]);
    }
    setShowTokenSelection(false);
    fetchPrice(fromTokens, toTokens);
    setError(null);
  };

  const handleRemoveToken = (section, index) => {
    if (section === 'from') {
      setFromTokens(fromTokens.filter((_, i) => i !== index));
    } else {
      setToTokens(toTokens.filter((_, i) => i !== index));
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
          <div key={index} className="relative bg-black rounded-[20px] p-4">
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
                <div className="flex right-9">
                  <Lock size={16} className="text-[#03e1ff] " />
                  <input
                    type="text"
                    value={token.value}
                    onChange={(e) => {
                      const newTokens = [...tokens];
                      newTokens[index] = { ...newTokens[index], value: e.target.value };
                      section === 'from' ? setFromTokens(newTokens) : setToTokens(newTokens);
                      handleValueChange(index, e.target.value, section);
                    }}
                    className="bg-transparent text-white text-right outline-none w-24"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <input
                  type="text"
                  value={token.percentage || ''}
                  onChange={(e) => {
                    const newTokens = [...tokens];
                    newTokens[index] = { ...newTokens[index], percentage: e.target.value };
                    section === 'from' ? setFromTokens(newTokens) : setToTokens(newTokens);
                  }}
                  className="bg-transparent text-[#878787] text-right outline-none w-16 text-xs"
                  placeholder="0%"
                />
              </div>
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
        />
      )}
    </div>
  );
}