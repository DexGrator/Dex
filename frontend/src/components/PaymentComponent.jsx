"use client";

import { useState, useCallback, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { BiGasPump, BiDollar, BiCoin } from "react-icons/bi";
import { debounce } from "lodash";
import { fetchOneToOnePrice } from "@/service/jupiter-service";
import { useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import useSolanaConnection from "@/app/hooks/useSolanaConnect";

const fetchPaymentData = async (inputMint, outputMint, amount, swapMode = 'ExactOut', slippageBps = 50) => {
    try {
        const response = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&swapMode=${swapMode}&slippageBps=${slippageBps}`);
        const paymentData = await response.json();
        return {
            inAmount: paymentData.inAmount,
            otherAmountThreshold: paymentData.otherAmountThreshold
        };
    } catch (err) {
        console.error(err);
        return {
            inAmount: 0,
            otherAmountThreshold: 0
        };
    }
}

const PaymentComponent = ({ availableTokens }) => {
    // State for Token and Amount
    const [token, setToken] = useState({ token: "", value: "", uri: "" });
    const [senderAddress, setSenderAddress] = useState("");

    // Additional States
    const [isLoading, setIsLoading] = useState(false);

    const wallet = useWallet();
    const connection = useSolanaConnection();

    const initiatePayment = async (e) => {
        if (!wallet.connected || !wallet.signTransaction) {
            console.error(
                "Wallet is not connected or does not support signing transactions"
            );
            console.log(wallet);
            return;
        }

        console.log("Payment initiated", { token, senderAddress });
        const selectedToken = availableTokens.find(
            (t) => t.symbol === token.token
        );

        if (!selectedToken) {
            console.error("Selected token not found");
            return;
        }

        try {
            setIsLoading(true);
            const paymentData = await fetchPaymentData(wallet.publicKey.toString(), senderAddress, token.value);
            console.log("Payment Data:", paymentData);
            // Proceed with the payment using paymentData
        } catch (error) {
            console.error("Error fetching payment data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for Token Selection Change
    const handleTokenChange = (value) => {
        let logoURI = null;
        const tokenEntry = availableTokens.find((token) => token.symbol === value);
        if (tokenEntry) {
            logoURI = tokenEntry.logoURI;
        }

        setToken({ ...token, token: value, uri: logoURI ? logoURI : "" });
    };

    // Handler for Value Change
    const handleValueChange = (value) => {
        setToken({ ...token, value });
    };

    // Function to Render Token Input
    const renderTokenInput = () => (
        <div className="space-y-4 mb-6 overflow-hidden">
            {/* Token Selection and Value Input */}
            <div className="flex flex-col space-y-2 overflow-hidden">
                <div className="flex items-center space-x-4">
                    {/* Token Logo */}
                    <img
                        src={token.uri !== "" ? token.uri : "/image.png"}
                        alt="Token Logo"
                        className="w-6 h-6 rounded-full"
                    />
                    <div className="flex flex-col w-full ">
                        {/* Token Dropdown */}
                        <select
                            value={token.token}
                            onChange={(e) => handleTokenChange(e.target.value)}
                            className="bg-gray-800 rounded-md py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option className="w-30" value="">
                                Select Token
                            </option>
                            {availableTokens.map((t) => (
                                <option key={t.address} value={t.symbol}>
                                    {t.name} ({t.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                {/* Amount Input */}
                <input
                    type="number"
                    value={token.value}
                    onChange={(e) => handleValueChange(e.target.value)}
                    className="bg-gray-800 rounded-md py-2 px-3 w-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Amount"
                />
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Make a Payment</h2>

            <div className="space-y-8">
                {/* Token Section */}
                <div>
                    <label className="block text-sm font-medium mb-2">Token</label>
                    {renderTokenInput()}
                </div>

                {/* Sender Address Section */}
                <div>
                    <label className="block text-sm font-medium mb-2">Sender Address</label>
                    <input
                        type="text"
                        value={senderAddress}
                        onChange={(e) => setSenderAddress(e.target.value)}
                        className="bg-gray-800 rounded-md py-2 px-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Sender Address"
                    />
                </div>

                {/* Connect Wallet Button */}
                <button
                    onClick={initiatePayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : "Make Payment"}
                </button>
            </div>
        </div>
    );
};

export default PaymentComponent;
