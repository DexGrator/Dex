import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// Default styles that can be customized
require('@solana/wallet-adapter-react-ui/styles.css');

const SolanaWalletConnect = () => {
  

  return (
    
          <div>
            <WalletMultiButton />
            <WalletStatus />
          </div>
        
  );
};

// Component to show wallet status
const WalletStatus = () => {
  const { publicKey } = useWallet();

  return (
    <div>
    
    </div>
  );
};

export default SolanaWalletConnect;
