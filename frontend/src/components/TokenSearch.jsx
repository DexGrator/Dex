import { useState } from 'react';
import Image from 'next/image';

const TokenSearch = ({ tokens, onSelectToken }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search tokens..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full bg-gray-800 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {searchTerm && (
        <div className="absolute top-full left-0 w-full bg-gray-800 rounded-md mt-2 max-h-60 overflow-auto z-10">
          {filteredTokens.length ? (
            filteredTokens.map((token) => (
              <div
                key={token.symbol}
                onClick={() => onSelectToken(token)}
                className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
              >
                <Image
                  src={token.logoURI}
                  alt={token.symbol}
                  width={24}
                  height={24}
                  className="mr-2 rounded-full"
                />
                <span className="text-white">{token.name} ({token.symbol})</span>
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-400">No tokens found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenSearch;
