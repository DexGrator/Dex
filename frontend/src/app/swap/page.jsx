"use client"
import React, { useEffect, useState } from 'react';
import SwapComponent from '@/components/SwapComponent';
import Navbar from '@/components/Navbar';
import { fetchAvailableTokens } from '@/service/jupiter-service';

const SwapPage = () => {
  const [availableTokens, setAvailableTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokens = await fetchAvailableTokens();
        setAvailableTokens(tokens);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTokens();
  }, []);

  return (
    <div className="bg-[#021524]">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen" style={{ paddingTop: '0.5rem' }}>
        <div className="w-full max-w-lg">
          {loading ? (
            <div className="text-white text-center">Loading tokens...</div>
          ) : error ? (
            <div className="text-red-500 text-center">Error fetching tokens: {error.message}</div>
          ) : (
            <SwapComponent availableTokens={availableTokens} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
