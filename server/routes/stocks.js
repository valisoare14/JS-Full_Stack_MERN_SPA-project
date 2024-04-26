const express = require('express')
const router = express.Router()
const Stock = require('../databases/Stock')
const fetchStocks = require('../utils/fetchStocks')
const getAdminSymbols = require('../utils/getAdminSymbols')

router.get('/',async(req,res)=>{
    try {
        const docnumber=await Stock.countDocuments({})
        const doc=await Stock.find({})
        let lastupdate = null
        if(doc.length !== 0){
            lastupdate=Number(((Date.now()-doc[0].timestamp.getTime())/60000).toFixed())
        }
        if(docnumber==0 || lastupdate > 100){
            await fetchStocks(docnumber)
        }
        const obs=await Stock.find()
        const adminSymbols =await getAdminSymbols('stocks')
        return res.status(200).json({
            _id : obs[0]._id,
            data : obs[0].data.filter(a => adminSymbols.includes(a.symbol)),
            timestamp : obs[0].timestamp
        })
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