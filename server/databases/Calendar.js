const mongoose=require('mongoose')
const CalendarSchema=new mongoose.Schema({
    date: Date,
    country: String,
    event: String,
    currency: String,
    previous: Number,
    estimate: Number,
    actual: Number,
    change: Number,
    impact: String,
    changePercentage: Number,
    timestamp:Date
    
},{versionKey:false})

const Calendar=mongoose.model('calendar',CalendarSchema)

module.exports=Calendar