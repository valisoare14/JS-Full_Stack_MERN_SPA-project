const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
   portfolio_asset_id : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : 'portfolioasset'
   },
   quantity : Number, 
   price : Number,
   fee : Number,
   realized_profit : Number,
   type : String,
   date : Date
},{
    versionKey : false
})

const Transaction = mongoose.model('transaction' , TransactionSchema)

module.exports = Transaction