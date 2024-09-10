import React from 'react';
import SwapComponent from '@/components/SwapComponent';
import Navbar from '@/components/Navbar';

const SwapPage = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto mt-8">
        <SwapComponent />
      </div>
    </div>
  );
};

export default SwapPage;