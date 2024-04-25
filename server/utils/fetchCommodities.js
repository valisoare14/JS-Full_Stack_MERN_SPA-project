const Commodity = require('../databases/Commodity')

async function fetchCommodities(docnumber){
    const key=process.env.FMP_API_KEY
    const url=process.env.FMP__BASE_URL
    try {
        const symbols=["GCUSD", "ZLUSX", "KEUSX", "ZFUSD", "PLUSD", "SILUSD", "HEUSX", "ZCUSX", "ZOUSX", "ALIUSD", "ZBUSD", "ESUSD", "ZMUSD", "ZQUSD", "SIUSD", "DXUSD", "ZSUSX", "LBUSD", "LEUSX", "SBUSX", "NGUSD", "CLUSD", "OJUSX", "KCUSX", "CTUSX", "HGUSD", "MGCUSD", "GFUSX", "ZTUSD", "ZRUSD", "PAUSD", "CCUSD", "NQUSD", "ZNUSD", "RTYUSD", "BZUSD", "YMUSD", "RBUSD", "HOUSD", "DCUSD"]
            const array=[]
            for(let symbol of symbols){
                const response=await fetch(`${url}quote/${symbol}?apikey=${key}`)
                const result=await response.json()
                if(!response.ok){
                    throw new Error(result["Error Message"])
                }
                array.push({ 
                    'name':result[0].name,
                    'symbol':result[0].symbol,
                    'current_price':result[0].price,
                    'price_change_percentage_24h':result[0].changesPercentage,
                    "market":"commodities",
                    "market_cap":result[0].marketCap,
                    "supply" : result[0].sharesOutstanding,
                    "dayHigh":result[0].dayHigh,
                    "dayLow":result[0].dayLow,
                    "price_change_24h":result[0].change,
                    "previous_close": result[0].previousClose,
                    "year_high":result[0].yearHigh,
                    "year_low":result[0].yearLow,
                    "average_price_50_days":result[0].priceAvg50,
                    "average_price_200_days":result[0].priceAvg200,
                    "exchange":result[0].exchange,
                    "volume":result[0].volume,
                    "average_volume":result[0].avgVolume
                })
            }
            const sortedByMk = array.sort((a,b)=> b.market_cap - a.market_cap)

            var i=1
            for(let element of sortedByMk) {
                element.market_cap_rank = i
                i++
            }
            if(docnumber !== 0) {
                await Commodity.deleteMany()
            }
            await new Commodity({
                data:sortedByMk,
                timestamp:Date.now()
            }).save()
    } catch (error) {
        console.error(error)
    }
}

module.exports = fetchCommodities