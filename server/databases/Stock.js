const mongoose=require('mongoose')

const StockSchema=new mongoose.Schema({
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
     country:String,
     exchange:String,
     industry:String,
     ipo:String,
     website:String
    }],
    timestamp:Date
 },{ versionKey: false })

 const Stock=mongoose.model('stock',StockSchema)

 module.exports=Stock