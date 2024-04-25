const Stock = require('../databases/Stock')
const Commodity = require('../databases/Commodity')
const Crypto = require('../databases/Crypto')
const fetchCryptoCurrencies = require('./fetchCryptoCurrencies')
const fetchStocks = require('./fetchStocks')
const fetchCommodities = require('./fetchCommodities')

async function fetchAdminSymbols(){
    try {
        let nodoc = await Crypto.countDocuments()
        if(nodoc === 0){
            fetchCryptoCurrencies(nodoc)
        }
        nodoc = await Stock.countDocuments()
        if(nodoc === 0 ){
            fetchStocks(nodoc)
        }
        nodoc = await Commodity.countDocuments()
        if(nodoc === 0 ){
            fetchCommodities(nodoc)
        }

        const commoditiesSymbols = (await Commodity.findOne()).data.map(c => c.symbol)
        const cryptocurrenciesSymbols = (await Crypto.findOne()).data.map(c=>c.symbol)
        const stocksSymbols = (await Stock.findOne()).data.map(c=>c.symbol)

        return {cryptocurrenciesSymbols , stocksSymbols , commoditiesSymbols}
    } catch (error) {
        console.error(error)
    }
}

module.exports = fetchAdminSymbols