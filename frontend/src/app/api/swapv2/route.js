import { NextResponse } from "next/server";

async function fetchQuote(inputMint, outputMint, amount) {
    const response = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippage=0.8`);
    return await response.json();
  }
  

  export async function POST(request) {
    const { fromTokens, toTokens, publicKey } = await request.json();
    console.log({ fromTokens, toTokens });
  
    // Check if there's no valid fromTokens or toTokens
    if (!fromTokens.length || !toTokens.length) {
      return NextResponse.json({ error: 'Invalid token lists' }, { status: 400 });
    }
  
    let quotes = [];
  
    // Case 1: Multiple fromTokens, Single toToken
    if (fromTokens.length > 1 && toTokens.length === 1) {
      const toToken = toTokens[0];
  
      quotes = await Promise.all(
        fromTokens.map(async (fromToken) => {
          // Calculate the amount of fromToken based on its decimals
          const amount = parseFloat(fromToken.amount) * Math.pow(10, fromToken.decimals);
          console.log({ amount, fromToken: fromToken.symbol, toToken: toToken.symbol });
  
          // Fetch the quote for each fromToken to the single toToken
          const quote = await fetchQuote(fromToken.address, toToken.address, amount);
          return { fromToken, toToken, quote };
        })
      );
    }
  
    // Case 2: Single fromToken, Multiple toTokens
    else if (fromTokens.length === 1 && toTokens.length > 1) {
      const fromToken = fromTokens[0];
  
      quotes = await Promise.all(
        toTokens.map(async (toToken) => {
          const amount = ((toToken.percentage || 100) / 100) * parseFloat(fromToken.amount) * Math.pow(10, fromToken.decimals);
          console.log({ amount, fromToken: fromToken.symbol, toToken: toToken.symbol });
  
          const quote = await fetchQuote(fromToken.address, toToken.address, amount);
          return { fromToken, toToken, quote };
        })
      );
    }
  
    // Case 3: One-to-One swap (one fromToken and one toToken)
    else if (fromTokens.length === 1 && toTokens.length === 1) {
      const fromToken = fromTokens[0];
      const toToken = toTokens[0];
  
      const amount = parseFloat(fromToken.amount) * Math.pow(10, fromToken.decimals);
      console.log({ amount, fromToken: fromToken.symbol, toToken: toToken.symbol });
  
      const quote = await fetchQuote(fromToken.address, toToken.address, amount);
      quotes = [{ fromToken, toToken, quote }];
    }
  
    // If no valid case found
    if (!quotes.length) {
      return NextResponse.json({ error: 'Invalid token swap request' }, { status: 400 });
    }
  
    // Prepare swap transactions
    const swapTransactions = await Promise.all(
      quotes.map(async ({ fromToken, toToken, quote }) => {
        const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteResponse: quote,
            userPublicKey: publicKey,
            dynamicComputeUnitLimit: true, 
            prioritizationFeeLamports: 1000000
          }),
        });
        const transaction = await swapResponse.json();
        return { fromToken: fromToken.symbol, toToken: toToken.symbol, transaction };
      })
    );
  
    console.log({ swapTransactions });
  
    return NextResponse.json({ swapTransactions }, { status: 200 });
  }
