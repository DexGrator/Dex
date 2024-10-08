import React from 'react';
import Navbar from '@/components/Navbar';
import { fetchAvailableTokens } from '@/service/jupiter-service';
import NewSwap from '@/components/NewSwap';

const SwapPage = async () => {
  // const [availableTokens, setAvailableTokens] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   const loadTokens = async () => {
  //     try {
  //       const tokens = await fetchAvailableTokens();
  //       setAvailableTokens(tokens);
  //     } catch (err) {
  //       setError(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadTokens();
  // }, []);

  const availableTokens = await fetchAvailableTokens();

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen flex flex-col">
  <Navbar />
  <div className="flex justify-center items-center flex-1">
    <div className="w-full max-w-lg p-4">
      {availableTokens.length > 0 ? (
        <div className="flex justify-center">
          <NewSwap availableTokens={availableTokens} />
        </div>
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
