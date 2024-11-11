let entryPrice = 0;

async function fetchLivePrice(cryptoId) {
    const entryPriceField = document.getElementById("entry-price");
    entryPriceField.innerText = "Fetching...";

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        entryPrice = data[cryptoId]?.usd;
        
        if (entryPrice) {
            entryPriceField.innerText = `$${entryPrice.toFixed(2)} USD`;
        } else {
            entryPriceField.innerText = "Price not available";
        }
    } catch (error) {
        entryPriceField.innerText = "Error fetching price";
        console.error("Error fetching live price:", error);
    }
}

// Call fetchLivePrice with the selected cryptocurrency ID
function selectCrypto(cryptoId, symbol) {
    fetchLivePrice(cryptoId);
    const tradingViewWidget = document.querySelector(".tradingview-widget-container iframe");
    if (tradingViewWidget) {
        // Update TradingView chart symbol
        tradingViewWidget.src = tradingViewWidget.src.replace(/symbol=\w+/, `symbol=BINANCE:${symbol}USDT`);
    }
}
