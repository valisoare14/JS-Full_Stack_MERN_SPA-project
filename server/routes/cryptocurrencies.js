const express = require('express')
const router = express.Router()
const Crypto = require('../databases/Crypto')
const fetchCryptoCurrencies = require('../utils/fetchCryptoCurrencies')
const getAdminSymbols = require('../utils/getAdminSymbols')

router.get('/',async(req,res)=>{
    try {
        const docnumber=await Crypto.countDocuments({})
        const doc=await Crypto.find()
        let lastupdate = null
        if(doc.length != 0){
            lastupdate=Number(((Date.now()-doc[0].timestamp.getTime())/60000).toFixed())
        }
        if(docnumber==0 || lastupdate > 100){
            await fetchCryptoCurrencies(docnumber)
        }
        const obs=await Crypto.find()
        const adminSymbols =await getAdminSymbols('cryptocurrencies')
        return res.status(200).json({
            _id : obs[0]._id,
            data : obs[0].data.filter(a => adminSymbols.includes(a.symbol)),
            timestamp : obs[0].timestamp
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({message:error.message})
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