"use client";

import { useState, useCallback, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { BiGasPump, BiDollar, BiCoin } from "react-icons/bi";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { debounce } from "lodash";
import { fetchOneToOnePrice } from "@/service/jupiter-service";
import { useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import useSolanaConnection from "@/app/hooks/useSolanaConnect";

const SwapComponent = ({ availableTokens }) => {
  const [fromTokens, setFromTokens] = useState([
    { token: "", value: "", uri: "", percentage: 100 },
  ]);
  const [toTokens, setToTokens] = useState([{ token: "", value: "", uri: "", percentage: 100 }]);
  const [gasEstimate, setGasEstimate] = useState("963K (~$0.03)");
  const [minimumReceived, setMinimumReceived] = useState("2,332.7522 USD");
  const [isLoading, setIsLoading] = useState(false);

  const wallet = useWallet();
  const connection = useSolanaConnection();

  const atomicSwap = (e) => {

    if(!wallet.connected || !wallet.signTransaction) {
      console.error(
        "Wallet is not connected or does not support signing transactions"
      );
      console.log(wallet)
      return;
    }

    console.log("Swap initiated", {fromTokens, toTokens})
    const fromToken = availableTokens.find((token) => token.symbol === fromTokens[0]?.token);
    const toToken = availableTokens.find((token) => token.symbol === toTokens[0]?.token);

    console.log({fromToken, toToken})

    fetch("/api/swap", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputMint: fromToken.address,
        outputMint: toToken.address,
        amount: fromTokens[0].value * Math.pow(10, fromToken.decimals),
        userPublicKey: wallet.publicKey?.toString()
      })
    })
    .then(async (res) => {
      try{
        const {swapTransaction} = await res.json();
        const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
        const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
        const signedTransaction = await wallet.signTransaction(transaction)

        const rawTransaction = signedTransaction.serialize();

        const transactionId = await connection.sendRawTransaction(rawTransaction, {
          skipPreflight: true, 
          maxRetries: 2
        });

        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: transactionId
        }, 'confirmed');


        alert("Swap Successful!");
        console.log(`https://solscan.io/tx/${transactionId}`);

      } catch (e){ 
        console.error("Failed to sign transaction: ", e);
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const fetchPrice = useCallback(
    debounce(async (fromToken, toTokens, amount) => {
      if (!fromToken || !toTokens.length || !amount) return;

      setIsLoading(true);
      try {
        const results = await Promise.all(toTokens.map(async (toToken) => {
          const price = await fetchOneToOnePrice(fromToken, toToken.token);
          return { ...toToken, value: price * amount * (toToken.percentage / 100) };
        }));

        setToTokens(results);
      } catch (error) {
        console.error("Error fetching conversion:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  // Monitor changes to fromTokens and toTokens to trigger recalculation
  useEffect(() => {
    if (fromTokens.some(token => token.value) && toTokens.some(token => token.token)) {
      fetchPrice(fromTokens[0]?.token, toTokens, fromTokens[0]?.value);
    }
  }, [fromTokens, toTokens, fetchPrice]);

  const handleAddToken = (direction) => {
    const newTokens = direction === "from" ? [...fromTokens] : [...toTokens];
    const newToken = { token: "", value: "", uri: "", percentage: 100 / (newTokens.length + 1) };

    newTokens.push(newToken);
    updatePercentages(newTokens, direction);
  };

  const handleDeleteToken = (index, direction) => {
    const newTokens = direction === "from" ? fromTokens.filter((_, i) => i !== index) : toTokens.filter((_, i) => i !== index);

    if (newTokens.length === 0) {
      newTokens.push({ token: "", value: "", uri: "", percentage: 100 });
    } else {
      updatePercentages(newTokens, direction);
    }

    if (direction === "from") {
      setFromTokens(newTokens);
    } else {
      setToTokens(newTokens);
    }
  };

  const updatePercentages = (tokens, direction) => {
    const totalTokens = tokens.length;
    const newPercentage = 100 / totalTokens;

    tokens.forEach(token => token.percentage = newPercentage);

    if (direction === "from") {
      setFromTokens(tokens);
    } else {
      setToTokens(tokens);
    }
  };

  const handleTokenChange = (index, value, direction) => {
    let logoURI = null;
    const tokenEntry = availableTokens.find((token) => token.symbol === value);
    if (tokenEntry) {
      logoURI = tokenEntry.logoURI;
    }

    if (direction === "from") {
      const newFromTokens = [...fromTokens];
      newFromTokens[index].token = value;
      newFromTokens[index].uri = logoURI ? logoURI : "";
      setFromTokens(newFromTokens);
    } else {
      const newToTokens = [...toTokens];
      newToTokens[index].token = value;
      newToTokens[index].uri = logoURI ? logoURI : "";
      setToTokens(newToTokens);
    }
  };

  const handleValueChange = (index, value, direction) => {
    if (direction === "from") {
      const newFromTokens = [...fromTokens];
      newFromTokens[index].value = value;
      setFromTokens(newFromTokens);

      fetchPrice(fromTokens[index].token, toTokens, value);
    } else {
      const newToTokens = [...toTokens];
      newToTokens[index].value = value;
      setToTokens(newToTokens);
    }
  };

  const handlePercentageChange = (index, value, direction) => {
  const tokens = direction === "from" ? [...fromTokens] : [...toTokens];
  const totalTokens = tokens.length;

  // Adjust the percentage of the selected token
  tokens[index].percentage = value;

  // Adjust the other tokens to make sure the total percentage is 100%
  const remainingTokens = tokens.filter((_, i) => i !== index);
  const remainingPercentage = 100 - value;
  remainingTokens.forEach((token, i) => {
    token.percentage = remainingPercentage / (totalTokens - 1);
  });

  // Update the correct state
  if (direction === "from") {
    setFromTokens(tokens);
  } else {
    setToTokens(tokens);
  }

  // Recalculate the total value for "from" tokens and trigger price conversion
  const totalFromValue = tokens.reduce((sum, token) => {
    return sum + (token.value * (token.percentage / 100));
  }, 0);

  if (direction === "from") {
    fetchPrice(fromTokens[0]?.token, toTokens, totalFromValue);
  } else {
    fetchPrice(fromTokens[0]?.token, tokens, fromTokens[0]?.value);
  }
};


  const renderTokenInputs = (tokens, direction) => {
    return tokens.map((token, index) => (
      <div key={index} className="space-y-4 mb-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-4">
            {token.uri !== "" && (
              <img
                src={token.uri}
                alt="Token Logo"
                className="w-6 h-6 rounded-full"
              />
            )}
            <select
              value={token.token}
              onChange={(e) =>
                handleTokenChange(index, e.target.value, direction)
              }
              className="bg-gray-800 rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option className="w-30" value="">Select Token</option>
              {availableTokens.map((t) => (
                <option key={t.address} value={t.symbol}>
                  {t.name} ({t.symbol})
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            value={token.value}
            onChange={(e) => handleValueChange(index, e.target.value, direction)}
            className="bg-gray-800 rounded-md py-2 px-3 w-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Amount"
          />
        </div>
        <div className="flex items-center">
          <Slider
            min={0}
            max={100}
            step={1}
            value={token.percentage}
            onChange={(value) => handlePercentageChange(index, value, direction)}
            className="w-3/4 mx-2"
          />
          <span className="text-gray-400">{token.percentage}%</span>
        </div>
        <button
          onClick={() => handleDeleteToken(index, direction)}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          aria-label="Delete token"
        >
          <FaTimes />
        </button>
      </div>
    ));
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Swap Tokens</h2>

      <div className="space-y-8">
        {/* From Section */}
        <div>
          <label className="block text-sm font-medium mb-2">From</label>
          {renderTokenInputs(fromTokens, "from")}
          <button
            onClick={() => handleAddToken("from")}
            className="text-blue-500 hover:text-blue-400 text-sm mt-2"
          >
            + Add Token
          </button>
        </div>

        {/* To Section */}
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          {renderTokenInputs(toTokens, "to")}
          <button
            onClick={() => handleAddToken("to")}
            className="text-blue-500 hover:text-blue-400 text-sm mt-2"
          >
            + Add Token
          </button>
        </div>

        {/* Minimum Received */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Minimum Received:</span>
          <span>{minimumReceived}</span>
        </div>

        {/* Connect Wallet Button */}
        <button
          onClick={atomicSwap}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
        >
          Swap Tokens
        </button>

        {/* Additional Sections */}
        <div className="flex flex-col space-y-4">
          {/* Gas Estimate Section */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <BiGasPump className="text-gray-400 mr-2" />
              <span className="text-gray-400">Gas Estimate</span>
            </div>
            <span>{gasEstimate}</span>
          </div>

          {/* Max Transaction Fee Section */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <BiDollar className="text-gray-400 mr-2" />
              <span className="text-gray-400">Max Transaction Fee</span>
            </div>
            <span>maxTransactionFee</span>
          </div>

          {/* Max Transaction Fee Section */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <BiDollar className="text-gray-400 mr-2" />
              <span className="text-gray-400">Platform Fee</span>
            </div>
            <span>0.01%</span>
          </div>

          {/* Deposit Section */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <BiCoin className="text-gray-400 mr-2" />
              <span className="text-gray-400">Deposit</span>
            </div>
            <span>deposit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapComponent;
