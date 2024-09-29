import { NextResponse } from "next/server";

async function fetchQuote(inputMint, outputMint, amount) {
    const response = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippage=0.8`);
    return await response.json();
  }
  

export async function POST(request) {
    const {fromToken, toTokens, publicKey} = await request.json();

    console.log(fromToken, toTokens);

    const quotes = await Promise.all(
        toTokens.map(async ({ address, percentage }) => {
          const amount = ((percentage / 100) * parseFloat(fromToken.amount)) * Math.pow(10, fromToken.decimals);
          console.log({percentage, amount, value: parseFloat(fromToken.amount)})
          const quote = await fetchQuote(fromToken.address, address, amount);
          return { address, quote };
        })
      );

      const swapTransactions = await Promise.all(
        quotes.map(async ({ token, quote }) => {
          // Prepare the swap call with the necessary details
          const swapResponse = await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              quoteResponse: quote,
              userPublicKey: publicKey,
              wrapAndUnwrapSol: true
            }),
          });
          return await swapResponse.json();
        })
      );

      console.log(swapTransactions);
      

    return NextResponse.json({swapTransactions}, {status: 200});
}
