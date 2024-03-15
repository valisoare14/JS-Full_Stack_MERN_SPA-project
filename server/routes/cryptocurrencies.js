const express = require('express')
const router = express.Router()
const Crypto = require('../databases/Crypto')

router.get('/',async(req,res)=>{
    try {
        const key=process.env.COINGECKO_API_KEY
        const url=process.env.COINGECKO_BASE_URL
        //numarul de documente din colectia Crypto
        const docnumber=await Crypto.countDocuments({})
        if(docnumber==0){
            try {
                const response = await fetch(`${url}coins/markets?vs_currency=usd&ids=%20bitcoin%2C%20ethereum%2C%20binancecoin%2C%20ripple%2C%20cardano%2C%20solana%2C%20polkadot%2C%20dogecoin%2C%20avalanche%2C%20terra%2C%20chainlink%2C%20litecoin%2C%20bitcoin-cash%2C%20stellar%2C%20uniswap%2C%20algorand%2C%20cosmos%2C%20vechain%2C%20internet-computer%2C%20filecoin%2C%20tron%2C%20ethereum-classic%2C%20tezos%2C%20monero%2C%20eos%2C%20shiba-inu%2C%20aave%2C%20klaytn%2C%20maker%2C%20neo%2C%20chiliz%2C%20huobi-token%2C%20theta-token%2C%20bitcoin-sv%2C%20crypto-com-chain%2C%20compound%2C%20dash%2C%20iota%2C%20waves%2C%20decred%2C%20zcash%2C%20elrond%2C%20pancakeswap-token%2C%20near%2C%20quant%2C%20loopring%2C%20the-graph%2C%20enjin-coin%2Csushiswap%2C%20polygon%2C%20yearn.finance%2C%20synthetix%2C%20curve%2C%20decentraland%2C%20sandbox%2C%20helium&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en&precision=2&x_cg_api_key=${key}`);
                const result = await response.json();
                const obs=await new Crypto({
                    data:result.map(element=>({"name":element.name,"symbol":element.symbol,"current_price":element.current_price,"price_change_percentage_24h":element.price_change_percentage_24h,"image":element.image,"market":"cryptocurrencies"})),
                    timestamp:Date.now()
                }).save()
                return res.status(200).json(obs)
              } catch (error) {
                console.error(error)
            }
        }
        else{
             //Numarul de minute trecute de la ultima actualizare a bazei de date
            const doc=await Crypto.find({})
            const lastupdate=Number(((Date.now()-doc[0].timestamp)/60000).toFixed())
            //API fetch limit : 100 minutes
            if(lastupdate>100){
                try {
                    const response = await fetch(`${url}coins/markets?vs_currency=usd&ids=%20bitcoin%2C%20ethereum%2C%20binancecoin%2C%20ripple%2C%20cardano%2C%20solana%2C%20polkadot%2C%20dogecoin%2C%20avalanche%2C%20terra%2C%20chainlink%2C%20litecoin%2C%20bitcoin-cash%2C%20stellar%2C%20uniswap%2C%20algorand%2C%20cosmos%2C%20vechain%2C%20internet-computer%2C%20filecoin%2C%20tron%2C%20ethereum-classic%2C%20tezos%2C%20monero%2C%20eos%2C%20shiba-inu%2C%20aave%2C%20klaytn%2C%20maker%2C%20neo%2C%20chiliz%2C%20huobi-token%2C%20theta-token%2C%20bitcoin-sv%2C%20crypto-com-chain%2C%20compound%2C%20dash%2C%20iota%2C%20waves%2C%20decred%2C%20zcash%2C%20elrond%2C%20pancakeswap-token%2C%20near%2C%20quant%2C%20loopring%2C%20the-graph%2C%20enjin-coin%2Csushiswap%2C%20polygon%2C%20yearn.finance%2C%20synthetix%2C%20curve%2C%20decentraland%2C%20sandbox%2C%20helium&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en&precision=2&x_cg_api_key=${key}`);
                    const result = await response.json()
                    await Crypto.deleteMany()
                    const obs=await new Crypto({
                        data:result.map(element=>({"name":element.name,"symbol":element.symbol,"current_price":element.current_price,"price_change_percentage_24h":element.price_change_percentage_24h,"image":element.image,"market":"cryptocurrencies"})),
                        timestamp:Date.now()
                    }).save()
                    return res.status(200).json(obs)
                  } catch (error) {
                    console.error(error)
                }
            }
            else{
                const obs=await Crypto.find()
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
        const cryptocurrencies = (await Crypto.find())[0].data
        const targetCryptocurrencies = cryptocurrencies.filter(cryptocurrency => adata.includes(cryptocurrency.symbol))
        res.status(200).json({data : targetCryptocurrencies , message : "Filtered cryptocurrencies retrieved successfully !"})
        
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})
module.exports = router