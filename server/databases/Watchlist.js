const mongoose = require('mongoose')
const WatchlistSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'user'
    },
    symbol : {
        type : String,
        unique : true
    },
    market : String
},{versionKey:false})

const Watchlist = mongoose.model('watchlist' , WatchlistSchema)

module.exports = Watchlist