const Stock = require('../databases/Stock')

async function fetchStocks(docnumber){
    const key=process.env.FINNHUB_API_KEY
    const url=process.env.FINNHUB_BASE_URL
    try {
        const symbols=JSON.parse(process.env.STOCKS_SYMBOLS)
            const names=JSON.parse(process.env.STOCKS_NAMES)
            const currentPrices=[]
            for(let symbol of symbols){
                const response =await fetch(`${url}quote?symbol=${symbol}&token=${key}`)
                const result=await response.json()
                const response_=await fetch(`${url}stock/profile2?symbol=${symbol}&token=${key}`)
                const result_=await response_.json()
                currentPrices.push({'price_change_percentage_24h':result.dp,
                'name':names[symbols.indexOf(symbol)],
                'symbol':symbol,
                'current_price':Number(result.c).toFixed(2),
                'image':result_.logo,
                "market":"stocks",
                "market_cap":result_.marketCapitalization,
                "supply" : result_.shareOutstanding,
                "dayHigh":result.h,
                "dayLow":result.l,
                "price_change_24h":result.d,
                "previous_close": result.pc,
                "country":result_.country,
                "exchange":result_.exchange,
                "industry":result_.finnhubIndustry,
                "ipo":result_.ipo,
                "website":result_.weburl
                })
            }
            const sortedByMk = currentPrices.sort((a,b)=> b.market_cap - a.market_cap)

            var i=1
            for(let element of sortedByMk) {
                element.market_cap_rank = i
                i++
            }
            if(docnumber !== 0){
                await Stock.deleteMany()
            }
            await new Stock({
                data:sortedByMk,
                timestamp:Date.now()
            }).save()
    } catch (error) {
        console.error(error)
    }
}

module.exports = fetchStocks