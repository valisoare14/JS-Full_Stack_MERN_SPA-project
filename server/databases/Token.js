const mongoose=require('mongoose')

const TokenSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user", // specificam numele modelului, nu colectiei din MongoDB Compass
        unique:true
    },
    token:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now,
        expires:300
    }
},{ versionKey: false })
//dupa 300 de secunde(5min) , tokenul va expira si intregul document
//va fii sters , nu doar campul timestamp
//abordare utila pentru sterge tokeni temporari de sesiune ,
//link-uri de autentificare one-time(in cazul nostru) etc..
//gasesti in sectiune Indexes , TTL(time to live) pentru campul timestamp
const Token=mongoose.model("token",TokenSchema)



module.exports= Token