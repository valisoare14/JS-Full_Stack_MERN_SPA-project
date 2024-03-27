const mongoose = require('mongoose')

const AlarmSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user'
    },
    symbol:String,
    name : String,
    image : String,
    priceAtSubmission:Number,
    priceTarget:Number,
    status: String,
    timestamp:Date
},{versionKey:false})

const Alarm = mongoose.model('alarm' , AlarmSchema)

module.exports=Alarm