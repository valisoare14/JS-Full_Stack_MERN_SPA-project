const router = require('express').Router()
const Portfolio = require('../databases/Portfolio')
const PortfolioAsset = require('../databases/PortfolioAsset')
const Transaction = require('../databases/Transaction')
const {User} = require('../databases/User')

router.post('/' , async(req,res)=>{
    try {
        if(Object.keys(req.body).length != 1) {
            return res.status(400).json({message : "Invalid request !"})
        }

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message: 'User not found !'})
        }

        const noPortfolios = await Portfolio.find({
            userId : user._id
        })

        if(noPortfolios.length >= process.env.MAX_NOPORTFOLIOS) {
            return res.status(400).json({message: 'Max number of portfolios allready reached !'})
        }

        const portfolio = await new Portfolio({
            userId : user._id,
            name : req.body.name
        }).save()

        return res.status(200).json({data : portfolio , message : `Portfolio '${portfolio.name}' created successfully !` })
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

router.delete('/' , async(req,res)=>{
    try {
        if(Object.keys(req.body).length != 1) {
            return res.status(400).json({message : "Invalid request !"})
        }

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message: 'User not found !'})
        }

        const portfolio = await Portfolio.findOne({
            _id : req.body.portfolio_id
        })

        if(!portfolio) {
            return res.status(400).json({message: 'Portfolio not found !'})
        }

        const portfolio_assets = await PortfolioAsset.find({
            portfolioId : portfolio._id
        })

        if(portfolio_assets.length > 0) {
            portfolio_assets.forEach(async (p)=>{
                await Transaction.deleteMany({
                    portfolio_asset_id : p._id
                })
                await PortfolioAsset.deleteOne({
                    _id : p._id
                })
            })
        }

        await Portfolio.deleteOne({
            _id : portfolio._id
        })

        return res.status(200).json({message : `${portfolio.name} portfolio deleted successfully !`})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

router.get('/' , async(req,res)=>{
    try {
        const user = await User.findOne({
            _id : req.userId
        })
        if(!user) {
            return res.status(400).json({message: 'User not found !'})
        }

        const portfolios = await Portfolio.find({
            userId : user._id
        })

        return res.status(200).json({data : portfolios , message : "Portfolios retrieved successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message : error.message})
    }
})


module.exports = router