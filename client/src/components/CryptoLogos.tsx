// Cryptocurrency logo utility
export function getCryptoLogo(symbol: string): string {
  const logos: Record<string, string> = {
    BTC: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
    ETH: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    BNB: "https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
    ADA: "https://assets.coingecko.com/coins/images/975/small/cardano.png",
    SOL: "https://assets.coingecko.com/coins/images/4128/small/solana.png",
    XRP: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png",
    DOT: "https://assets.coingecko.com/coins/images/12171/small/polkadot.png",
    DOGE: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
    AVAX: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png",
    LUNA: "https://assets.coingecko.com/coins/images/8284/small/luna1557227471663.png",
    SHIB: "https://assets.coingecko.com/coins/images/11939/small/shiba.png",
    LINK: "https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png",
    UNI: "https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png",
    LTC: "https://assets.coingecko.com/coins/images/2/small/litecoin.png",
    BCH: "https://assets.coingecko.com/coins/images/780/small/bitcoin-cash-circle.png",
    MATIC: "https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png",
    ALGO: "https://assets.coingecko.com/coins/images/4380/small/download.png",
    VET: "https://assets.coingecko.com/coins/images/1077/small/vechain.png",
    ICP: "https://assets.coingecko.com/coins/images/14495/small/Internet_Computer_logo.png",
    FIL: "https://assets.coingecko.com/coins/images/12817/small/filecoin.png",
    TRX: "https://assets.coingecko.com/coins/images/1094/small/tron-logo.png",
    ETC: "https://assets.coingecko.com/coins/images/453/small/ethereum-classic-logo.png",
    XLM: "https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png",
    THETA: "https://assets.coingecko.com/coins/images/2538/small/theta-token-logo.png",
    HBAR: "https://assets.coingecko.com/coins/images/3688/small/hbar.png",
    FTM: "https://assets.coingecko.com/coins/images/4001/small/Fantom.png",
    NEAR: "https://assets.coingecko.com/coins/images/10365/small/near_icon.png",
    ATOM: "https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png",
    XTZ: "https://assets.coingecko.com/coins/images/976/small/Tezos-logo.png",
    FLOW: "https://assets.coingecko.com/coins/images/13446/small/5f6294c0c7a8cda55cb1c936_Flow_Wordmark.png"
  };

  return logos[symbol.toUpperCase()] || `https://via.placeholder.com/32x32/22c55e/ffffff?text=${symbol.charAt(0)}`;
}