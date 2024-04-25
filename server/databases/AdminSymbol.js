const mongoose=require('mongoose')
const AdminSymbolSchema=new mongoose.Schema({
   commodities : {
        symbols : [String],
        timestamp : { type: Date, default: Date.now }
   },
   stocks : {
    symbols : [String],
    timestamp : { type: Date, default: Date.now }
   },
   cryptocurrencies : {
    symbols : [String],
    timestamp : { type: Date, default: Date.now }
   }
},{ versionKey: false })

const AdminSymbol=mongoose.model('adminsymbol',AdminSymbolSchema)

module.exports=AdminSymbol