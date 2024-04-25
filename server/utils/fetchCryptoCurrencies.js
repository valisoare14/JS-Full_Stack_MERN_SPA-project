const Crypto = require('../databases/Crypto')

async function fetchCryptoCurrencies(docnumber){
    const key=process.env.COINGECKO_API_KEY
    const url=process.env.COINGECKO_BASE_URL
    try {
        const response = await fetch(`${url}coins/markets?vs_currency=usd&ids=%20bitcoin%2C%20ethereum%2C%20binancecoin%2C%20ripple%2C%20cardano%2C%20solana%2C%20polkadot%2C%20dogecoin%2C%20avalanche%2C%20terra%2C%20chainlink%2C%20litecoin%2C%20bitcoin-cash%2C%20stellar%2C%20uniswap%2C%20algorand%2C%20cosmos%2C%20vechain%2C%20internet-computer%2C%20filecoin%2C%20tron%2C%20ethereum-classic%2C%20tezos%2C%20monero%2C%20eos%2C%20shiba-inu%2C%20aave%2C%20klaytn%2C%20maker%2C%20neo%2C%20chiliz%2C%20huobi-token%2C%20theta-token%2C%20bitcoin-sv%2C%20crypto-com-chain%2C%20compound%2C%20dash%2C%20iota%2C%20waves%2C%20decred%2C%20zcash%2C%20elrond%2C%20pancakeswap-token%2C%20near%2C%20quant%2C%20loopring%2C%20the-graph%2C%20enjin-coin%2Csushiswap%2C%20polygon%2C%20yearn.finance%2C%20synthetix%2C%20curve%2C%20decentraland%2C%20sandbox%2C%20helium&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en&precision=2&x_cg_api_key=${key}`);
            const result = await response.json()
            if(!response.ok) {
                throw new Error(result.error_message)
            }
            if(docnumber !== 0) {
                await Crypto.deleteMany()
            }
            await new Crypto({
                data:result.map(element=>({
                    "name":element.name,
                    "symbol":element.symbol,
                    "current_price":element.current_price,
                    "price_change_percentage_24h":element.price_change_percentage_24h,
                    "image":element.image,
                    "market":"cryptocurrencies",
                    "market_cap":element.market_cap,
                    "supply" : element.total_supply,
                    "dayHigh":element.high_24h,
                    "dayLow":element.low_24h,
                    "market_cap_rank":element.market_cap_rank,
                    "price_change_24h":element.price_change_24h,
                    "previous_close": (element.current_price-element.price_change_24h),
                    "fully_diluted_valuation":element.fully_diluted_valuation,
                    "total_volume":element.total_volume,
                    "market_cap_change_24h":element.market_cap_change_24h,
                    "market_cap_change_percentage_24h":element.market_cap_change_percentage_24h,
                    "circulating_supply":element.circulating_supply,
                    "max_supply":element.max_supply,
                    "ath":element.ath,
                    "ath_change_percentage":element.ath_change_percentage,
                    "ath_date":new Date(element.ath_date),
                    "atl":element.atl,
                    "atl_change_percentage":element.atl_change_percentage,
                    "atl_date":new Date(element.atl_date)
                })),
                timestamp:Date.now()
            }).save()
    } catch (error) {
        console.error(error)
    }
}

module.exports = fetchCryptoCurrencies