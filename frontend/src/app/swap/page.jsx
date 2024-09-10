import React from 'react';
import SwapComponent from '@/components/SwapComponent';
import Navbar from '@/components/Navbar';
import { fetchAvailableTokens } from '@/service/jupiter-service';

const SwapPage = async () => {

  const availableTokens = await fetchAvailableTokens();

  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        <SwapComponent availableTokens={availableTokens}/>
      </div>
    </div>
  );
};

export default SwapPage;