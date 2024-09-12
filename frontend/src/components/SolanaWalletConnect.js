import React, { useMemo } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles that can be customized
require('@solana/wallet-adapter-react-ui/styles.css');

const SolanaWalletConnect = () => {
  const network = "devnet"; // Use "mainnet-beta" for the main Solana network

  // Define the wallet adapters
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={clusterApiUrl(network)}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div>
            <WalletMultiButton />
            <WalletStatus />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
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
