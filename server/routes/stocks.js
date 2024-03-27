const express = require('express')
const router = express.Router()
const Stock = require('../databases/Stock')

router.get('/',async(req,res)=>{
    try {
        const key=process.env.FINNHUB_API_KEY
        const url=process.env.FINNHUB_BASE_URL
        //numarul de documente din colectia Stock
        const docnumber=await Stock.countDocuments({})
        if(docnumber==0){
            try {
                const symbols=['AAPL', 'MSFT', 'AMZN', 'GOOGL','BRK-A', 'JNJ', 'WMT', 'V', 'JPM', 'TSLA', 'PG', 'UNH', 'MA', 'NVDA', 'HD', 'BABA', 'DIS', 'PFE', 'KO']
                const names=["Apple Inc.", "Microsoft Corporation", "Amazon.com Inc.", "Alphabet Inc.", "Berkshire Hathaway Inc.", "Johnson & Johnson", "Walmart Inc.", "Visa Inc.", "JPMorgan Chase & Co.", "Tesla, Inc.", "Procter & Gamble Co.", "UnitedHealth Group Incorporated", "Mastercard Incorporated", "NVIDIA Corporation", "The Home Depot, Inc.", "Alibaba Group Holding Limited", "The Walt Disney Company", "Pfizer Inc.", "The Coca-Cola Company"]
                const currentPrices=[]
                for(let symbol of symbols){
                    //Price
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
                const obs=await new Stock({
                    data:sortedByMk,
                    timestamp:Date.now()
                }).save()
                return res.status(200).json(obs)
              } catch (error) {
                console.error(error)
            }
        }
        else{
             //Numarul de minute trecute de la ultima actualizare a bazei de date
            const doc=await Stock.find({})
            const lastupdate=Number(((Date.now()-doc[0].timestamp)/60000).toFixed())
            //API fetch limit : 100 minutes
            if(lastupdate>100){
                try {
                    const symbols=['AAPL', 'MSFT', 'AMZN', 'GOOGL','BRK-A', 'JNJ', 'WMT', 'V', 'JPM', 'TSLA', 'PG', 'UNH', 'MA', 'NVDA', 'HD', 'BABA', 'DIS', 'PFE', 'KO']
                    const names=["Apple Inc.", "Microsoft Corporation", "Amazon.com Inc.", "Alphabet Inc.", "Berkshire Hathaway Inc.", "Johnson & Johnson", "Walmart Inc.", "Visa Inc.", "JPMorgan Chase & Co.", "Tesla, Inc.", "Procter & Gamble Co.", "UnitedHealth Group Incorporated", "Mastercard Incorporated", "NVIDIA Corporation", "The Home Depot, Inc.", "Alibaba Group Holding Limited", "The Walt Disney Company", "Pfizer Inc.", "The Coca-Cola Company"]
                    const currentPrices=[]
                    for(let symbol of symbols){
                        //Price
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
                    await Stock.deleteMany()
                    const sortedByMk = currentPrices.sort((a,b)=> b.market_cap - a.market_cap)

                    var i=1
                    for(let element of sortedByMk) {
                        element.market_cap_rank = i
                        i++
                    }
                    const obs=await new Stock({
                        data:sortedByMk,
                        timestamp:Date.now()
                    }).save()
                    return res.status(200).json(obs)
                  } catch (error) {
                    console.error(error)
                }
            }
            else{
                const obs=await Stock.find()
                return res.status(200).json(obs[0])
            }
            
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({error:error.message})
    }
})

router.post('/symbols',async(req,res)=>{
    try {
        if(Object.keys(req.body).length == 0) {
            res.status(400).json({message : "Request body is missing !"})
        }
        const {data} = req.body
        const adata = data.split(',')
        const stocks = (await Stock.find())[0].data
        const targetStocks = stocks.filter(stock => adata.includes(stock.symbol))
        res.status(200).json({data : targetStocks , message : "Filtered stocks retrieved successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

module.exports = router