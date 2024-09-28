"use client"
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { ArrowDownUp, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fetchOneToOnePrice } from "@/service/jupiter-service"; // Your price fetching logic
import { useWallet } from "@solana/wallet-adapter-react";
import useSolanaConnection from "@/app/hooks/useSolanaConnect";
import { VersionedTransaction } from "@solana/web3.js";

const TokenSelector = ({ token, onSelect, isFrom, availableTokens, toTokens }) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="justify-between w-[200px]">
          {token ? (
            <div className="flex items-center">
              <img src={token.logoURI} alt={token.name} className="w-6 h-6 mr-2" />
              {token.symbol}
            </div>
          ) : (
            "Select token"
          )}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search tokens..." onValueChange={setSearchValue} />
          <CommandList>
            <CommandEmpty>No tokens found.</CommandEmpty>
            <CommandGroup>
              {availableTokens
                .filter((t) =>
                  (isFrom || !toTokens.some((tt) => tt.address === t.address)) &&
                  (t.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                   t.symbol.toLowerCase().includes(searchValue.toLowerCase()))
                )
                .map((t) => (
                  <CommandItem
                    key={t.address}
                    onSelect={() => {
                      onSelect(t);
                      setOpenPopover(false);
                    }}
                  >
                    {t.logoURI && <div className="flex items-center">
                      <img src={t.logoURI} alt={t.name} className="w-6 h-6 mr-2" />
                      {t.symbol} - {t.name}
                    </div>}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const SwapComponent = ({ availableTokens }) => {
  const [fromToken, setFromToken] = useState(null);
  const [toTokens, setToTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const wallet = useWallet();
  const connection = useSolanaConnection();

  const fetchPrice = useCallback(
    debounce(async (fromToken, toTokens, amount) => {
      console.log({fromToken, toTokens, amount})
      if (!fromToken || !toTokens.length || !amount) return;
      
      setIsLoading(true);
      try {
        const results = await Promise.all(
          toTokens.map(async (toToken) => {
            const price = await fetchOneToOnePrice(fromToken, toToken.symbol);
            return {
              ...toToken,
              value: price * amount * (toToken.percentage / 100),
            };
          })
        );

        setToTokens(results);
        console.log(results);
      } catch (error) {
        console.error("Error fetching conversion:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleValueChange = (index, value, direction) => {
    if (direction === "from") {
      setFromToken({...fromToken, amount: value});
      console.log(fromToken)
      fetchPrice(fromToken.symbol, toTokens, value);
    } else {
      const newToTokens = [...toTokens];
      newToTokens[index].value = value;
      setToTokens(newToTokens);
    }
  };

  const handlePercentageChange = (index, value, direction) => {
    const tokens =
      direction === "from" ? fromToken : [...toTokens];
    const totalTokens = tokens.length;

    tokens[index].percentage = value;

    // Adjust the other tokens
    const remainingTokens = tokens.filter((_, i) => i !== index);
    const remainingPercentage = 100 - value;
    remainingTokens.forEach((token) => {
      token.percentage = remainingPercentage / remainingTokens.length;
    });

    if (direction === "from") {
      setFromToken(tokens);
    } else {
      setToTokens(tokens);
    }

    // Recalculate the total value for "from" tokens and trigger price conversion
    const totalFromValue = tokens.reduce((sum, token) => {
      return sum + token.value * (token.percentage / 100);
    }, 0);

    if (direction === "from") {
      fetchPrice(fromToken.symbol, toTokens, totalFromValue);
    } else {
      fetchPrice(fromToken.symbol, tokens, fromToken.value);
    }
  };
  


  const addToken = () => {
    if (toTokens.length < 5) {
      const newPercentage = 100 / (toTokens.length + 1);
      const updatedTokens = toTokens.map(token => ({
        ...token,
        percentage: newPercentage,
      }));
      const newToken = {
        token: null,
        amount: "",
        percentage: newPercentage,
      };
      setToTokens([...updatedTokens, newToken]);
    }
  };

  const updateTokenPercentage = (index, value) => {
    const updatedTokens = [...toTokens];
    updatedTokens[index].percentage = value;
    const remainingPercentage = 100 - value;
    const otherTokens = updatedTokens.filter((_, i) => i !== index);
    otherTokens.forEach((token) => (token.percentage = remainingPercentage / otherTokens.length));
    setToTokens(updatedTokens);
  };

  const handleAmountChange = (index, value) => {
    const updatedTokens = [...toTokens];
    updatedTokens[index].amount = value;
    setToTokens(updatedTokens);
  };

  const handleSwap = () => {
    // Logic for performing swap action
    console.log("Swapping:", fromToken, toTokens);
  };

  const atomicSwap = async () => {

    if(!wallet.connected || !wallet.signTransaction) {
      console.error(
        "Wallet is not connected or does not support signing transactions"
      );
      console.log(wallet)
      return;
    }

    console.log("Swap initiated", {fromToken, toTokens})

    const newToTokens = toTokens.map((token) => {
        const availToken = availableTokens.find((tkn) => tkn.symbol === token.symbol);
        return {
          ...token,
          address: availToken.address
        }
    })

    console.log({fromToken, newToTokens})

    fetch("/api/swapv2", {
      method: "POST",
      body: JSON.stringify({
        fromToken: fromToken,
        toTokens: toTokens,
        publicKey: wallet.publicKey?.toString()
      })
    })
    .then(async (res) => {
      try {
        // Assuming res contains the response with multiple swap transactions in an array
        const { swapTransactions } = await res.json();  // Multiple transactions
        
        const signedTransactions = await Promise.all(swapTransactions.map(async (tx) => {
          // Deserialize the swap transaction from base64
          const swapTransactionBuf = Buffer.from(tx.swapTransaction, 'base64');
          const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      
          // Sign the transaction
          const signedTransaction = await wallet.signTransaction(transaction);
      
          // Serialize the signed transaction
          return signedTransaction.serialize();
        }));
      
        // Send all the signed transactions
        const transactionIds = await Promise.all(signedTransactions.map(async (rawTransaction) => {
          // Send each raw transaction to the blockchain
          return await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            maxRetries: 2
          });
        }));
      
        // Confirm all transactions
        const latestBlockHash = await connection.getLatestBlockhash();
      
        await Promise.all(transactionIds.map(async (transactionId) => {
          await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: transactionId
          }, 'confirmed');
          console.log(`https://solscan.io/tx/${transactionId}`);  // Log transaction URLs for tracking
        }));
      
        alert("Multi-Token Swap Successful!");
      
      } catch (e) {
        console.error("Failed to sign or send transactions: ", e);
      }
    });

    // fetch("/api/swap", {
    //   method: "POST",
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     inputMint: fromToken.address,
    //     outputMint: toToken.address,
    //     amount: fromTokens[0].value * Math.pow(10, fromToken.decimals),
    //     userPublicKey: wallet.publicKey?.toString()
    //   })
    // })
    // .then(async (res) => {
    //   try{
    //     const {swapTransaction} = await res.json();
    //     const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    //     const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    //     const signedTransaction = await wallet.signTransaction(transaction)

    //     const rawTransaction = signedTransaction.serialize();

    //     const transactionId = await connection.sendRawTransaction(rawTransaction, {
    //       skipPreflight: true, 
    //       maxRetries: 2
    //     });

    //     const latestBlockHash = await connection.getLatestBlockhash();
    //     await connection.confirmTransaction({
    //       blockhash: latestBlockHash.blockhash,
    //       lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    //       signature: transactionId
    //     }, 'confirmed');


    //     alert("Swap Successful!");
    //     console.log(`https://solscan.io/tx/${transactionId}`);

    //   } catch (e){ 
    //     console.error("Failed to sign transaction: ", e);
    //   }
    // })
    // .catch((err) => {
    //   console.log(err);
    // })
  }

  return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="w-[60vw] p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Token Swap</h2>
  
        <div className="space-y-4 mb-6">
          <Label>From</Label>
          <div className="flex items-center space-x-2">
            <TokenSelector
              token={fromToken}
              onSelect={(newToken) => setFromToken({ ...newToken, amount: "", percentage: 100 })}
              isFrom={true}
              availableTokens={availableTokens}
              toTokens={toTokens}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={fromToken?.amount || ""}
              onChange={(e) => handleValueChange(0, e.target.value, "from")}
              className="w-[100px]"
            />
          </div>
        </div>
  
        <div className="flex justify-center my-4">
          <ArrowDownUp className="h-6 w-6" />
        </div>
  
        <div className="space-y-4 mb-6 items-center">
          <Label className="mr-2">To</Label>
          <br />
          {toTokens.map((token, index) => (
            <div key={index} className="flex items-center space-x-2">
              <TokenSelector
                token={token}
                onSelect={(newToken) => {
                  const updatedTokens = [...toTokens];
                  updatedTokens[index] = {
                    ...newToken,
                    amount: token.amount,
                    percentage: token.percentage,
                  };
                  setToTokens(updatedTokens);
                }}
                isFrom={false}
                availableTokens={availableTokens}
                toTokens={toTokens}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={token.value}
                onChange={(e) => handleAmountChange(index, e.target.value)}
                className="w-[100px]"
              />
              <div className="flex-1">
                <Slider
                  value={[token.percentage]}
                  onValueChange={(value) => handlePercentageChange(index, value[0], "to")}
                  max={100}
                  step={1}
                />
              </div>
              <span className="w-[40px] text-right">{token.percentage.toFixed(0)}%</span>
            </div>
          ))}
  
          {toTokens.length < 5 && (
            <Button variant="outline" size="sm" onClick={addToken} className="mt-2">
              <Plus className="mr-2 h-4 w-4" /> Add Token
            </Button>
          )}
        </div>
  
        <Button className="w-full" onClick={atomicSwap} disabled={isLoading}>
          {isLoading ? "updating..." : "Swap"}
        </Button>
      </div>
    </div>
  );
}  

export default SwapComponent;