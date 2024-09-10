"use client";

import { useState, useEffect, useCallback } from "react";
import { FaEthereum, FaTimes } from "react-icons/fa";
import { BiGasPump } from "react-icons/bi";
import Image from "next/image";
import { debounce } from "lodash";
import { fetchOneToOnePrice } from "@/service/jupiter-service";

const SwapComponent = ({ availableTokens }) => {
  const [fromTokens, setFromTokens] = useState([
    { token: "", value: "", uri: "" },
  ]);
  const [toTokens, setToTokens] = useState([{ token: "", value: "", uri: "" }]);
  const [gasEstimate, setGasEstimate] = useState("963K (~$0.03)");
  const [minimumReceived, setMinimumReceived] = useState("2,332.7522 USD");

  const [isLoading, setIsLoading] = useState(false);

  const fetchPrice = useCallback(
    debounce(async (fromToken, toToken, amount) => {
      if (!fromToken || !toToken) return;

      setIsLoading(true);
      try {
        const price = await fetchOneToOnePrice(fromToken, toToken);

    
        setToTokens((prevTokens) => {
          const newTokens = [...prevTokens];
          newTokens[0].value = amount ? price*amount : '';
          return newTokens;
        });
      } catch (error) {
        console.error("Error fetching conversion:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleAddToken = (direction) => {
    if (direction === "from") {
      setFromTokens([...fromTokens, { token: "", value: "", uri: "" }]);
    } else {
      setToTokens([...toTokens, { token: "", value: "", uri: "" }]);
    }
  };

  const handleDeleteToken = (index, direction) => {
    if (direction === "from") {
      const newFromTokens = fromTokens.filter((_, i) => i !== index);
      setFromTokens(
        newFromTokens.length
          ? newFromTokens
          : [{ token: "", value: "", uri: "" }]
      );
    } else {
      const newToTokens = toTokens.filter((_, i) => i !== index);
      setToTokens(
        newToTokens.length ? newToTokens : [{ token: "", value: "", uri: "" }]
      );
    }
  };

  const handleTokenChange = (index, value, direction) => {
    let logoURI = null;
    console.log("HELLO");
    const tokenEntry = availableTokens.find((token) => token.symbol === value);
    console.log(tokenEntry);
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
      console.log("HELLO WORLD")
      if(toTokens[0]) {
        console.log("HELLo")
        fetchPrice(fromTokens[0].token, toTokens[0].token, value);
      }

    } else {
      const newToTokens = [...toTokens];
      newToTokens[index].value = value;
      setToTokens(newToTokens);
    }
  };

  const handleSwap = () => {
    // TODO: Implement swap logic
    console.log("Swap initiated", { fromTokens, toTokens });
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
            + Select Multiple Tokens
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
            + Select Multiple Tokens
          </button>
        </div>

        {/* Minimum Received */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Minimum Received:</span>
          <span>{minimumReceived}</span>
        </div>

        {/* Connect Wallet Button */}
        <button
          onClick={handleSwap}
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
