const mongoose=require('mongoose')

const StockSchema=new mongoose.Schema({
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

 const Stock=mongoose.model('stock',StockSchema)

 module.exports=Stock