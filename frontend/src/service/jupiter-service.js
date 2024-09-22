export const fetchAvailableTokens = async () => {
    try {
        const response = await fetch("https://tokens.jup.ag/tokens?tags=verified");
        const tokens = await response.json();
        return tokens;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export const fetchOneToOnePrice = async (toToken, vsToken) => {
    try {
        const response = await fetch(`https://price.jup.ag/v6/price?ids=${toToken}&vsToken=${vsToken}`);
        const priceData = await response.json();
        return priceData.data[toToken].price;
    } catch (err) {
        console.error(err)
        return 0.00;
    }
}

export const fetchPaymentData = async (inputMint, outputMint, amount, swapMode = 'ExactOut', slippageBps = 50) => {
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
