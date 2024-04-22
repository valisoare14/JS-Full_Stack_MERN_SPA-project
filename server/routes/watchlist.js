const express = require('express')
const router = express.Router()
const {User} = require('../databases/User')
const Watchlist = require('../databases/Watchlist') 

router.post('/',async(req,res)=>{
    try {
        const userId_ = req.userId
        const user = await User.findOne({
            _id : userId_
        })
        if(!user) {
            return res.status(400).json({message : "User not found !"})
        }

        const {symbol,market} = req.body
        if(!symbol) {
            return res.status(400).json({message : "Symbol not provided for  watchlist !"})
        }

        const watchlistAsset = await new Watchlist({
            userId : userId_,
            symbol : symbol,
            market : market
        }).save()

        return res.status(200).json({data:watchlistAsset , message :"Asset added successfully to watchlist !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.get('/:market',async(req,res)=>{
    try {
        const userId_ = req.userId
        const user = await User.findOne({
            _id : userId_
        })

        if(!user) {
            return res.status(400).json({message : "User not found !"})
        }
        const {market} = req.params
        const watchlistAssets = await Watchlist.find({
            userId : user._id,
            market : market
        })

        return res.status(200).json({data:watchlistAssets , message : "Assets retrieved successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})

router.delete('/',async(req,res)=>{
    try {
        const userId_ = req.userId
        const user = await User.findOne({
            _id : userId_
        })

        if(!user) {
            return res.status(400).json({message : "User not found !"})
        }
        const {symbol} = req.body
        if(!symbol) {
            return res.status(400).json({message : "Symbol not provided for  watchlist !"})
        }

        const asset = await Watchlist.findOne({
            userId : user._id,
            symbol : symbol
        })

        if(!asset) {
            return res.status(400).json({message :"Asset not found in the watchlist !"})
        }

        await asset.deleteOne()

        return res.status(200).json({message : "Asset removed from watchlist successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

router.delete('/deleteall' , async(req,res)=>{
    try {
        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message : "User not found !"})
        }

        await Watchlist.deleteMany({
            userId : user._id
        })

        return res.status(200).json({message : "Watchlist assets deleted successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

module.exports = router