import React from 'react';
import { X, Lock, Plus } from 'lucide-react'; // Import any necessary icons
import Slider from './Slider'; // Adjust the path as needed




const renderTokenSection = (section, tokens, handleAddToken, handleRemoveToken, handleLockToggle, handleValueChange, handlePercentageChange, lockedTokens) => (
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
            <Slider
              percentage={token.percentage || 0}
              onPercentageChange={(newPercentage) => handlePercentageChange(index, newPercentage, section)}
              isLocked={lockedTokens[section][index]}
              isDisabled={tokens.length === 1}
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

export default renderTokenSection; // Export the function
