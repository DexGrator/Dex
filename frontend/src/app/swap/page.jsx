import React from 'react';
import SwapComponent from '@/components/SwapComponent';
import Navbar from '@/components/Navbar';
import { fetchAvailableTokens } from '@/service/jupiter-service';

const SwapPage = async () => {

  const availableTokens = await fetchAvailableTokens();

  return (
    <div className="bg-[#021524]"> 
      <Navbar />
      <div className="flex justify-center items-center min-h-screen" style={{ paddingTop: '0.5rem' }}>
        <div className="w-full max-w-lg">
          <SwapComponent availableTokens={availableTokens} />
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
