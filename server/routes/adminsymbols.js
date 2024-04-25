const { User } = require('../databases/User')
const AdminSymbols = require('../databases/AdminSymbol')
const fetchAdminSymbols = require('../utils/fetchAdminSymbols')
const router = require('express').Router()

router.post('/all' , async(req,res)=>{
    try {
        const user = await User.findOne({
            _id : req.userId
        })
        if(!user) {
            return res.status(400).json({message : 'User not found !'})
        }

        const {cryptocurrenciesSymbols ,
             stocksSymbols , commoditiesSymbols} = await fetchAdminSymbols()

        const adminsymbolsnodocs = await AdminSymbols.countDocuments()
        if(adminsymbolsnodocs !== 0){
            await AdminSymbols.deleteMany()
        }

        const restoredAdminSymbols = await new AdminSymbols({
            commodities : {
                symbols : commoditiesSymbols
            },
            cryptocurrencies : {
                symbols : cryptocurrenciesSymbols
            },
            stocks : {
                symbols : stocksSymbols
            }
        }).save()
        
        return res.status(200).json({data : restoredAdminSymbols , message : 'Changes restored successfully !'})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.put('/' , async(req,res)=>{
    try {
        if(Object.keys(req.body).length != 1){
            return res.status(400).json({message : 'Invalid request !'})
        }

        const user = await User.findOne({
            _id : req.userId
        })
        if(!user) {
            return res.status(400).json({message : 'User not found !'})
        }

        const { newObject } = req.body;

        let updateObject = {};
        updateObject['stocks.symbols'] = newObject.stocks.symbols;
        updateObject['stocks.timestamp'] = Date.now();
        updateObject['commodities.symbols'] = newObject.commodities.symbols;
        updateObject['commodities.timestamp'] = Date.now();
        updateObject['cryptocurrencies.symbols'] = newObject.cryptocurrencies.symbols;
        updateObject['cryptocurrencies.timestamp'] = Date.now();

        await AdminSymbols.findOneAndUpdate({}, {
            $set: updateObject
        });

        return res.status(200).json({message : `Visible symbols updated successfully!`})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.get('/all' , async(req,res)=>{
    try {
        const user = await User.findOne({
            _id : req.userId
        })
        if(!user) {
            return res.status(400).json({message : 'User not found !'})
        }

        const {cryptocurrenciesSymbols ,
            stocksSymbols , commoditiesSymbols} = await fetchAdminSymbols()

        return res.status(200).json({data : {
            commodities : {
                symbols : commoditiesSymbols
            },
            cryptocurrencies : {
                symbols : cryptocurrenciesSymbols
            },
            stocks : {
                symbols : stocksSymbols
            }
        } , message : 'Available admin symbols fetched successfully !'})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.get('/all/visible' , async(req,res)=>{
    try {
        const user = await User.findOne({
            _id : req.userId
        })
        if(!user) {
            return res.status(400).json({message : 'User not found !'})
        }

        const adminSymbolsObject = await AdminSymbols.findOne()
        
        return res.status(200).json({data : adminSymbolsObject , message : 'Visible admin symbols fetched successfully !'})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

module.exports = router