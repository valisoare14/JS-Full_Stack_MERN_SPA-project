const mongoose = require('mongoose')

const FeedbackSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user'
    },
    symbol : {
        type : String
    },
    reaction : String,
    comment : String,
    timestamp : {
        type : Date ,
        default : Date.now,
        expires : 144000
    }
},{versionKey : false})

const Feedback = mongoose.model('feedback' , FeedbackSchema)

module.exports = Feedback