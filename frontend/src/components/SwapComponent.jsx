"use client";

import { useState, useCallback, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { BiGasPump, BiDollar, BiCoin } from "react-icons/bi";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { debounce } from "lodash";
import { fetchOneToOnePrice } from "@/service/jupiter-service";

const SwapComponent = ({ availableTokens }) => {
  // State for From Tokens
  const [fromTokens, setFromTokens] = useState([
    { token: "", value: "", uri: "", percentage: 100 },
  ]);

  // State for To Tokens
  const [toTokens, setToTokens] = useState([
    { token: "", value: "", uri: "", percentage: 100 },
  ]);

  // Additional States
  const [gasEstimate, setGasEstimate] = useState("963K (~$0.03)");
  const [minimumReceived, setMinimumReceived] = useState("2,332.7522 USD");
  const [isLoading, setIsLoading] = useState(false);

  // States for Search Inputs (Separate for From and To)
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  // Debounced Fetch Price Function
  const fetchPrice = useCallback(
    debounce(async (fromToken, toTokens, amount) => {
      if (!fromToken || !toTokens.length || !amount) return;

      setIsLoading(true);
      try {
        const results = await Promise.all(
          toTokens.map(async (toToken) => {
            const price = await fetchOneToOnePrice(fromToken, toToken.token);
            return {
              ...toToken,
              value: price * amount * (toToken.percentage / 100),
            };
          })
        );

        setToTokens(results);
      } catch (error) {
        console.error("Error fetching conversion:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  // Effect to Trigger Price Fetching
  useEffect(() => {
    if (
      fromTokens.some((token) => token.value) &&
      toTokens.some((token) => token.token)
    ) {
      fetchPrice(fromTokens[0]?.token, toTokens, fromTokens[0]?.value);
    }
  }, [fromTokens, toTokens, fetchPrice]);

  // Handler to Add a New Token
  const handleAddToken = (direction) => {
    const newTokens =
      direction === "from" ? [...fromTokens] : [...toTokens];
    const newToken = {
      token: "",
      value: "",
      uri: "",
      percentage: 100 / (newTokens.length + 1),
    };

    newTokens.push(newToken);
    updatePercentages(newTokens, direction);
  };

  // Handler to Delete a Token
  const handleDeleteToken = (index, direction) => {
    const newTokens =
      direction === "from"
        ? fromTokens.filter((_, i) => i !== index)
        : toTokens.filter((_, i) => i !== index);

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

  // Function to Update Percentages Uniformly
  const updatePercentages = (tokens, direction) => {
    const totalTokens = tokens.length;
    const newPercentage = 100 / totalTokens;

    tokens.forEach((token) => (token.percentage = newPercentage));

    if (direction === "from") {
      setFromTokens(tokens);
    } else {
      setToTokens(tokens);
    }
  };

  // Handler for Token Selection Change
  const handleTokenChange = (index, value, direction) => {
    let logoURI = null;
    const tokenEntry = availableTokens.find(
      (token) => token.symbol === value
    );
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

  // Handler for Value Change
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

  // Handler for Percentage Change
  const handlePercentageChange = (index, value, direction) => {
    const tokens =
      direction === "from" ? [...fromTokens] : [...toTokens];
    const totalTokens = tokens.length;

    tokens[index].percentage = value;

    // Adjust the other tokens
    const remainingTokens = tokens.filter((_, i) => i !== index);
    const remainingPercentage = 100 - value;
    remainingTokens.forEach((token) => {
      token.percentage = remainingPercentage / remainingTokens.length;
    });

    if (direction === "from") {
      setFromTokens(tokens);
    } else {
      setToTokens(tokens);
    }

    // Recalculate the total value for "from" tokens and trigger price conversion
    const totalFromValue = tokens.reduce((sum, token) => {
      return sum + token.value * (token.percentage / 100);
    }, 0);

    if (direction === "from") {
      fetchPrice(fromTokens[0]?.token, toTokens, totalFromValue);
    } else {
      fetchPrice(fromTokens[0]?.token, tokens, fromTokens[0]?.value);
    }
  };

  // Filtered Token Lists Based on Search Inputs
  const filteredFromTokens = availableTokens.filter((t) =>
    t.name.toLowerCase().includes(searchFrom.toLowerCase())
  );

  const filteredToTokens = availableTokens.filter((t) =>
    t.name.toLowerCase().includes(searchTo.toLowerCase())
  );

  // Function to Render Token Inputs
  // Function to Render Token Inputs
const renderTokenInputs = (tokens, direction) => {
  return tokens.map((token, index) => (
    <div key={index} className="space-y-4 mb-6 overflow-hidden">
      {/* Token Selection and Value Input */}
      <div className="flex flex-col space-y-2 overflow-hidden">
        <div className="flex items-center space-x-4">
          {/* Token Logo */}
          <img
            src={token.uri !== "" ? token.uri : "/path/to/placeholder-image.png"}
            alt="Token Logo"
            className="w-6 h-6 rounded-full"
          />
          <div className="flex flex-col w-full ">
            {/* Token Dropdown */}
            <select
              value={token.token}
              onChange={(e) =>
                handleTokenChange(index, e.target.value, direction)
              }
              className="bg-gray-800 rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option className="w-30" value="">
                Select Token
              </option>
              {(direction === "from"
                ? filteredFromTokens
                : filteredToTokens
              ).map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.name} ({t.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Amount Input */}
        <input
          type="number"
          value={token.value}
          onChange={(e) => handleValueChange(index, e.target.value, direction)}
          className="bg-gray-800 rounded-md py-2 px-3 w-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Amount"
        />
      </div>
      {/* Conditional Slider Rendering */}
      {token.token !== "" &&
        ((direction === "from" && fromTokens.length > 1) ||
          (direction === "to" && toTokens.length > 1)) && (
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
      )}
      {/* Delete Button */}
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
            + Add From Token
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
            + Add To Token
          </button>
        </div>

        {/* Minimum Received */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Minimum Received:</span>
          <span>{minimumReceived}</span>
        </div>

        {/* Connect Wallet Button */}
        <button
          onClick={() =>
            console.log("Swap initiated", { fromTokens, toTokens })
          }
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

          {/* Platform Fee Section */}
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
