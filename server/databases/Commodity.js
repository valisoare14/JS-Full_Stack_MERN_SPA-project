//Moongose ~ MongoDB
const mongoose=require('mongoose')
const CommoditieSchema=new mongoose.Schema({
   data:[{
    name:String,
    symbol:String,
    current_price:Number,
    price_change_percentage_24h:Number,
    market : String,
    market_cap:Number,
    supply : Number,
    dayHigh:Number,
    dayLow:Number,
    market_cap_rank:Number,
    price_change_24h:Number,
    previous_close: Number,
    year_high:Number,
    year_low:Number,
    average_price_50_days:Number,
    average_price_200_days:Number,
    exchange:String,
    volume:Number,
    average_volume:Number
   }],
   timestamp:Date
},{ versionKey: false })


// '{ versionKey: false }' -> elimina adaugarea cheii __v in baza de date la viitoare insertii
//(cheie v__ reprezinta versiunea curenta a documentului , ce se incrementeaza la eventuale modificari)
//modelul definit 'stock' va cauta o colectie la plural cu litere mici -> 'stocks'
const Commodity=mongoose.model('commodity',CommoditieSchema)

module.exports=Commodity



