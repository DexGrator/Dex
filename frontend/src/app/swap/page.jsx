"use client";
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
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen flex flex-col">
      <Navbar />
      <div className="flex justify-center items-center flex-1">
        <div className="w-full max-w-lg p-4">
          {loading ? (
            <div className="text-white text-center">Loading tokens...</div>
          ) : error ? (
            <div className="text-red-500 text-center">
              Error fetching tokens: {error.message}
            </div>
          ) : availableTokens.length > 0 ? (
            <SwapComponent availableTokens={availableTokens} />
          ) : (
            <div className="text-white text-center">
              No tokens available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
