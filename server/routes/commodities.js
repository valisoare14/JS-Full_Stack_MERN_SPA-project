const express = require('express')
const router = express.Router()
const Commodity = require('../databases/Commodity')

router.get('/',async(req,res)=>{
    try {
        const key=process.env.FMP_API_KEY
        const url=process.env.FMP__BASE_URL
        //numarul de documente din colectia Stock
        const docnumber=await Commodity.countDocuments({})
        if(docnumber==0){
            try {
                const symbols=["GCUSD", "ZLUSX", "KEUSX", "ZFUSD", "PLUSD", "SILUSD", "HEUSX", "ZCUSX", "ZOUSX", "ALIUSD", "ZBUSD", "ESUSD", "ZMUSD", "ZQUSD", "SIUSD", "DXUSD", "ZSUSX", "LBUSD", "LEUSX", "SBUSX", "NGUSD", "CLUSD", "OJUSX", "KCUSX", "CTUSX", "HGUSD", "MGCUSD", "GFUSX", "ZTUSD", "ZRUSD", "PAUSD", "CCUSD", "NQUSD", "ZNUSD", "RTYUSD", "BZUSD", "YMUSD", "RBUSD", "HOUSD", "DCUSD"]
                const array=[]
                for(let symbol of symbols){
                    const response=await fetch(`${url}quote/${symbol}?apikey=${key}`)
                    if(!response.ok){
                        if(response.status==429){
                            return res.status(429).json({message:"Limit of 250 API calls/day reached(250 calls /40 commodities = 6 fetches / day)"})
                        }
                        else{
                            const jsonError=await response.json()
                            throw new Error(JSON.stringify(jsonError))
                        }
                    }
                    const result=await response.json()
                    array.push({ 'name':result[0].name,'symbol':result[0].symbol,'current_price':result[0].price,'price_change_percentage_24h':result[0].changesPercentage,"market":'commodities'})
                }
                const commodity=await new Commodity({
                    data:array,
                    timestamp:Date.now()
                }).save()
                return res.status(200).json(commodity)
              } catch (error) {
                console.error(error)
                return res.status(400).json(error)
            }
        }
        else{
             //Numarul de minute trecute de la ultima actualizare a bazei de date
            const doc=await Commodity.find({})
            const lastupdate=Number(((Date.now()-doc[0].timestamp)/60000).toFixed())
            //API fetch limit : 100 minutes
            if(lastupdate>100){
                try {
                    const symbols=["GCUSD", "ZLUSX", "KEUSX", "ZFUSD", "PLUSD", "SILUSD", "HEUSX", "ZCUSX", "ZOUSX", "ALIUSD", "ZBUSD", "ESUSD", "ZMUSD", "ZQUSD", "SIUSD", "DXUSD", "ZSUSX", "LBUSD", "LEUSX", "SBUSX", "NGUSD", "CLUSD", "OJUSX", "KCUSX", "CTUSX", "HGUSD", "MGCUSD", "GFUSX", "ZTUSD", "ZRUSD", "PAUSD", "CCUSD", "NQUSD", "ZNUSD", "RTYUSD", "BZUSD", "YMUSD", "RBUSD", "HOUSD", "DCUSD"]
                    const array=[]
                    for(let symbol of symbols){
                        const response=await fetch(`${url}quote/${symbol}?apikey=${key}`)
                        if(!response.ok){
                            if(response.status==429){
                                return res.status(429).json({message:"Limit of 250 API calls/day reached(250 calls /40 commodities = 6 fetches / day)"})
                            }
                            else{
                                const jsonError=await response.json()
                                throw new Error(JSON.stringify(jsonError))
                            }
                        }
                        const result=await response.json()
                        array.push({ 'name':result[0].name,'symbol':result[0].symbol,'current_price':result[0].price,'price_change_percentage_24h':result[0].changesPercentage,"market":"commodities"})
                    }
                    await Commodity.deleteMany()
                    const commodity=await new Commodity({
                        data:array,
                        timestamp:Date.now()
                    }).save()
                    return res.status(200).json(commodity)
                  } catch (error) {
                    console.error(error)
                }
            }
            else{
                const obs=await Commodity.find()
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
        const commodities = (await Commodity.find())[0].data
        const targetCommodities = commodities.filter(commodity => adata.includes(commodity.symbol))
        res.status(200).json({data : targetCommodities , message : "Filtered commodities retrieved successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})


module.exports = router