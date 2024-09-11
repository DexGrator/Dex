"use client";

import { useState, useEffect, useCallback } from "react";
import { FaEthereum, FaTimes } from "react-icons/fa";
import { BiGasPump } from "react-icons/bi";
import Image from "next/image";
import { debounce } from "lodash";
import { fetchOneToOnePrice } from "@/service/jupiter-service";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const SwapComponent = ({ availableTokens }) => {
  const [fromTokens, setFromTokens] = useState([
    { token: "", value: "", uri: "", percentage: 100 },
  ]);
  const [toTokens, setToTokens] = useState([{ token: "", value: "", uri: "", percentage: 100 }]);
  const [gasEstimate, setGasEstimate] = useState("963K (~$0.03)");
  const [minimumReceived, setMinimumReceived] = useState("2,332.7522 USD");

  const [isLoading, setIsLoading] = useState(false);

  const fetchPrice = useCallback(
    debounce(async (fromToken, toTokens, amount) => {
      if (!fromToken || !toTokens.length) return;

      setIsLoading(true);
      try {
        const results = await Promise.all(toTokens.map(async (toToken) => {
          const price = await fetchOneToOnePrice(toToken.token, fromToken);
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

      const totalPercentage = toTokens.reduce((sum, token) => sum + token.percentage, 0);
      if (totalPercentage !== 100) {
        alert("Percentage shares must total 100%");
        return;
      }

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

    // Calculate the new percentage values
    const newTokens = tokens.map((token, i) => {
      if (i === index) {
        return { ...token, percentage: value };
      }
      return { ...token, percentage: (100 - value) / (totalTokens - 1) };
    });

    if (direction === "from") {
      setFromTokens(newTokens);
    } else {
      setToTokens(newTokens);
    }

    const totalPercentage = newTokens.reduce((sum, token) => sum + token.percentage, 0);
    if (totalPercentage !== 100) {
      alert("Percentage shares must total 100%");
      return;
    }

    if (fromTokens[0]) {
      fetchPrice(fromTokens[0].token, newTokens, fromTokens[0].value);
    }
  };

  const renderTokenInputs = (tokens, direction) => {
    return tokens.map((token, index) => (
      <div key={index} className="flex items-center space-x-4 mb-4">
        <div className="flex items-center flex-grow">
          {token.uri !== "" && (
            <img
              src={token.uri}
              alt="Token Logo"
              className="w-6 h-6 mr-2 rounded-full"
            />
          )}
          <select
            value={token.token}
            onChange={(e) =>
              handleTokenChange(index, e.target.value, direction)
            }
            className="w-full bg-gray-800 rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Token</option>
            {availableTokens.map((t) => (
              <option key={t.symbol} value={t.symbol}>
                {t.name} ({t.symbol})
              </option>
            ))}
          </select>
        </div>
        <input
          type="number"
          value={token.value}
          onChange={(e) => handleValueChange(index, e.target.value, direction)}
          className="flex-grow bg-gray-800 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Amount"
        />
        <Slider
          min={0}
          max={100}
          step={1}
          value={token.percentage}
          onChange={(value) => handlePercentageChange(index, value, direction)}
          className="w-40 mx-2"
        />
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
    <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6">Swap Tokens</h2>

      <div className="space-y-6">
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
          onClick={() => console.log("Swap initiated", { fromTokens, toTokens })}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
        >
          Swap Tokens
        </button>

        {/* Gas Estimate */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <BiGasPump className="text-gray-400 mr-2" />
            <span className="text-gray-400">Gas Estimate</span>
          </div>
          <span>{gasEstimate}</span>
        </div>
      </div>
    </div>
  );
};

export default SwapComponent;
