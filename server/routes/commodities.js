const express = require('express')
const router = express.Router()
const Commodity = require('../databases/Commodity')
const fetchCommodities = require('../utils/fetchCommodities')
const getAdminSymbols = require('../utils/getAdminSymbols')

router.get('/',async(req,res)=>{
    try {
        const docnumber=await Commodity.countDocuments({})
        const doc=await Commodity.find({})
        let lastupdate = null
        if(doc.length != 0){
            lastupdate=Number(((Date.now()-doc[0].timestamp.getTime())/60000).toFixed())
        }
        if(docnumber==0 || lastupdate>100){
            await fetchCommodities(docnumber)
        }
        const obs=await Commodity.find()
        const adminSymbols =await getAdminSymbols('commodities')
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
        const commodities = (await Commodity.find())[0].data
        const targetCommodities = commodities.filter(commodity => adata.includes(commodity.symbol))
        res.status(200).json({data : targetCommodities , message : "Filtered commodities retrieved successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})


module.exports = router