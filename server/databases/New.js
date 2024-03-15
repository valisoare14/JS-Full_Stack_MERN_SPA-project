const mongoose=require('mongoose')

const NewsSchema= new mongoose.Schema({
    items:Number,
    feed:[{
        title:String,
        url:String,
        time_published:Date,
        authors:[String],
        summary:String,
        banner:String,
        source:String,
        topics:[String],
        sentiment:String
    }],
    timestamp:Date
},{versionKey:false})

const New=mongoose.model('new',NewsSchema)

module.exports=New