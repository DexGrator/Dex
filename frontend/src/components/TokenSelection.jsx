import React, { useState } from 'react';
import { Search } from 'lucide-react'; // Adjust the import based on where the Search component is located

const TokenSelection = ({ onSelect, onClose, availableTokens, selectedTokens }) => {
  const [searchValue, setSearchValue] = useState("");

  const filteredTokens = availableTokens.filter(token => 
    !selectedTokens.includes(token.address) &&
    (token.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchValue.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] rounded-lg p-4 w-80 max-h-[80vh] overflow-y-auto relative">
        <h2 className="text-white text-lg font-semibold mb-4 flex justify-between items-center">
          <span>Select Token</span>
          <button
            className="text-gray-400 hover:text-white transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </h2>
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

export default TokenSelection;
