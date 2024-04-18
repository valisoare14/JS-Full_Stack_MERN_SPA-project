const router = require('express').Router()
const PortfolioAsset = require('../databases/PortfolioAsset')
const Transaction = require('../databases/Transaction')
const {User} = require('../databases/User')

router.post('/' , async (req,res)=>{
    try {
        if(Object.keys(req.body).length != 6) {
            return res.status(400).json({message: 'Invalid request !'})
        }

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message: 'User not found !'})
        }

        const portfolioasset = await new PortfolioAsset({
            portfolioId : req.body.portfolioId,
            symbol : req.body.symbol,
            market : req.body.market,
            quantity : req.body.quantity,
            mean_acquisition_price : req.body.mean_acquisition_price
        }).save()

        const transaction = await new Transaction({
            portfolio_asset_id : portfolioasset._id,
            quantity :  req.body.quantity,
            price : req.body.mean_acquisition_price,
            fee : req.body.fee,
            realized_profit : -req.body.fee,
            type : "BUY",
            date : Date.now()
        }).save()


        return res.status(200).json({data : {portfolioasset , transaction} , message : `${req.body.symbol} added to portfolio successfully !` })
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

router.get('/:portfolioId' , async(req,res)=>{
    try {
        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message: 'User not found !'})
        }

        const {portfolioId} = req.params

        const portfolioAssets = await PortfolioAsset.find({
            portfolioId : portfolioId
        })

        return res.status(200).json({data : portfolioAssets , message : "Portfolio assets fetched successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

router.delete('/' , async(req,res)=>{
    try {
        if(Object.keys(req.body).length != 2) {
            return res.status(400).json({message: 'Invalid request !' , success : false})
        }

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message: 'User not found !', success : false})
        }

        await Transaction.deleteMany({
            portfolio_asset_id : req.body.portfolio_asset_id
        })

        await PortfolioAsset.deleteOne({
            _id : req.body.portfolio_asset_id
        })

        return res.status(200).json({message :`${req.body.symbol} deleted successfully from portfolio !`, success : true })
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message , success : false})
    }
})


module.exports = router