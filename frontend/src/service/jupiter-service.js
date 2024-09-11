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
        console.log(priceData);
        console.log(priceData.data[toToken]);

        return priceData.data[toToken].price;
    } catch (err) {
        console.error(err)
        return 0.00;
    }
}
