let entryPrice = 0;

// Fetch live price from CoinGecko API
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

// Change crypto selection
function selectCrypto(cryptoId, symbol) {
    fetchLivePrice(cryptoId);

    // Update TradingView widget symbol dynamically
    const tradingViewWidget = document.querySelector(".tradingview-widget-container iframe");
    if (tradingViewWidget) {
        tradingViewWidget.src = tradingViewWidget.src.replace(/symbol=\w+/, `symbol=BINANCE:${symbol}USDT`);
    }
}

// Calculate stop-loss price
function calculateStopLoss() {
    const tradeAmount = parseFloat(document.getElementById("trade-amount").value);
    const portfolioSize = parseFloat(document.getElementById("portfolio-size").value);
    const riskPercentage = parseFloat(document.getElementById("risk-percentage").value) / 100;
    const leverage = parseFloat(document.getElementById("leverage").value);

    if (isNaN(entryPrice) || isNaN(tradeAmount) || isNaN(portfolioSize) || isNaN(riskPercentage) || isNaN(leverage)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const riskAmount = portfolioSize * riskPercentage;
    const stopLossPrice = entryPrice - (riskAmount / (tradeAmount * leverage));

    document.getElementById("stop-loss-result").innerText = `Stop-Loss Price: $${stopLossPrice.toFixed(2)}`;
}
