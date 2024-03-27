const mongoose=require('mongoose')

const CryptoSchema=new mongoose.Schema({
    data:[{
     name:String,
     symbol:String,
     current_price:Number,
     price_change_percentage_24h:Number,
     image:String,
     market : String,
     market_cap:Number,
     supply : Number,
     dayHigh:Number,
     dayLow:Number,
     market_cap_rank:Number,
     price_change_24h:Number,
     previous_close: Number,
     fully_diluted_valuation:Number,
     total_volume:Number,
     market_cap_change_24h:Number,
     market_cap_change_percentage_24h:Number,
     circulating_supply:Number,
     max_supply:Number,
     ath:Number,
     ath_change_percentage:Number,
     ath_date:Date,
     atl:Number,
     atl_change_percentage:Number,
     atl_date:Date
    }],
    timestamp:Date
 },{ versionKey: false })

 const Crypto=mongoose.model('crypto',CryptoSchema)

 module.exports = Crypto