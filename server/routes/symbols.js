const router = require('express').Router()
const Crypto = require('../databases/Crypto')
const Commoditie = require('../databases/Commodity')

router.get('/stocks' , (req , res)=>{
    try {
        const stocksSymbols = JSON.parse(process.env.STOCKS_SYMBOLS)
        return res.status(200).json({symbols : stocksSymbols , message : "Stocks symbols fetched successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : "Stocks symbols failed to fetch !"})
    }
})

router.get('/cryptocurrencies' , async (req , res)=>{
    try {
        const cryptocurrenciesSymbols = (await Crypto.find())[0]?.data.map(el => el.symbol)
        return res.status(200).json({symbols : cryptocurrenciesSymbols , message : "Cryptocurrencies symbols fetched successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : "Cryptocurrencies symbols failed to fetch !"})
    }
})

module.exports = router