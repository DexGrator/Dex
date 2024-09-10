"use client"

import { useState, useEffect } from 'react';
import { FaEthereum, FaTimes } from 'react-icons/fa';
import { BiGasPump } from 'react-icons/bi';

const SwapComponent = () => {
  const [fromTokens, setFromTokens] = useState([{ token: 'ETH', value: '1' }]);
  const [toTokens, setToTokens] = useState([{ token: 'aArbAAVE', value: '17.0603' }]);
  const [gasEstimate, setGasEstimate] = useState('963K (~$0.03)');
  const [minimumReceived, setMinimumReceived] = useState('2,332.7522 USD');
  const [availableTokens, setAvailableTokens] = useState([]);

  useEffect(() => {
    fetchAvailableTokens();
  }, []);

  const fetchAvailableTokens = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await new Promise(resolve => setTimeout(() => resolve([
        { symbol: 'ETH', name: 'Ethereum' },
        { symbol: 'aArbAAVE', name: 'Arbirtrum AAVE' },
        { symbol: 'USDC', name: 'USD Coin' },
        { symbol: 'WBTC', name: 'Wrapped Bitcoin' },
      ]), 1000));
      setAvailableTokens(response);
    } catch (error) {
      console.error('Error fetching available tokens:', error);
    }
  };

  const handleAddToken = (direction) => {
    if (direction === 'from') {
      setFromTokens([...fromTokens, { token: '', value: '' }]);
    } else {
      setToTokens([...toTokens, { token: '', value: '' }]);
    }
  };

  const handleDeleteToken = (index, direction) => {
    if (direction === 'from') {
      const newFromTokens = fromTokens.filter((_, i) => i !== index);
      setFromTokens(newFromTokens.length ? newFromTokens : [{ token: '', value: '' }]);
    } else {
      const newToTokens = toTokens.filter((_, i) => i !== index);
      setToTokens(newToTokens.length ? newToTokens : [{ token: '', value: '' }]);
    }
  };

  const handleTokenChange = (index, value, direction) => {
    if (direction === 'from') {
      const newFromTokens = [...fromTokens];
      newFromTokens[index].token = value;
      setFromTokens(newFromTokens);
    } else {
      const newToTokens = [...toTokens];
      newToTokens[index].token = value;
      setToTokens(newToTokens);
    }
  };

  const handleValueChange = (index, value, direction) => {
    if (direction === 'from') {
      const newFromTokens = [...fromTokens];
      newFromTokens[index].value = value;
      setFromTokens(newFromTokens);
    } else {
      const newToTokens = [...toTokens];
      newToTokens[index].value = value;
      setToTokens(newToTokens);
    }
  };

  const handleSwap = () => {
    // TODO: Implement swap logic
    console.log('Swap initiated', { fromTokens, toTokens });
  };

  const renderTokenInputs = (tokens, direction) => {
    return tokens.map((token, index) => (
      <div key={index} className="flex items-center space-x-4 mb-4">
        <div className="relative flex-grow">
          <select
            value={token.token}
            onChange={(e) => handleTokenChange(index, e.target.value, direction)}
            className="w-full bg-gray-800 rounded-md py-2 pl-10 pr-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Token</option>
            {availableTokens.map((t) => (
              <option key={t.symbol} value={t.symbol}>{t.name} ({t.symbol})</option>
            ))}
          </select>
          <FaEthereum className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
          {renderTokenInputs(fromTokens, 'from')}
          <button
            onClick={() => handleAddToken('from')}
            className="text-blue-500 hover:text-blue-400 text-sm mt-2"
          >
            + Select Multiple Tokens
          </button>
        </div>

        {/* To Section */}
        <div>
          <label className="block text-sm font-medium mb-2">To</label>
          {renderTokenInputs(toTokens, 'to')}
          <button
            onClick={() => handleAddToken('to')}
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