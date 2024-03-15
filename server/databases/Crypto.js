const mongoose=require('mongoose')

const CryptoSchema=new mongoose.Schema({
    data:[{
     name:String,
     symbol:String,
     current_price:Number,
     price_change_percentage_24h:Number,
     image:String,
     market : String
    }],
    timestamp:Date
 },{ versionKey: false })

 const Crypto=mongoose.model('crypto',CryptoSchema)

 module.exports = Crypto