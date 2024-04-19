const router = require('express').Router()
const PortfolioAsset = require('../databases/PortfolioAsset')
const Transaction = require('../databases/Transaction')
const {User} = require('../databases/User')

router.post('/' , async (req,res)=>{
    try {
        if(Object.keys(req.body).length != 5) {
            return res.status(400).json({message: 'Invalid request !'})
        }

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message: 'User not found !'})
        }


        const portfolio_asset_id = req.body.portfolio_asset_id
        const quantity = Number(req.body.quantity)
        const price = Number(req.body.price)
        const fee = Number(req.body.fee)
        const type = req.body.type


        const portfolio_asset = await PortfolioAsset.findOne({
            _id : portfolio_asset_id
        })

        if(!portfolio_asset) {
            return res.status(400).json({message: 'The asset is not in portfolio !'})
        }

        let realized_profit = -fee
        if(type === "SELL" ) {
            if(portfolio_asset.quantity < quantity){
                return res.status(400).json({message: 'Not enough quantity to sell !'})
            }
            realized_profit += quantity * price - quantity * portfolio_asset.mean_acquisition_price 
        }
        

        const transaction = await new Transaction({
            portfolio_asset_id : portfolio_asset_id,
            quantity : quantity,
            price : price,
            fee : fee,
            realized_profit : realized_profit,
            type : type,
            date : Date.now()
        }).save()

        let mean_acquisition_price = NaN

        if(type === "BUY") {
            mean_acquisition_price = (portfolio_asset.mean_acquisition_price * portfolio_asset.quantity + transaction.price*transaction.quantity) / 
                (transaction.quantity + portfolio_asset.quantity)
        }

       
        const portfolioasset = await PortfolioAsset.findOneAndUpdate({
            _id : portfolio_asset._id
        },{
            $set : {
                mean_acquisition_price : Number.isNaN(mean_acquisition_price) ? portfolio_asset.mean_acquisition_price : mean_acquisition_price,
                quantity : type === "BUY" ? portfolio_asset.quantity + quantity : portfolio_asset.quantity - quantity
            }
        } , {
            new : true
        })

        return res.status(200).json({data : {transaction , portfolioasset} , message : "Transaction executed successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

router.delete('/' , async(req,res)=>{
    try {
        if(Object.keys(req.body).length != 1) {
            return res.status(400).json({message: 'Invalid request !'})
        }

        const user = await User.findOne({
            _id : req.userId
        })

        if(!user) {
            return res.status(400).json({message: 'User not found !'})
        }

        const {transaction_id } = req.body

        const transaction = await Transaction.findOne({
            _id : transaction_id
        })

        if(!transaction) {
            return res.status(400).json({message: 'Transaction not found !'})
        }

        const portfolio_asset = await PortfolioAsset.findOne({
            _id : transaction.portfolio_asset_id
        })

        if(!portfolio_asset) {
            return res.status(400).json({message: 'The asset is not in portfolio !'})
        }

        
        const transactions = await Transaction.find({
            portfolio_asset_id : portfolio_asset._id
        })
        console.log(transactions)
        if(a = transactions.map(t => new Date(t.date).getTime()).find(el => el > transaction.date.getTime())) {
            console.log(a)
            console.log(transaction.date.getTime())
            return res.status(400).json({message: 'The target transaction cannot be deleted anymore !'})
        }

        let new_portfolio_asset = undefined

        if (transaction.type === "BUY") {
            const old_mean_acquision_price = (portfolio_asset.mean_acquisition_price*portfolio_asset.quantity - 
                transaction.quantity*transaction.price)/
                (portfolio_asset.quantity - transaction.quantity == 0 ? 1 : portfolio_asset.quantity - transaction.quantity)
            console.log(old_mean_acquision_price)
            new_portfolio_asset = await PortfolioAsset.findOneAndUpdate({
                _id : portfolio_asset._id
            },{
                $set : {
                    quantity : portfolio_asset.quantity - transaction.quantity,
                    mean_acquisition_price : old_mean_acquision_price
                }
            },{new : true})
        } else {
            new_portfolio_asset = await PortfolioAsset.findOneAndUpdate({
                _id : portfolio_asset._id
            },{
                $set : {
                    quantity : portfolio_asset.quantity + transaction.quantity
                }
            } , {new : true})
        }
        await Transaction.deleteOne({
            _id : transaction._id
        })

        return res.status(200).json({data : new_portfolio_asset , message : "Transaction deleted successfully !"})
    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

router.get('/:portfolioasset_id' , async(req,res)=>{
    try {
        const user = await User.findOne({
            _id : req.userId
        })
        if(!user) {
            return res.status(400).json({message: 'User not found !'})
        }

        const {portfolioasset_id} = req.params

        const portfolio_asset = await PortfolioAsset.findOne({
            _id : portfolioasset_id
        })

        if(!portfolio_asset) {
            return res.status(400).json({message: 'The asset is not in portfolio !'})
        }

        const transactions = await Transaction.find({
            portfolio_asset_id : portfolio_asset._id
        })

        return res.status(200).json({data : transactions , message : "Transactions fetched successfully !"})

    } catch (error) {
        console.error(error)
        return res.status(400).json({message:error.message})
    }
})

module.exports = router